import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

interface CharacterInfo {
    id: string;
    alias: string;
    motive: string;
    experience: number;
    specialization: string;
    is_ready_to_join: boolean;
}

interface CharacterState {
    characterInfo: CharacterInfo | null;
}

type CharacterAction = 
    | { type: 'SET_CHARACTER_INFO'; payload: CharacterInfo }
    | { type: 'CLEAR_CHARACTER_INFO' };

const initialState: CharacterState = {
    characterInfo: null,
};

function characterReducer(state: CharacterState, action: CharacterAction): CharacterState {
    switch (action.type) {
        case 'SET_CHARACTER_INFO':
            return {
                ...state,
                characterInfo: action.payload,
            };
        case 'CLEAR_CHARACTER_INFO':
            return {
                ...state,
                characterInfo: null,
            };
        default:
            return state;
    }
}

interface CharacterContextType {
    state: CharacterState;
    dispatch: React.Dispatch<CharacterAction>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(characterReducer, initialState);

    return (
        <CharacterContext.Provider value={{ state, dispatch }}>
            {children}
        </CharacterContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCharacter = () => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacter must be used within a CharacterProvider');
    }
    return context;
};

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase/client';
import { useLocation } from 'react-router-dom';

interface FormData {
    alias: string;
    motive: string;
    experience: number;
    specialization: string;
    is_ready_to_join: boolean;
}

interface CharacterFormProps {
    dispatch: React.Dispatch<any>;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ dispatch }) => {
    // Define stable default values using useMemo
    const defaultValues = useMemo(() => ({
        alias: '',
        motive: '',
        experience: 0,
        specialization: '',
        is_ready_to_join: false
    }), []);

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset 
    } = useForm<FormData>({
        defaultValues
    });

    const location = useLocation();

    // Reset form when location changes (initial load or navigation)
    useEffect(() => {
        reset(defaultValues);
    }, [location.pathname, reset, defaultValues]);

    const onSubmit = async (data: FormData) => {
        console.log("Form submitted with data: ", data);
        await createProfile(data);
    };

    async function createProfile(data: FormData) {
        try {
            const userId = uuidv4();
            const { data: profile, error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    alias: data.alias,
                    motive: data.motive,
                    experience: data.experience,
                    specialization: data.specialization,
                    is_ready_to_join: data.is_ready_to_join,
                })
                .select()
                .single();

            if (error) {
                console.error("Error creating profile:", error.message);
                return;
            }

            // Dispatch to update global state
            dispatch({ type: 'SET_CHARACTER_INFO', payload: profile });

            // CRITICAL FIX: Explicitly reset to defaultValues AFTER async work completes
            reset(defaultValues);
            console.log("Form reset called and completed");
        } catch (err) {
            console.error("Unexpected error during profile creation:", err);
        }
    }

    return (
        <div className="card shadow-lg p-6 bg-white w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">Create Hero Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Alias field */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text text-lg">Alias</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Hero Name"
                        className={`input input-bordered w-full ${errors.alias ? 'input-error' : ''}`}
                        {...register("alias", { required: "Alias is required" })}
                    />
                    {errors.alias && <p className="text-error text-sm mt-1">{errors.alias.message}</p>}
                </div>

                {/* Motive field */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text text-lg">Motive</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Why do you fight?"
                        className={`input input-bordered w-full ${errors.motive ? 'input-error' : ''}`}
                        {...register("motive", { required: "Motive is required" })}
                    />
                    {errors.motive && <p className="text-error text-sm mt-1">{errors.motive.message}</p>}
                </div>

                {/* Experience field */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text text-lg">Experience</span>
                    </label>
                    <input
                        type="number"
                        placeholder="Years of experience"
                        className={`input input-bordered w-full ${errors.experience ? 'input-error' : ''}`}
                        {...register("experience", {
                            required: "Experience is required",
                            min: { value: 0, message: "Must be a non-negative number" }
                        })}
                    />
                    {errors.experience && <p className="text-error text-sm mt-1">{errors.experience.message}</p>}
                </div>

                {/* Specialization Selection */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text text-lg">Specialization</span>
                    </label>
                    <select
                        className={`select select-bordered w-full ${errors.specialization ? 'select-error' : ''}`}
                        {...register("specialization", { required: "Please select a specialization" })}
                    >
                        <option value="" disabled>Select your class</option>
                        <option value="Magic">Magic (Arcane/Elemental)</option>
                        <option value="Martial">Martial (Might/Skill)</option>
                        <option value="Stealth">Stealth (Infiltration/Assassination)</option>
                        <option value="Divine">Divine (Faith/Clerical)</option>
                    </select>
                    {errors.specialization && <p className="text-error text-sm mt-1">{errors.specialization.message}</p>}
                </div>

                {/* Is Ready To Join Checkbox */}
                <div className="form-control mb-6">
                    <label className="label cursor-pointer justify-start">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary mr-3"
                            {...register("is_ready_to_join")}
                        />
                        <span className="label-text text-lg">Ready to join the guild?</span>
                    </label>
                </div>

                {/* Submit button */}
                <div className="form-control mt-6">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`btn btn-primary w-full text-lg uppercase tracking-wider ${isSubmitting ? 'loading' : ''}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CharacterForm;

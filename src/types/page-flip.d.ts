declare module 'page-flip' {
    export class PageFlip {
        constructor(element: HTMLElement, settings: any);
        loadFromHTML(pages: HTMLElement[]): void;
        updateFromHtml(pages: HTMLElement[]): void;
        destroy(): void;
        // Add other methods if needed, but these are what we use.
    }
}

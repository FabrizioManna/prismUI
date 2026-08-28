import { LitElement } from 'lit';
/**
 * A drag-and-drop file upload zone styled with Glassmorphism.
 * Handles the UI presentation and exposes the selected files via events.
 */
export declare class PrismFileUpload extends LitElement {
    static styles: import('lit').CSSResult[];
    private fileInput;
    /**
     * Helper text or instruction.
     */
    label: string;
    /**
     * Accept attribute for the file input (e.g., "image/*").
     */
    accept: string;
    /**
     * Allows multiple files.
     */
    multiple: boolean;
    /**
     * Disables the dropzone.
     */
    disabled: boolean;
    private _isDragging;
    private _selectedFiles;
    private _handleDragOver;
    private _handleDragLeave;
    private _handleDrop;
    private _handleInputChange;
    private _processFiles;
    private _openFileDialog;
    private _formatSize;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'prism-file-upload': PrismFileUpload;
    }
}
//# sourceMappingURL=prism-file-upload.d.ts.map
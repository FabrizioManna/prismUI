import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { sharedStyles } from '../../styles/shared-styles';

/**
 * A drag-and-drop file upload zone styled with Glassmorphism.
 * Handles the UI presentation and exposes the selected files via events.
 */
@customElement('prism-file-upload')
export class PrismFileUpload extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `
  ];

  @query('input[type="file"]') private fileInput!: HTMLInputElement;

  /**
   * Helper text or instruction.
   */
  @property({ type: String }) label = 'Drag and drop files here or click to browse';

  /**
   * Accept attribute for the file input (e.g., "image/*").
   */
  @property({ type: String }) accept = '';

  /**
   * Allows multiple files.
   */
  @property({ type: Boolean }) multiple = false;

  /**
   * Disables the dropzone.
   */
  @property({ type: Boolean }) disabled = false;

  @state() private _isDragging = false;
  @state() private _selectedFiles: File[] = [];

  private _handleDragOver(e: DragEvent) {
    if (this.disabled) return;
    e.preventDefault();
    this._isDragging = true;
  }

  private _handleDragLeave(e: DragEvent) {
    if (this.disabled) return;
    e.preventDefault();
    this._isDragging = false;
  }

  private _handleDrop(e: DragEvent) {
    if (this.disabled) return;
    e.preventDefault();
    this._isDragging = false;
    
    if (e.dataTransfer && e.dataTransfer.files) {
      this._processFiles(Array.from(e.dataTransfer.files));
    }
  }

  private _handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      this._processFiles(Array.from(target.files));
    }
  }

  private _processFiles(files: File[]) {
    // If multiple is false, take only the first one
    const newFiles = this.multiple ? files : [files[0]];
    this._selectedFiles = newFiles;
    
    this.dispatchEvent(new CustomEvent('files-selected', {
      detail: { files: this._selectedFiles }
    }));
  }

  private _openFileDialog() {
    if (!this.disabled) {
      this.fileInput.click();
    }
  }

  private _formatSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  render() {
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const dragClass = this._isDragging 
      ? 'border-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
      : 'border-slate-300/40 dark:border-slate-600/50 bg-white/10 dark:bg-slate-800/20 hover:bg-white/20 dark:hover:bg-slate-800/30';

    return html`
      <div class="w-full">
        <div
          @dragover="${this._handleDragOver}"
          @dragleave="${this._handleDragLeave}"
          @drop="${this._handleDrop}"
          @click="${this._openFileDialog}"
          class="relative w-full p-8 flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed backdrop-blur-md transition-all duration-200 ${dragClass} ${disabledClass}"
        >
          <input
            type="file"
            class="hidden"
            ?multiple="${this.multiple}"
            accept="${this.accept}"
            @change="${this._handleInputChange}"
          />
          
          <svg class="w-10 h-10 mb-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
            ${this.label}
          </p>
        </div>

        <!-- File List -->
        ${this._selectedFiles.length > 0 ? html`
          <div class="mt-4 flex flex-col gap-2">
            ${this._selectedFiles.map(file => html`
              <div class="flex items-center justify-between px-4 py-2 rounded-lg bg-white/20 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div class="flex items-center truncate">
                  <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-sm text-slate-700 dark:text-slate-200 truncate">${file.name}</span>
                </div>
                <span class="text-xs text-slate-500 ml-4 shrink-0">${this._formatSize(file.size)}</span>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-file-upload': PrismFileUpload;
  }
}

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Introduction',
};
export default meta;

export const Welcome: StoryObj = {
  render: () => html`
    <div style="font-family: sans-serif; color: white; padding: 2rem; max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
      <h1 style="font-size: 3rem; margin: 0 0 1rem 0;">💎 PrismUI</h1>
      <p style="font-size: 1.25rem; opacity: 0.8; margin-bottom: 2rem;">
        The Ultimate Glassmorphism Web Component Library
      </p>

      <h2 style="font-size: 1.5rem; margin-top: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem;">📦 Installation</h2>
      <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px;"><code>npm install prismui</code></pre>
      
      <p style="margin-top: 1rem;">PrismUI utilizes Lucide for its iconography. If rendering icons manually:</p>
      <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px;"><code>npm install lucide-static</code></pre>

      <h2 style="font-size: 1.5rem; margin-top: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem;">🚀 Usage Guide</h2>
      <p>Because PrismUI is built natively on standard Web Components, it works directly in the browser and integrates seamlessly with any modern JavaScript framework.</p>

      <h3 style="margin-top: 1.5rem; color: #61dafb;">⚛️ React</h3>
      <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px;"><code>import 'prismui/src/components/foundations/prism-button.js';

export default function App() {
  return (
    &lt;div className="p-10"&gt;
      &lt;prism-button variant="primary"&gt;Submit Data&lt;/prism-button&gt;
    &lt;/div&gt;
  );
}</code></pre>

      <h3 style="margin-top: 1.5rem; color: #42b883;">💚 Vue 3</h3>
      <p>Tell the Vue compiler to ignore components starting with <code>prism-</code> in your <code>vite.config.ts</code>:</p>
      <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px;"><code>export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('prism-')
        }
      }
    })
  ]
}</code></pre>

      <h3 style="margin-top: 1.5rem; color: #dd0031;">🅰️ Angular</h3>
      <p>Simply add <code>CUSTOM_ELEMENTS_SCHEMA</code> to your module.</p>
      <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px;"><code>import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }</code></pre>

    </div>
  `,
};

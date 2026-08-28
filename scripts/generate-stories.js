import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPONENTS_DIR = path.join(__dirname, '../src/components');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const toPascalCase = (str) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const toTitleCase = (str) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

console.log('Scanning for missing stories...');
let createdCount = 0;

walkDir(COMPONENTS_DIR, (filePath) => {
  if (filePath.endsWith('.ts') && !filePath.endsWith('.stories.ts') && !filePath.endsWith('index.ts')) {
    const storiesPath = filePath.replace('.ts', '.stories.ts');
    
    if (!fs.existsSync(storiesPath)) {
      const fileName = path.basename(filePath, '.ts'); // e.g., prism-input
      
      // Determine category based on folder
      let category = 'Components';
      if (filePath.includes('foundations')) category = 'Foundations & Actions';
      if (filePath.includes('form')) category = 'Form & Data Entry';
      if (filePath.includes('navigation')) category = 'Navigation & Routing';
      if (filePath.includes('layout')) category = 'Data Display & Tables';
      if (filePath.includes('overlays')) category = 'Overlays & Feedback';

      const componentName = fileName; // prism-input
      const titleName = toTitleCase(fileName.replace('prism-', '')); // Input

      const template = `import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './${fileName}';

const meta: Meta = {
  title: '${category}/${titleName}',
  component: '${componentName}',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html\`
    <${componentName}></${componentName}>
  \`,
};
`;
      fs.writeFileSync(storiesPath, template, 'utf-8');
      console.log(`✅ Created ${path.basename(storiesPath)}`);
      createdCount++;
    }
  }
});

console.log(`\n🎉 Done! Created ${createdCount} missing story files.`);

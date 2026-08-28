const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const componentsDir = path.join(__dirname, 'src', 'components');
const files = walkSync(componentsDir).filter(f => f.endsWith('.ts') && !f.endsWith('.stories.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replace solid backgrounds with glass ones (e.g. bg-blue-500 -> bg-blue-600/50 backdrop-blur-md border border-blue-500/40 text-white)
  // We'll target bg-{color}-500 or 600 where opacity is NOT specified
  content = content.replace(/bg-(blue|red|green|yellow|indigo)-[56]00(?!\/[0-9]+)/g, 'bg-$1-600/50 backdrop-blur-md border border-$1-500/40 text-white');

  // 2. Ensure text contrast on primary colors (if any text-blue-900 exists on a glass primary btn)
  content = content.replace(/text-(blue|red|green)-900 dark:text-(blue|red|green)-50/g, 'text-white');

  // 3. Update generic backgrounds to use /40 or /50 if they use /10 or /20 and are main containers
  content = content.replace(/bg-white\/[12]0 dark:bg-slate-800\/[12]0/g, 'bg-white/30 dark:bg-slate-800/40');
  content = content.replace(/bg-slate-50\/40 dark:bg-slate-800\/40/g, 'bg-slate-100/50 dark:bg-slate-800/50');
  
  // 4. Ensure structural components have .prism-glass or .prism-glass-panel
  // Many already have it, but we can enhance the generic border classes
  content = content.replace(/border-slate-200\/50 dark:border-slate-700\/50/g, 'border-slate-300/40 dark:border-slate-600/50');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

console.log('Migration complete.');

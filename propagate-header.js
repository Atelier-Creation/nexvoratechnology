const fs = require('fs');
const path = require('path');

// Read index.html's header
const indexContent = fs.readFileSync('index.html', 'utf-8');
const headerMatch = indexContent.match(/<section class="header-section">[\s\S]*?<\/section>/);

if (!headerMatch) {
  console.error('Error: Could not find header-section in index.html');
  process.exit(1);
}

const sourceHeader = headerMatch[0];

function getRelativeDepth(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  const parts = relativePath.split(path.sep);
  return parts.length - 1;
}

function processFile(filePath) {
  const depth = getRelativeDepth(filePath);
  const relativePrefix = '../'.repeat(depth);
  
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Customise header HTML for this page
  let customizedHeader = sourceHeader;
  
  // Adjust logo path relative prefixes
  // e.g. replace src="./assets/..." with src="../assets/..." or src="../../assets/..."
  customizedHeader = customizedHeader.replace(
    /src="\.\/assets\/cdn\.prod\.website-files\.com/g,
    `src="${relativePrefix || './'}assets/cdn.prod.website-files.com`
  );
  
  // Clean all existing active states from links
  customizedHeader = customizedHeader.replace(/ w--current/g, '');
  customizedHeader = customizedHeader.replace(/ active/g, '');
  
  // Determine which page it is to apply active class w--current
  const baseName = path.basename(filePath).toLowerCase();
  // Get directory name relative to __dirname (e.g. "careers" or ".")
  const dirName = path.dirname(path.relative(__dirname, filePath)).replace(/\\/g, '/').toLowerCase();
  
  let activeHref = '';
  if (filePath.endsWith('index.html') && depth === 0) {
    activeHref = '/';
  } else if (baseName === 'about-us.html') {
    activeHref = '/about-us.html';
  } else if (baseName === 'products.html') {
    activeHref = '/Products.html';
  } else if (baseName === 'careers.html' || dirName === 'careers' || dirName.startsWith('careers/')) {
    activeHref = '/careers.html';
  } else if (baseName === 'blog.html' || dirName === 'blog' || dirName.startsWith('blog/') || dirName === 'blog-author' || dirName.startsWith('blog-author/')) {
    activeHref = '/blog.html';
  } else if (baseName === 'pricing.html') {
    activeHref = '/pricing.html';
  } else if (baseName === 'features.html' || dirName === 'features' || dirName.startsWith('features/')) {
    activeHref = '/features.html';
  } else if (baseName === 'contact.html') {
    activeHref = '/contact.html';
  }
  
  if (activeHref) {
    // Escape special characters for regex
    const escapedHref = activeHref.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Replace class="custom-nav-pill" with class="custom-nav-pill w--current" for matching href
    const pillRegex = new RegExp(`(href="${escapedHref}"\\s+class="custom-nav-pill)`, 'g');
    customizedHeader = customizedHeader.replace(pillRegex, `$1 w--current`);
  }
  
  // Replace the header section in target file
  if (fileContent.match(/<section class="header-section">[\s\S]*?<\/section>/)) {
    fileContent = fileContent.replace(/<section class="header-section">[\s\S]*?<\/section>/, customizedHeader);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`Updated header in: ${path.relative(__dirname, filePath)} (depth: ${depth}, active: ${activeHref || 'none'})`);
  } else {
    console.warn(`Warning: No header-section found in ${path.relative(__dirname, filePath)}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file.startsWith('.') || file === 'node_modules' || file === 'assets') {
        continue;
      }
      traverseDirectory(fullPath);
    } else if (file.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

console.log('Starting header propagation...');
traverseDirectory(__dirname);
console.log('Finished header propagation!');

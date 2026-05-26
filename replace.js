const fs = require('fs');
const path = require('path');

const indexContent = fs.readFileSync('index.html', 'utf-8');
const headerMatch = indexContent.match(/<section class=\"header-section\">[\s\S]*?<\/section>/);
const footerMatch = indexContent.match(/<section class=\"footer-section\">[\s\S]*?<\/section>/);

if (!headerMatch || !footerMatch) {
    console.error('Error: Could not find header or footer in index.html');
    process.exit(1);
}

const headerContent = headerMatch[0];
const footerContent = footerMatch[0];

let integrationContent = fs.readFileSync('./careers/frontend-developer.html', 'utf-8');
integrationContent = integrationContent.replace(/<section class=\"header-section\">[\s\S]*?<\/section>/, headerContent);
integrationContent = integrationContent.replace(/<section class=\"footer-section\">[\s\S]*?<\/section>/, footerContent);

fs.writeFileSync('./careers/frontend-developer.html', integrationContent, 'utf-8');
console.log('Successfully replaced header and footer in frontend-developer.html');

// Replace CSS link in all HTML files
// const oldLink = 'https://assets-global.website-files.com/65f295c5e095b2886b26ceef/css/saasnap.nexvora.25e64d69a.css';
// const newLink = '../assets/assets-global.website-files.com/65f295c5e095b2886b26ceef/css/saasnap.nexvora.25e64d69a.css';

// function replaceLinkInFiles(dir) {
//     const files = fs.readdirSync(dir);
//     for (const file of files) {
//         const filePath = path.join(dir, file);
//         const stat = fs.statSync(filePath);
//         if (stat.isDirectory()) {
//             replaceLinkInFiles(filePath);
//         } else if (filePath.endsWith('.html')) {
//             let content = fs.readFileSync(filePath, 'utf-8');
//             if (content.includes(oldLink)) {
//                 content = content.split(oldLink).join(newLink);
//                 fs.writeFileSync(filePath, content, 'utf-8');
//                 console.log(`Replaced link in ${filePath}`);
//             }
//         }
//     }
// }

// replaceLinkInFiles(__dirname);

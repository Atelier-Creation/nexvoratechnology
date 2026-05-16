const fs = require('fs');

const indexContent = fs.readFileSync('index.html', 'utf-8');
const headerMatch = indexContent.match(/<section class=\"header-section\">[\s\S]*?<\/section>/);
const footerMatch = indexContent.match(/<section class=\"footer-section\">[\s\S]*?<\/section>/);

if (!headerMatch || !footerMatch) {
    console.error('Error: Could not find header or footer in index.html');
    process.exit(1);
}

const headerContent = headerMatch[0];
const footerContent = footerMatch[0];

let integrationContent = fs.readFileSync('about-us.html', 'utf-8');
integrationContent = integrationContent.replace(/<section class=\"header-section\">[\s\S]*?<\/section>/, headerContent);
integrationContent = integrationContent.replace(/<section class=\"footer-section\">[\s\S]*?<\/section>/, footerContent);

fs.writeFileSync('about-us.html', integrationContent, 'utf-8');
console.log('Successfully replaced header and footer in integration.html');

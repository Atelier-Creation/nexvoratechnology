const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const ASSET_HOSTS = [
  'assets-global.website-files.com',
  'cdn.prod.website-files.com',
  'd3e54v103j8qbb.cloudfront.net',
];
const DOWNLOAD_CONCURRENCY = 8;
const DOWNLOAD_TIMEOUT_MS = 30000;
const IGNORED_FILE_NAMES = new Set(['download-assets.js', 'replace.js']);
const TEXT_EXTENSIONS = new Set([
  '',
  '.html',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.svg',
  '.txt',
]);

const escapedHosts = ASSET_HOSTS.map((host) => host.replace(/\./g, String.raw`\.`));
const urlPattern = new RegExp(
  String.raw`(?:https?:)?//(${escapedHosts.join('|')})(/[^\s"'<>),\\]+)`,
  'g'
);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.continue') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (
      !IGNORED_FILE_NAMES.has(entry.name) &&
      TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function localPathForUrl(url) {
  const parsed = new URL(url.startsWith('//') ? `https:${url}` : url);
  const decodedSegments = parsed.pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  return path.join(ROOT_DIR, 'assets', parsed.hostname, ...decodedSegments);
}

function relativeUrl(fromFile, toFile) {
  let relative = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, '/');
  if (!relative.startsWith('.')) {
    relative = `./${relative}`;
  }
  return encodeURI(relative).replace(/#/g, '%23');
}

async function download(url, outputPath) {
  if (fs.existsSync(outputPath)) {
    return 'exists';
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    return 'downloaded';
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`timed out after ${DOWNLOAD_TIMEOUT_MS / 1000}s`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function removePreconnects(content) {
  let nextContent = content;

  for (const host of ASSET_HOSTS) {
    const escapedHost = host.replace(/\./g, String.raw`\.`);
    nextContent = nextContent
      .replace(
      new RegExp(
        String.raw`<link\b[^>]*\bhref=["']https://${escapedHost}["'][^>]*\brel=["']preconnect["'][^>]*>\s*`,
        'gi'
      ),
      ''
    )
    .replace(
      new RegExp(
        String.raw`<link\b[^>]*\brel=["']preconnect["'][^>]*\bhref=["']https://${escapedHost}["'][^>]*>\s*`,
        'gi'
      ),
      ''
    );
  }

  return nextContent;
}

async function main() {
  const files = walk(ROOT_DIR);
  const replacementsByFile = new Map();
  const downloads = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(urlPattern)];

    if (matches.length === 0) {
      continue;
    }

    const replacements = new Map();
    for (const match of matches) {
      const absoluteUrl = match[0].startsWith('//') ? `https:${match[0]}` : match[0];
      const outputPath = localPathForUrl(absoluteUrl);

      downloads.set(absoluteUrl, outputPath);
      replacements.set(match[0], relativeUrl(file, outputPath));
    }

    replacementsByFile.set(file, replacements);
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  const queue = [...downloads];
  let cursor = 0;

  async function worker() {
    while (cursor < queue.length) {
      const [url, outputPath] = queue[cursor];
      cursor += 1;

      try {
        const result = await download(url, outputPath);
        if (result === 'downloaded') {
          downloaded += 1;
          console.log(`Downloaded ${url}`);
        } else {
          skipped += 1;
        }
      } catch (error) {
        failed += 1;
        console.error(`Failed ${url}: ${error.message}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(DOWNLOAD_CONCURRENCY, queue.length) }, () => worker())
  );

  let filesChanged = 0;
  let urlsReplaced = 0;

  for (const [file, replacements] of replacementsByFile) {
    let content = fs.readFileSync(file, 'utf8');
    let nextContent = removePreconnects(content);

    for (const [remoteUrl, localUrl] of replacements) {
      const before = nextContent;
      nextContent = nextContent.split(remoteUrl).join(localUrl);
      if (before !== nextContent) {
        urlsReplaced += 1;
      }
    }

    if (nextContent !== content) {
      fs.writeFileSync(file, nextContent, 'utf8');
      filesChanged += 1;
      console.log(`Rewrote ${path.relative(ROOT_DIR, file)}`);
    }
  }

  console.log('');
  console.log(`Assets found: ${downloads.size}`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Already local: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Files changed: ${filesChanged}`);
  console.log(`URL entries replaced: ${urlsReplaced}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

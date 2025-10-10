#!/usr/bin/env node

/**
 * GitHub Raw Asset Link Generator
 * Generates raw GitHub content URLs for assets in the AppAssets repository
 */

const REPO_OWNER = 'xephas-official';
const REPO_NAME = 'AppAssets';
const BRANCH = 'main';
const PROJECT_PATH = 'linkyoo';

const FOLDERS = ['meta', 'placeholders', 'blog'];

/**
 * Generate a GitHub raw content link
 * @param {string} folder - The folder name (meta, placeholders, or blog)
 * @param {string} filename - The filename with extension
 * @returns {string} The complete GitHub raw content URL
 */
function generateLink(folder, filename) {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/${BRANCH}/${PROJECT_PATH}/${folder}/${filename}`;
}

/**
 * Display usage instructions
 */
function showUsage() {
  console.log(`
Usage: node generate-link.js <path>

Arguments:
  path - The path to the asset (folder/filename)

Examples:
  node generate-link.js meta/Linkyoo-Editor-Cover.webp
  node generate-link.js blog/Linkyoo-Editor-Blog.webp
  node generate-link.js placeholders/kalya-placeholder.webp

Available folders: ${FOLDERS.join(', ')}
  `);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showUsage();
  process.exit(0);
}

if (args.length !== 1) {
  console.error('Error: Please provide the path in the format: folder/filename\n');
  showUsage();
  process.exit(1);
}

const path = args[0];
const pathParts = path.split('/');

if (pathParts.length !== 2) {
  console.error('Error: Path must be in the format: folder/filename\n');
  showUsage();
  process.exit(1);
}

const [folder, filename] = pathParts;

// Validate folder
if (!FOLDERS.includes(folder)) {
  console.error(`Error: Invalid folder "${folder}". Must be one of: ${FOLDERS.join(', ')}\n`);
  showUsage();
  process.exit(1);
}

// Generate and display the link
const link = generateLink(folder, filename);
console.log('\nGenerated Link:');
console.log(link);
console.log('');

#!/usr/bin/env node

/**
 * GitHub Raw Asset Link Generator
 * Generates raw GitHub content URLs for assets in the AppAssets repository
 */

const fs = require('fs');
const path = require('path');

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
 * Get all files in a folder sorted by modification time (newest first)
 * @param {string} folder - The folder name
 * @returns {Array} Array of filenames sorted by newest first
 */
function getFilesInFolder(folder) {
  const folderPath = path.join(__dirname, PROJECT_PATH, folder);
  
  if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder "${folderPath}" does not exist.`);
    return [];
  }

  try {
    const files = fs.readdirSync(folderPath)
      .filter(file => {
        // Filter out hidden files and directories
        const filePath = path.join(folderPath, file);
        return !file.startsWith('.') && fs.statSync(filePath).isFile();
      })
      .map(file => {
        const filePath = path.join(folderPath, file);
        return {
          name: file,
          mtime: fs.statSync(filePath).mtime.getTime()
        };
      })
      .sort((a, b) => b.mtime - a.mtime) // Sort by modification time, newest first
      .map(file => file.name);

    return files;
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
    return [];
  }
}

/**
 * Display usage instructions
 */
function showUsage() {
  console.log(`
Usage: node generate-link.js <path>

Arguments:
  path - The path to the asset or just the folder name

Examples:
  # Generate link for a specific file:
  node generate-link.js meta/Linkyoo-Editor-Cover.webp
  node generate-link.js blog/Linkyoo-Editor-Blog.webp
  node generate-link.js placeholders/kalya-placeholder.webp

  # Generate links for all files in a folder (sorted by newest first):
  node generate-link.js meta
  node generate-link.js placeholders
  node generate-link.js blog

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
  console.error('Error: Please provide the path in the format: folder/filename or just folder\n');
  showUsage();
  process.exit(1);
}

const input = args[0];
const pathParts = input.split('/');

// Check if it's just a folder name or a full path
if (pathParts.length === 1) {
  // Just a folder - generate links for all files
  const folder = pathParts[0];
  
  if (!FOLDERS.includes(folder)) {
    console.error(`Error: Invalid folder "${folder}". Must be one of: ${FOLDERS.join(', ')}\n`);
    showUsage();
    process.exit(1);
  }

  const files = getFilesInFolder(folder);
  
  if (files.length === 0) {
    console.log(`\nNo files found in "${folder}" folder.\n`);
    process.exit(0);
  }

  console.log(`\nGenerated Links for "${folder}" folder (${files.length} file${files.length > 1 ? 's' : ''}, sorted by newest first):\n`);
  files.forEach((filename, index) => {
    const link = generateLink(folder, filename);
    console.log(`${index + 1}. ${filename}`);
    console.log(`   ${link}\n`);
  });
  
} else if (pathParts.length === 2) {
  // Full path with folder/filename
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
  
} else {
  console.error('Error: Path must be in the format: folder/filename or just folder\n');
  showUsage();
  process.exit(1);
}

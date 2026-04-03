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

/**
 * Generate a GitHub raw content link
 * @param {string} relativePath - The relative path within the project folder
 * @returns {string} The complete GitHub raw content URL
 */
function generateLink(relativePath) {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/${BRANCH}/${PROJECT_PATH}/${relativePath}`;
}

/**
 * Get all available folders in the project path
 * @returns {Array} Array of folder names
 */
function getAvailableFolders() {
  const projectPath = path.join(__dirname, PROJECT_PATH);
  
  if (!fs.existsSync(projectPath)) {
    return [];
  }

  try {
    return fs.readdirSync(projectPath)
      .filter(item => {
        const itemPath = path.join(projectPath, item);
        return !item.startsWith('.') && fs.statSync(itemPath).isDirectory();
      });
  } catch (error) {
    console.error(`Error reading project folders: ${error.message}`);
    return [];
  }
}

/**
 * Check if a folder exists in the project path
 * @param {string} folder - The folder name to check
 * @returns {boolean} True if folder exists
 */
function folderExists(folder) {
  const folderPath = path.join(__dirname, PROJECT_PATH, folder);
  return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
}

/**
 * Get all files in a folder sorted by modification time (newest first)
 * @param {string} relativePath - The relative path within the project folder
 * @returns {Array} Array of filenames sorted by newest first
 */
function getFilesInFolder(relativePath) {
  const folderPath = path.join(__dirname, PROJECT_PATH, relativePath);
  
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
  const availableFolders = getAvailableFolders();
  const folderList = availableFolders.length > 0 
    ? availableFolders.join(', ') 
    : 'No folders found';
  
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

Available folders: ${folderList}
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
const localPath = path.join(__dirname, PROJECT_PATH, input);

if (!fs.existsSync(localPath)) {
  const availableFolders = getAvailableFolders();
  console.error(`Error: Path "${input}" does not exist in ${PROJECT_PATH}/\n`);
  if (availableFolders.length > 0) {
    console.error(`Available folders: ${availableFolders.join(', ')}\n`);
  }
  process.exit(1);
}

const stat = fs.statSync(localPath);

if (stat.isDirectory()) {
  const files = getFilesInFolder(input);

  if (files.length === 0) {
    console.log(`\nNo files found in "${input}".\n`);
    process.exit(0);
  }

  console.log(`\nGenerated Links for "${input}" (${files.length} file${files.length > 1 ? 's' : ''}, sorted by newest first):\n`);
  files.forEach((filename, index) => {
    const link = generateLink(`${input}/${filename}`);
    console.log(`${index + 1}. ${filename}`);
    console.log(`   ${link}\n`);
  });

} else if (stat.isFile()) {
  const link = generateLink(input);
  console.log('\nGenerated Link:');
  console.log(link);
  console.log('');

} else {
  console.error(`Error: "${input}" is neither a file nor a directory.\n`);
  process.exit(1);
}

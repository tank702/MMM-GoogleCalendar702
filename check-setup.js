#!/usr/bin/env node

/* Installation Check Script
 * Verifies that all requirements are met
 * By Tank702
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath, name) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${name} found`);
        return true;
    } else {
        console.log(`❌ ${name} missing`);
        return false;
    }
}

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║   MMM-GoogleCalendar702 Installation Check               ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let allGood = true;

// Check required files
console.log('Checking required files...');
allGood &= checkFile(path.join(__dirname, '..', 'MMM-GoogleCalendar.js'), 'Main module');
allGood &= checkFile(path.join(__dirname, '..', 'node_helper.js'), 'Node helper');
allGood &= checkFile(path.join(__dirname, '..', 'MMM-GoogleCalendar.css'), 'Stylesheet');
allGood &= checkFile(path.join(__dirname, '..', 'package.json'), 'Package.json');

console.log('\nChecking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));

if (majorVersion >= 14) {
    console.log(`✅ Node.js ${nodeVersion} (requirement: >= 14.0.0)`);
} else {
    console.log(`❌ Node.js ${nodeVersion} - Please upgrade to >= 14.0.0`);
    allGood = false;
}

console.log('\nChecking authentication setup...');
const credentialsExist = checkFile(path.join(__dirname, '..', 'credentials.json'), 'Google credentials');
const tokenExist = checkFile(path.join(__dirname, '..', 'token.json'), 'Auth token');

if (!credentialsExist) {
    console.log('\n⚠️  Authentication not configured');
    console.log('   Run: npm run setup');
    console.log('   Then: npm run auth');
}

console.log('\n' + '═'.repeat(60) + '\n');

if (allGood && credentialsExist && tokenExist) {
    console.log('🎉 Installation complete! Module is ready to use.\n');
} else if (allGood && credentialsExist) {
    console.log('⚠️  Installation complete, but authentication needed.');
    console.log('   Run: npm run auth\n');
} else if (allGood) {
    console.log('⚠️  Installation complete, but setup needed.');
    console.log('   Run: npm run setup\n');
} else {
    console.log('❌ Installation incomplete. Please fix the issues above.\n');
}

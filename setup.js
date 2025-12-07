#!/usr/bin/env node

/* Initial Setup Script
 * Guides users through configuration
 * By Tank702
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   MMM-GoogleCalendar702 Setup Wizard                     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('Welcome! This wizard will help you set up Google Calendar integration.\n');

    // Check if credentials already exist
    const credentialsPath = path.join(__dirname, '..', 'credentials.json');

    if (fs.existsSync(credentialsPath)) {
        console.log('✅ credentials.json already exists.\n');
        const replace = await question('Do you want to replace it? (y/N): ');
        
        if (replace.toLowerCase() !== 'y') {
            console.log('\nKeeping existing credentials.');
            console.log('Next step: Run "npm run auth" to authenticate.\n');
            rl.close();
            return;
        }
    }

    console.log('\n📋 To get your Google Calendar credentials:\n');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Create a new project or select an existing one');
    console.log('3. Enable the Google Calendar API:');
    console.log('   - Search for "Google Calendar API"');
    console.log('   - Click "Enable"');
    console.log('4. Create OAuth 2.0 credentials:');
    console.log('   - Go to "Credentials" in the left menu');
    console.log('   - Click "+ CREATE CREDENTIALS"');
    console.log('   - Select "OAuth client ID"');
    console.log('   - Choose "Desktop app" as application type');
    console.log('   - Name it "MagicMirror Calendar"');
    console.log('   - Click "Create"');
    console.log('5. Download the credentials:');
    console.log('   - Click the download icon for your new credential');
    console.log('   - Save the file\n');

    const hasCredentials = await question('Have you downloaded the credentials file? (y/N): ');

    if (hasCredentials.toLowerCase() !== 'y') {
        console.log('\nPlease complete the steps above, then run this setup again.');
        console.log('Command: npm run setup\n');
        rl.close();
        return;
    }

    const credentialsFile = await question('\nEnter the full path to your credentials file: ');

    try {
        // Validate the credentials file
        const fileContent = fs.readFileSync(credentialsFile.trim());
        const credentials = JSON.parse(fileContent);

        if (!credentials.installed && !credentials.web) {
            throw new Error('Invalid credentials file format');
        }

        // Copy to module directory
        fs.copyFileSync(credentialsFile.trim(), credentialsPath);

        console.log('\n✅ Credentials saved successfully!\n');
        console.log('Next steps:');
        console.log('1. Run: npm run auth');
        console.log('2. Follow the authentication prompts');
        console.log('3. Add the module to your MagicMirror config\n');

        console.log('Example config.js entry:');
        console.log(`
{
    module: "MMM-GoogleCalendar",
    position: "top_left",
    config: {
        view: "month",      // "month", "week", "day", "agenda"
        size: "large",      // "full", "large", "medium", "compact"
        theme: "glass",     // "glass", "modern", "classic"
        updateInterval: 300000,
        maxEvents: 50
    }
}
        `);

        console.log('\n🎉 Setup wizard complete!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\nPlease check the file path and try again.\n');
    }

    rl.close();
}

main().catch(console.error);

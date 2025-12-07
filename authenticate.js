#!/usr/bin/env node

/* Google Calendar Authentication Setup
 * This script helps users set up OAuth2 authentication
 * By Tank702
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   MMM-GoogleCalendar702 Authentication Setup             ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Check if credentials exist
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.log('❌ credentials.json not found!\n');
        console.log('Please follow these steps:\n');
        console.log('1. Go to: https://console.cloud.google.com/');
        console.log('2. Create a new project (or select existing)');
        console.log('3. Enable Google Calendar API');
        console.log('4. Create OAuth 2.0 credentials (Desktop App)');
        console.log('5. Download the credentials');
        console.log('6. Save as "credentials.json" in:', __dirname.replace('/scripts', ''));
        console.log('\nFor detailed instructions, see: README.md\n');
        rl.close();
        return;
    }

    try {
        // Load credentials
        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

        // Create OAuth2 client
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        // Generate auth URL
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        console.log('✅ Credentials loaded successfully!\n');
        console.log('📋 Follow these steps to authenticate:\n');
        console.log('1. Open this URL in your browser:');
        console.log('\n' + authUrl + '\n');
        console.log('2. Sign in and authorize the application');
        console.log('3. Copy the authorization code from the browser\n');

        const code = await question('Paste the authorization code here: ');

        // Get access token
        const { tokens } = await oAuth2Client.getToken(code.trim());
        oAuth2Client.setCredentials(tokens);

        // Save token
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

        console.log('\n✅ Authentication successful!');
        console.log('✅ Token saved to:', TOKEN_PATH);
        console.log('\n🎉 Setup complete! Your calendar module is ready to use.\n');
        console.log('To test: Restart your MagicMirror\n');

        // Test API access
        console.log('Testing API access...');
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const calendarList = await calendar.calendarList.list();

        console.log('\n📅 Found', calendarList.data.items.length, 'calendars:');
        calendarList.data.items.forEach((cal, index) => {
            console.log(`   ${index + 1}. ${cal.summary} (${cal.id})`);
        });

        console.log('\n✨ All done! Your calendar data is syncing.\n');

    } catch (error) {
        console.error('\n❌ Error during authentication:', error.message);
        console.log('\nPlease try again or check the README for troubleshooting.\n');
    }

    rl.close();
}

main().catch(console.error);

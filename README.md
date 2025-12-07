# MMM-GoogleCalendar702

<div align="center">

![Google Calendar](https://img.shields.io/badge/Google%20Calendar-4285F4?style=for-the-badge&logo=google-calendar&logoColor=white)
![MagicMirror](https://img.shields.io/badge/MagicMirror²-000000?style=for-the-badge&logo=raspberrypi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A stunning Google Calendar module for MagicMirror² with full touch support and virtual keyboard**

[Features](#-features) • [Installation](#-installation) • [Configuration](#%EF%B8%8F-configuration) • [Usage](#-usage) • [Troubleshooting](#-troubleshooting)

</div>

---

## 🌟 Features

### **Visual Excellence**
- 🎨 **Three Stunning Themes**: Glass-morphism, Modern Gradient, Classic Dark
- 📱 **Four View Modes**: Month, Week, Day, and Agenda views
- 📏 **Flexible Sizing**: Full screen, Large, Medium, and Compact options
- ✨ **Smooth Animations**: Elegant transitions and hover effects
- 🎯 **Responsive Design**: Adapts beautifully to any screen size

### **Full Touch Support**
- 👆 **Touch-Enabled Navigation**: Swipe to change dates
- 🖱️ **Interactive Events**: Tap events to view details
- ⌨️ **Virtual Keyboard**: On-screen keyboard for event creation
- 🖐️ **Gesture Controls**: Intuitive touch gestures throughout

### **Google Calendar Integration**
- 📅 **Real-Time Sync**: Automatic synchronization with Google Calendar
- 🔄 **Multi-Calendar Support**: Display multiple calendars simultaneously
- 🎨 **Color-Coded Events**: Maintain your Google Calendar color scheme
- ⏰ **All Event Types**: Support for timed and all-day events

### **Event Management**
- ➕ **Create Events**: Add new events directly from the mirror
- ✏️ **Edit Events**: Modify existing events on the fly
- 🗑️ **Delete Events**: Remove events with confirmation
- 📍 **Event Details**: View location, description, and time information

---

## 📦 Installation

### Prerequisites

- MagicMirror² installation
- Node.js >= 14.0.0
- npm (comes with Node.js)
- Google account with Calendar access

### Quick Install

1. **Navigate to your MagicMirror modules directory**
   ```bash
   cd ~/MagicMirror/modules
   ```

2. **Clone this repository**
   ```bash
   git clone https://github.com/tank702/MMM-GoogleCalendar702702.git
   ```

3. **Install dependencies**
   ```bash
   cd MMM-GoogleCalendar702
   npm install
   ```

4. **Run setup wizard**
   ```bash
   npm run setup
   ```

5. **Authenticate with Google**
   ```bash
   npm run auth
   ```

---

## 🔐 Google API Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select an existing project
3. Name your project (e.g., "MagicMirror Calendar")
4. Click **"Create"**

### Step 2: Enable Google Calendar API

1. In the Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Calendar API"**
3. Click on it and press **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose **"External"** user type
   - Fill in app name: "MagicMirror Calendar"
   - Add your email as support email
   - Click **"Save and Continue"**
   - Skip scopes (click **"Save and Continue"**)
   - Add yourself as a test user
   - Click **"Save and Continue"**
4. Back in Credentials, click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
5. Select **"Desktop app"** as application type
6. Name it "MagicMirror Calendar"
7. Click **"Create"**

### Step 4: Download Credentials

1. Click the **download icon** (⬇️) next to your newly created OAuth client
2. The file will download as `client_secret_xxx.json`
3. When running `npm run setup`, provide the path to this file
4. The setup will copy it to `credentials.json` in the module directory

### Step 5: Authenticate

1. Run the authentication command:
   ```bash
   npm run auth
   ```

2. A URL will appear - **open it in your browser**

3. Sign in with your Google account

4. You'll see a warning: *"Google hasn't verified this app"*
   - Click **"Advanced"**
   - Click **"Go to MagicMirror Calendar (unsafe)"**
   - This is safe - it's your own app!

5. Grant permissions to access your calendars

6. Copy the **authorization code** from the browser

7. Paste it into the terminal and press Enter

8. You should see: ✅ **Authentication successful!**

---

## ⚙️ Configuration

### Basic Configuration

Add this to your `config/config.js` file:

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "month",
        size: "large",
        theme: "glass"
    }
}
```

### Complete Configuration Options

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",  // Any valid MagicMirror position
    config: {
        // DISPLAY SETTINGS
        view: "month",              // "month", "week", "day", "agenda"
        size: "large",              // "full", "large", "medium", "compact"
        maxEvents: 50,              // Maximum events to display
        maxDays: 365,               // Days to fetch ahead
        
        // CALENDAR SETTINGS
        calendars: [],              // Empty = all calendars
                                    // Or specify IDs: ["primary", "calendar-id@group.calendar.google.com"]
        updateInterval: 300000,     // Update every 5 minutes (in milliseconds)
        fadeSpeed: 2000,            // Fade animation speed
        animationSpeed: 1000,       // General animation speed
        
        // VISUAL SETTINGS
        theme: "glass",             // "glass", "modern", "classic"
        showWeekNumbers: false,     // Show ISO week numbers
        firstDayOfWeek: 0,          // 0 = Sunday, 1 = Monday
        timeFormat: "12",           // "12" or "24" hour format
        dateFormat: "MMM D",        // Date format (uses Moment.js)
        
        // TOUCH & INTERACTION
        touchEnabled: true,         // Enable touch controls
        virtualKeyboard: true,      // Show on-screen keyboard
        allowEventCreation: true,   // Allow creating new events
        allowEventEditing: true,    // Allow editing events
        allowEventDeletion: true,   // Allow deleting events
        dragAndDrop: true,          // Enable drag-and-drop (future feature)
        
        // EVENT DISPLAY
        showEventDetails: true,     // Show event details in modal
        showLocation: true,         // Show event locations
        showDescription: true,      // Show event descriptions
        colorByCalendar: true,      // Use calendar colors instead of event colors
        
        // ADVANCED
        debug: false,               // Enable console logging
        authMethod: "oauth2"        // Authentication method (oauth2 only for now)
    }
}
```

### Configuration Examples

#### Compact Month View (Top Right)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_right",
    config: {
        view: "month",
        size: "compact",
        theme: "glass",
        showWeekNumbers: true,
        maxEvents: 20
    }
}
```

#### Large Agenda View (Full Left)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "agenda",
        size: "large",
        theme: "modern",
        maxEvents: 100,
        maxDays: 30
    }
}
```

#### Week View with Touch (Bottom)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "bottom_bar",
    config: {
        view: "week",
        size: "full",
        theme: "glass",
        touchEnabled: true,
        virtualKeyboard: true,
        timeFormat: "24"
    }
}
```

#### Work Calendar Only
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "month",
        size: "large",
        calendars: [
            "work@company.com",
            "meetings@company.com"
        ],
        colorByCalendar: true
    }
}
```

---

## 🎮 Usage

### Touch Controls

#### Swipe Gestures
- **Swipe Right**: Go to previous period (day/week/month)
- **Swipe Left**: Go to next period

#### Tap Actions
- **Tap Event**: View event details
- **Tap Day Cell**: Create new event on that day
- **Tap Time Slot**: Create event at that time
- **Tap "Today" Button**: Jump to current date

### Virtual Keyboard

When creating or editing events, the virtual keyboard automatically appears at the bottom of the screen:

- **Letter Keys**: Type event title, description, location
- **Space**: Add spaces
- **⌫**: Delete last character
- **Done**: Close keyboard and save

### Navigation

- **Previous/Next Arrows**: Navigate through dates
- **Today Button**: Return to current date
- **View Buttons**: Switch between Month, Week, Day, and Agenda views

### Creating Events

1. **Tap** on a day (Month view) or time slot (Week/Day view)
2. The virtual keyboard appears
3. Type your event details
4. Event is automatically created in your primary calendar

### Editing Events

1. **Tap** on an existing event
2. In the modal, click the **Edit** button
3. Use the virtual keyboard to modify details
4. Changes sync to Google Calendar

### Deleting Events

1. **Tap** on an event to view details
2. Click the **Delete** button
3. Confirm deletion
4. Event is removed from Google Calendar

---

## 🎨 Themes

### Glass-Morphism (Default)
Beautiful frosted glass effect with blur and transparency. Perfect for modern mirrors.

```javascript
config: {
    theme: "glass"
}
```

### Modern Gradient
Vibrant gradient background with smooth color transitions.

```javascript
config: {
    theme: "modern"
}
```

### Classic Dark
Traditional dark theme with high contrast for excellent readability.

```javascript
config: {
    theme: "classic"
}
```

---

## 📏 Sizing Options

### Full Screen
```javascript
size: "full"  // Takes entire screen (100vw × 100vh)
```

### Large
```javascript
size: "large"  // 1400px × 900px (default)
```

### Medium
```javascript
size: "medium"  // 1000px × 700px
```

### Compact
```javascript
size: "compact"  // 600px × 500px
```

---

## 📅 View Modes

### Month View
Grid layout showing entire month with event chips. Great for overview.

### Week View
Timeline view showing 7 days with hourly slots. Perfect for detailed weekly planning.

### Day View
Single day timeline with all events. Ideal for touch screens.

### Agenda View
List of upcoming events grouped by date. Best for quick scanning.

---

## 🔧 Troubleshooting

### Authentication Issues

**Problem**: "Authentication Required" message appears

**Solution**:
```bash
cd ~/MagicMirror/modules/MMM-GoogleCalendar702
npm run auth
```

---

**Problem**: "Invalid credentials" error

**Solution**:
1. Delete `credentials.json` and `token.json`
2. Run `npm run setup` again
3. Follow the Google API Setup steps carefully
4. Make sure you selected "Desktop app" not "Web application"

---

### No Events Showing

**Problem**: Calendar loads but no events appear

**Solution**:
1. Check your Google Calendar has events in the next 365 days
2. Verify calendar IDs in config are correct
3. Run `npm run auth` to refresh authentication
4. Check browser console for errors (F12)
5. Enable debug mode: `debug: true` in config

---

### Events Not Syncing

**Problem**: New events from Google Calendar don't appear

**Solution**:
1. Check `updateInterval` setting (default: 5 minutes)
2. Restart MagicMirror: `pm2 restart mm`
3. Check token hasn't expired - re-authenticate if needed
4. Verify internet connection

---

### Touch Not Working

**Problem**: Touch controls unresponsive

**Solution**:
1. Verify `touchEnabled: true` in config
2. Make sure MagicMirror is running on a touch screen
3. Check for JavaScript errors in console (F12)
4. Restart MagicMirror

---

### Virtual Keyboard Issues

**Problem**: Keyboard doesn't appear when creating events

**Solution**:
1. Verify `virtualKeyboard: true` in config
2. Ensure `allowEventCreation: true`
3. Try creating an event by tapping a day cell
4. Check browser console for errors

---

### Module Won't Load

**Problem**: Module doesn't appear on mirror

**Solution**:
```bash
# Check for syntax errors
cd ~/MagicMirror/modules/MMM-GoogleCalendar702
npm run check

# Reinstall dependencies
npm install

# Check MagicMirror logs
pm2 logs mm
```

---

## 📝 Calendar ID Reference

### Finding Your Calendar ID

1. Go to [Google Calendar](https://calendar.google.com)
2. Click settings gear → **Settings**
3. Click on the calendar you want
4. Scroll down to **"Integrate calendar"**
5. Copy the **Calendar ID** (looks like `abc123@group.calendar.google.com`)

### Special Calendar IDs

- `"primary"` - Your main calendar
- `"#contacts@group.v.calendar.google.com"` - Contacts birthdays
- `"#holidays@group.v.calendar.google.com"` - Holidays

### Example with Multiple Calendars

```javascript
config: {
    calendars: [
        "primary",
        "family@group.calendar.google.com",
        "work@company.com",
        "#contacts@group.v.calendar.google.com"
    ]
}
```

---

## 🔄 Updating

To update to the latest version:

```bash
cd ~/MagicMirror/modules/MMM-GoogleCalendar702
git pull
npm install
pm2 restart mm
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **MagicMirror²** - The amazing smart mirror platform
- **Google Calendar API** - For providing the calendar integration
- **googleapis** npm package - For Node.js API access
- **Moment.js** - For beautiful date formatting

---

## 💡 Feature Roadmap

- [ ] **Drag-and-drop** event rescheduling (in progress)
- [ ] **Recurring event** creation
- [ ] **Event reminders** and notifications
- [ ] **Calendar sharing** between mirrors
- [ ] **Voice control** integration
- [ ] **Custom event templates**
- [ ] **Export to ICS** format
- [ ] **Multi-language** support
- [ ] **Dark/Light** mode auto-switching
- [ ] **Weather integration** for events

---

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/tank702/MMM-GoogleCalendar702/issues)
3. Create a new issue with:
   - Your MagicMirror version
   - Your config
   - Error messages from browser console (F12)
   - Steps to reproduce

---

<div align="center">

**Made with ❤️ for the MagicMirror community**

[⭐ Star this repo](https://github.com/tank702/MMM-GoogleCalendar702) if you find it useful!

</div>

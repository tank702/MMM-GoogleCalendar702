# Quick Start Guide

Get MMM-GoogleCalendar702 up and running in 5 minutes!

## Prerequisites Checklist

- [ ] MagicMirror² installed
- [ ] Node.js 14+ installed
- [ ] Google account
- [ ] Internet connection

## Installation (3 steps)

### 1. Install the Module

```bash
cd ~/MagicMirror/modules
git clone https://github.com/tank702/MMM-GoogleCalendar702.git
cd MMM-GoogleCalendar
npm install
```

### 2. Set Up Google Calendar API

**Quick Method:**
```bash
npm run setup
```

Follow the prompts and provide your Google credentials file.

**Manual Method:**

<details>
<summary>Click to expand manual setup instructions</summary>

1. Go to https://console.cloud.google.com/
2. Create a project
3. Enable Google Calendar API
4. Create OAuth 2.0 Desktop credentials
5. Download credentials.json
6. Place in module directory
</details>

### 3. Authenticate

```bash
npm run auth
```

- Open the URL shown
- Sign in with Google
- Copy the code
- Paste back in terminal

✅ Done!

## Configuration (1 step)

Add to your `~/MagicMirror/config/config.js`:

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

## Start MagicMirror

```bash
cd ~/MagicMirror
npm start
```

Or if using PM2:
```bash
pm2 restart mm
```

---

## 5 Popular Configurations

### 1. **Compact Monthly Overview** (Top Right)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_right",
    config: {
        view: "month",
        size: "compact",
        theme: "glass"
    }
}
```
**Best for**: Quick month view alongside other modules

---

### 2. **Full Screen Week Planner** (Center)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "fullscreen_below",
    config: {
        view: "week",
        size: "full",
        theme: "modern",
        touchEnabled: true,
        virtualKeyboard: true
    }
}
```
**Best for**: Touch screen mirrors, detailed weekly planning

---

### 3. **Today's Agenda** (Left Side)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "agenda",
        size: "medium",
        theme: "glass",
        maxEvents: 10,
        maxDays: 7
    }
}
```
**Best for**: Showing next week's events in list format

---

### 4. **Day View with Touch** (Full Screen)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "fullscreen_below",
    config: {
        view: "day",
        size: "large",
        theme: "classic",
        touchEnabled: true,
        virtualKeyboard: true,
        timeFormat: "12"
    }
}
```
**Best for**: Bathroom mirrors, detailed daily schedule

---

### 5. **Work Calendar Only** (Bottom)
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "bottom_bar",
    config: {
        view: "month",
        size: "medium",
        theme: "modern",
        calendars: [
            "work@company.com"
        ],
        colorByCalendar: true
    }
}
```
**Best for**: Office mirrors showing only work events

---

## Common Issues & Quick Fixes

### "Authentication Required" message

```bash
cd ~/MagicMirror/modules/MMM-GoogleCalendar702
npm run auth
```

### No events showing

Check your config:
```javascript
config: {
    debug: true  // Enable debug logging
}
```

Then check browser console (F12) for errors.

### Module not appearing

```bash
# Check installation
cd ~/MagicMirror/modules/MMM-GoogleCalendar702
npm run check

# View MagicMirror logs
pm2 logs mm
```

### Touch not working

Verify in config:
```javascript
config: {
    touchEnabled: true
}
```

---

## Next Steps

Once your calendar is running:

1. **Customize the theme**: Try `"glass"`, `"modern"`, or `"classic"`
2. **Change the view**: Switch between Month, Week, Day, Agenda
3. **Add touch controls**: Enable virtual keyboard for event creation
4. **Multiple calendars**: Add all your Google calendars
5. **Perfect the size**: Adjust to fit your mirror layout

---

## Getting Help

- **Documentation**: [README.md](README.md)
- **Troubleshooting**: [README.md#troubleshooting](README.md#-troubleshooting)
- **Issues**: [GitHub Issues](https://github.com/tank702/MMM-GoogleCalendar702/issues)

---

## Tips & Tricks

### Pro Tip #1: Calendar IDs
Find your calendar ID:
1. Go to https://calendar.google.com
2. Click Settings (gear icon)
3. Click on a calendar
4. Scroll to "Integrate calendar"
5. Copy the Calendar ID

### Pro Tip #2: Touch Gestures
- **Swipe left/right**: Navigate dates
- **Tap event**: View details
- **Tap empty space**: Create event

### Pro Tip #3: Update Frequency
For more real-time updates:
```javascript
config: {
    updateInterval: 60000  // Update every 1 minute
}
```

### Pro Tip #4: Specific Calendars
Only show certain calendars:
```javascript
config: {
    calendars: [
        "primary",                              // Your main calendar
        "family@group.calendar.google.com",     // Family events
        "#contacts@group.v.calendar.google.com" // Birthdays
    ]
}
```

---

**Enjoy your stunning Google Calendar on MagicMirror!** 🎉

If you find this module useful, please ⭐ [star the repo](https://github.com/tank702/MMM-GoogleCalendar702)!

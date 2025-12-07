# 🚀 Easy iCal Setup Guide - No Authentication Required!

## ✨ Why iCal is Better

**No OAuth complexity!** Just copy/paste your calendar URLs - done in 2 minutes!

- ✅ **No Google Cloud Console setup**
- ✅ **No authentication tokens**
- ✅ **No credentials files**
- ✅ **Just copy & paste URLs**
- ✅ **Works immediately**

---

## 📋 Getting Your iCal URL from Google Calendar

### Step 1: Open Google Calendar Settings

1. Go to [Google Calendar](https://calendar.google.com)
2. Click the **Settings gear icon** (top right)
3. Click **Settings**

### Step 2: Select Your Calendar

1. In the left sidebar, find **"Settings for my calendars"**
2. Click on the calendar you want to add

### Step 3: Get the iCal URL

1. Scroll down to **"Integrate calendar"** section
2. Find **"Secret address in iCal format"**
3. Click the **copy icon** or copy the URL

The URL will look like:
```
https://calendar.google.com/calendar/ical/your-email%40gmail.com/private-abc123def456/basic.ics
```

### Step 4: Add to MagicMirror Config

Edit `~/MagicMirror/config/config.js`:

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        calendars: [
            "https://calendar.google.com/calendar/ical/your-email%40gmail.com/private-abc123/basic.ics"
        ]
    }
}
```

### Step 5: Restart MagicMirror

```bash
pm2 restart mm
```

**That's it!** Your calendar is now displaying! 🎉

---

## 🎯 Multiple Calendars

### Simple Format (Just URLs)

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        calendars: [
            "https://calendar.google.com/calendar/ical/personal@gmail.com/private-abc123/basic.ics",
            "https://calendar.google.com/calendar/ical/work@gmail.com/private-def456/basic.ics",
            "https://calendar.google.com/calendar/ical/family@group.calendar.google.com/private-ghi789/basic.ics"
        ]
    }
}
```

### Advanced Format (With Custom Names & Colors)

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        calendars: [
            {
                name: "Personal",
                url: "https://calendar.google.com/calendar/ical/personal@gmail.com/private-abc123/basic.ics",
                color: "#4285f4"  // Blue
            },
            {
                name: "Work",
                url: "https://calendar.google.com/calendar/ical/work@gmail.com/private-def456/basic.ics",
                color: "#ea4335"  // Red
            },
            {
                name: "Family",
                url: "https://calendar.google.com/calendar/ical/family@group.calendar.google.com/private-ghi789/basic.ics",
                color: "#34a853"  // Green
            }
        ]
    }
}
```

---

## 🎨 Available Colors

You can use any hex color code, but here are Google Calendar's standard colors:

| Color | Hex Code | Use For |
|-------|----------|---------|
| Blue | `#4285f4` | Default, Personal |
| Red | `#ea4335` | Important, Work |
| Yellow | `#fbbc04` | Warnings, Reminders |
| Green | `#34a853` | Family, Health |
| Orange | `#ff6d00` | Social, Events |
| Cyan | `#46bdc6` | Projects |
| Indigo | `#7986cb` | Study |
| Purple | `#a142f4` | Hobbies |
| Pink | `#f538a0` | Birthdays |
| Coral | `#e67c73` | Appointments |
| Teal | `#33b679` | Travel |
| Gray | `#616161` | Archive |

---

## 🔒 Security Note

### ⚠️ IMPORTANT: Keep Your iCal URLs Private!

Your iCal URL contains a **private key** that allows anyone with the URL to view your calendar events.

**Never share your iCal URL publicly!**

- ❌ Don't post on GitHub (unless in private repo)
- ❌ Don't share on forums
- ❌ Don't commit to public repositories

**If your URL is exposed:**
1. Go to Google Calendar Settings
2. Find your calendar
3. Click **"Reset private URLs"** under "Integrate calendar"
4. Copy the new URL and update your config

---

## 📅 Other Calendar Services

This module works with **any calendar that provides an iCal feed**:

### Apple iCloud Calendar

1. Go to [iCloud.com](https://www.icloud.com) → Calendar
2. Click the share icon next to your calendar
3. Check **"Public Calendar"**
4. Copy the **webcal://** URL
5. Change `webcal://` to `https://`
6. Use in config

### Microsoft Outlook/Office 365

1. Go to Outlook Calendar
2. Right-click your calendar → **Sharing and permissions**
3. Click **"Publish this calendar"**
4. Copy the **ICS** link
5. Use in config

### Any Other Calendar

Look for:
- "iCal feed"
- "ICS export"
- "Calendar subscription"
- "Webcal URL" (change to https://)

---

## 🛠️ Troubleshooting

### Calendar Not Loading

**Problem**: Events not appearing

**Solutions**:
1. Verify the iCal URL is correct (copy/paste again)
2. Make sure URL starts with `https://`
3. Check you copied the **"Secret address in iCal format"** (not public URL)
4. Enable debug mode: `debug: true` in config
5. Check console for errors: `pm2 logs mm`

---

### "No calendars configured" Error

**Problem**: Module shows error message

**Solution**:
```javascript
// Make sure you have at least one calendar URL
calendars: [
    "YOUR_ICAL_URL_HERE"
]
```

---

### URL Format Error

**Problem**: Calendar URL doesn't work

**Check**:
- URL must start with `https://`
- URL must end with `.ics`
- URL should contain `private-` in it
- Don't use the "Public URL" - use "Secret address"

**Correct**:
```
https://calendar.google.com/calendar/ical/email@gmail.com/private-abc123/basic.ics
```

**Incorrect**:
```
webcal://calendar.google.com/...  (wrong protocol)
https://calendar.google.com/calendar/embed?...  (embed URL, not iCal)
```

---

### Events Not Updating

**Problem**: New events don't appear

**Solution**:
- Default update interval is 5 minutes
- Restart MagicMirror to force update: `pm2 restart mm`
- Or set faster updates in config:
```javascript
config: {
    updateInterval: 60000  // 1 minute (60000 ms)
}
```

---

## 📝 Complete Example Config

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        // CALENDARS (Required)
        calendars: [
            {
                name: "Personal",
                url: "https://calendar.google.com/calendar/ical/personal@gmail.com/private-abc123/basic.ics",
                color: "#4285f4"
            },
            {
                name: "Work", 
                url: "https://calendar.google.com/calendar/ical/work@company.com/private-def456/basic.ics",
                color: "#ea4335"
            }
        ],
        
        // DISPLAY
        view: "month",        // month, week, day, agenda
        size: "large",        // full, large, medium, compact
        theme: "glass",       // glass, modern, classic
        
        // LIMITS
        maxEvents: 50,        // Max events to show
        maxDays: 365,         // Days to fetch ahead
        updateInterval: 300000,  // 5 minutes
        
        // VISUAL
        showWeekNumbers: false,
        firstDayOfWeek: 0,    // 0=Sunday, 1=Monday
        timeFormat: "12",     // 12 or 24 hour
        colorByCalendar: true,
        
        // TOUCH
        touchEnabled: true,
        
        // DEBUG
        debug: false
    }
}
```

---

## ❓ FAQ

### Can I edit events from the mirror?

**No.** iCal feeds are read-only. This is intentional to keep setup simple. Edit events in your calendar app (Google Calendar, Apple Calendar, etc.) and they'll sync automatically.

### How often do events update?

Default: Every 5 minutes. You can change this with `updateInterval` (in milliseconds).

### Can I use calendars from different services?

**Yes!** Any calendar that provides an iCal/ICS feed will work. Mix Google, Apple, Outlook, or any other calendar.

### Does this use the Google Calendar API?

**No.** This uses standard iCal feeds, which require no API setup, no authentication, and no credentials. Just copy/paste URLs!

### Is this method secure?

**Yes**, as long as you keep your private iCal URLs secure (don't share them publicly). The URLs contain a private key that only you should have.

---

## 🎉 That's It!

**No OAuth. No API keys. No credentials.**

**Just copy your iCal URL and paste it in the config!**

Enjoy your calendar! 🪞✨

---

**For more configuration options, see:**
- config.sample.js - Full configuration examples
- README.md - Complete documentation
- QUICKSTART.md - 5-minute setup guide

# MMM-GoogleCalendar702

<div align="center">

![Google Calendar](https://img.shields.io/badge/Google%20Calendar-4285F4?style=for-the-badge&logo=google-calendar&logoColor=white)
![MagicMirror](https://img.shields.io/badge/MagicMirror²-000000?style=for-the-badge&logo=raspberrypi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A stunning Google Calendar module for MagicMirror² - No OAuth Required!**

✨ **Easy Setup** • 📅 **Multiple Views** • 🎨 **Beautiful Themes** • 👆 **Touch Support**

</div>

---

## ⚡ Quick Start (2 Minutes!)

### 1. Install
```bash
cd ~/MagicMirror/modules
git clone https://github.com/tank702/MMM-GoogleCalendar702
cd MMM-GoogleCalendar702
npm install
```

### 2. Get Your iCal URL
1. Go to [Google Calendar](https://calendar.google.com) → Settings
2. Select your calendar
3. Scroll to "Integrate calendar"
4. Copy the **"Secret address in iCal format"**

### 3. Configure
Add to `~/MagicMirror/config/config.js`:
```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        calendars: [
            "PASTE_YOUR_ICAL_URL_HERE"
        ]
    }
}
```

### 4. Restart
```bash
pm2 restart mm
```

**Done!** 🎉

👉 **[Detailed iCal Setup Guide →](ICAL_SETUP.md)**

---

## 🌟 Why This Module?

### ⚡ **Super Easy Setup**
- **No OAuth complexity** - No Google Cloud Console
- **No API keys** - No credentials files
- **No authentication** - Just copy/paste URLs
- **2-minute setup** - Seriously, that's it!

### 📅 **Beautiful & Functional**
- 4 view modes (Month, Week, Day, Agenda)
- 3 stunning themes (Glass, Modern, Classic)
- Touch screen support with gestures
- Responsive design for any screen

### 🌐 **Universal Calendar Support**
- Google Calendar ✅
- Apple iCloud ✅
- Outlook/Office 365 ✅
- **Any** calendar with iCal feed ✅

---

## 📦 Full Installation

### Prerequisites
- MagicMirror² installed
- Node.js >= 14.0.0
- npm (comes with Node.js)

### Install Steps

```bash
# 1. Navigate to modules directory
cd ~/MagicMirror/modules

# 2. Clone repository
git clone https://github.com/tank702/MMM-GoogleCalendar702

# 3. Install dependencies
cd MMM-GoogleCalendar702
npm install
```

---

## 🔧 Configuration

### Basic Example

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        calendars: [
            "https://calendar.google.com/calendar/ical/YOUR_EMAIL/private-KEY/basic.ics"
        ]
    }
}
```

### Multiple Calendars

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        calendars: [
            {
                name: "Personal",
                url: "https://calendar.google.com/.../basic.ics",
                color: "#4285f4"
            },
            {
                name: "Work",
                url: "https://calendar.google.com/.../basic.ics",
                color: "#ea4335"
            }
        ]
    }
}
```

### All Options

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        // REQUIRED
        calendars: [],  // Array of iCal URLs
        
        // DISPLAY
        view: "month",          // month, week, day, agenda
        size: "large",          // full, large, medium, compact
        theme: "glass",         // glass, modern, classic
        
        // LIMITS
        maxEvents: 50,
        maxDays: 365,
        updateInterval: 300000, // 5 minutes (ms)
        
        // VISUAL
        showWeekNumbers: false,
        firstDayOfWeek: 0,      // 0=Sunday
        timeFormat: "12",       // 12 or 24
        colorByCalendar: true,
        
        // TOUCH
        touchEnabled: true,
        
        // DEBUG
        debug: false
    }
}
```

---

## 📅 How to Get iCal URLs

### From Google Calendar

1. Open [Google Calendar](https://calendar.google.com)
2. Click **Settings** → **Settings**
3. Select calendar from left menu
4. Find **"Integrate calendar"** section
5. Copy **"Secret address in iCal format"**

Example URL:
```
https://calendar.google.com/calendar/ical/email@gmail.com/private-abc123/basic.ics
```

### From Apple iCloud

1. Open [iCloud Calendar](https://www.icloud.com/calendar)
2. Share calendar → Enable "Public Calendar"
3. Copy webcal:// URL
4. Change `webcal://` to `https://`

### From Outlook/Office 365

1. Calendar → Sharing → Publish calendar
2. Copy ICS link

**[Complete iCal Setup Guide →](ICAL_SETUP.md)**

---

## 🎨 Themes & Sizes

### Themes

| Theme | Style |
|-------|-------|
| `glass` | Frosted glass with blur (default) |
| `modern` | Vibrant purple-blue gradient |
| `classic` | Traditional dark high-contrast |

### Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| `full` | 100vw × 100vh | Dedicated display |
| `large` | 1400px × 900px | Main calendar |
| `medium` | 1000px × 700px | Secondary |
| `compact` | 600px × 500px | Corner display |

---

## 📱 Touch Controls

- **Swipe Left/Right**: Navigate dates
- **Tap Event**: View details
- **Tap "Today"**: Jump to today

**Note**: Event editing not supported (iCal is read-only). Edit in your calendar app.

---

## 🔒 Security

**⚠️ Keep iCal URLs Private!**

Your iCal URL contains a private key. Never share publicly.

If compromised:
1. Calendar Settings → Your calendar
2. Click "Reset private URLs"
3. Update config with new URL

---

## 🐛 Troubleshooting

### Calendar Not Loading

```javascript
// Enable debug mode
config: {
    debug: true
}
```

Check logs: `pm2 logs mm`

### Common Issues

| Problem | Solution |
|---------|----------|
| Events not showing | Verify iCal URL is correct |
| "No calendars" error | Add at least one calendar URL |
| Module not appearing | Run `npm install` in module folder |
| Events not updating | Default is 5 minutes, or restart |

[Full Troubleshooting →](ICAL_SETUP.md#-troubleshooting)

---

## 📚 Documentation

- **[ICAL_SETUP.md](ICAL_SETUP.md)** - Complete iCal guide
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup
- **[config.sample.js](config.sample.js)** - Config examples
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deployment guide

---

## ❓ FAQ

**Q: Do I need Google Cloud Console?**  
A: No! Just iCal URLs.

**Q: Do I need authentication?**  
A: No! No OAuth required.

**Q: Can I edit events?**  
A: No, iCal is read-only. Edit in your calendar app.

**Q: Multiple calendar services?**  
A: Yes! Mix Google, Apple, Outlook, etc.

**Q: How often do events update?**  
A: Every 5 minutes (configurable).

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## ⭐ Show Your Support

If you find this useful:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features

---

<div align="center">

**Made with ❤️ for the MagicMirror community**

[GitHub](https://github.com/tank702/MMM-GoogleCalendar702) • [Issues](https://github.com/tank702/MMM-GoogleCalendar702/issues)

</div>

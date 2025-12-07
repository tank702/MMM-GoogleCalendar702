# 📦 MMM-GoogleCalendar702 - GitHub Repository

## 🔗 Repository Information

**GitHub URL**: https://github.com/tank702/MMM-GoogleCalendar702

**Clone Command**:
```bash
git clone https://github.com/tank702/MMM-GoogleCalendar702
```

**Repository Details**:
- **Owner**: tank702
- **Repository**: MMM-GoogleCalendar702
- **Type**: Public
- **License**: MIT

---

## 🚀 Quick Installation

### From GitHub (Recommended):

```bash
# Navigate to MagicMirror modules directory
cd ~/MagicMirror/modules

# Clone the repository
git clone https://github.com/tank702/MMM-GoogleCalendar702

# Install dependencies
cd MMM-GoogleCalendar702
npm install

# Setup Google Calendar API
npm run setup

# Authenticate with Google
npm run auth
```

### Add to config.js:

```javascript
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "month",
        size: "large",
        theme: "glass",
        touchEnabled: true,
        virtualKeyboard: true
    }
}
```

### Restart MagicMirror:

```bash
pm2 restart mm
```

---

## 🔄 Updating the Module

```bash
cd ~/MagicMirror/modules/MMM-GoogleCalendar702
git pull
npm install
pm2 restart mm
```

---

## 📚 Documentation Links

- **README**: Full documentation
- **QUICKSTART**: 5-minute setup guide
- **FINAL_SUMMARY**: Quick overview
- **config.sample.js**: Configuration examples

---

## 🐛 Issues & Support

**Report Issues**: https://github.com/tank702/MMM-GoogleCalendar702/issues

**Before reporting**:
1. Check existing issues
2. Review troubleshooting in README.md
3. Enable debug mode: `debug: true`
4. Check browser console (F12)

---

## 🤝 Contributing

**Contributions welcome!**

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

See CONTRIBUTING.md for guidelines.

---

## 📋 Repository Structure

```
MMM-GoogleCalendar702/
├── MMM-GoogleCalendar702.js      # Main module
├── MMM-GoogleCalendar702.css     # Styling
├── node_helper.js                # Backend
├── package.json                  # Dependencies
├── README.md                     # Documentation
├── scripts/                      # Setup scripts
│   ├── setup.js
│   ├── authenticate.js
│   └── check-setup.js
└── translations/                 # i18n files
    └── en.json
```

---

## 🌟 Features

- 📅 4 View Modes (Month, Week, Day, Agenda)
- 🎨 3 Themes (Glass, Modern, Classic)
- 📏 4 Size Options (Full, Large, Medium, Compact)
- 👆 Full Touch Screen Support
- ⌨️ Virtual On-Screen Keyboard
- 🔄 Real-Time Google Calendar Sync
- ➕ Create/Edit/Delete Events

---

## 📝 Version

**Current Version**: 1.0.0  
**Released**: December 6, 2024

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

**Tank702**

- GitHub: [@tank702](https://github.com/tank702)
- Repository: [MMM-GoogleCalendar702](https://github.com/tank702/MMM-GoogleCalendar702)

---

## ⭐ Show Your Support

If you find this module useful, please:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute code

---

**Happy Mirroring!** 🪞✨

# Contributing to MMM-GoogleCalendar702

First off, thank you for considering contributing to MMM-GoogleCalendar702! It's people like you that make this module better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Submitting Changes](#submitting-changes)
- [Testing](#testing)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this standard.

**Expected Behavior:**
- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

**Unacceptable Behavior:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information without permission

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**How to Submit a Good Bug Report:**

1. **Use a clear and descriptive title**
2. **Describe the exact steps to reproduce the problem**
3. **Provide specific examples** (code snippets, screenshots)
4. **Describe the behavior you observed** and **what you expected to see**
5. **Include your environment details:**
   - MagicMirror version
   - Node.js version
   - Module configuration
   - Browser console errors (F12)

**Template:**
```markdown
**Bug Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened

**Screenshots:**
If applicable, add screenshots

**Environment:**
- MagicMirror version: [e.g. 2.25.0]
- Node.js version: [e.g. 18.17.0]
- Module version: [e.g. 1.0.0]
- Browser: [e.g. Chrome 120]
- OS: [e.g. Raspberry Pi OS Bullseye]

**Configuration:**
```javascript
{
    module: "MMM-GoogleCalendar",
    config: {
        // Your config here
    }
}
```

**Console Errors:**
```
Error messages from browser console
```
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

1. **Use a clear and descriptive title**
2. **Provide a detailed description** of the suggested enhancement
3. **Explain why this enhancement would be useful**
4. **Provide examples** of how it would work
5. **List any alternatives** you've considered

**Template:**
```markdown
**Feature Request:**
Clear description of the feature

**Use Case:**
Why this feature would be useful

**Proposed Solution:**
How you think it should work

**Alternatives Considered:**
Other approaches you've thought about

**Additional Context:**
Screenshots, mockups, or examples
```

### Pull Requests

We actively welcome your pull requests!

**Process:**

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**:
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- Node.js >= 14.0.0
- npm
- MagicMirror² installation
- Git
- Google Calendar API credentials (for testing)

### Setup Steps

1. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/MMM-GoogleCalendar.git
   cd MMM-GoogleCalendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Google Calendar API** (for testing):
   ```bash
   npm run setup
   npm run auth
   ```

4. **Link to MagicMirror:**
   ```bash
   ln -s $(pwd) ~/MagicMirror/modules/MMM-GoogleCalendar
   ```

5. **Start development:**
   ```bash
   cd ~/MagicMirror
   npm start
   ```

### Development Tools

**Browser DevTools (F12):**
- Console for error messages
- Network tab for API calls
- Elements inspector for CSS

**Debugging:**
- Enable debug mode in config: `debug: true`
- Check browser console
- Check MagicMirror logs: `pm2 logs mm`

---

## Coding Guidelines

### JavaScript Style

**Code Formatting:**
- Use 4 spaces for indentation (not tabs)
- Use semicolons
- Use single quotes for strings (except when escaping)
- Maximum line length: 120 characters

**Naming Conventions:**
```javascript
// Functions: camelCase
function createEventModal() { }

// Variables: camelCase
const selectedEvent = null;

// Constants: UPPER_CASE
const MAX_EVENTS = 50;

// Classes: PascalCase (if used)
class EventManager { }
```

**Comments:**
```javascript
// Use clear, descriptive comments
// Explain WHY, not WHAT (the code shows what)

/* Multi-line comments for
 * complex sections or
 * function documentation
 */

// Good
// Calculate event position based on start time
const position = this.calculatePosition(event.start);

// Bad
// Set position
const position = this.calculatePosition(event.start);
```

**Functions:**
- Keep functions small and focused
- One function = one responsibility
- Use descriptive names
- Add JSDoc comments for complex functions

```javascript
/**
 * Creates a visual event block for the calendar
 * @param {Object} event - The event object from Google Calendar API
 * @param {Date} date - The date to display the event
 * @param {number} hour - The hour slot (0-23)
 * @returns {HTMLElement} The event block DOM element
 */
createEventBlock: function(event, date, hour) {
    // Implementation
}
```

### CSS Style

**Organization:**
```css
/* Group related styles together */
/* Use clear section headers */

/* =============== EVENT BLOCKS =============== */

.event-block {
    position: relative;
    border-radius: 8px;
}

/* Use meaningful class names */
.event-title { }        /* Good */
.evt-ttl { }           /* Bad */
```

**Consistency:**
- Use consistent units (prefer rem/em for text, px for borders)
- Maintain existing naming conventions
- Group properties logically
- Use CSS variables for colors when appropriate

### File Structure

**Adding New Files:**
```
MMM-GoogleCalendar/
├── MMM-GoogleCalendar.js      # Main module
├── node_helper.js              # Backend helper
├── MMM-GoogleCalendar.css      # Styles
├── scripts/                    # Setup scripts
│   ├── setup.js
│   ├── authenticate.js
│   └── check-setup.js
├── translations/               # Language files
│   └── en.json
└── README.md                   # Documentation
```

### Git Commit Messages

**Format:**
```
<type>: <short summary>

<detailed description>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
# Good
git commit -m "feat: add drag-and-drop event rescheduling"

git commit -m "fix: resolve virtual keyboard not showing on mobile

The keyboard was hidden by overflow:hidden on parent container.
Changed to overflow:visible for keyboard area.

Fixes #42"

# Bad
git commit -m "fixed stuff"
git commit -m "update"
```

---

## Submitting Changes

### Before Submitting

**Checklist:**
- [ ] Code follows the style guidelines
- [ ] Comments added for complex logic
- [ ] Self-reviewed the code
- [ ] Tested on actual MagicMirror installation
- [ ] Updated documentation if needed
- [ ] No console.log() left in code (use debug flag instead)
- [ ] Checked for console errors
- [ ] Branch is up to date with main

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How you tested these changes

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Tested on MagicMirror
- [ ] No console errors
```

### Review Process

1. **Automated checks** run on your PR
2. **Maintainer review** within a few days
3. **Feedback addressed** via additional commits
4. **Approval and merge** when ready

---

## Testing

### Manual Testing

**Basic Functionality:**
1. Module loads without errors
2. Calendar events display correctly
3. Touch controls work (if enabled)
4. Different views render properly
5. Theme changes work
6. Event creation/editing/deletion work
7. Responsive on different screen sizes

**Browser Testing:**
- Chrome/Chromium
- Firefox
- Safari (if available)
- Mobile browsers

**Error Scenarios:**
- No internet connection
- Invalid credentials
- Empty calendar
- Large number of events
- Long event titles

### Testing Checklist

**Before Submitting PR:**
- [ ] Fresh install works: `git clone`, `npm install`, `npm run setup`, `npm run auth`
- [ ] Module appears in MagicMirror
- [ ] No JavaScript errors in console
- [ ] No CSS layout issues
- [ ] Touch controls functional (if applicable)
- [ ] All views (Month/Week/Day/Agenda) work
- [ ] All themes render correctly
- [ ] All sizes display properly
- [ ] Events sync from Google Calendar
- [ ] Event creation works
- [ ] Event editing works
- [ ] Event deletion works
- [ ] Virtual keyboard appears and functions

---

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Credited in relevant code comments

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MMM-GoogleCalendar! 🎉

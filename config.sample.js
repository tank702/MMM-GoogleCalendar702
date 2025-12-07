/* Sample Configuration for MMM-GoogleCalendar702
 * Copy the configuration you want to your config.js file
 * Location: ~/MagicMirror/config/config.js
 */

// ====================================================================
// BASIC CONFIGURATION - Copy this to get started quickly
// ====================================================================

{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "month",
        size: "large",
        theme: "glass"
    }
}

// ====================================================================
// COMPLETE CONFIGURATION - All available options
// ====================================================================

{
    module: "MMM-GoogleCalendar702",
    position: "top_left",  // Options: top_left, top_center, top_right, 
                           //          upper_third, middle_center, lower_third,
                           //          bottom_left, bottom_center, bottom_right,
                           //          bottom_bar, fullscreen_below, fullscreen_above
    
    config: {
        // DISPLAY SETTINGS
        view: "month",              // Options: "month", "week", "day", "agenda"
        size: "large",              // Options: "full", "large", "medium", "compact"
        maxEvents: 50,              // Maximum number of events to display
        maxDays: 365,               // How many days ahead to fetch events
        
        // CALENDAR SETTINGS
        calendars: [],              // Empty array = all calendars
                                    // Or specify calendar IDs:
                                    // ["primary", "work@company.com", "family@group.calendar.google.com"]
        
        updateInterval: 300000,     // Update frequency in milliseconds (5 minutes)
        fadeSpeed: 2000,            // Fade animation speed in milliseconds
        animationSpeed: 1000,       // General animation speed in milliseconds
        
        // VISUAL SETTINGS
        theme: "glass",             // Options: "glass", "modern", "classic"
        showWeekNumbers: false,     // Show ISO week numbers in month view
        firstDayOfWeek: 0,          // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
        timeFormat: "12",           // Options: "12" (12-hour) or "24" (24-hour)
        dateFormat: "MMM D",        // Date format using Moment.js syntax
        
        // TOUCH & INTERACTION
        touchEnabled: true,         // Enable touch screen controls
        virtualKeyboard: true,      // Show on-screen keyboard for event creation
        allowEventCreation: true,   // Allow creating new events from the mirror
        allowEventEditing: true,    // Allow editing existing events
        allowEventDeletion: true,   // Allow deleting events
        dragAndDrop: true,          // Enable drag-and-drop (future feature)
        
        // EVENT DISPLAY
        showEventDetails: true,     // Show detailed event information in modals
        showLocation: true,         // Display event locations
        showDescription: true,      // Display event descriptions
        colorByCalendar: true,      // Use calendar colors instead of event colors
        
        // ADVANCED
        debug: false,               // Enable console logging for troubleshooting
        authMethod: "oauth2"        // Authentication method (currently only "oauth2")
    }
}

// ====================================================================
// PRESET CONFIGURATIONS - Ready-to-use setups
// ====================================================================

// --------------------------------------------------------------------
// PRESET 1: Compact Month View (Top Right Corner)
// Perfect for: Small mirrors, secondary calendar display
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "top_right",
    config: {
        view: "month",
        size: "compact",
        theme: "glass",
        showWeekNumbers: true,
        maxEvents: 20,
        firstDayOfWeek: 1  // Start week on Monday
    }
}

// --------------------------------------------------------------------
// PRESET 2: Full Screen Week Planner (Touch Enabled)
// Perfect for: Kitchen mirrors, office planning boards
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "fullscreen_below",
    config: {
        view: "week",
        size: "full",
        theme: "modern",
        touchEnabled: true,
        virtualKeyboard: true,
        allowEventCreation: true,
        allowEventEditing: true,
        timeFormat: "12",
        updateInterval: 60000  // Update every minute
    }
}

// --------------------------------------------------------------------
// PRESET 3: Today's Agenda (Bathroom Mirror)
// Perfect for: Quick morning overview, vertical mirrors
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "middle_center",
    config: {
        view: "day",
        size: "medium",
        theme: "classic",
        touchEnabled: true,
        showLocation: true,
        showDescription: true,
        timeFormat: "12"
    }
}

// --------------------------------------------------------------------
// PRESET 4: Upcoming Events List (Hallway Mirror)
// Perfect for: Quick glance at next week
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "agenda",
        size: "large",
        theme: "glass",
        maxEvents: 15,
        maxDays: 7,  // Only show next 7 days
        showLocation: true,
        colorByCalendar: true
    }
}

// --------------------------------------------------------------------
// PRESET 5: Work Calendar Only (Office Mirror)
// Perfect for: Professional settings, meeting room displays
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "fullscreen_below",
    config: {
        view: "week",
        size: "full",
        theme: "classic",
        calendars: [
            "work@company.com",
            "meetings@company.com"
        ],
        colorByCalendar: true,
        touchEnabled: true,
        allowEventCreation: true,
        timeFormat: "24",
        firstDayOfWeek: 1  // Monday
    }
}

// --------------------------------------------------------------------
// PRESET 6: Family Calendar (Living Room)
// Perfect for: Shared family schedules, household coordination
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        view: "month",
        size: "large",
        theme: "modern",
        calendars: [
            "family@group.calendar.google.com",
            "kids@group.calendar.google.com",
            "#contacts@group.v.calendar.google.com"  // Birthdays
        ],
        touchEnabled: true,
        virtualKeyboard: true,
        colorByCalendar: true,
        showEventDetails: true
    }
}

// --------------------------------------------------------------------
// PRESET 7: Multiple Calendars Combined
// Perfect for: Power users with multiple calendar sources
// --------------------------------------------------------------------

{
    module: "MMM-GoogleCalendar702",
    position: "fullscreen_below",
    config: {
        view: "month",
        size: "full",
        theme: "glass",
        calendars: [
            "primary",                                    // Personal calendar
            "work@company.com",                           // Work calendar
            "family@group.calendar.google.com",           // Family events
            "#contacts@group.v.calendar.google.com",      // Birthdays
            "#holiday@group.v.calendar.google.com"        // Holidays
        ],
        colorByCalendar: true,
        touchEnabled: true,
        virtualKeyboard: true,
        allowEventCreation: true,
        allowEventEditing: true,
        maxEvents: 100,
        updateInterval: 300000
    }
}

// ====================================================================
// THEMING EXAMPLES
// ====================================================================

// Glass Theme - Frosted glass with transparency
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        theme: "glass",
        view: "month",
        size: "large"
    }
}

// Modern Theme - Vibrant gradients
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        theme: "modern",
        view: "week",
        size: "large"
    }
}

// Classic Theme - Dark with high contrast
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        theme: "classic",
        view: "agenda",
        size: "medium"
    }
}

// ====================================================================
// SIZE COMPARISON
// ====================================================================

// Full Screen (100vw x 100vh)
{ config: { size: "full" } }

// Large (1400px x 900px) - Default
{ config: { size: "large" } }

// Medium (1000px x 700px)
{ config: { size: "medium" } }

// Compact (600px x 500px)
{ config: { size: "compact" } }

// ====================================================================
// VIEW MODES
// ====================================================================

// Month View - Grid calendar with events
{ config: { view: "month" } }

// Week View - Timeline with hourly slots
{ config: { view: "week" } }

// Day View - Single day detailed schedule
{ config: { view: "day" } }

// Agenda View - List of upcoming events
{ config: { view: "agenda" } }

// ====================================================================
// ADVANCED CONFIGURATIONS
// ====================================================================

// High Frequency Updates (Every 30 seconds)
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        updateInterval: 30000,  // 30 seconds
        debug: true
    }
}

// Minimal Touch Interface (No Keyboard)
{
    module: "MMM-GoogleCalendar702",
    position: "top_right",
    config: {
        touchEnabled: true,
        virtualKeyboard: false,     // Disable keyboard
        allowEventCreation: false,  // View only
        allowEventEditing: false,
        allowEventDeletion: false
    }
}

// Debug Mode (For Troubleshooting)
{
    module: "MMM-GoogleCalendar702",
    position: "top_left",
    config: {
        debug: true,  // Enable detailed console logging
        view: "month",
        size: "large"
    }
}

// ====================================================================
// NOTES AND TIPS
// ====================================================================

/*
 * To find your calendar ID:
 * 1. Go to https://calendar.google.com
 * 2. Settings → Click on your calendar
 * 3. Scroll to "Integrate calendar"
 * 4. Copy the "Calendar ID"
 * 
 * Common Calendar IDs:
 * - "primary" - Your main Google calendar
 * - "your-email@gmail.com" - Your personal calendar
 * - "#contacts@group.v.calendar.google.com" - Birthdays
 * - "#holiday@group.v.calendar.google.com" - Holidays
 * 
 * Position Options:
 * - top_left, top_center, top_right
 * - upper_third (left/center/right)
 * - middle_center
 * - lower_third (left/center/right)
 * - bottom_left, bottom_center, bottom_right
 * - bottom_bar
 * - fullscreen_above, fullscreen_below
 * 
 * Update Interval Guidelines:
 * - 30000 (30 sec) - High frequency, more API calls
 * - 60000 (1 min) - Balanced
 * - 300000 (5 min) - Default, recommended
 * - 600000 (10 min) - Conservative
 * - 900000 (15 min) - Low frequency
 * 
 * Time Formats:
 * - "12" - 12-hour format (3:00 PM)
 * - "24" - 24-hour format (15:00)
 * 
 * Date Formats (Moment.js):
 * - "MMM D" - Dec 25
 * - "MMMM D, YYYY" - December 25, 2024
 * - "DD/MM/YYYY" - 25/12/2024
 * - "MM/DD/YYYY" - 12/25/2024
 */

/* Magic Mirror
 * Node Helper: MMM-GoogleCalendar702
 *
 * By Tank702
 * Simplified iCal-based version - No OAuth required!
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const ical = require("node-ical");
const axios = require("axios");
const moment = require("moment");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for: " + this.name);
        
        this.config = null;
        this.calendars = [];
        this.events = [];
        this.updateTimer = null;
    },

    socketNotificationReceived: function(notification, payload) {
        switch(notification) {
            case "CONFIG":
                this.config = payload;
                this.initialize();
                break;
                
            case "GET_EVENTS":
                if (this.calendars.length > 0) {
                    this.fetchAllEvents();
                }
                break;
                
            case "CREATE_EVENT":
                this.createEvent(payload);
                break;
                
            case "UPDATE_EVENT":
                this.updateEvent(payload);
                break;
                
            case "DELETE_EVENT":
                this.deleteEvent(payload);
                break;
        }
    },

    initialize: function() {
        console.log("Initializing MMM-GoogleCalendar702 with iCal feeds");
        
        // Validate calendars configuration
        if (!this.config.calendars || this.config.calendars.length === 0) {
            this.sendSocketNotification("ERROR", {
                message: "No calendars configured. Please add calendar URLs to your config."
            });
            return;
        }
        
        // Setup calendars
        this.calendars = this.config.calendars.map((cal, index) => {
            if (typeof cal === "string") {
                // Simple URL format
                return {
                    id: `calendar-${index}`,
                    name: `Calendar ${index + 1}`,
                    url: cal,
                    color: this.getCalendarColor(index)
                };
            } else {
                // Detailed format
                return {
                    id: cal.id || `calendar-${index}`,
                    name: cal.name || `Calendar ${index + 1}`,
                    url: cal.url,
                    color: cal.color || this.getCalendarColor(index)
                };
            }
        });
        
        this.sendSocketNotification("CALENDARS", this.calendars);
        this.sendSocketNotification("AUTHENTICATED", true);
        
        // Initial fetch
        this.fetchAllEvents();
        
        // Setup periodic updates
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        this.updateTimer = setInterval(() => {
            this.fetchAllEvents();
        }, this.config.updateInterval || 300000);
        
        if (this.config.debug) {
            console.log("Initialized with", this.calendars.length, "calendars");
        }
    },

    fetchAllEvents: async function() {
        try {
            const allEvents = [];
            
            for (const calendar of this.calendars) {
                try {
                    const events = await this.fetchCalendarEvents(calendar);
                    allEvents.push(...events);
                } catch (error) {
                    console.error(`Error fetching calendar ${calendar.name}:`, error.message);
                    if (this.config.debug) {
                        console.error("Calendar URL:", calendar.url);
                        console.error("Full error:", error);
                    }
                }
            }
            
            // Sort events by start time
            allEvents.sort((a, b) => {
                const aTime = new Date(a.start.dateTime || a.start.date);
                const bTime = new Date(b.start.dateTime || b.start.date);
                return aTime - bTime;
            });
            
            // Filter to maxEvents
            const maxEvents = this.config.maxEvents || 100;
            this.events = allEvents.slice(0, maxEvents);
            
            this.sendSocketNotification("EVENTS", this.events);
            
            if (this.config.debug) {
                console.log(`Fetched ${this.events.length} total events from ${this.calendars.length} calendars`);
            }
            
        } catch (error) {
            console.error("Error fetching events:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to fetch calendar events: " + error.message
            });
        }
    },

    fetchCalendarEvents: async function(calendar) {
        try {
            // Fetch iCal data
            const response = await axios.get(calendar.url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'MagicMirror-GoogleCalendar702/1.0'
                }
            });
            
            // Parse iCal data
            const icalData = ical.parseICS(response.data);
            const events = [];
            
            const now = new Date();
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + (this.config.maxDays || 365));
            
            // Convert iCal events to our format
            for (const k in icalData) {
                const event = icalData[k];
                
                if (event.type === 'VEVENT') {
                    const start = event.start;
                    const end = event.end;
                    
                    // Skip past events
                    if (end < now) continue;
                    
                    // Skip events too far in the future
                    if (start > maxDate) continue;
                    
                    // Determine if all-day event
                    const isAllDay = !event.start.getHours && !event.start.getMinutes;
                    
                    const convertedEvent = {
                        id: event.uid || this.generateEventId(),
                        summary: event.summary || "(No title)",
                        description: event.description || "",
                        location: event.location || "",
                        start: isAllDay ? {
                            date: moment(start).format("YYYY-MM-DD")
                        } : {
                            dateTime: start.toISOString(),
                            timeZone: event.start.tz || Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        end: isAllDay ? {
                            date: moment(end).format("YYYY-MM-DD")
                        } : {
                            dateTime: end.toISOString(),
                            timeZone: event.end.tz || Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        calendarId: calendar.id,
                        calendarName: calendar.name,
                        color: calendar.color,
                        status: event.status || "confirmed",
                        created: event.created ? event.created.toISOString() : null,
                        updated: event.lastmodified ? event.lastmodified.toISOString() : null,
                        url: event.url || null
                    };
                    
                    events.push(convertedEvent);
                }
            }
            
            if (this.config.debug) {
                console.log(`Calendar "${calendar.name}": ${events.length} events`);
            }
            
            return events;
            
        } catch (error) {
            console.error(`Error fetching calendar ${calendar.name}:`, error.message);
            throw error;
        }
    },

    createEvent: function(eventData) {
        // iCal is read-only - inform user
        this.sendSocketNotification("ERROR", {
            message: "Event creation not supported with iCal feeds. Use your calendar app to add events."
        });
        
        if (this.config.debug) {
            console.log("Event creation attempted but not supported with iCal feeds");
        }
    },

    updateEvent: function(eventData) {
        // iCal is read-only - inform user
        this.sendSocketNotification("ERROR", {
            message: "Event editing not supported with iCal feeds. Use your calendar app to edit events."
        });
        
        if (this.config.debug) {
            console.log("Event update attempted but not supported with iCal feeds");
        }
    },

    deleteEvent: function(eventId) {
        // iCal is read-only - inform user
        this.sendSocketNotification("ERROR", {
            message: "Event deletion not supported with iCal feeds. Use your calendar app to delete events."
        });
        
        if (this.config.debug) {
            console.log("Event deletion attempted but not supported with iCal feeds");
        }
    },

    getCalendarColor: function(index) {
        // Predefined colors matching Google Calendar's palette
        const colors = [
            "#4285f4", // Blue
            "#ea4335", // Red
            "#fbbc04", // Yellow
            "#34a853", // Green
            "#ff6d00", // Orange
            "#46bdc6", // Cyan
            "#7986cb", // Indigo
            "#a142f4", // Purple
            "#f538a0", // Pink
            "#e67c73", // Coral
            "#33b679", // Teal
            "#616161"  // Gray
        ];
        
        return colors[index % colors.length];
    },

    generateEventId: function() {
        return 'event-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    stop: function() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
    }
});

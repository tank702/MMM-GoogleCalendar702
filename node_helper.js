/* Magic Mirror
 * Node Helper: MMM-GoogleCalendar702
 *
 * By Tank702
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const readline = require("readline");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for: " + this.name);
        
        this.config = null;
        this.oauth2Client = null;
        this.calendar = null;
        this.calendars = [];
        this.events = [];
        this.authenticated = false;
        
        // Paths
        this.tokenPath = path.join(__dirname, "token.json");
        this.credentialsPath = path.join(__dirname, "credentials.json");
    },

    socketNotificationReceived: function(notification, payload) {
        switch(notification) {
            case "CONFIG":
                this.config = payload;
                this.initialize();
                break;
                
            case "GET_EVENTS":
                if (this.authenticated) {
                    this.fetchEvents();
                }
                break;
                
            case "OPEN_EVENT_CREATOR":
                this.openEventCreator(payload);
                break;
                
            case "EDIT_EVENT":
                this.updateEvent(payload);
                break;
                
            case "DELETE_EVENT":
                this.deleteEvent(payload);
                break;
                
            case "KEY_PRESS":
                this.handleKeyPress(payload);
                break;
        }
    },

    initialize: async function() {
        try {
            // Check if credentials exist
            if (!fs.existsSync(this.credentialsPath)) {
                console.error("Credentials file not found!");
                this.sendSocketNotification("ERROR", {
                    message: "Please run 'npm run setup' to configure Google Calendar API credentials"
                });
                return;
            }
            
            // Load credentials
            const credentials = JSON.parse(fs.readFileSync(this.credentialsPath));
            const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
            
            // Create OAuth2 client
            this.oauth2Client = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirect_uris[0]
            );
            
            // Check if we have a token
            if (fs.existsSync(this.tokenPath)) {
                const token = JSON.parse(fs.readFileSync(this.tokenPath));
                this.oauth2Client.setCredentials(token);
                this.authenticated = true;
                
                // Initialize calendar API
                this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
                
                this.sendSocketNotification("AUTHENTICATED", true);
                
                // Fetch initial data
                await this.fetchCalendars();
                await this.fetchEvents();
                
                // Set up token refresh
                this.setupTokenRefresh();
            } else {
                console.log("No token found. Please authenticate.");
                this.sendSocketNotification("ERROR", {
                    message: "Authentication required. Please run 'npm run auth'"
                });
            }
            
        } catch (error) {
            console.error("Initialization error:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to initialize: " + error.message
            });
        }
    },

    setupTokenRefresh: function() {
        // Refresh token every 45 minutes
        setInterval(async () => {
            try {
                const { credentials } = await this.oauth2Client.refreshAccessToken();
                this.oauth2Client.setCredentials(credentials);
                
                // Save updated token
                fs.writeFileSync(this.tokenPath, JSON.stringify(credentials));
                console.log("Token refreshed successfully");
            } catch (error) {
                console.error("Token refresh error:", error);
            }
        }, 45 * 60 * 1000);
    },

    fetchCalendars: async function() {
        try {
            const response = await this.calendar.calendarList.list();
            this.calendars = response.data.items;
            
            // Filter calendars if specific ones are configured
            if (this.config.calendars && this.config.calendars.length > 0) {
                this.calendars = this.calendars.filter(cal => 
                    this.config.calendars.includes(cal.id)
                );
            }
            
            this.sendSocketNotification("CALENDARS", this.calendars);
            
            if (this.config.debug) {
                console.log("Fetched calendars:", this.calendars.map(c => c.summary));
            }
            
        } catch (error) {
            console.error("Error fetching calendars:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to fetch calendars: " + error.message
            });
        }
    },

    fetchEvents: async function() {
        try {
            const allEvents = [];
            const now = new Date();
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + this.config.maxDays);
            
            // Fetch events from all calendars
            for (const cal of this.calendars) {
                try {
                    const response = await this.calendar.events.list({
                        calendarId: cal.id,
                        timeMin: now.toISOString(),
                        timeMax: maxDate.toISOString(),
                        maxResults: this.config.maxEvents,
                        singleEvents: true,
                        orderBy: 'startTime'
                    });
                    
                    const events = response.data.items.map(event => ({
                        ...event,
                        calendarId: cal.id,
                        color: this.config.colorByCalendar ? cal.backgroundColor : event.colorId
                    }));
                    
                    allEvents.push(...events);
                    
                } catch (error) {
                    console.error(`Error fetching events for calendar ${cal.summary}:`, error);
                }
            }
            
            // Sort all events by start time
            allEvents.sort((a, b) => {
                const aTime = new Date(a.start.dateTime || a.start.date);
                const bTime = new Date(b.start.dateTime || b.start.date);
                return aTime - bTime;
            });
            
            this.events = allEvents;
            this.sendSocketNotification("EVENTS", this.events);
            
            if (this.config.debug) {
                console.log(`Fetched ${this.events.length} events`);
            }
            
        } catch (error) {
            console.error("Error fetching events:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to fetch events: " + error.message
            });
        }
    },

    createEvent: async function(eventData) {
        try {
            // Use first calendar if not specified
            const calendarId = eventData.calendarId || this.calendars[0].id;
            
            const event = {
                summary: eventData.summary || "New Event",
                description: eventData.description || "",
                location: eventData.location || "",
                start: eventData.start || {
                    dateTime: new Date().toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: eventData.end || {
                    dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            };
            
            const response = await this.calendar.events.insert({
                calendarId: calendarId,
                resource: event
            });
            
            const createdEvent = {
                ...response.data,
                calendarId: calendarId,
                color: this.calendars.find(c => c.id === calendarId)?.backgroundColor
            };
            
            this.sendSocketNotification("EVENT_CREATED", createdEvent);
            
            // Refresh events
            await this.fetchEvents();
            
            if (this.config.debug) {
                console.log("Event created:", createdEvent.summary);
            }
            
        } catch (error) {
            console.error("Error creating event:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to create event: " + error.message
            });
        }
    },

    updateEvent: async function(eventData) {
        try {
            const response = await this.calendar.events.update({
                calendarId: eventData.calendarId,
                eventId: eventData.id,
                resource: eventData
            });
            
            const updatedEvent = {
                ...response.data,
                calendarId: eventData.calendarId,
                color: this.calendars.find(c => c.id === eventData.calendarId)?.backgroundColor
            };
            
            this.sendSocketNotification("EVENT_UPDATED", updatedEvent);
            
            // Refresh events
            await this.fetchEvents();
            
            if (this.config.debug) {
                console.log("Event updated:", updatedEvent.summary);
            }
            
        } catch (error) {
            console.error("Error updating event:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to update event: " + error.message
            });
        }
    },

    deleteEvent: async function(eventId) {
        try {
            // Find the event to get its calendar ID
            const event = this.events.find(e => e.id === eventId);
            if (!event) {
                throw new Error("Event not found");
            }
            
            await this.calendar.events.delete({
                calendarId: event.calendarId,
                eventId: eventId
            });
            
            this.sendSocketNotification("EVENT_DELETED", eventId);
            
            // Refresh events
            await this.fetchEvents();
            
            if (this.config.debug) {
                console.log("Event deleted:", eventId);
            }
            
        } catch (error) {
            console.error("Error deleting event:", error);
            this.sendSocketNotification("ERROR", {
                message: "Failed to delete event: " + error.message
            });
        }
    },

    openEventCreator: function(data) {
        // This would be implemented with a form interface
        // For now, create a basic event at the specified date
        const eventDate = new Date(data.date);
        
        this.createEvent({
            summary: "New Event",
            start: {
                dateTime: eventDate.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: new Date(eventDate.getTime() + 3600000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        });
    },

    handleKeyPress: function(key) {
        // Handle virtual keyboard input
        // This would be connected to a form builder
        if (this.config.debug) {
            console.log("Key pressed:", key);
        }
    },

    // OAuth2 Helper Functions
    generateAuthUrl: function() {
        const SCOPES = ['https://www.googleapis.com/auth/calendar'];
        
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        
        return authUrl;
    },

    getAccessToken: async function(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            
            // Store the token
            fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
            
            return tokens;
        } catch (error) {
            console.error('Error retrieving access token:', error);
            throw error;
        }
    }
});

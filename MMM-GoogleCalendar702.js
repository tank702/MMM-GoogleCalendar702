/* Magic Mirror
 * Module: MMM-GoogleCalendar702
 *
 * By Tank702
 * A stunning Google Calendar module with touch support and virtual keyboard
 * MIT Licensed.
 */

Module.register("MMM-GoogleCalendar702", {
    defaults: {
        // Display Settings
        view: "month", // "month", "week", "day", "agenda"
        size: "large", // "full", "large", "medium", "compact"
        maxEvents: 50,
        maxDays: 365,
        
        // Calendar Settings (iCal URLs)
        calendars: [], // Array of iCal URLs or calendar objects
        updateInterval: 300000, // 5 minutes
        fadeSpeed: 2000,
        animationSpeed: 1000,
        
        // Visual Settings
        theme: "glass", // "glass", "modern", "classic"
        showWeekNumbers: false,
        firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday
        timeFormat: "12", // "12" or "24"
        dateFormat: "MMM D",
        
        // Touch & Interaction (Note: iCal is read-only)
        touchEnabled: true,
        virtualKeyboard: false,  // Disabled for iCal (read-only)
        allowEventCreation: false,  // Disabled for iCal (read-only)
        allowEventEditing: false,   // Disabled for iCal (read-only)
        allowEventDeletion: false,  // Disabled for iCal (read-only)
        dragAndDrop: false,          // Disabled for iCal (read-only)
        
        // Event Display
        showEventDetails: true,
        showLocation: true,
        showDescription: true,
        colorByCalendar: true,
        
        // Advanced
        debug: false,
    },

    requiresVersion: "2.1.0",

    start: function() {
        Log.info("Starting module: " + this.name);
        
        this.events = [];
        this.calendars = [];
        this.loaded = false;
        this.authenticated = false;
        this.selectedDate = new Date();
        this.selectedEvent = null;
        this.draggedEvent = null;
        this.keyboardVisible = false;
        
        this.sendSocketNotification("CONFIG", this.config);
        this.scheduleUpdate();
    },

    getStyles: function() {
        return [
            this.file("MMM-GoogleCalendar702.css"),
            "font-awesome.css"
        ];
    },

    getScripts: function() {
        return [
            "moment.js"
        ];
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = `google-calendar-wrapper ${this.config.size} ${this.config.theme}`;
        
        if (!this.authenticated) {
            return this.getAuthenticationPrompt(wrapper);
        }
        
        if (!this.loaded) {
            return this.getLoadingScreen(wrapper);
        }
        
        // Main calendar container
        const container = document.createElement("div");
        container.className = "calendar-container";
        
        // Header with navigation and view controls
        container.appendChild(this.createHeader());
        
        // Calendar view based on selected mode
        switch(this.config.view) {
            case "month":
                container.appendChild(this.createMonthView());
                break;
            case "week":
                container.appendChild(this.createWeekView());
                break;
            case "day":
                container.appendChild(this.createDayView());
                break;
            case "agenda":
                container.appendChild(this.createAgendaView());
                break;
        }
        
        // Event details modal (if event selected)
        if (this.selectedEvent) {
            container.appendChild(this.createEventModal());
        }
        
        // Virtual keyboard (if enabled and visible)
        if (this.config.virtualKeyboard && this.keyboardVisible) {
            container.appendChild(this.createVirtualKeyboard());
        }
        
        wrapper.appendChild(container);
        
        // Add touch event listeners if enabled
        if (this.config.touchEnabled) {
            this.addTouchListeners(wrapper);
        }
        
        return wrapper;
    },

    createHeader: function() {
        const header = document.createElement("div");
        header.className = "calendar-header";
        
        // Navigation buttons
        const nav = document.createElement("div");
        nav.className = "calendar-nav";
        
        const prevBtn = this.createButton("chevron-left", () => this.navigateDate(-1));
        const todayBtn = this.createButton("calendar-o", () => this.navigateToday(), "Today");
        const nextBtn = this.createButton("chevron-right", () => this.navigateDate(1));
        
        nav.appendChild(prevBtn);
        nav.appendChild(todayBtn);
        nav.appendChild(nextBtn);
        
        // Current date/period display
        const dateDisplay = document.createElement("div");
        dateDisplay.className = "current-period";
        dateDisplay.innerHTML = this.getFormattedPeriod();
        
        // View switcher
        const viewSwitcher = document.createElement("div");
        viewSwitcher.className = "view-switcher";
        
        const views = ["month", "week", "day", "agenda"];
        views.forEach(view => {
            const btn = document.createElement("button");
            btn.className = `view-btn ${this.config.view === view ? "active" : ""}`;
            btn.innerHTML = view.charAt(0).toUpperCase() + view.slice(1);
            btn.onclick = () => this.switchView(view);
            viewSwitcher.appendChild(btn);
        });
        
        // Add event button
        if (this.config.allowEventCreation) {
            const addBtn = this.createButton("plus", () => this.openEventCreator(), "New Event");
            addBtn.className += " add-event-btn";
            viewSwitcher.appendChild(addBtn);
        }
        
        header.appendChild(nav);
        header.appendChild(dateDisplay);
        header.appendChild(viewSwitcher);
        
        return header;
    },

    createMonthView: function() {
        const monthView = document.createElement("div");
        monthView.className = "month-view";
        
        // Weekday headers
        const weekdayHeader = document.createElement("div");
        weekdayHeader.className = "weekday-header";
        
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const startDay = this.config.firstDayOfWeek;
        
        for (let i = 0; i < 7; i++) {
            const day = weekdays[(startDay + i) % 7];
            const dayHeader = document.createElement("div");
            dayHeader.className = "weekday";
            dayHeader.innerHTML = day;
            weekdayHeader.appendChild(dayHeader);
        }
        
        monthView.appendChild(weekdayHeader);
        
        // Calendar grid
        const grid = document.createElement("div");
        grid.className = "calendar-grid";
        
        const firstDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
        const lastDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - ((firstDay.getDay() - startDay + 7) % 7));
        
        // Generate 6 weeks (42 days)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            
            const dayCell = this.createDayCell(currentDate, this.selectedDate.getMonth());
            grid.appendChild(dayCell);
        }
        
        monthView.appendChild(grid);
        
        return monthView;
    },

    createDayCell: function(date, currentMonth) {
        const cell = document.createElement("div");
        cell.className = "day-cell";
        cell.dataset.date = date.toISOString();
        
        const isToday = this.isToday(date);
        const isCurrentMonth = date.getMonth() === currentMonth;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        if (isToday) cell.classList.add("today");
        if (!isCurrentMonth) cell.classList.add("other-month");
        if (isWeekend) cell.classList.add("weekend");
        
        // Day number
        const dayNum = document.createElement("div");
        dayNum.className = "day-number";
        dayNum.innerHTML = date.getDate();
        cell.appendChild(dayNum);
        
        // Events for this day
        const dayEvents = this.getEventsForDate(date);
        const eventsContainer = document.createElement("div");
        eventsContainer.className = "day-events";
        
        const maxDisplay = this.config.size === "compact" ? 2 : 4;
        dayEvents.slice(0, maxDisplay).forEach(event => {
            const eventEl = this.createEventChip(event, "day");
            eventsContainer.appendChild(eventEl);
        });
        
        if (dayEvents.length > maxDisplay) {
            const more = document.createElement("div");
            more.className = "more-events";
            more.innerHTML = `+${dayEvents.length - maxDisplay} more`;
            more.onclick = (e) => {
                e.stopPropagation();
                this.showDayEvents(date, dayEvents);
            };
            eventsContainer.appendChild(more);
        }
        
        cell.appendChild(eventsContainer);
        
        // Click handler
        cell.onclick = () => {
            if (this.config.allowEventCreation) {
                this.openEventCreator(date);
            }
        };
        
        return cell;
    },

    createWeekView: function() {
        const weekView = document.createElement("div");
        weekView.className = "week-view";
        
        // Time column + day columns
        const grid = document.createElement("div");
        grid.className = "week-grid";
        
        // Header with days
        const header = document.createElement("div");
        header.className = "week-header";
        
        // Empty corner for time column
        const corner = document.createElement("div");
        corner.className = "time-corner";
        header.appendChild(corner);
        
        // Get week dates
        const weekDates = this.getWeekDates();
        weekDates.forEach(date => {
            const dayHeader = document.createElement("div");
            dayHeader.className = "week-day-header";
            if (this.isToday(date)) dayHeader.classList.add("today");
            
            dayHeader.innerHTML = `
                <div class="day-name">${moment(date).format("ddd")}</div>
                <div class="day-date">${moment(date).format("D")}</div>
            `;
            header.appendChild(dayHeader);
        });
        
        weekView.appendChild(header);
        
        // Time grid
        const timeGrid = document.createElement("div");
        timeGrid.className = "time-grid";
        
        // 24 hours
        for (let hour = 0; hour < 24; hour++) {
            const row = document.createElement("div");
            row.className = "time-row";
            
            // Time label
            const timeLabel = document.createElement("div");
            timeLabel.className = "time-label";
            timeLabel.innerHTML = this.formatHour(hour);
            row.appendChild(timeLabel);
            
            // Day slots
            weekDates.forEach(date => {
                const slot = document.createElement("div");
                slot.className = "time-slot";
                slot.dataset.date = date.toISOString();
                slot.dataset.hour = hour;
                
                // Check for events at this time
                const slotEvents = this.getEventsForTimeSlot(date, hour);
                slotEvents.forEach(event => {
                    const eventEl = this.createEventBlock(event, date, hour);
                    slot.appendChild(eventEl);
                });
                
                // Click to create event
                slot.onclick = () => {
                    if (this.config.allowEventCreation) {
                        const eventDate = new Date(date);
                        eventDate.setHours(hour, 0, 0, 0);
                        this.openEventCreator(eventDate);
                    }
                };
                
                row.appendChild(slot);
            });
            
            timeGrid.appendChild(row);
        }
        
        weekView.appendChild(timeGrid);
        
        return weekView;
    },

    createDayView: function() {
        const dayView = document.createElement("div");
        dayView.className = "day-view";
        
        // Day header
        const header = document.createElement("div");
        header.className = "day-header";
        header.innerHTML = moment(this.selectedDate).format("dddd, MMMM D, YYYY");
        dayView.appendChild(header);
        
        // Timeline
        const timeline = document.createElement("div");
        timeline.className = "day-timeline";
        
        for (let hour = 0; hour < 24; hour++) {
            const hourBlock = document.createElement("div");
            hourBlock.className = "hour-block";
            
            const timeLabel = document.createElement("div");
            timeLabel.className = "time-label";
            timeLabel.innerHTML = this.formatHour(hour);
            
            const eventArea = document.createElement("div");
            eventArea.className = "event-area";
            eventArea.dataset.hour = hour;
            
            // Add events for this hour
            const hourEvents = this.getEventsForTimeSlot(this.selectedDate, hour);
            hourEvents.forEach(event => {
                const eventEl = this.createEventBlock(event, this.selectedDate, hour);
                eventArea.appendChild(eventEl);
            });
            
            hourBlock.appendChild(timeLabel);
            hourBlock.appendChild(eventArea);
            timeline.appendChild(hourBlock);
        }
        
        dayView.appendChild(timeline);
        
        return dayView;
    },

    createAgendaView: function() {
        const agendaView = document.createElement("div");
        agendaView.className = "agenda-view";
        
        // Get upcoming events
        const upcomingEvents = this.getUpcomingEvents();
        
        if (upcomingEvents.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.innerHTML = `
                <i class="fa fa-calendar-o"></i>
                <p>No upcoming events</p>
            `;
            agendaView.appendChild(empty);
            return agendaView;
        }
        
        // Group by date
        const groupedEvents = this.groupEventsByDate(upcomingEvents);
        
        Object.keys(groupedEvents).forEach(dateKey => {
            const dateSection = document.createElement("div");
            dateSection.className = "date-section";
            
            const dateHeader = document.createElement("div");
            dateHeader.className = "date-header";
            dateHeader.innerHTML = moment(dateKey).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd, MMM D',
                sameElse: 'dddd, MMM D, YYYY'
            });
            dateSection.appendChild(dateHeader);
            
            const eventsList = document.createElement("div");
            eventsList.className = "events-list";
            
            groupedEvents[dateKey].forEach(event => {
                const eventItem = this.createAgendaEventItem(event);
                eventsList.appendChild(eventItem);
            });
            
            dateSection.appendChild(eventsList);
            agendaView.appendChild(dateSection);
        });
        
        return agendaView;
    },

    createEventChip: function(event, context = "day") {
        const chip = document.createElement("div");
        chip.className = "event-chip";
        chip.style.backgroundColor = event.color || "#4285f4";
        chip.dataset.eventId = event.id;
        
        const title = document.createElement("span");
        title.className = "event-title";
        title.innerHTML = event.summary || "(No title)";
        chip.appendChild(title);
        
        chip.onclick = (e) => {
            e.stopPropagation();
            this.selectEvent(event);
        };
        
        return chip;
    },

    createEventBlock: function(event, date, hour) {
        const block = document.createElement("div");
        block.className = "event-block";
        block.style.backgroundColor = event.color || "#4285f4";
        block.dataset.eventId = event.id;
        
        // Calculate position and height based on event time
        const start = new Date(event.start.dateTime || event.start.date);
        const end = new Date(event.end.dateTime || event.end.date);
        
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        const duration = endMinutes - startMinutes;
        
        const topOffset = ((startMinutes % 60) / 60) * 100;
        const height = (duration / 60) * 100;
        
        block.style.top = `${topOffset}%`;
        block.style.height = `${height}%`;
        
        block.innerHTML = `
            <div class="event-time">${moment(start).format(this.config.timeFormat === "12" ? "h:mm A" : "HH:mm")}</div>
            <div class="event-title">${event.summary || "(No title)"}</div>
        `;
        
        block.onclick = (e) => {
            e.stopPropagation();
            this.selectEvent(event);
        };
        
        if (this.config.dragAndDrop) {
            block.draggable = true;
            block.ondragstart = (e) => this.handleDragStart(e, event);
            block.ondragend = (e) => this.handleDragEnd(e);
        }
        
        return block;
    },

    createAgendaEventItem: function(event) {
        const item = document.createElement("div");
        item.className = "agenda-event-item";
        item.dataset.eventId = event.id;
        
        const colorBar = document.createElement("div");
        colorBar.className = "event-color-bar";
        colorBar.style.backgroundColor = event.color || "#4285f4";
        
        const content = document.createElement("div");
        content.className = "event-content";
        
        const header = document.createElement("div");
        header.className = "event-header";
        
        const title = document.createElement("div");
        title.className = "event-title";
        title.innerHTML = event.summary || "(No title)";
        
        const time = document.createElement("div");
        time.className = "event-time";
        time.innerHTML = this.formatEventTime(event);
        
        header.appendChild(title);
        header.appendChild(time);
        content.appendChild(header);
        
        if (event.location && this.config.showLocation) {
            const location = document.createElement("div");
            location.className = "event-location";
            location.innerHTML = `<i class="fa fa-map-marker"></i> ${event.location}`;
            content.appendChild(location);
        }
        
        item.appendChild(colorBar);
        item.appendChild(content);
        
        item.onclick = () => this.selectEvent(event);
        
        return item;
    },

    createEventModal: function() {
        const modal = document.createElement("div");
        modal.className = "event-modal";
        modal.onclick = () => this.closeEventModal();
        
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.onclick = (e) => e.stopPropagation();
        
        const event = this.selectedEvent;
        
        // Header
        const header = document.createElement("div");
        header.className = "modal-header";
        header.style.backgroundColor = event.color || "#4285f4";
        
        const title = document.createElement("h2");
        title.innerHTML = event.summary || "(No title)";
        
        const closeBtn = this.createButton("times", () => this.closeEventModal());
        closeBtn.className += " close-btn";
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        modalContent.appendChild(header);
        
        // Body
        const body = document.createElement("div");
        body.className = "modal-body";
        
        // Time
        const timeRow = this.createDetailRow("clock-o", this.formatEventTime(event));
        body.appendChild(timeRow);
        
        // Location
        if (event.location) {
            const locationRow = this.createDetailRow("map-marker", event.location);
            body.appendChild(locationRow);
        }
        
        // Description
        if (event.description && this.config.showDescription) {
            const descRow = this.createDetailRow("align-left", event.description);
            body.appendChild(descRow);
        }
        
        // Calendar
        const calendar = this.calendars.find(cal => cal.id === event.calendarId);
        if (calendar) {
            const calRow = this.createDetailRow("calendar", calendar.summary);
            body.appendChild(calRow);
        }
        
        modalContent.appendChild(body);
        
        // Actions
        const actions = document.createElement("div");
        actions.className = "modal-actions";
        
        if (this.config.allowEventEditing) {
            const editBtn = this.createButton("pencil", () => this.editEvent(event), "Edit");
            actions.appendChild(editBtn);
        }
        
        if (this.config.allowEventDeletion) {
            const deleteBtn = this.createButton("trash", () => this.deleteEvent(event), "Delete");
            deleteBtn.classList.add("danger");
            actions.appendChild(deleteBtn);
        }
        
        modalContent.appendChild(actions);
        modal.appendChild(modalContent);
        
        return modal;
    },

    createVirtualKeyboard: function() {
        const keyboard = document.createElement("div");
        keyboard.className = "virtual-keyboard";
        
        const layout = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
            ['Space', 'Done']
        ];
        
        layout.forEach(row => {
            const rowEl = document.createElement("div");
            rowEl.className = "keyboard-row";
            
            row.forEach(key => {
                const keyEl = document.createElement("button");
                keyEl.className = "key";
                keyEl.innerHTML = key;
                
                if (key === 'Space') {
                    keyEl.classList.add("space");
                } else if (key === 'Done') {
                    keyEl.classList.add("done");
                }
                
                keyEl.onclick = () => this.handleKeyPress(key);
                rowEl.appendChild(keyEl);
            });
            
            keyboard.appendChild(rowEl);
        });
        
        return keyboard;
    },

    // Helper Functions
    createButton: function(icon, onclick, text = "") {
        const btn = document.createElement("button");
        btn.className = "icon-btn";
        btn.innerHTML = `<i class="fa fa-${icon}"></i>`;
        if (text) {
            btn.innerHTML += ` <span>${text}</span>`;
        }
        btn.onclick = onclick;
        return btn;
    },

    createDetailRow: function(icon, text) {
        const row = document.createElement("div");
        row.className = "detail-row";
        row.innerHTML = `
            <i class="fa fa-${icon}"></i>
            <span>${text}</span>
        `;
        return row;
    },

    getFormattedPeriod: function() {
        switch(this.config.view) {
            case "month":
                return moment(this.selectedDate).format("MMMM YYYY");
            case "week":
                const weekStart = this.getWeekStart();
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return `${moment(weekStart).format("MMM D")} - ${moment(weekEnd).format("MMM D, YYYY")}`;
            case "day":
                return moment(this.selectedDate).format("MMMM D, YYYY");
            case "agenda":
                return "Upcoming Events";
        }
    },

    formatHour: function(hour) {
        if (this.config.timeFormat === "12") {
            const h = hour % 12 || 12;
            const ampm = hour < 12 ? "AM" : "PM";
            return `${h} ${ampm}`;
        }
        return `${hour}:00`;
    },

    formatEventTime: function(event) {
        const start = new Date(event.start.dateTime || event.start.date);
        const end = new Date(event.end.dateTime || event.end.date);
        
        if (event.start.date) {
            // All-day event
            return "All day";
        }
        
        const format = this.config.timeFormat === "12" ? "h:mm A" : "HH:mm";
        return `${moment(start).format(format)} - ${moment(end).format(format)}`;
    },

    getWeekStart: function() {
        const date = new Date(this.selectedDate);
        const day = date.getDay();
        const diff = (day - this.config.firstDayOfWeek + 7) % 7;
        date.setDate(date.getDate() - diff);
        date.setHours(0, 0, 0, 0);
        return date;
    },

    getWeekDates: function() {
        const dates = [];
        const start = this.getWeekStart();
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    },

    isToday: function(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    },

    getEventsForDate: function(date) {
        return this.events.filter(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date);
            return eventStart.getDate() === date.getDate() &&
                   eventStart.getMonth() === date.getMonth() &&
                   eventStart.getFullYear() === date.getFullYear();
        }).sort((a, b) => {
            const aTime = new Date(a.start.dateTime || a.start.date);
            const bTime = new Date(b.start.dateTime || b.start.date);
            return aTime - bTime;
        });
    },

    getEventsForTimeSlot: function(date, hour) {
        return this.events.filter(event => {
            const start = new Date(event.start.dateTime || event.start.date);
            const end = new Date(event.end.dateTime || event.end.date);
            
            return start.getDate() === date.getDate() &&
                   start.getMonth() === date.getMonth() &&
                   start.getFullYear() === date.getFullYear() &&
                   start.getHours() === hour;
        });
    },

    getUpcomingEvents: function() {
        const now = new Date();
        return this.events.filter(event => {
            const eventEnd = new Date(event.end.dateTime || event.end.date);
            return eventEnd >= now;
        }).slice(0, this.config.maxEvents);
    },

    groupEventsByDate: function(events) {
        const grouped = {};
        events.forEach(event => {
            const dateKey = moment(event.start.dateTime || event.start.date).format("YYYY-MM-DD");
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(event);
        });
        return grouped;
    },

    // Navigation
    navigateDate: function(direction) {
        switch(this.config.view) {
            case "month":
                this.selectedDate.setMonth(this.selectedDate.getMonth() + direction);
                break;
            case "week":
                this.selectedDate.setDate(this.selectedDate.getDate() + (direction * 7));
                break;
            case "day":
                this.selectedDate.setDate(this.selectedDate.getDate() + direction);
                break;
        }
        this.updateDom(this.config.animationSpeed);
    },

    navigateToday: function() {
        this.selectedDate = new Date();
        this.updateDom(this.config.animationSpeed);
    },

    switchView: function(view) {
        this.config.view = view;
        this.updateDom(this.config.animationSpeed);
    },

    // Event Actions
    selectEvent: function(event) {
        this.selectedEvent = event;
        this.updateDom(this.config.animationSpeed);
    },

    closeEventModal: function() {
        this.selectedEvent = null;
        this.updateDom(this.config.animationSpeed);
    },

    openEventCreator: function(date = null) {
        this.sendSocketNotification("OPEN_EVENT_CREATOR", {
            date: date || this.selectedDate
        });
        this.showKeyboard();
    },

    editEvent: function(event) {
        this.sendSocketNotification("EDIT_EVENT", event);
        this.showKeyboard();
    },

    deleteEvent: function(event) {
        if (confirm(`Delete event "${event.summary}"?`)) {
            this.sendSocketNotification("DELETE_EVENT", event.id);
            this.closeEventModal();
        }
    },

    showDayEvents: function(date, events) {
        // Switch to day view for the selected date
        this.selectedDate = new Date(date);
        this.config.view = "day";
        this.updateDom(this.config.animationSpeed);
    },

    // Keyboard
    showKeyboard: function() {
        this.keyboardVisible = true;
        this.updateDom(this.config.animationSpeed);
    },

    hideKeyboard: function() {
        this.keyboardVisible = false;
        this.updateDom(this.config.animationSpeed);
    },

    handleKeyPress: function(key) {
        if (key === 'Done') {
            this.hideKeyboard();
            return;
        }
        
        this.sendSocketNotification("KEY_PRESS", key);
    },

    // Drag and Drop
    handleDragStart: function(e, event) {
        this.draggedEvent = event;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.innerHTML);
        e.target.classList.add("dragging");
    },

    handleDragEnd: function(e) {
        e.target.classList.remove("dragging");
        this.draggedEvent = null;
    },

    // Touch Support
    addTouchListeners: function(wrapper) {
        let touchStartX = 0;
        let touchStartY = 0;
        
        wrapper.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        wrapper.addEventListener("touchend", (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe gestures
            if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50) {
                if (deltaX > 0) {
                    // Swipe right - previous
                    this.navigateDate(-1);
                } else {
                    // Swipe left - next
                    this.navigateDate(1);
                }
            }
        });
    },

    // Loading & Auth States
    getAuthenticationPrompt: function(wrapper) {
        wrapper.innerHTML = `
            <div class="auth-prompt">
                <i class="fa fa-calendar fa-3x"></i>
                <h2>Calendar Setup Required</h2>
                <p>Add your calendar iCal URLs to the config:</p>
                <ol>
                    <li>Open <a href="https://calendar.google.com" target="_blank">Google Calendar</a></li>
                    <li>Click Settings (gear icon) → Settings</li>
                    <li>Select your calendar from the left menu</li>
                    <li>Scroll to "Integrate calendar"</li>
                    <li>Copy the <strong>Secret address in iCal format</strong></li>
                    <li>Add to your MagicMirror config.js</li>
                </ol>
                <p>Example config:</p>
                <code>
                calendars: [<br>
                &nbsp;&nbsp;"https://calendar.google.com/calendar/ical/...@group.calendar.google.com/private-.../basic.ics"<br>
                ]
                </code>
            </div>
        `;
        return wrapper;
    },

    getLoadingScreen: function(wrapper) {
        wrapper.innerHTML = `
            <div class="loading-screen">
                <i class="fa fa-spinner fa-spin fa-3x"></i>
                <p>Loading your calendars...</p>
            </div>
        `;
        return wrapper;
    },

    // Socket Notifications
    socketNotificationReceived: function(notification, payload) {
        switch(notification) {
            case "AUTHENTICATED":
                this.authenticated = true;
                this.updateDom(this.config.fadeSpeed);
                break;
                
            case "CALENDARS":
                this.calendars = payload;
                this.loaded = true;
                this.updateDom(this.config.fadeSpeed);
                break;
                
            case "EVENTS":
                this.events = payload;
                this.updateDom(this.config.fadeSpeed);
                break;
                
            case "EVENT_CREATED":
                this.events.push(payload);
                this.hideKeyboard();
                this.updateDom(this.config.fadeSpeed);
                break;
                
            case "EVENT_UPDATED":
                const index = this.events.findIndex(e => e.id === payload.id);
                if (index !== -1) {
                    this.events[index] = payload;
                }
                this.closeEventModal();
                this.updateDom(this.config.fadeSpeed);
                break;
                
            case "EVENT_DELETED":
                this.events = this.events.filter(e => e.id !== payload);
                this.updateDom(this.config.fadeSpeed);
                break;
                
            case "ERROR":
                Log.error("Google Calendar Error:", payload);
                this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "Google Calendar Error",
                    message: payload.message
                });
                break;
        }
    },

    // Update Schedule
    scheduleUpdate: function() {
        setInterval(() => {
            this.sendSocketNotification("GET_EVENTS");
        }, this.config.updateInterval);
    }
});

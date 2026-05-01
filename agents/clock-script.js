// Global settings
let showSeconds = true;
let use24HourFormat = true;
let showDateDisplay = true;
let selectedTimezones = [];

// Timezone list with emoji
const timezones = {
    'America/New_York': { name: '🗽 New York', emoji: '🗽', offset: -5 },
    'America/Los_Angeles': { name: '🌴 Los Angeles', emoji: '🌴', offset: -8 },
    'America/Chicago': { name: '🌆 Chicago', emoji: '🌆', offset: -6 },
    'America/Denver': { name: '⛰️ Denver', emoji: '⛰️', offset: -7 },
    'Europe/London': { name: '🇬🇧 London', emoji: '🇬🇧', offset: 0 },
    'Europe/Paris': { name: '🇫🇷 Paris', emoji: '🇫🇷', offset: 1 },
    'Europe/Berlin': { name: '🇩🇪 Berlin', emoji: '🇩🇪', offset: 1 },
    'Europe/Moscow': { name: '🇷🇺 Moscow', emoji: '🇷🇺', offset: 3 },
    'Asia/Tokyo': { name: '🇯🇵 Tokyo', emoji: '🇯🇵', offset: 9 },
    'Asia/Shanghai': { name: '🇨🇳 Shanghai', emoji: '🇨🇳', offset: 8 },
    'Asia/Hong_Kong': { name: '🇭🇰 Hong Kong', emoji: '🇭🇰', offset: 8 },
    'Asia/Dubai': { name: '🇦🇪 Dubai', emoji: '🇦🇪', offset: 4 },
    'Asia/Bangkok': { name: '🇹🇭 Bangkok', emoji: '🇹🇭', offset: 7 },
    'Asia/Singapore': { name: '🇸🇬 Singapore', emoji: '🇸🇬', offset: 8 },
    'Asia/Kolkata': { name: '🇮🇳 India', emoji: '🇮🇳', offset: 5.5 },
    'Australia/Sydney': { name: '🇦🇺 Sydney', emoji: '🇦🇺', offset: 11 },
    'Australia/Melbourne': { name: '🇦🇺 Melbourne', emoji: '🇦🇺', offset: 11 },
    'Pacific/Auckland': { name: '🇳🇿 Auckland', emoji: '🇳🇿', offset: 13 },
    'America/Toronto': { name: '🇨🇦 Toronto', emoji: '🇨🇦', offset: -5 },
    'America/Mexico_City': { name: '🇲🇽 Mexico City', emoji: '🇲🇽', offset: -6 },
    'America/Sao_Paulo': { name: '🇧🇷 São Paulo', emoji: '🇧🇷', offset: -3 },
    'Africa/Cairo': { name: '🇪🇬 Cairo', emoji: '🇪🇬', offset: 2 },
    'Africa/Johannesburg': { name: '🇿🇦 Johannesburg', emoji: '🇿🇦', offset: 2 },
    'Africa/Lagos': { name: '🇳🇬 Lagos', emoji: '🇳🇬', offset: 1 }
};

// Initialize with default timezones
function initializeClocks() {
    selectedTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
    loadClocks();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
}

// Load clocks from localStorage
function loadClocks() {
    const saved = localStorage.getItem('selectedTimezones');
    if (saved) {
        try {
            selectedTimezones = JSON.parse(saved);
        } catch (e) {
            selectedTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
        }
    }
    renderClocks();
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
}

// Render all clock cards
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    grid.innerHTML = '';

    if (selectedTimezones.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏰</div>
                <p>No time zones selected. Click "Add Time Zone" to get started!</p>
            </div>
        `;
        return;
    }

    selectedTimezones.forEach((tz, index) => {
        const tzInfo = timezones[tz];
        if (tzInfo) {
            const clockCard = document.createElement('div');
            clockCard.className = 'clock-card';
            clockCard.id = `clock-${index}`;
            clockCard.innerHTML = `
                <div class="clock-header">
                    <div class="clock-timezone">${tzInfo.name}</div>
                    <button class="remove-btn" onclick="removeTimezone('${tz}')">✕</button>
                </div>
                <div class="clock-time" id="time-${index}">00:00:00</div>
                <div class="clock-date" id="date-${index}">Loading...</div>
                <div class="clock-offset" id="offset-${index}">UTC+0</div>
            `;
            grid.appendChild(clockCard);
        }
    });
}

// Update all clocks
function updateAllClocks() {
    // Update main clock (local time)
    updateMainClock();

    // Update selected timezone clocks
    selectedTimezones.forEach((tz, index) => {
        updateClock(tz, index);
    });
}

// Update main clock
function updateMainClock() {
    const now = new Date();
    const timeDisplay = document.getElementById('timeDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    const timezoneName = document.getElementById('timezoneName');

    const timeStr = formatTime(now);
    const dateStr = formatDate(now);

    timeDisplay.textContent = timeStr;
    dateDisplay.textContent = dateStr;
    timezoneName.textContent = 'Local Time (' + Intl.DateTimeFormat().resolvedOptions().timeZone + ')';
}

// Update individual clock
function updateClock(timezone, index) {
    const now = new Date();
    const options = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    try {
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(now);

        let hours = parseInt(parts.find(p => p.type === 'hour').value);
        const minutes = parts.find(p => p.type === 'minute').value;
        const seconds = parts.find(p => p.type === 'second').value;
        const month = parts.find(p => p.type === 'month').value;
        const day = parts.find(p => p.type === 'day').value;

        // Format time
        let timeStr;
        if (use24HourFormat) {
            timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
        } else {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            timeStr = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
        }

        if (showSeconds) {
            if (use24HourFormat) {
                timeStr = `${timeStr}:${seconds}`;
            } else {
                timeStr = timeStr.slice(0, -3) + `:${seconds} ${timeStr.slice(-2)}`;
            }
        }

        // Update DOM
        const timeElement = document.getElementById(`time-${index}`);
        if (timeElement) {
            timeElement.textContent = timeStr;
        }

        // Update date
        if (showDateDisplay) {
            const dateStr = `${month}/${day}/${now.getFullYear()}`;
            const dateElement = document.getElementById(`date-${index}`);
            if (dateElement) {
                dateElement.textContent = dateStr;
            }
        }

        // Update UTC offset
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const offset = (utcDate - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))) / 3600000;
        const offsetStr = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
        const offsetElement = document.getElementById(`offset-${index}`);
        if (offsetElement) {
            offsetElement.textContent = offsetStr;
        }
    } catch (e) {
        console.error('Error updating clock:', e);
    }
}

// Format time for main clock
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    let timeStr;
    if (use24HourFormat) {
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }

    if (showSeconds) {
        if (use24HourFormat) {
            timeStr = `${timeStr}:${seconds}`;
        } else {
            timeStr = timeStr.slice(0, -3) + `:${seconds} ${timeStr.slice(-2)}`;
        }
    }

    return timeStr;
}

// Format date for main clock
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
}

// Show timezone picker
function showTimezonePicker() {
    const select = document.getElementById('timezoneSelect');
    select.style.display = select.style.display === 'none' ? 'block' : 'none';

    if (select.style.display === 'block') {
        select.onchange = function() {
            if (this.value && !selectedTimezones.includes(this.value)) {
                selectedTimezones.push(this.value);
                saveClocks();
                renderClocks();
                updateAllClocks();
            }
            this.value = '';
            this.style.display = 'none';
        };
    }
}

// Remove timezone
function removeTimezone(timezone) {
    selectedTimezones = selectedTimezones.filter(tz => tz !== timezone);
    saveClocks();
    renderClocks();
}

// Clear all clocks
function clearAllClocks() {
    if (confirm('Are you sure you want to clear all time zones?')) {
        selectedTimezones = [];
        saveClocks();
        renderClocks();
    }
}

// Toggle format
function toggleFormat() {
    use24HourFormat = document.getElementById('format24').checked;
    updateAllClocks();
}

// Toggle seconds
function toggleSeconds() {
    showSeconds = document.getElementById('showSeconds').checked;
    updateAllClocks();
}

// Toggle date
function toggleDate() {
    showDateDisplay = document.getElementById('showDate').checked;
    renderClocks();
    updateAllClocks();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeClocks);

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

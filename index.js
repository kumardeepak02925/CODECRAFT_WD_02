
        // Get references to DOM elements
        const stopwatchContainer = document.getElementById('stopwatchContainer');
        const display = document.getElementById('display');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapBtn = document.getElementById('lapBtn');
        const lapList = document.getElementById('lap-list');
        const themeSelect = document.getElementById('theme-select');

        // Initialize stopwatch variables
        let startTime; // Stores the time when the stopwatch started or resumed
        let elapsedTime = 0; // Stores the total elapsed time in milliseconds
        let timerInterval; // Stores the interval ID for clearing the timer
        let isRunning = false; // Flag to check if the stopwatch is currently running
        let lapCounter = 0; // Counter for lap numbers

        /**
         * Formats a given time in milliseconds into HH:MM:SS.mmm format.
         * @param {number} time - The time in milliseconds.
         * @returns {string} The formatted time string.
         */
        function formatTime(time) {
            const hours = Math.floor(time / 3600000);
            const minutes = Math.floor((time % 3600000) / 60000);
            const seconds = Math.floor(((time % 3600000) % 60000) / 1000);
            const milliseconds = Math.floor(((time % 3600000) % 60000 % 1000));

            // Pad with leading zeros to ensure consistent two-digit format
            const pad = (num, length = 2) => num.toString().padStart(length, '0');

            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
        }

        /**
         * Updates the stopwatch display.
         * This function is called repeatedly by setInterval.
         */
        function updateDisplay() {
            // Calculate current elapsed time by adding time since start to previously elapsed time
            elapsedTime = Date.now() - startTime + elapsedTime;
            display.textContent = formatTime(elapsedTime);
            // Re-adjust startTime for the next interval to prevent drift
            startTime = Date.now();
        }

        /**
         * Starts or resumes the stopwatch.
         */
        function startStopwatch() {
            if (!isRunning) {
                isRunning = true;
                startTime = Date.now(); // Record the start time
                // Update display every 10 milliseconds for smooth millisecond tracking
                timerInterval = setInterval(updateDisplay, 10);

                // Update button states
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                resetBtn.disabled = false;
                lapBtn.disabled = false;
            }
        }

        /**
         * Pauses the stopwatch.
         */
        function pauseStopwatch() {
            if (isRunning) {
                isRunning = false;
                clearInterval(timerInterval); // Stop the interval
                // No need to update elapsedTime here, it's already updated in updateDisplay

                // Update button states
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                lapBtn.disabled = true; // Lap is disabled when paused
            }
        }

        /**
         * Resets the stopwatch to its initial state.
         */
        function resetStopwatch() {
            // Ensure stopwatch is paused before resetting
            pauseStopwatch();

            // Reset all variables
            elapsedTime = 0;
            lapCounter = 0;
            display.textContent = formatTime(0); // Set display to 00:00:00.000

            // Clear lap list
            lapList.innerHTML = '<li class="text-gray-500 text-center py-2">No laps recorded yet.</li>';

            // Reset button states
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
            lapBtn.disabled = true;
        }

        /**
         * Records the current lap time.
         */
        function recordLap() {
            if (isRunning) {
                lapCounter++;
                const lapTime = formatTime(elapsedTime); // Get the current elapsed time as lap time

                // Create a new list item for the lap
                const listItem = document.createElement('li');
                listItem.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-200');
                listItem.innerHTML = `
                    <span>Lap ${lapCounter}:</span>
                    <span class="font-mono text-lg">${lapTime}</span>
                `;

                // If "No laps recorded yet." is present, remove it
                if (lapList.firstElementChild && lapList.firstElementChild.textContent.includes('No laps recorded yet.')) {
                    lapList.innerHTML = '';
                }
                lapList.prepend(listItem); // Add new lap to the top of the list
            }
        }

        /**
         * Applies the selected theme to the stopwatch.
         * @param {string} themeName - The name of the theme to apply ('default', 'dark', 'minimalist').
         */
        function applyTheme(themeName) {
            // Remove all theme classes first
            document.body.classList.remove('default-theme', 'dark-theme', 'minimalist-theme');
            stopwatchContainer.classList.remove('default-theme', 'dark-theme', 'minimalist-theme');

            // Add the selected theme class
            if (themeName !== 'default') {
                document.body.classList.add(`${themeName}-theme`);
                stopwatchContainer.classList.add(`${themeName}-theme`);
            }
            // For default, no specific class is needed as base styles apply
        }

        // Add event listeners to buttons
        startBtn.addEventListener('click', startStopwatch);
        pauseBtn.addEventListener('click', pauseStopwatch);
        resetBtn.addEventListener('click', resetStopwatch);
        lapBtn.addEventListener('click', recordLap);

        // Add event listener for theme selection
        themeSelect.addEventListener('change', (event) => {
            applyTheme(event.target.value);
        });

        // Initial state setup when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            resetStopwatch(); // Ensure initial state is clean and buttons are correctly disabled
            applyTheme(themeSelect.value); // Apply the default selected theme on load
        });
    
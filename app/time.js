export function initializeTimeDisplay() {
  // to create time display elements
  const timeContainer = document.createElement("div");
  timeContainer.className = "time-container";

  const timeDisplay = document.createElement("div");
  timeDisplay.className = "time-display";

  const dateDisplay = document.createElement("div");
  dateDisplay.className = "date-display";

  timeContainer.appendChild(timeDisplay);
  timeContainer.appendChild(dateDisplay);

  // Add time to the navbar
  const navbar = document.querySelector(".sidebar");
  navbar.appendChild(timeContainer);

  // initialize Socket.IO time updates by using existing socket connection
  const socket = window.socket;

  socket.on("timeUpdate", (timeData) => {
    updateTimeDisplay(timeData, timeDisplay, dateDisplay);
  });

  // Fallback local time update in case socket disconnects
  function updateLocalTime() {
    const now = new Date();
    const timeData = {
      // time is format in 24 hours format
      time: now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      //   formatted to display weekday,day,month and year
      date: now.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    updateTimeDisplay(timeData, timeDisplay, dateDisplay);
  }

  // to update time display
  function updateTimeDisplay(timeData, timeElement, dateElement) {
    timeElement.innerHTML = `
            <span class="time-icon">🕒</span>
            <span class="time-text">${timeData.time}</span>
        `;
    dateElement.textContent = timeData.date;

    // added animation class
    timeElement.classList.add("time-update");
    setTimeout(() => timeElement.classList.remove("time-update"), 500);
  }

  // start local time updates
  updateLocalTime();
  setInterval(updateLocalTime, 1000);
}

// added to existing Socket.IO setup
io.on("connection", (socket) => {
  // to send time updates every second
  const timeInterval = setInterval(() => {
    const now = new Date();
    socket.emit("timeUpdate", {
      // format time as HH:MM:SS
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      //   format time as week day month day and year
      date: now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(timeInterval);
  });
});

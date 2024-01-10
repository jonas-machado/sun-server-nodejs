const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const telnet = require("./controllers/socket/connectTelnet");

const monitoring = require("./controllers/socket/monitoring");

// Define the Telnet server information

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  monitoring(io, socket);
  telnet(io, socket);
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

const port = 3001;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

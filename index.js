const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const {
  connectZte,
  connectDatacom,
  multipleTelnet,
  multipleTelnetDatacom,
} = require("./controllers/socket/connectTelnet");

const { message } = require("./controllers/socket/monitoring");

// Define the Telnet server information

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });

  socket.on("connectTelnet", connectZte);

  socket.on("connectTelnetDatacom", connectDatacom);

  socket.on("multipleTelnet", multipleTelnet);

  socket.on("multipleDatacomTelnet", multipleTelnetDatacom);

  socket.on("message", message);
});

const port = 3001;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

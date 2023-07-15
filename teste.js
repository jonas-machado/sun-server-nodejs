const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: "*",
});
const { Telnet } = require("telnet-client");

// Define the Telnet server information

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });

  socket.on("connectTelnet", ({ ip, command, brand, commandType }) => {
    console.log("to run telnet zte");
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      //shellPrompt: "#",
      //negotiationMandatory: false,
      timeout: 5000,
      execTimeout: 5000,
      loginPrompt: "Username:",
      passwordPrompt: "Password:",
      username: "admin",
      password: "1234",
      pageSeparator: "--More--",
    };
    connection.on("ready", function () {
      console.log("Connected to Telnet server");

      // Send commands to the server
      connection.exec(command, async function (err, response) {
        console.log(response);
        io.to(socket.id).emit("telnet response", {
          data: response,
          commandType: commandType,
        });
        if (err) {
          console.log(err);
        }

        // Close the connection
        connection.end();
      });
    });

    connection.on("close", function () {
      console.log("Disconnected from Telnet server");
    });

    connection.connect(params);
  });
});

const port = 3001;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

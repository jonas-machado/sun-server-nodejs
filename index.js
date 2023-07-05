const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { Telnet } = require("telnet-client");

// Define the Telnet server information

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("connectTelnet", ({ ip, command, brand }) => {
    console.log(ip, command, brand);
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      shellPrompt: "#",
      //negotiationMandatory: false,
      timeout: 5000,
      execTimeout: 5000,
      loginPrompt: "Username:",
      passwordPrompt: "Password:",
      username: "admin",
      password: "OT#internet2018",
      pageSeparator: "--More--",
    };
    connection.on("ready", function () {
      console.log("Connected to Telnet server");

      // Send commands to the server
      connection.exec(command, async function (err, response) {
        console.log(response);
        io.emit("telnet response", response);
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
  try {
    socket.on("connectTelnetDatacom", ({ ip, command, brand }) => {
      console.log(ip, command, brand);
      const connection = new Telnet();
      const params = {
        host: ip,
        port: 23,
        //negotiationMandatory: false,
        timeout: 2000,
        username: "admin",
        password: "OT#internet2018",
        pageSeparator: /--More--|END/g,
        shellPrompt: /OLT.*#/g,
      };
      connection.on("ready", async function () {
        console.log("Connected to Telnet server");
        connection.send("conf", function (err, response) {
          console.log(response);
          if (err) {
            console.log(err);
          }
          connection.exec(
            command,
            { execTimeout: 10000 },
            function (err, response) {
              const cleanedResponse = cleanPagination(response);

              console.log(response);
              io.emit("telnet response", cleanedResponse);
              if (err) {
                console.log(err);
              }

              connection.end();
            }
          );
        });
      });

      connection.on("close", function () {
        console.log("Disconnected from Telnet server");
      });

      function cleanPagination(response) {
        const paginationRegex = /--More--|\x1b\[7m\x1b\[27m\x1b\[8D\x1b\[K/g;
        return response.replace(paginationRegex, "");
      }

      connection.connect(params);
    });
  } catch (err) {
    throw new Error(err);
  }
  socket.on("multipleCommands", ({ ip, commands }) => {
    console.log(ip, commands);
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      shellPrompt: "#",
      //negotiationMandatory: false,
      timeout: 5000,
      execTimeout: 5000,
      loginPrompt: "Username:",
      passwordPrompt: "Password:",
      username: "admin",
      password: "OT#internet2018",
      pageSeparator: "--More--",
    };
    connection.on("ready", function () {
      console.log("Connected to Telnet server");
      let i = 0;
      const sendNextCommand = () => {
        if (i < commands.length) {
          // Send commands to the server
          connection.exec(commands[i], async function (err, response) {
            console.log(response);
            io.emit("telnet response", response);
            if (err) {
              console.log(err);
            }
            i++;
            sendNextCommand();
          });
        } else {
          // Close the connection
          connection.end();
        }
      };
      sendNextCommand();
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

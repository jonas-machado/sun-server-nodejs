const net = require("net");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const { Telnet } = require("telnet-client");

// Define the Telnet server information

let connection = null;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("connectTelnet", ({ ip, command }) => {
    if (connection) {
      connection.end();
    }

    connection = new Telnet();

    const params = {
      host: ip,
      port: 23,
      negotiationMandatory: false,
      timeout: 1500,
      username: "admin",
      password: "OT#internet2018",
    };
    console.log(params);
    connection.on("ready", function () {
      console.log("Connected to Telnet server");

      // Send commands to the server
      connection.exec(command, function (err, response) {
        if (err) {
          console.log(err);
        } else {
          io.emit("telnet response", response);
          console.log(response);
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
  // Handle client disconnection
});

// // Create a TCP socket connection to the Telnet server
// const client = net.createConnection({ host, portTelnet }, () => {
//   console.log("Connected to Telnet server");
//   client.write("cliente\r\n");
// });

// // Handle data received from the Telnet server
// client.on("data", async (data) => {
//   const dataString = data.toString();
//   console.log("Received:", data.toString());
//   if (data.includes("login:")) {
//     client.write("cliente\r\n");
//   }
//   if (data.includes("Password:")) {
//     client.write("1234\r\n");
//   }
//   if (data.includes("BusyBox")) {
//     client.write("ethtool eth0\r\n");
//     client.write("exit\r\n");
//   }
// });

// // Handle connection close
// client.on("close", () => {
//   console.log("Connection closed");
// });

// // Handle errors
// client.on("error", (err) => {
//   console.error("Error:", err);
// });

const port = 3001;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

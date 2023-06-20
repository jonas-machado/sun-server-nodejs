const { Telnet } = require("telnet-client");

// Telnet connection configuration
const connection = new Telnet();
const params = {
  host: "172.16.87.2",
  port: 23, // Default Telnet port for OLT ZTE C320
  shellPrompt: "", // Regular expression for detecting the command prompt
  timeout: 1500, // Timeout for waiting on response
  removeEcho: 4,
  negotiationMandatory: false, // Optional
  loginPrompt: "jackeline.okotny login: ",
  passwordPrompt: "Password: ",
  username: "cliente",
  password: "1234",
  failedLoginMatch: "login failed",
};

// Connect to the OLT
connection.on("ready", function () {
  console.log("Connected to Telnet server");

  // Send commands to the server
  connection.exec("ethtool eth0", async function (err, response) {
    console.log(response);
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

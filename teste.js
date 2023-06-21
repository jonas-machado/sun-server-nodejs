const { Telnet } = require("telnet-client");

// Telnet connection configuration
const connection = new Telnet();
const params = {
  host: "172.16.42.30",
  port: 23, // Default Telnet port for OLT ZTE C320
  shellPrompt: "#",
  timeout: 5000,
  execTimeout: 5000,
  loginPrompt: "Username:",
  passwordPrompt: "Password:",
  username: "admin",
  password: "OT#internet2018",
  pageSeparator: "--More--",
};

// Connect to the OLT
connection.on("ready", function () {
  console.log("Connected to Telnet server");

  // Send commands to the server
  connection.exec(
    //"show gpon onu state gpon-olt_1/2/2",
    //"show clock",
    "show gpon onu detail-info gpon-onu_1/2/2:1",
    async function (err, response) {
      console.log(response);
      if (err) {
        console.log(err);
      }

      // Close the connection
      connection.end();
    }
  );
});

connection.on("close", function () {
  console.log("Disconnected from Telnet server");
});

connection.connect(params);

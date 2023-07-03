const { Telnet } = require("telnet-client");

const connection = new Telnet();
const params = {
  host: "172.16.42.150",
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
  connection.exec("conf t", async function (err, response) {
    console.log(response);
    if (err) {
      console.log(err);
    }
    await connection.exec(
      "show gpon onu detail-info gpon-onu_1/2/1:1",
      async function (err, response) {
        console.log(response);
        if (err) {
          console.log(err);
        }

        // Close the connection
      }
    );
    // Close the connection
    connection.end();
  });
});
connection.on("close", function () {
  console.log("Disconnected from Telnet server");
});

connection.on("failedlogin", function (msg) {
  console.log("Login failed !", msg);
});

connection.connect(params);

const { Telnet } = require("telnet-client");

// Define the Telnet server information

const connection = new Telnet();
const params = {
  host: "10.0.0.163",
  port: 23,
  //shellPrompt: "/ #",
  negotiationMandatory: false,
  timeout: 1500,
  loginPrompt: "Username: ",
  passwordPrompt: "Password: ",
  username: "admin",
  password: "OT#internet2018",
  failedLoginMatch: "Bad Username/Password",
};
connection.on("ready", function () {
  console.log("Connected to Telnet server");

  // Send commands to the server
  connection.exec("ipconfig", async function (err, response) {
    console.log("response");
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

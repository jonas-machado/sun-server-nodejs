const { Telnet } = require("telnet-client");

// Define the Telnet server information

const connection = new Telnet();
const params = {
  host: "192.168.254.66",
  port: 23,
  timeout: 5000,
  pageSeparator: "--More--",
  username: "admin",
  password: "OT#internet2018",
  shellPrompt: /OLT.*#/g,
  execTimeout: 10000,
};
connection.on("ready", async function (prompt) {
  console.log("Connected to Telnet server");
  console.log(prompt);

  await connection.send("conf", async function (err, response) {
    console.log(response);
    if (err) {
      console.log(err);
    }
    await connection.exec(
      "do show interface gpon 1/1/1 onu ",
      async function (err, response) {
        console.log(response);
        if (err) {
          console.log(err);
        }
      }
    );
    connection.end();
  });

  // Close the connection
});

connection.on("close", function () {
  console.log("Disconnected from Telnet server");
});

connection.on("failedlogin", function (msg) {
  console.log("Login failed !", msg);
});

connection.connect(params);

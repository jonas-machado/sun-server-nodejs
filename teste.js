const { Telnet } = require("telnet-client");

// Define the Telnet server information

const connection = new Telnet();
const params = {
  host: "192.168.254.66",
  port: 23,
  timeout: 2000,
  pageSeparator: /--More--|END/,
  username: "admin",
  password: "OT#internet2018",
  shellPrompt: /OLT.*#/g,
};
connection.on("ready", function (prompt) {
  console.log("Connected to Telnet server");

  connection.send("conf", function (err, response) {
    console.log(response);
    if (err) {
      console.log("err conf");
    }
    connection.exec(
      //"do show system clock",
      "do show interface gpon 1/1/1 onu 1",
      function (err, response) {
        console.log(response);
        if (err) {
          console.log("err command");
        }
        connection.end();
      }
    );
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

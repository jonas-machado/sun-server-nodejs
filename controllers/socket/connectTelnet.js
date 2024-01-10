const { Telnet } = require("telnet-client");

module.exports = (io, socket) => {
  const connectZte = ({ ip, command, brand, commandType }) => {
    console.log(ip, command, brand, commandType);
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      shellPrompt: "#",
      //negotiationMandatory: false,
      timeout: 10000,
      execTimeout: 10000,
      loginPrompt: "Username:",
      passwordPrompt: "Password:",
      username: "admin",
      password: "OT#internet2018",
      pageSeparator: "--More--",
    };
    connection.on("ready", function () {
      console.log("Connected to Telnet server");

      // Send commands to the server
      try {
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
      } catch (error) {
        console.log(error);
      }
    });

    connection.on("close", function () {
      console.log("Disconnected from Telnet server");
    });

    connection.connect(params);
  };

  const connectDatacom = ({ ip, command, brand, commandType }) => {
    console.log(ip, command, brand);
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      //negotiationMandatory: false,
      timeout: 10000,
      execTimeout: 10000,
      username: "admin",
      password: "OT#internet2018",
      pageSeparator: /--More--|END/g,
      shellPrompt: /OLT.*#/g,
    };
    connection.on("ready", async function () {
      console.log("Connected to Telnet server", socket.id);
      try {
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
              io.to(socket.id).emit("telnet response", {
                data: cleanedResponse,
                commandType: commandType,
              });
              if (err) {
                console.log(err);
              }

              connection.end();
            }
          );
        });
      } catch (error) {
        console.log(error);
      }
    });

    connection.on("close", function () {
      console.log("Disconnected from Telnet server");
    });

    function cleanPagination(response) {
      const paginationRegex = /--More--|\x1b\[7m\x1b\[27m\x1b\[8D\x1b\[K/g;
      const paginationRegexExtra =
        /\(END\)|\x1b\[7m\(\)\x1b\[27m\x1b\[5D\x1b\[K/g;
      return response
        .replace(paginationRegex, "")
        .replace(paginationRegexExtra, "");
    }

    connection.connect(params);
  };

  const multipleTelnet = ({ ip, commands, brand, commandType }) => {
    console.log(ip, commands);
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      shellPrompt: "#",
      //negotiationMandatory: false,
      timeout: 10000,
      execTimeout: 10000,
      loginPrompt: "Username:",
      passwordPrompt: "Password:",
      username: "admin",
      password: "OT#internet2018",
      pageSeparator: "--More--",
    };
    connection.on("ready", function () {
      console.log("Connected to Telnet server");
      let i = 0;
      let res = [];
      const sendNextCommand = () => {
        if (i < commands.length) {
          // Send commands to the server
          try {
            connection.exec(commands[i], async function (err, response) {
              console.log(response);
              res.push(response);
              if (err) {
                console.log(err);
              }
              i++;
              sendNextCommand();
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          io.to(socket.id).emit("multipleResponse", {
            data: res,
            brand: brand,
            commandType: commandType,
          });
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
  };

  const multipleTelnetDatacom = ({ ip, commands, brand, commandType }) => {
    console.log(ip, commands);
    const connection = new Telnet();
    const params = {
      host: ip,
      port: 23,
      //negotiationMandatory: false,
      timeout: 10000,
      execTimeout: 10000,
      username: "admin",
      password: "OT#internet2018",
      pageSeparator: /--More--|END/g,
      shellPrompt: /OLT.*#/g,
    };
    connection.on("ready", function () {
      console.log("Connected to Telnet server");
      let i = 0;
      let res = [];
      try {
        connection.send("conf", function (err, response) {
          console.log(response);
          if (err) {
            console.log(err);
          }

          const sendNextCommand = () => {
            if (i < commands.length) {
              // Send commands to the server
              connection.exec(
                commands[i],
                { execTimeout: 20000 },
                async function (err, response) {
                  console.log(response);
                  res.push(response);
                  if (err) {
                    console.log(err);
                  }
                  i++;
                  sendNextCommand();
                }
              );
            } else {
              const cleanedResponse = res.map((ont) => cleanPagination(ont));
              io.to(socket.id).emit("multipleResponse", {
                data: cleanedResponse,
                brand: brand,
                commandType: commandType,
              });
              // Close the connection
              connection.end();
            }
          };
          sendNextCommand();
        });
      } catch (error) {
        console.log(error);
      }
    });

    connection.on("close", function () {
      console.log("Disconnected from Telnet server");
    });

    function cleanPagination(response) {
      const paginationRegex = /--More--|\x1b\[7m\x1b\[27m\x1b\[8D\x1b\[K/g;
      const paginationRegexExtra =
        /\(END\)|\x1b\[7m\(\)\x1b\[27m\x1b\[5D\x1b\[K/g;
      return response
        .replace(paginationRegex, "")
        .replace(paginationRegexExtra, "");
    }

    connection.connect(params);
  };

  socket.on("connectTelnet", connectZte);

  socket.on("connectTelnetDatacom", connectDatacom);

  socket.on("multipleTelnet", multipleTelnet);

  socket.on("multipleDatacomTelnet", multipleTelnetDatacom);
};

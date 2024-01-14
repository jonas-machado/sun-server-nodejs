const axios = require("axios");

module.exports = async (io, socket) => {
  const fnMessage = async ({ message, id }) => {
    console.log(message);
    axios.post("http://localhost:3000/api/monitoring/update", {
      text: message,
      id,
    });
    await socket.broadcast.emit("attMessage", {
      message: message,
      textId: id,
    });
  };

  const status = ({ isUp, id }) => {
    console.log(isUp);
    socket.broadcast.emit("attStatus", {
      isUp: isUp,
      itemId: id,
    });
  };

  const date = ({ currentDate, id }) => {
    console.log(currentDate);

    socket.broadcast.emit("attDate", {
      currentDate: currentDate,
      itemId: id,
    });
  };

  const bases = ({ currentBases, id }) => {
    console.log(currentBases);

    socket.broadcast.emit("attBases", {
      currentBases: currentBases,
      itemId: id,
    });
  };

  const router = () => {
    io.emit("routerRefresh");
  };

  await socket.on("message", fnMessage);
  await socket.on("status", status);

  await socket.on("date", date);
  await socket.on("bases", bases);
  await socket.on("refresh", router);
};

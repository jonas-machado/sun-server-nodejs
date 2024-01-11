module.exports = (io, socket) => {
  const fnMessage = ({ message, id }) => {
    console.log(message);

    socket.broadcast.emit("attMessage", {
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

  socket.on("message", fnMessage);
  socket.on("status", status);

  socket.on("date", date);
  socket.on("bases", bases);
  socket.on("refresh", router);
};

module.exports = (io) => {
  const fnMessage = ({ message, id }) => {
    console.log(message);

    io.broadcast.emit("attMessage", {
      message: message,
      textId: id,
    });
  };

  const status = ({ isUp, id }) => {
    console.log(isUp);
    io.broadcast.emit("attStatus", {
      isUp: isUp,
      itemId: id,
    });
  };

  const date = ({ currentDate, id }) => {
    console.log(currentDate);

    io.broadcast.emit("attDate", {
      currentDate: currentDate,
      itemId: id,
    });
  };

  const bases = ({ currentBases, id }) => {
    console.log(currentBases);

    io.broadcast.emit("attBases", {
      currentBases: currentBases,
      itemId: id,
    });
  };

  return {
    fnMessage,
    status,
    date,
    bases,
  };
};

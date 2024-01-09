module.exports = (io) => {
  const fnMessage = ({ message, id }) => {
    console.log(message);
    console.log(io);
    io.emit("attMessage", {
      message: message,
      textId: id,
    });
  };

  const status = ({ isUp, id }) => {
    console.log(isUp);
    io.emit("attStatus", {
      isUp: isUp,
      itemId: id,
    });
  };

  const date = ({ currentDate, id }) => {
    console.log(currentDate);

    io.emit("attDate", {
      currentDate: currentDate,
      itemId: id,
    });
  };

  const bases = ({ currentBases, id }) => {
    console.log(currentBases);

    io.emit("attBases", {
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

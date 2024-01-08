module.exports = (io) => {
  const fnMessage = ({ message, id }) => {
    console.log(message);

    io.emit("attMessage", {
      message: message,
      textId: id,
    });
  };

  return {
    fnMessage,
  };
};

const axios = require("axios");

module.exports = async (io, socket) => {
  const fnMessage = async ({ message, id }) => {
    axios
      .post("http://localhost:3000/api/monitoring/update", {
        text: message,
        id,
      })
      .catch((err) => console.log(err));
    await socket.broadcast.emit("attMessage", {
      message: message,
      textId: id,
    });
  };

  const status = ({ isUp, id }) => {
    axios
      .post("http://localhost:3000/api/monitoring/update", {
        isUp,
        id,
      })
      .catch((err) => console.log(err));
    socket.broadcast.emit("attStatus", {
      isUp: isUp,
      itemId: id,
    });
  };

  const currentTecnology = ({ tecnology, id }) => {
    axios
      .post("http://localhost:3000/api/monitoring/update", {
        tecnology,
        id,
      })
      .catch((err) => console.log(err));
    socket.broadcast.emit("attTecnology", {
      tecnology,
      itemId: id,
    });
  };

  const date = ({ currentDate, id }) => {
    axios
      .post("http://localhost:3000/api/monitoring/update", {
        dateDown: currentDate,
        id,
      })
      .catch((err) => console.log(err));
    socket.broadcast.emit("attDate", {
      currentDate: currentDate,
      itemId: id,
    });
  };

  const bases = ({ currentBases, id }) => {
    axios
      .post("http://localhost:3000/api/monitoring/update", {
        bases: currentBases,
        id,
      })
      .catch((err) => console.log(err));
    socket.broadcast.emit("attBases", {
      currentBases: currentBases,
      itemId: id,
    });
  };

  const router = () => {
    io.emit("routerRefresh");
  };

  const alert = ({ message }) => {
    io.emit("alertUsers", {
      message,
    });
  };

  await socket.on("message", fnMessage);
  await socket.on("status", status);
  await socket.on("tecnology", currentTecnology);
  await socket.on("date", date);
  await socket.on("bases", bases);
  await socket.on("refresh", router);
  await socket.on("alert", alert);
};

const axios = require("axios");

module.exports = async (io, socket) => {
  const fnMessage = async ({ message, id }) => {
    await axios
      .post("http://localhost:3000/api/monitoring/update", {
        text: message,
        id,
      })
      .catch((err) => console.log(err));

    const res = await socket.broadcast.emit("attMessage", {
      message: message,
      id,
    });
    console.log(res);
  };

  const status = async ({ isUp, id }) => {
    await axios
      .post("http://localhost:3000/api/monitoring/update", {
        isUp,
        id,
      })
      .catch((err) => console.log(err));
    await socket.broadcast.emit("attStatus", {
      isUp: isUp,
      id,
    });
  };

  const currentTecnology = async ({ tecnology, id }) => {
    console.log(tecnology);
    await axios
      .post("http://localhost:3000/api/monitoring/update", {
        tecnology,
        id,
      })
      .catch((err) => console.log(err));
    await socket.broadcast.emit("attTecnology", {
      tecnology,
      id,
    });
  };

  const date = async ({ currentDate, id }) => {
    await axios
      .post("http://localhost:3000/api/monitoring/update", {
        dateDown: currentDate,
        id,
      })
      .catch((err) => console.log(err));
    await socket.broadcast.emit("attDate", {
      currentDate: currentDate,
      id,
    });
  };

  const bases = async ({ currentBases, id }) => {
    await axios
      .post("http://localhost:3000/api/monitoring/update", {
        bases: currentBases,
        id,
      })
      .catch((err) => console.log(err));
    await socket.broadcast.emit("attBases", {
      currentBases: currentBases,
      id,
    });
  };

  const router = () => {
    console.log("called refresh");
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

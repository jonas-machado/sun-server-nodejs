const axios = require("axios");

module.exports = async (io, socket) => {
  const onSignOutAll = async () => {
    console.log("working");

    await socket.broadcast.emit("signOutAll");
  };

  const onSignOutUser = async ({ email }) => {
    console.log("working");

    await socket.broadcast.emit("signOutUser", { email });
  };

  await socket.on("signOutAllUsers", onSignOutAll);
  await socket.on("signOutUsers", onSignOutUser);
};

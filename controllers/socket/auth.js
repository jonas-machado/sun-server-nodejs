const axios = require("axios");

module.exports = async (io, socket) => {
  const onSignOutAll = async () => {
    console.log("working");

    await io.emit("signOutAll");
  };

  const onSignOutUser = async ({ email }) => {
    console.log("working");
    console.log(email);

    await io.emit("signOutUser", { email });
  };

  await socket.on("signOutAllUsers", onSignOutAll);
  await socket.on("signOutUsers", onSignOutUser);
};

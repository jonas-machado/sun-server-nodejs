const snmp = require("net-snmp");

const host = "172.16.45.3"; // Substitua pelo IP da sua antena WOM 5000
const community = "OT#2023"; // Substitua pela community string da sua antena
const port = 161; // Porta padrão SNMP

var session = snmp.createSession(host, community);

const oids = ["1.3.6.1.4.1.3902"];

session.get(oids, function (error, varbinds) {
  if (error) {
    console.error(error);
  } else {
    for (var i = 0; i < varbinds.length; i++) {
      if (snmp.isVarbindError(varbinds[i])) {
        console.error(snmp.varbindError(varbinds[i]));
      } else {
        console.log(varbinds[i].oid + " = " + varbinds[i].value);
      }
    }
  }
  session.close();
});

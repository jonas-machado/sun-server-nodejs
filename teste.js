const snmp = require("net-snmp");

const host = "100.64.128.75"; // Substitua pelo IP da sua antena WOM 5000
const community = "public"; // Substitua pela community string da sua antena
const port = 161; // Porta padrão SNMP

const session = new snmp.Session({
  host: host,
  port: port,
  community: community,
});

const oid = ["1.3.6.1.2.1.1.1.0"]; // OID para status da antena

session.get(oid, (err, result) => {
  if (err) {
    console.error("Erro ao obter status da antena:", err);
    return;
  }

  const status = result.variables[0].value;
  console.log("Status da antena:", status);
});

session.close();

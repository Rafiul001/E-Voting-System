import app from "./app";
import config from "./config/config";
import { connectToDatabase } from "./mongodb_connection/connection";
import { initiallyEnrollAdminAndConnectGateway } from "./networkConnection/networkConnection";

app.listen(config.port, async () => {
  await connectToDatabase();
  await initiallyEnrollAdminAndConnectGateway("admin", "adminpw");
  console.log(`Server running on port http://localhost:${config.port}`);
});

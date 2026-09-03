import dotenv from "dotenv";
import path from "node:path";
import { createApp } from "./src/app.js";
import { runMigrations } from "./src/db.js";

dotenv.config({ path: path.resolve(process.cwd(), "api/.env") });

const port = Number(process.env.PORT || 8080);
const app = createApp();

runMigrations().then(() => {
  app.listen(port, () => {
    console.log(`HPD API listening on port ${port}`);
  });
}).catch(error => {
  console.error("Database migrations failed", error);
  process.exitCode = 1;
});

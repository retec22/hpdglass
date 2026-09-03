import "dotenv/config";
import { createApp } from "./src/app.js";
import { runMigrations } from "./src/db.js";

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

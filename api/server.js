import "dotenv/config";
import { createApp } from "./src/app.js";

const port = Number(process.env.PORT || 8080);
const app = createApp();

app.listen(port, () => {
  console.log(`HPD CRM API listening on port ${port}`);
});

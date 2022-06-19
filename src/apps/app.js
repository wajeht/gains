import express from "express";
const app = express();
const PORT = 3000;

import api from "./api/api.js";

app.use("/api", api);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

import path from "path";

import express from "express";
const app = express();

const PORT = 8080;
import api from "./api/api.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(path.join(process.cwd(), "src", "public")))); // prettier-ignore

app.use("/api", api);

app.use("*", (req, res, next) => {
  try {
    res.sendFile(path.resolve(path.join(process.cwd(), "src", "public", "index.html"))); // prettier-ignore
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

import express from "express";
const sessions = express.Router();

sessions.get("/", (req, res) => {
  res.json({
    msg: "/sessions",
  });
});

export default sessions;

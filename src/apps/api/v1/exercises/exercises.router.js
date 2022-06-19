import express from "express";
const exercises = express.Router();

exercises.get("/", (req, res) => {
  res.json({
    msg: "/exercises",
  });
});

export default exercises;

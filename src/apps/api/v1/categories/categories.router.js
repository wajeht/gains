import express from "express";
const categories = express.Router();

categories.get("/", (req, res) => {
  res.json({
    msg: "/categories",
  });
});

export default categories;

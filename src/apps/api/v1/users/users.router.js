import express from "express";
const users = express.Router();

users.get("/", (req, res) => {
  res.json({
    msg: "/users",
  });
});

export default users;

import express from "express";
import jsonwebtoken from "jsonwebtoken";

import bcrypt from "bcrypt";

import uniqid from "uniqid";

let users = [];
let articles = [
  {
    id: 1,
    title: "React Tech",
    text: "React. js is an open-source JavaScript library that is used for building user interfaces specifically for single-page applications. It's used for handling the view layer for web and mobile apps. React also allows us to create reusable UI components.",
    author: "Sonal Bedi",
  },
  {
    id: 2,
    title: "Node Tech",
    text: " Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.",
    author: "Nikhil Bedi",
  },
  {
    id: 3,
    title: "Badminton",
    text: "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net. Although it may be played with larger teams, the most common forms of the game are singles and doubles",
    author: "Kusum Bedi",
  },
];

export const viewArticles = (req, res) => {
  res.send(articles);
};

export const getUsers = (req, res) => {
  console.log(`Users in the database: ${users}`);

  res.send(users);
};
export const postUsers = (req, res) => {
  let user = { ...req.body };
  console.log("request body");
  console.log(req.body);
  users.push(user);
  console.log(users);

  res.send("data got saved");
};

export const createUser = (req, res) => {
  console.log("came");
  const check = users.find((user) => user.email == req.body.email);
  if (check) {
    return res
      .status(409)
      .json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        req.body.password = hash;

        const newUser = req.body;

        const userId = uniqid();

        const userWithId = {
          id: userId,
          ...newUser,
        };

        const token = jsonwebtoken.sign(
          {
            userName: userWithId.name,
            id: userWithId.id,
          },
          "my_key",
          {
            expiresIn: "1h",
          }
        );

        users.push(userWithId);

        return res.status(200).json({
          success: true,
          message: `User with name ${newUser.name} is created`,
          token: token,
        });
      }
    });
  }
};

export const signinUser = (req, res) => {
  const tempUser = users.find((user) => user.email == req.body.email);
  console.log(req.body.email);
  if (tempUser == null) {
    return res.status(401).json({ success: false, message: "Auth failed" });
  }

  bcrypt.compare(req.body.password, tempUser.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    if (result) {
      const token = jsonwebtoken.sign(
        {
          userName: tempUser.name,
          id: tempUser.id,
        },
        "my_key",
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        message: "Auth successful",
        token: token,
      });
    }
  });
};

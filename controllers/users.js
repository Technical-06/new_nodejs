import express from "express";
import jsonwebtoken from "jsonwebtoken";
// import multer from 'multer';

import bcrypt from "bcrypt";

import uniqid from "uniqid";

let users = [];
let articles = [
  {
    id: 1,
    title: "Node js beginner",
    text: "The API reference documentation provides detailed information about a function or object in Node.js. This documentation indicates what arguments a method accepts, the return value of that method, and what errors may be related to that method. It also indicates which methods are available for different versions of Node.js. This documentation describes the built-in modules provided by Node.js. It does not document modules provided by the community.",
    author: "Bhavesh Yadav",
  },
  {
    id: 2,
    title: "React JS",
    text: "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debugA Simple Component React components implement a render() method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the component can be accessed by render() via this.props. JSX is optional and not required to use React. Try the Babel REPL to see the raw JavaScript code produced by the JSX compilation step.",
    author: "Shantanu Chhailkar",
  },
  {
    id: 3,
    title: "Cricket",
    text: "Cricket is a bat-and-ball game played between two teams of eleven players each on a field at the centre of which is a 22-yard (20-metre) pitch with a wicket at each end, each comprising two bails balanced on three stumps. The game proceeds when a player on the fielding team, called the bowler, 'bowls' (propels) the ball from one end of the pitch towards the wicket at the other end, with an 'over' being completed once they have legally done so six times. The batting side has one player at each end of the pitch, with the player at the opposite end of the pitch from the bowler aiming to strike the ball with a bat. The batting side scores runs either when the ball reaches the boundary of the field, or when the two batters swap ends of the pitch, which results in one run.",
    author: "Aniket chougule",
  },
];

// All routes here start with '/users' already

// get all the blogs data
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
// export const getUserByID = (req, res) => {
//   const user = users.find((user) => user.id === req.params.id);
//   res.send(user);
// };

// export const getAllUsers = (req, res) => {
//     res.send(users)
// };

// export const deleteUser = (req, res) => {
//   // console.log(`user with id ${req.params.id} has been deleted`);

//   users = users.filter((user) => user.id != req.params.id);
//   // let result = users.findIndex((user) => user.id === req.params.id);

//   res.send("data deleted");
// };

// export const updateUser = (req, res) => {
//   console.log(users);
//   console.log("update------", req.body);
//   let result = users.findIndex((user) => user.id === req.params.id);

//   console.log(result);

//   bcrypt.hash(req.body.password, 10, (err, hash) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     } else {
//       req.body.password = hash;
//       users[result].name = req.body.name;
//       users[result].email = req.body.email;
//       users[result].mobile = req.body.mobile;
//       users[result].password = req.body.password;
//     }
//     return res.status(200).json({
//       success: true,
//       message: `Upadte successfully `,
//     });
//   });

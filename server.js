import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

import Chika from "./models/chika.model.js";
import User from "./models/user.model.js";

// App config
const app = express();
const port = process.env.PORT || 5000;
const connectionUrl = `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.yaymv.mongodb.net/chikapp?retryWrites=true&w=majority`;

// Middleware
app.use(express.json());
app.use(cors());

// DB config
mongoose
  .connect(connectionUrl, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

// API Endpoints
app.get("/", (req, res) => {
  res.status(200).send("API Working");
});

// Chika Endpoints

app.get("/get-chika", (req, res) => {
  Chika.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  }).sort([["_id", -1]]);
});

app.post("/create-chika", (req, res) => {
  const chikaData = req.body;

  Chika.create(chikaData, (err, chika) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(chika);
    }
  });
});

// User Endpoints
// app.get("/users", (req, res) => {
//   User.find((err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

app.get("/:user", (req, res) => {
  const user = _.snakeCase(req.params.user);

  User.findOne({ username: user }, (err, user) => {
    // console.log(user, req.params);
    if (err) {
      res.status(500).send(err);
    } else {
      if (user.isAuthenticated === true) {
        res.status(200).send(user);
      } else {
        res.status(403).send("please login");
      }
    }
  });
});

app.post("/registeruser", (req, res) => {
  const userData = req.body;

  User.find(
    { tagname: userData.tagname, displayname: userData.displayname },
    (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (user !== null) {
        res.status(409).send("Username or tagname already in use");
      } else {
        userData.username = _.snakeCase(userData.displayname);
        userData.isVerified = false;
        userData.chikaId = uuidv4();
        userData.isAuthenticated = true;

        console.log(userData);

        User.create(userData, (err, user) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(201).send(user);
          }
        });
        console.log(res);
      }
    }
  );
});

app.post("/loginuser", (req, res) => {
  const loginUser = req.body;
  console.log(loginUser, typeof loginUser);

  User.findOne({ displayname: loginUser.displayname }, async (err, user) => {
    if (user) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (user.password === loginUser.password) {
          await User.updateOne(
            { displayname: loginUser.displayname },
            { isAuthenticated: true }
          );
          console.log(user);
          res.status(200).send(user);
          // res.redirect("/" + displayname);
        } else if (
          user.password !== loginUser.password ||
          loginUser.password === null
        ) {
          res.status(403).send("Password Incorrect");
        }
      }
    } else {
      res.status(403).send("Password Incorrect");
    }
  });
});

app.post("/logout", async (req, res) => {
  const logoutUser = req.body.username;
  console.log(logoutUser);
  User.findOne({ username: logoutUser }, async (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      await User.updateOne(
        { username: user.username },
        { isAuthenticated: false }
      );
      console.log(user);
      res.status(201).send(user);
    }
  });
});

// Listener
app.listen(port, () => console.log("API Working"));

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

  User.find({ username: user }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(user);
    }
  });
});

app.post("/registeruser", (req, res) => {
  const userData = req.body;

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
});

app.post("/loginuser", (req, res) => {
  const loginUser = req.body;

  User.findOne({ displayname: loginUser.displayname }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (user.password === loginUser.password) {
        res.status(200).send(user);
      } else {
        res.status(403).send("Password Incorrect");
      }
    }
  });
});

app.post("logout", (req, res) => {});

// Listener
app.listen(port, () => console.log("API Working"));

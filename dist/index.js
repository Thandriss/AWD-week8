"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
// import { type } from "os";
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
// import cookie_parser from 'cookie-parser'
// import cookieParser from "cookie-parser";
const passport = require("passport");
const initPass = require('./passport-config');
// const jwt = require('jsonwebtoken')
const session = require('express-session');
function getUserByName(username) {
    for (let i = 0; i < saved.length; i++) {
        if (saved[i].username === username)
            return saved[i];
    }
    return null;
}
function getUserById(id) {
    for (let i = 0; i < saved.length; i++) {
        if (saved[i].id === id)
            return saved[i];
    }
    return null;
}
initPass(passport, getUserByName, getUserById);
const app = express();
const port = 3000;
class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}
let saved = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(session({
    secret: "AAAABBDCDAF",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.post("/api/user/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(req.body);
    if (!checkUsername(username)) {
        let new_pass;
        yield bcrypt
            .genSalt(10)
            .then(salt => {
            console.log('Salt: ', salt);
            bcrypt.hash(password, salt)
                .then((result) => {
                new_pass = result;
                let user = new User(Date.now().toString(), username, new_pass);
                saved.push(user);
                res.send(user);
            });
        })
            .then(hash => {
            console.log('Hash: ', hash);
        })
            .catch(err => console.error(err.message));
    }
    else
        res.status(400).send();
}));
function checkUsername(username) {
    for (let i = 0; i < saved.length; i++) {
        if (saved[i].username === username)
            return true;
    }
    return false;
}
function findUser(username) {
    for (let i = 0; i < saved.length; i++) {
        if (saved[i].username === username)
            return saved[i];
    }
    return null;
}
app.get("/api/user/list", (req, res) => {
    res.send(saved);
});
// app.post("/api/user/login", (req, res) => {
//     passport.authenticate('local', {
//         success: res.status(200),
//         failureMessage: res.status(401)
//     })
// })
app.get("/api/secret", checkAuth, (req, res) => {
});
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.status(200).send("ok");
    }
    else {
        res.status(401);
    }
}
app.post("/api/user/login", passport.authenticate('local', {
    successRedirect: "/api/secret"
}));
// app.post("/api/user/login", (req, res) => {
//     const {username, password} = req.body;
//     if(checkUsername(username)) {
//         let user = findUser(username);
//         if(user != null) {
//             bcrypt.compare(password, user.password, (err, isMatch) => {
//                 if(err) throw err
//                 if(isMatch) {
//                     let jwtToken = {
//                         id: user?.id,
//                         username: user?.username,
//                         password: user?.password
//                     }
//                     jwt.sign(
//                         jwtToken,
//                         "gdshual",
//                         {
//                             expiresIn: 120
//                         },
//                         (err, token) => {
//                             res.status(200).send("ok", token)
//                         }
//                     );
//                 } else {
//                     res.status(401).send()
//                 }
//             })
//         }   
//     }
// })
app.listen(port, () => {
    console.log("Server listen!");
});

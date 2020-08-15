const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const redis  = require('redis');
var app = express();

  
const server = app.listen(5000, () => {
    console.log("express server running on port 5000");
  });

  const io = socket.listen(server);

  io.on("connection", function (socket) {
    socket.on("sendmsg",(msg)=>console.log(msg))
  });

 var client  = redis.createClient({
      host: "127.0.0.1",
      port: "6379"
  });

  client.on("error", function(error) {
    console.log("redis client error",error);
  });

  client.on("connect", function(error) {
    console.log("redis client connected");
  });

  client.on("warning", function(error) {
    console.log("redis client warning",error);
  });

  client.on("ready", function(error) {
    console.log("redis client ready");
  });

  client.on("reconnecting", function(error) {
    console.log("redis client reconnecting",error);
  });

  app.get("/", (req, res) => {
    res.json("server is working");

    client.set('some-data','42',function(err) {
        if (err) { 
          throw err; /* in production, handle errors more gracefully */
        } else {
          client.get('some-data',function(err,value) {
            if (err) {
              throw err;
            } else {
              console.log(value);
            }
          }
        );
        }
      });
  });
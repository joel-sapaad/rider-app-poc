require("dotenv").config({ path: ".env" });
const fs = require("fs");
fs.copyFile(`${__dirname}/sw.js`, `${__dirname}/dist/sw.js`,(err)=>{
  if(err){
    console.log("error copying file")
  } else {
    console.log("copy file success");
  }
});
// Imports
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
// Initialise app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
// Middlewares
app.use(morgan("tiny"));
app.use(express.json());

// Watch for active websocket clients
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("subscribe", (data) => {
    console.log(`[WS]Subscribed`, data);
  });

  socket.on("location_updated", (data) => {
    console.log("Client location updated", data);
    io.sockets.emit("client_location_updated", data);
  });
});

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  console.log("subscribed", subscription);
  io.sockets.emit("client_subscribed", subscription);
  res.status(201).json({});

  // const payload = JSON.stringify({
  //   title: 'Push notifications with Service Workers',
  // });

  // webPush.sendNotification(subscription, payload)
  //   .catch(error => console.error(error));
});

app.post("/send_push", (req, res) => {
  const data = req.body;
  const payload = JSON.stringify({
    title: data.message.title,
  });
  webPush
    .sendNotification(data.subscription, payload)
    .catch((error) => console.error(error));
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const server = httpServer.listen(process.env.PORT, () => {
  console.log(`APP listening on PORT ${process.env.PORT}`);
});

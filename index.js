require("dotenv").config({ path: ".env" });
const fs = require("fs");
fs.copyFile(`${__dirname}/sw.js`, `${__dirname}/dist/sw.js`, (err) => {
  if (err) {
    console.log("error copying file sw.js");
  } else {
    console.log("Copy sw.js success");
  }
});
fs.copyFile(`${__dirname}/rider.png`, `${__dirname}/dist/rider.png`, (err) => {
  if (err) {
    console.log("error copying file rider.png");
  } else {
    console.log("Copy rider.png success");
  }
});
// Imports
const express = require("express");
const cors = require("cors");
const webPush = require("web-push");
const morgan = require("morgan");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
// Initialise app
const app = express();
const httpServer = createServer(app);
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Middlewares
app.use(express.static(path.join(__dirname, "dist")));
app.use(morgan("tiny"));
app.use(express.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  "mailto:test@example.com",
  publicVapidKey,
  privateVapidKey
);

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
  const client = req.body;
  console.log("subscribed", client);
  io.sockets.emit("client_subscribed", client);
  res.status(201).json({});
});

app.post("/send_push", (req, res) => {
  const data = req.body;
  const payload = JSON.stringify({
    title: data.message.title,
    body: data.message.body,
  });
  webPush
    .sendNotification(data.subscription, payload)
    .catch((error) => console.error(error));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

const server = httpServer.listen(process.env.PORT, () => {
  console.log(`APP listening on PORT ${process.env.PORT}`);
});

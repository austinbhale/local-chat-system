var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
const nameList = [];
const messageHistory = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/public", express.static(__dirname + "/public"));

// Handle 404 responses.
// TODO: Make a custom 404 response.
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// Standard error handler.
// TODO: Make a custom error handler response.
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

io.on("connection", function(socket) {
  socket.on("username", function(name) {
    if (nameList.includes(name)) {
      io.emit("exception", "Username taken");
    } else {
      nameList.push(name);
      socket.emit("history", messageHistory);
      socket.emit("username", name);
      socket.broadcast.emit("username others", name);
      io.emit("userList", nameList);
      messageHistory.push(name + " has entered the chat.");
    }
  });

  socket.on("chat message", function(msg, name) {
    messageHistory.push(name + ": " + msg);
    socket.emit("chat message", msg, name);
    socket.broadcast.emit("chat message others", msg, name);
  });

  var name;
  socket.on("user disconnect", function(_name) {
    name = _name;
  });

  socket.on("typing", function(name) {
    socket.broadcast.emit("typing", name);
  });

  socket.on("not typing", function() {
    socket.broadcast.emit("not typing");
  });

  socket.on("disconnect", function() {
    io.emit("user disconnect", name);
    nameList.splice(nameList.indexOf(name), 1);
    io.emit("userList", nameList);
    messageHistory.push(name + " has left the chat.");
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});

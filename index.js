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
app.use(function(req, res, next) {
  res.status(404).send("Sorry, this place doesn't exist!");
});

// Standard error handler.
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Uh oh, something broke!");
});

io.on("connection", function(socket) {
  socket.on("username validity", function(name) {
    nameList.includes(name)
      ? socket.emit("username validity", name, false)
      : socket.emit("username validity", name, true);
  });

  socket.on("username", function(name) {
    nameList.push(name);
    socket.emit("history", messageHistory);
    socket.emit("username", name);
    socket.broadcast.emit("username others", name);
    io.emit("userList", nameList);
    messageHistory.push(
      '<li class="other">' + name + " has entered the chat.</li>"
    );
  });

  socket.on("chat message", function(msg, name) {
    messageHistory.push('<li class="other">' + name + ": " + msg + "</li>");
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

  socket.on("group history", function(data) {
    socket.emit("group history", data);
  });

  socket.on("disconnect", function() {
    io.emit("user disconnect", name);
    nameList.splice(nameList.indexOf(name), 1);
    io.emit("userList", nameList);
    messageHistory.push(
      '<li class="other">' + name + " has left the chat.</li>"
    );
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
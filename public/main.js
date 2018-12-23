$(function() {
  var socket = io();

  var name = prompt("Please enter your username");
  while (name == null || name == "") {
    name = prompt("Please enter a valid username");
  }

  socket.emit("username", name);

  socket.on("username", function(name) {
    $("#messages").append($("<li>").text(name + " has entered the chat."));
  });

  $("form").submit(function() {
    socket.emit("chat message", $("#m").val(), name);
    $("#m").val("");
    return false;
  });

  socket.on("chat message", function(msg, name) {
    $("#messages").append($("<li>").text(name +": "+msg));
  });

  socket.emit("user disconnect", name);

  socket.on("user disconnect", function(name) {
    $("#messages").append($("<li>").text(name + " has left the chat."));
  });

  // TODO: Alternative to alerting the username is taken.
  socket.on('exception', function(data) {
    alert(data);
  });
});
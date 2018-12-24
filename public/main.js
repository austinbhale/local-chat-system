$(function() {
  var socket = io();

  var name = prompt("Please enter your username");
  while (name == null || name == "") {
    name = prompt("Please enter a valid username");
  }

  socket.emit("username", name);

  socket.on("username", function(name) {
    $("#messages").append(
      $('<li class="own">').text(name + " has entered the chat.")
    );
  });

  socket.on("username others", function(name) {
    $("#messages").append(
      $('<li class="other">').text(name + " has entered the chat.")
    );
  });

  $("form").submit(function() {
    socket.emit("chat message", $("#m").val(), name);
    $("#m").val("");
    return false;
  });

  socket.on("chat message", function(msg, name) {
    $("#messages").append($('<li class="own">').text(name + ": " + msg));
  });

  socket.on("chat message others", function(msg, name) {
    $("#messages").append($('<li class="other">').text(name + ": " + msg));
  });

  socket.emit("user disconnect", name);

  socket.on("user disconnect", function(name) {
    $("#messages").append(
      $('<li class="other">').text(name + " has left the chat.")
    );
  });

  // TODO: Alternative to alerting the username is taken.
  socket.on("exception", function(data) {
    alert(data);
  });

  socket.on("history", function(data) {
    for (var i in data) {
      $("#messages").append($('<li class="other">').text(data[i]));
    }
  });

  socket.on("userList", function(data) {
    $("#users li:not(:first)").empty();
    for (var i in data) {
      $("#users").append($("<li>").text(data[i]));
    }
  });
});
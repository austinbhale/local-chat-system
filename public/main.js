var socket;
var individualHistory = [];

$(function() {
  socket = io();

  var name = prompt("Please enter your username");
  while (name == null || name == "") {
    name = prompt("Please enter a valid username");
  }

  socket.emit("username validity", name);

  socket.on("username validity", function(name, validity) {
    if (validity) {
      socket.emit("username", name);
    } else {
      name = prompt(name + " is already taken. Please choose another.");
      socket.emit("username validity", name);
    }
  });

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

  var typing = false;
  var timeout = undefined;
  var timeoutInterval = 800;

  function sendNotTyping() {
    typing = false;
    socket.emit("not typing", name);
  }

  // Calls timeout for this client typing and broadcasts the event to all other users.
  $("form").keypress(function(e) {
    if (e.keyCode == 13) {
      sendNotTyping();
    } else if (!typing) {
      typing = true;
      socket.emit("typing", name);
      timeout = setTimeout(sendNotTyping, timeoutInterval);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(sendNotTyping, timeoutInterval);
    }
  });

  socket.on("typing", function(name) {
    $("#messages").append($('<li id="type">').text(name + " is typing..."));
  });

  socket.on("not typing", function() {
    $("#type").remove();
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

  socket.on("history", function(data) {
    for (var i in data) {
      $("#messages").append(data[i]);
    }
  });

  socket.on("group history", function(data) {
    $("#messages").html(data);
  });

  socket.on("userList", function(data) {
    $("#users li:not(:first)").empty();
    $("#users li:empty").remove();
    for (var i in data) {
      $("#users").append(
        $("<li>").html('<a href="#user" onClick="showUser();">' + data[i] + "</a>")
      );
    }
  });
});

function showUser() {
  // if (document.querySelector("a").getAttribute("href") == "#user") {
  //   return;
  // }
  individualHistory[0] = $("#messages").html();
  $("#messages").empty();
}

function showGroup() {
  // individualHistory = $("#messages").html();
  socket.emit("group history", individualHistory[0]);
}

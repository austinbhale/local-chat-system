# local-chat-system
Expanded chat application that modeled the simple SocketIO [example](https://github.com/socketio/chat-example).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

## Prerequisites

Taken from [socket.io](https://socket.io/get-started/chat):

> The first goal is to setup a simple HTML webpage that serves out a form and a list of messages. 
>
> We’re going to use the Node.JS web framework express to this end. Make sure Node.JS is installed.
>
> First let’s create a package.json manifest file that describes our project. 
 ```
 npm init
 ```
> Now, in order to easily populate the dependencies with the things we need, we’ll use npm install --save:
```
npm install --save express@4.15.2
```
## Running the script

If you run
```
node index.js
```
the http server should be listening on port 3000.

Navigate your browser to ```http://localhost:3000```.

## Current Features

* Custom usernames

* Connection/Disconnection broadcasted messages

* Message history for new users

* Real-time "{name} is typing..." functionality

* Modern message bubbles

* Active users list

## Contributing

Feel free to fork this repository to add/modify these enhancements!

I hope that this expanded model might serve as a base for even more features.

Possible improvements:
* Full navigation menu
* Private messaging
* Login Page
* See if users are away/inactive for some time
* History enable/disable feature
* Private groups
* A published server
* ...and more - share your results!

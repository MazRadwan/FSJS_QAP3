// --watch script enabled use npm start to run the server

const server = require("./server");

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

var http = require("http");
var hostname = "127.0.0.1";
var port = 8080;

const server = http.createServer(function (req, res) {
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      console.log("d");
      res.writeHead(200, { "Content-Type": "application/json" });

      const proudcts = JSON.stringify([
        {
          name: "농구공",
          price: 5000,
        },
      ]);
      res.end(proudcts);
    } else if (method === "POST") {
      res.end("생성되었습니다");
    }
  }
  res.end("Good Bye");
});

server.listen(port, hostname);

console.log("market server on!");

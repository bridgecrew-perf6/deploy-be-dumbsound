require("dotenv").config()

const express = require("express");

const cors = require('cors')

// import this
const http = require('http');

const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL, // we must define cors because our client and server have diffe
//   },
// });

const router = require("./src/routes/routes");

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors())


app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"))

// app.get('/', function (req, res) {
//   res.send({
//     message: 'Hello World',
//     CLIENT_URL: process.env.CLIENT_URL,
//   });
// });

app.listen(port, () => console.log(`Listening on port ${port}!`));
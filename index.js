require("dotenv").config()

const express = require("express");

const cors = require('cors')

const app = express();

const router = require("./src/routes/routes");

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors())

app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"))

app.listen(port, () => console.log(`Listening on port ${port}!`));
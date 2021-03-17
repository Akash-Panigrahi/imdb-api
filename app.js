const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const indexRouter = require("./routes/index");

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

const client = new MongoClient(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err) {
    console.error("App starting error:", err.message);
    process.exit(1);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Connected to %s", MONGODB_URL);
    console.log("App is running on %s ... \n", PORT);
    console.log("Press CTRL + C to stop the process. \n");
  }

  process.mongo = client;

  //   client.close();
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/", indexRouter);

// app.all("*", function (req, res) {
//   return apiResponse.notFoundResponse(res, "Page not found");
// });

// app.use((err, req, res) => {
//   if (err.name == "UnauthorizedError") {
//     return apiResponse.unauthorizedResponse(res, err.message);
//   }
// });

app.listen(PORT);

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});
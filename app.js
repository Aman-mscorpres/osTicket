const express = require("express");
const http = require("http");
const https = require("https");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//
const PORT = process.env.PORT || 3001;
// global.ThrowError = require("./UTILLS/utills").ThrowError;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./UTILLS/start");

require("./ROUTES/router")(app);

// ERROR HANDLING
app.use(require("./UTILLS/utills").errorHandler);
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

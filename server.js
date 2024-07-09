const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/auction-system", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/users", require("./routes/users"));
app.use("/api/auctions", require("./routes/auctions"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const routes = require("./Routes/route");
app.use("/", routes);

// mongoose
//   .connect("mongodb://127.0.0.1:27017/QSR", {
//     // Specify your database name here
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

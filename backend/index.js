const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const cors = require("cors");


const PORT = (process.env.PORT)
const BASE_URL = (process.env.BASE_URL)
const DB_URL = (process.env.DB_URL)

const userRoutes = require("./router/user.route");
const taskRoutes = require("./router/task.route");



//default route
app.get('/', (req, res) => {
  res.send('Welcome to SE NPRU TaskFlow Mini API!');
});

//cors
app.use(cors({
  origin:["http://localhost:5173","127.0.0.1:5173", BASE_URL],
  methods:["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders:["Content-Type","Authorization","access-token"]
}))

app.use(express.static("public"));

app.use(express.json()); //ให้ Express อ่านข้อมูล JSON จาก req.body (เช่น POST/PUT จาก React)
app.use(express.urlencoded({ extended: true })) //ให้ Express อ่านข้อมูลจาก form (x-www-form-urlencoded) เช่นฟอร์ม HTML

//route
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Swagger disabled for now

if (process.env.NODE_ENV !== 'test') {
  if(!DB_URL) {
      console.error("DB_URL is not defined in .env file")
  } else {
      mongoose.connect(DB_URL).then(() => {
          console.log("Connected to MongoDB Successfully!");
      }).catch((error) => {
          console.error("MongoDB connection error:", error)
      });
  }
}

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
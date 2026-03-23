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
  origin: "*",
  methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type","Authorization","access-token"]
}))

app.use(express.static("public"));

app.use(express.json()); //ให้ Express อ่านข้อมูล JSON จาก req.body (เช่น POST/PUT จาก React)
app.use(express.urlencoded({ extended: true })) //ให้ Express อ่านข้อมูลจาก form (x-www-form-urlencoded) เช่นฟอร์ม HTML

//route
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Swagger disabled for now

if(!DB_URL){
    console.error("DB_URL is not defined in .env file")
}else{
    mongoose.connect(DB_URL).then(() =>{
        console.log("Connected to MongoDB Successfully!");
    }).catch((error) => {
        console.error("MongoDB connection error:", error)
    }
    )
}

app.listen(PORT,() =>
  console.log(`Server on ${PORT}`)
);
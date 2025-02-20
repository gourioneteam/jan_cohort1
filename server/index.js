require('dotenv').config();

const express=require('express')
const connectDB = require('./src/config/db');

const cors = require("cors");

connectDB();

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: [process.env.FE_url,"https://jan-cohort1-fe.vercel.app/"] ,
        credentials: true,
        methods: ["GET","POST","PUT","DELETE"]
    })
);
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", require("./src/routes/authRoutes"));  // Authentication Routes
app.use("/api/admin", require("./src/routes/adminroute"));  // Admin Routes
app.use("/api/student", require("./src/routes/studentroute"));  // student Routes
app.use("/api/admin", require("./src/routes/batchallocationroutes"));//admin
app.use("/api/trainer", require("./src/routes/trainerroutes"));//admin
app.get('/',(req,res)=>{
    res.send("welcome")
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
const app = express();
import cors from 'cors';
import router from "./routes";
import dotenv from 'dotenv';
import ConnectToDB from "./config/db";
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
ConnectToDB();

app.use('/api',router);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})

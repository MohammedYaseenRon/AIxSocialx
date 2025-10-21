import express from "express";
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv'
import path from 'path';
import authRoutes from "./routes/authRoutes"
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const server = http.createServer();
const port = Number(process.env.PORT || 4001)


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Server is running");
});


//routes
app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});





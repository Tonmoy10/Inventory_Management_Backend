import express from "express";
import cors from "cors"
import { loginRouter } from "./Routes/LoginRoutes.js";

const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}))
app.use(express.json())
app.use('/auth',loginRouter)

app.listen(3000, () => {
    console.log("The server works!!")
})
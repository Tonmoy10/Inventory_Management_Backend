import express from "express";
import cors from "cors"
import { loginRouter } from "./Routes/LoginRoutes.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth',loginRouter)

const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if(token) {
        Jwt.verify(token, "nawabi_kacchi_online", (err, decoded) => {
            if (err) return res.json({Status: false, Error: "Invalid Token!!"})
            next()
        })
    } else {
        return res.json({Status: false, Error:"Not logged In!"})
    }
}

app.get('/verify', verifyUser, (req, res) => {
    return res.json({Status: true})
})

app.listen(3000, () => {
    console.log("The server works!!")
})
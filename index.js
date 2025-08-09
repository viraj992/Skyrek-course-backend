import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import Student from "./models/student.js"  // auto suggestion import nm, .js agata dagnna
import studentRouter from "./routers/studentRouter.js"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js"
import dotenv from "dotenv"
import cors from "cors"


dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if(value != null){ // null nove nm
            const token = value.replace("Bearer ","")
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (err,decoded)=>{
                    if(decoded == null){
                        res.status(403).json({
                            message : "unauthorized"
                        })
                    }else{
                        req.user = decoded 
                        next()
                    }
                    
                }
            )
        }else{
            next()
        }
        

        
    }
)

const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database Connected")
    }
).catch( 
    ()=>{
        console.log("failed to connect to the database")
    }
)

// suggestions = ctrl + space button
// github repositary created
app.use("/students",studentRouter)
app.use("/api/users", userRouter)
app.use("/api//products",productRouter)


app.listen(5000,
    ()=>{
        console.log("server started")
    }
)
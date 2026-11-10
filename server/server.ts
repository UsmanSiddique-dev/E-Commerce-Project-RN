import "dotenv/config"
import express from "express"
import type {Request,Response} from "express";
import cors from "cors"

const app= express();

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000;

app.get("/",(req:Request,res:Response)=>{
    res.json({
        message:"Server is Live"
    })
})

app.listen(port,()=>{
    console.log("App is Running")
})


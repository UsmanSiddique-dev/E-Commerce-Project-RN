import "dotenv/config"
import express from "express"
import type {Request,Response} from "express";
import cors from "cors"
import connectDB from "./config/db.ts";
import {clerkMiddleware} from "@clerk/express"
const app= express();

// COnnest To MongoDB
await connectDB()
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

const port = process.env.PORT || 3000;

app.get("/",(req:Request,res:Response)=>{
    res.json({
        message:"Server is Live"
    })
})

app.listen(port,()=>{
    console.log("App is Running")
})


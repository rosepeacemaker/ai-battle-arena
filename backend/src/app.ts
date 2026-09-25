import express from "express"
import runGraph from "./ai/graph.ai.service.js"
import cors from "cors";



const app = express()
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST" , "OPTIONS"],
    credentials: true
}))

// for health check
app.get("/health",(req, res )  =>{
    res.status(200).json({
        status: "ok" })

})

app.get("/", async (req,res)=>{

   const result =  await runGraph("Write a code for factorial function in js")
   res.json(result)
})

app.post("/invoke", async (req,res)=>{
console.log("Invoke line hits")
    const { input } = req.body

    const result = await runGraph(input)

    res.status(200).json({
        message:"Graph executed successfully",
        success: true,
        data: result
    })

})


export default app
import express from "express"
import runGraph from "./ai/graph.ai.service.js"

const app = express()


// for health check
app.get("/health",(req, res )  =>{
    res.status(200).json({
        status: "ok" })

})

app.get("/", async (req,res)=>{

   const result =  await runGraph("Write a code for factorial function in js")
   res.json(result)
})


export default app
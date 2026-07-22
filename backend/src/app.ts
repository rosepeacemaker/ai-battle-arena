import express from "express"
import useGraph from "./ai/graph.ai.service.js"

const app = express()


// for health check
app.get("/health",(req, res )  =>{
    res.status(200).json({
        status: "ok" })

})

app.post("/use-graph", async (req,res)=>{
        await useGraph("what is capital of USA?")
})


export default app
import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { mistralModel, cohereModel } from "./model.service.js";
import { z } from "zod"


const state = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""),{
        reducer: (current, next)=>{
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""),{
        reducer: (current, next)=>{
            return next
        }
    }),
    judge_recomendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0
    }),
        {
            reducer: (current, next) => {
                return next
            }
        }
    )
})

const solutionNode:GraphNode<typeof state> = async (State: typeof state)=>{
    
    const [mistral_solution , cohere_solution] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])
    
    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text
    }
}

 const graph = new StateGraph(state)
 .addNode("solution", solutionNode)
 .addEdge( START, "solution")
 .addEdge("solution", END )
    .compile();


 export default async function(userMessage:string){
    const result = await graph.invoke({
      messages:[
        new HumanMessage(userMessage)
      ]  
    })
    console.log(result)
    return result.messages
 }














// type JUDGEMENT ={
//     winner:"solution_1" | "solution_2";
//     solution_1_score: number;
//     solution_2_score: number;
// }

// type AIBATTLESTATE ={
//     messages: typeof MessagesValue;
//     solution_1: string;
//     solution_2: string;
//     judgemant: JUDGEMENT;
// }

// const state:AIBATTLESTATE = {
// messages: MessagesValue,
// solution_1: "",
// solution_2: "",
// judgemant:{
//         winner:"solution_1",
//         solution_1_score:0,
//         solution_2_score:0
// }
// }
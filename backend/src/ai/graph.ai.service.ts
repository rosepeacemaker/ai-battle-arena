import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue, type GraphNode } from "@langchain/langgraph";

import { mistralModel, cohereModel, geminiModel } from "../services/model.service.js";
import { createAgent, providerStrategy } from "langchain";
import { z } from "zod"


const state = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
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

const solutionNode: GraphNode<typeof state> = async (State: typeof state) => {
    console.log(State)
    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(State.messages[0].content),
        cohereModel.invoke(State.messages[0].content)
    ])

    return {
        solution_1: mistral_solution.content,
        solution_2: cohere_solution.content
    }
}
const judgeNode: GraphNode<typeof state> = async (State: typeof state) => {
    const { solution_1, solution_2 } = State;

    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10)
        }))
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(
                `You are the judge tasked with evaluated the quality of two solutions to a probelm. The problem is: ${State.messages[0].content}. The first solution is : ${solution_1}.The
                second solution is:${solution_2}.Please provide a score between 0 and 10 for each solutions.`
            )
        ]
    })

    const result = judgeResponse.structuredResponse
    return {
        judge_recomendation: result
    }
}


const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();


export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    })
    console.log(result)
    return result.messages
}












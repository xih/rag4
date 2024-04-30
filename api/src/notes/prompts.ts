import { OpenAI } from "langchain/llms/openai";
import { OpenAIClient } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
// import { ChatPromptTemplate } from "langchain/prompts";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseMessageChunk } from "langchain/schema";

export const NOTES_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "formatNotes",
    description: "format the notes response",
    parameters: {
      type: "object",
      properties: {
        notes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              note: {
                type: "string",
                description: "the notes",
              },
              pageNumbers: {
                type: "array",
                items: {
                  type: "number",
                  description: "The page number(s) of the note",
                },
              },
            },
          },
        },
      },
      required: ["documents"],
    },
  },
};

export const NOTE_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "formatNotes",
    description: "format the notes response",
    parameters: {
      type: "object",
      properties: {
        notes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              note: {
                type: "string",
                description: "the notes",
              },
              pageNumbers: {
                type: "array",
                items: {
                  type: "number",
                  description: "the page number(s) of the note",
                },
              },
            },
          },
        },
      },
      required: ["documents"],
    },
  },
};

export const NOTE_TOOL_SCHEMA2: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "proess notes",
    description: "format the notes object",
    parameters: {
      type: "object",
      properties: {
        notes: {
          type: "array",
          properties: {
            note: {
              type: "object",
              properties: {
                note: {
                  type: "string",
                  description: "the notes",
                },
                pageNumbers: {
                  type: "array",
                  items: {
                    type: "number",
                    description: "the page number(s) of the note",
                  },
                },
              },
            },
          },
        },
      },
      required: ["documents"],
    },
  },
};

export const NOTE_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "ai",
    `Take notes on the following scientific paper.
    This is a technical paper outlining a computer science technique.
    The goal is to be able to create a complete understanding of the paper after reading all notes.
    
    Rules:
    - Include specific quotes and details inside your notes.
    - Respond with as many notes as it might take to cover the entire paper.
    - Go into as much detail as you can, while keeping each note on a very specific part of the paper.
    - Include notes about the results of any experiments the paper describes.
    - Include notes about any steps to reproduce the results of the experiments.
    - DO NOT respond with notes like: "The author discusses how well XYZ works.", instead explain what XYZ is and how it works.
    
    Respond with a JSON array with two keys: "note" and "pageNumbers".
    "note" will be the specific note, and pageNumbers will be an array of numbers (if the note spans more than one page).
    Take a deep breath, and work your way through the paper step by step.`,
  ],
  ["human", "Paper: {paper}"],
]);

export const noteOutputParser = (message: BaseMessageChunk) => {
  if (!message.additional_kwargs.tool_calls) {
    throw new Error("missing tool calls");
  }

  const toolCalls = message.additional_kwargs.tool_calls;

  const notes = toolCalls
    .map((call) => {
      const obj = JSON.parse(call.function.arguments);
      console.log("obj", obj);
      return obj.notes;
    })
    .flat();

  return notes;
};

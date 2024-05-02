import { ChatOpenAI, OpenAIClient } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseMessageChunk } from "langchain/schema";

// https://js.langchain.com/docs/integrations/chat/openai/
// create speech:
// https://platform.openai.com/docs/api-reference/audio/createSpeech

// this takes in a quesiton
export const QA_TOOL_SCHEMA: OpenAIClient.ChatCompletionTool = {
  type: "function",
  function: {
    name: "qa_tool",
    description: "get an answer to the quesiotn and follow up questions",
    parameters: {
      type: "object",
      properties: {
        answer: {
          type: "string",
          descripiton: "answer to the question",
        },
        followUpQuestions: {
          type: "array",
          items: {
            type: "string",
            description: "followup questions the student should ask",
          },
        },
      },
      required: ["question", "followUpQuestion"],
    },
  },
};

export const QA_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "ai",
    `You are a tenured professor of computer science helping a student with their research. 
  The student has a question regarding a paper they are reading.
  Here are their notes on the paper:
  {notes}
  
  And here are some relevant parts of the paper relating to their question 
  {relevantDocuments}
  
  Answer the student's question in the context of the paper. You should also suggest followup questions.
  Take a deep breath, and think through your reply carefully, step by step`,
  ],
  ["human", "Question: {question}"],
]);

export const qaOutputParser = (message: BaseMessageChunk) => {
  if (!message.additional_kwargs.tool_calls) {
    throw new Error("missing tool calls");
  }

  const toolCalls = message.additional_kwargs.tool_calls;

  const response = toolCalls
    .map((call) => {
      const args = JSON.parse(call.function.arguments);

      return args;
    })
    .flat();

  return response;
};

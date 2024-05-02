// 1. add a route /qa to get the results of the work
// 2. generate qa from the question
// 3. runs a similarity search on the vector embeddings to get the results

import { ChatOpenAI } from "@langchain/openai";
import { SupabaseDatabase } from "database.js";
import { ArxivPaperNote } from "notes/prompts.js";
import { Document } from "langchain/document";
import { QA_PROMPT, QA_TOOL_SCHEMA, qaOutputParser } from "./prompt.js";
import { formatDocumentsAsString } from "langchain/util/document";

const qaModel = async ({
  documents,
  question,
  notes,
}: {
  documents: Array<Document>;
  question: string;
  notes: Array<ArxivPaperNote>;
}) => {
  const model = new ChatOpenAI({
    model: "gpt-3.5-turbo-0125",
    temperature: 0.0,
  });

  const modelWithTools = model.bind({
    tools: [QA_TOOL_SCHEMA],
  });

  const chain = QA_PROMPT.pipe(modelWithTools).pipe(qaOutputParser);

  const response = await chain.invoke({
    notes,
    relevantDocuments: formatDocumentsAsString(documents),
    question,
  });

  return response;
};

export const qa = async (question: string, paperUrl: string) => {
  const database = await SupabaseDatabase.fromExistingIndex();

  const documents = await database.vectorStore.similaritySearch(question, 8, {
    url: paperUrl,
  });

  // need a getPaper funciton
  const paper = await database.getPaper(paperUrl);

  const qaAndFollowupQuestions = await qaModel({
    documents,
    question,
    notes: paper as unknown as ArxivPaperNote[],
  });

  // save the qaAndFOllowUpQuestions to the database
  await Promise.all([
    qaAndFollowupQuestions.map((qa) => {
      database.saveQa(
        question,
        qa.answer,
        qa.followUpQuestions,
        formatDocumentsAsString(documents)
      );
    }),
  ]);

  console.log("saved to db");
  console.log(documents, "documents");

  return qaAndFollowupQuestions;
};

// 1. setup a database
// 2. make the class fromDocuments where i pass in embeddings (openAI embeddings), client, tableName, and queryName
// 3. make the tables in supabase
// 4. go to the SQL editor and fill in the SQL commands
// 5. [5-1-2024]
// 6. go to supabase and fill in the commands to make the database

import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { Document } from "langchain/document";
import { ArxivPaperNote } from "notes/prompts.js";
import { Database } from "generated/db.js";

export const ARXIV_EMBEDDINGS_TABLE = "arxiv_embeddings";
export const ARXIV_PAPERS_TABLE = "arxiv_papers";
export const ARXIV_QUESTION_ANSWERING = "arxiv_question_answering";

export class SupabaseDatabase {
  client: SupabaseClient<Database, "public", any>;
  vectorStore: SupabaseVectorStore;

  constructor(client: SupabaseClient, vectorStore: SupabaseVectorStore) {
    this.client = client;
    this.vectorStore = vectorStore;
  }

  static fromExistingIndex() {}

  static async fromDocuments(documents: Array<Document>) {
    // 1. check for supabase url and apikeys
    // 2. if they don't exist throw an error
    // 3. construct the client and the vectorstore
    // 4. pass to
    const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
    const apiKey = process.env.SUPABASE_API_KEY;

    if (!apiKey || !supabaseUrl) {
      throw new Error("missing supabase credentials");
    }

    const client = createClient<Database>(supabaseUrl, apiKey);

    const vectorStore = await SupabaseVectorStore.fromDocuments(
      documents,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: ARXIV_EMBEDDINGS_TABLE,
        queryName: "match_documents",
      }
    );

    return new this(client, vectorStore);
  }

  async addPaper({
    notes,
    paperUrl,
    name,
    paper,
  }: {
    notes: Array<ArxivPaperNote>;
    paperUrl: string;
    name: string;
    paper: string;
  }) {
    const { data, error } = await this.client.from(ARXIV_PAPERS_TABLE).insert({
      notes,
      arxiv_url: paperUrl,
      name,
      paper,
    });

    if (error) {
      console.log(error);
    }
    return data;
  }
}

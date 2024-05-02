import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { ChatOpenAI } from "@langchain/openai";
import {
  NOTES_TOOL_SCHEMA,
  NOTE_PROMPT,
  NOTE_TOOL_SCHEMA,
  NOTE_TOOL_SCHEMA2,
  noteOutputParser,
} from "./prompts.js";
import { formatDocumentsAsString } from "langchain/util/document";
import { SupabaseDatabase } from "database.js";

const savePdfToFile = async ({ pdfUrl }: { pdfUrl: string }) => {
  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });

  const randomName = uuidv4();
  const directory = "pdfs";

  if (!existsSync(directory)) {
    mkdirSync(directory);
    console.log("directory created successfully");
  } else {
    console.log("directory already exists");
  }

  const filePath = `${directory}/${randomName}.pdf`;

  await writeFile(filePath, response.data, "binary");
  console.log("written to file successfully");
  return filePath;
};

const createDocumentsFromPdf = async (filepath: string) => {
  // const langchainDocumentLoader =
  const loader = new PDFLoader(filepath);

  const docs = await loader.load();

  return docs;
};

const generateNotes = ({ documents }: { documents: Array<Document> }) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0125",
    temperature: 0.0,
  });

  const modelWithTool = model.bind({
    tools: [NOTES_TOOL_SCHEMA],
  });

  const chain = NOTE_PROMPT.pipe(modelWithTool).pipe(noteOutputParser);

  const response = chain.invoke({
    paper: formatDocumentsAsString(documents),
  });

  return response;
};

export const takeNotes = async ({
  pdfUrl,
  name,
}: {
  pdfUrl: string;
  name: string;
}) => {
  // 1. get the pdf from axios and use a pdf library to save it to a folder
  // 2. create a document loader that takes the pdf and creates langchain documents from it
  // 3. create new metadata from the documents, including the pdfURl, so that it is easier to index in the DB
  // 4. generateNotes from this, -- pass into langchain chain LCEL, pipe prompt to output parser, etc

  if (!pdfUrl.endsWith("pdf")) {
    throw new Error("Needs to end with pdf");
  }

  const pdfFilePath = await savePdfToFile({ pdfUrl });

  const documents = await createDocumentsFromPdf(pdfFilePath);

  const newDocs = documents.map((doc) => {
    return {
      ...doc,
      metadata: {
        ...doc.metadata,
        url: pdfUrl,
      },
    };
  });

  const notes = await generateNotes({
    documents: newDocs,
  });

  // store the notes in the database

  const database = await SupabaseDatabase.fromDocuments(newDocs);

  // besides just adding the paper, there is also
  // adding the embeddings

  await Promise.all([
    database.addPaper({
      notes,
      paperUrl: pdfUrl,
      name,
      paper: formatDocumentsAsString(documents),
    }),
    database.vectorStore.addDocuments(documents),
  ]);

  return notes;
};

// takeNotes({
//   pdfUrl: "https://arxiv.org/pdf/2404.15949.pdf",
//   name: "test",
// });

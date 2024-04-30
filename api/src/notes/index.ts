import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

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

const takeNotes = async ({ pdfUrl }: { pdfUrl: string }) => {
  // 1. get the pdf from axios and use a pdf library to save it to a folder

  const pdf = await savePdfToFile({ pdfUrl });
};

takeNotes({
  pdfUrl: "https://arxiv.org/pdf/2404.15949.pdf",
});

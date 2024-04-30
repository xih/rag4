// start an express server
import express from "express";
import { takeNotes } from "notes/index.js";

const main = () => {
  const app = express();
  const port = process.env.PORT || 8001;

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(200).send("hello world");
  });

  app.post("/take_notes", async (req, res) => {
    const { pdfUrl, name } = req.body;
    const notes = await takeNotes({ pdfUrl, name });
    // return notes;
    res.status(200).send(notes);
  });

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

main();

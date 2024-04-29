import type { NextApiRequest, NextApiResponse } from "next";

export type ArxivPaperNote = {
  note: string;
  pageNumbers: Array<number>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<ArxivPaperNote> | undefined>
) {
  const API_URL = "http://localhost:8001/take_notes";
  const data = await fetch(API_URL, {
    method: "post",
    body: req.body,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return null;
  });

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(400);
  }
}

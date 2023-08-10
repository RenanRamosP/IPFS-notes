import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

import { getIPFS } from "./ipfs/controllers/getIPFS";
import { insertIPFS } from "./ipfs/controllers/insertIPFS";
import { getAllPinned, unPin } from "./ipfs/controllers/pinnedIPFS";

type bodyInsertIPFS = {
  type?: "string" | "file";
  content: string;
  path: string;
};

export type BasicIpfsData = {
  cid: string;
  path?: string;
};

function runMiddleware(
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse,
  fn: (...args: any[]) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const handler = async (
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse
): Promise<void> => {
  const multerStorage = multer.memoryStorage();
  const multerUpload = multer({ storage: multerStorage });
  try {
    await runMiddleware(req, res, multerUpload.single("content"));

    const file = req.file;

    if (req.method === "GET") {
      console.log("funct to GET!!", req.method, req.body);
      const { cid } = req.query;
      console.log("🚀 ~ file: ipfs.ts:31 ~ req.query:", req.query);
      if (cid) {
        Array.isArray(cid)
          ? getIPFS({ cid: cid[0] }, res)
          : getIPFS({ cid }, res);
      } else {
        const pinnedData = await getAllPinned();
        res.status(200).json(pinnedData);
      }
    } else if (req.method === "POST") {
      console.log("funct to POST!!", typeof req.body, req.body);

      const { content, path, type } = req.body as bodyInsertIPFS;
      await insertIPFS(
        { content: req.file ? req.file : content, path, type },
        res
      );
    } else if (req.method === "DELETE") {
      const { cid } = req.query;
      unPin(String(cid))
        .then((cidResp) => {
          res.status(200).json({ cid: cidResp });
        })
        .catch((err) => {
          res.status(400).json({ cid, content: err });
        });
    } else {
      // Handle any other HTTP method
      console.log("🚀 ~ file: ipfs.ts:17 ~ req:", req.method, req.body);
    }
  } catch (e) {
    console.log("🚀 ~ file: ipfs.ts:17 ~ req:", req.body, e);
    res.status(400).json({ cid: "err", content: e });
  }

  // res.status(200).json({ success: true });
};

//nextjs api routes config
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;

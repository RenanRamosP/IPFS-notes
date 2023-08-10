import type { NextApiResponse } from "next";

import { BasicIpfsData } from "../../ipfs";
import { nodeIPFS } from "./nodeIPFS";

type FileObject = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};
type dataToInsert = {
  type?: "string" | "file";
  path: string;
  content: string | FileObject;
};

async function insertIPFS(
  payload: dataToInsert,
  res: NextApiResponse<BasicIpfsData & { content: any }>
) {
  try {
    const { node } = nodeIPFS();
    let file: FileObject | undefined;
    if (payload.type === "file") {
      file = payload.content as FileObject;
    }
    const infoToAdd = {
      path:
        payload.type === "file"
          ? payload.path + "/" + file?.originalname
          : payload.path,
      content:
        payload.type === "file"
          ? (file?.buffer as Buffer)
          : (payload.content as string),
    };

    const addedInfo = await node.add(infoToAdd, { wrapWithDirectory: true });
    console.log("🚀 ~ file: insertIPFS  ~ addedInfo:", addedInfo);
    const dataResp = {
      cid: addedInfo.cid.toString(),
      content: payload.content,
      path: payload.path,
    };

    res.status(200).json(dataResp);
  } catch (e) {
    res.status(400);
  }
}

export { insertIPFS };

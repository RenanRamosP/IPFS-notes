import type { NextApiResponse } from "next";
import { BasicIpfsData } from "../../ipfs";
import { nodeIPFS } from "./nodeIPFS";
import { CID } from "ipfs-http-client";

type dataToInsert = {
  cid: string;
};

export interface IPFSEntry {
  readonly type: "dir" | "file";
  readonly cid: CID;
  readonly name: string;
  readonly path: string;
  mode?: number;
  mtime?: any;
  size: number;
}

type GetResponse = {
  cid: string;
  content: Buffer | string;
  name: string;
};

export const getFileData = async (cid: string): Promise<IPFSEntry> => {
  const { node } = nodeIPFS();

  let fileData: IPFSEntry = {} as IPFSEntry;
  for await (const file of node.ls(cid)) {
    fileData = file;
    break;
  }
  return fileData;
};

export async function getIPFS(
  req: dataToInsert,
  res: NextApiResponse<GetResponse>
) {
  try {
    const { node } = nodeIPFS();
    const { cid } = req;

    const fileData = await getFileData(cid);
    const { name } = fileData;
    let content: Buffer | string = "";
    if (fileData.name) {
      for await (const ipfsBlock of node.get(cid, { timeout: 1000 })) {
        content = Buffer.from(ipfsBlock);
        console.log("🚀 ~ file: getIPFS.ts:46 ~ get<< ~ content:");
      }
    } else {
      for await (const ipfsBlock of node.cat(cid, { timeout: 1000 })) {
        content = Buffer.from(ipfsBlock);
        console.log("🚀 ~ file: catIPFS.ts:52 ~ cat<< ~ content:");
      }
    }
    console.log("🚀 ~ file: getIPFS.ts:51 ~ content:", typeof content);
    res.status(200).json({ cid, content, name });
    return;
  } catch (e) {
    res.status(400);
  }
}

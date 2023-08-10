import { CID } from "ipfs-http-client";
import { getFileData } from "./getIPFS";
import { nodeIPFS } from "./nodeIPFS";

type PinReturn = {
  cid: string;
  type: string;
};

export async function getAllPinned(): Promise<PinReturn[]> {
  const { node } = nodeIPFS();

  let pinnedData = [];
  for await (const { cid: cidRaw } of node.pin.ls()) {
    const cid = cidRaw.toString();
    const fileData = await getFileData(cid);
    const { type, path: rawPath, name } = fileData;
    const path = rawPath.replace(cid, "CID-hash");
    pinnedData.push({ cid, type, path, name });
  }
  pinnedData.sort((a, b) => a.cid.localeCompare(b.cid));

  return pinnedData;
}

export async function unPin(cid: string): Promise<string> {
  try {
    const { node } = nodeIPFS();

    const cidParsed = CID.parse(cid);
    const resp = await node.pin.rm(cidParsed, {
      recursive: true,
      timeout: 1000,
    });
    console.log("🚀 ~ file: pinnedIPFS.ts:31 ~ unPin ", resp);

    return resp.toString();
  } catch {
    throw new Error("error on unpinning");
  }
}

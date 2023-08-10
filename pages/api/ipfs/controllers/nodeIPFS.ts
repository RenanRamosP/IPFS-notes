import { create } from "ipfs-http-client";

const HOST = process.env.IPFS_HOST + ":" + process.env.IPFS_PORT;
const PORT = Number(process.env.IPFS_PORT);
const TOKEN = process.env.IPFS_SWARM_KEY;

function nodeIPFS() {
  console.log("started server with ipfs node: " + HOST + ":" + PORT);

  return {
    node: create({
      host: HOST ?? "localhost:5001",
      port: PORT ?? 5001,
      protocol: "http",
      headers: { authorization: "Bearer " + TOKEN },
      timeout: 5000,
    }),
  };
}
export { nodeIPFS };

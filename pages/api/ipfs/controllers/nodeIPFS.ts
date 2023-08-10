import { create } from "ipfs-http-client";

const HOST = process.env.IPFS_HOST;
const PORT = Number(process.env.IPFS_PORT);
const TOKEN = process.env.IPFS_SWARM_KEY;

function nodeIPFS() {
  return {
    node: create({
      host: HOST ?? "localhost:5001",
      port: PORT ?? 5001,
      protocol: "http",
      headers: { authorization: "Bearer " + TOKEN },
      timeout: 1500,
    }),
  };
}
export { nodeIPFS };

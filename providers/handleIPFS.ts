"use client";
import axios from "axios";
import { BasicIpfsData } from "../pages/api/ipfs";

const getNotes = async (cid?: string) => {
  return axios
    .get<BasicIpfsData & any>("/api/ipfs", { params: { cid: cid } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error("error on getting notes", err);
    });
};

const unPinIPFSNote = async (cid: string) => {
  return axios
    .delete<BasicIpfsData & any>("/api/ipfs", { params: { cid: cid } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error("error on getting notes", err);
    });
};

export { getNotes, unPinIPFSNote };

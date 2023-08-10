"use client";
import Head from "next/head";
import Header from "@/components/header/Header";
import DialogInsertNote from "@/components/InsertNote/DialogInsertNote";
import IPFSTable from "@/components/IPFSTable";
import { tableDataReducer } from "../state/tableDataReducer";
import { Inter } from "@next/font/google";
import { useReducer } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [state, dispatch] = useReducer(tableDataReducer, []);

  return (
    <div className={inter.className}>
      <Head>
        <title>IPFS Notes</title>
        <meta name="description" content="IPFS Notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" w-[100vw] h-[100vh]">
        <div className="flex flex-col gap-3">
          <Header />

          <div className="flex flex-col justify-around gap-3">
            <div className="flex justify-start px-3">
              <DialogInsertNote dispatch={dispatch} />
            </div>
            <IPFSTable state={state} dispatch={dispatch} />
          </div>
        </div>
      </main>
    </div>
  );
}

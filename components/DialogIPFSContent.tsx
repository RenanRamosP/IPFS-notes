"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

import { ArrowBigDownDash } from "lucide-react";
import { useState } from "react";
import { BasicIpfsData } from "../pages/api/ipfs";
import { getNotes } from "../providers/handleIPFS";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type DialogIPFSContentProps = {
  cid: string;
};

type DialogIPFSContentState = {
  content: string | Buffer;
  name?: string;
};

export default function DialogIPFSContent(props: DialogIPFSContentProps) {
  const { cid } = props;
  const [contentData, setContentData] = useState<DialogIPFSContentState>({
    content: "",
    name: "",
  });

  return (
    <Dialog>
      <DialogTrigger>
        <ArrowBigDownDash
          className="cursor-pointer"
          onClick={async () => {
            const resp = await getNotes(cid);

            const { name, content } = resp;
            setContentData({ content, name });
          }}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Content</DialogTitle>
        </DialogHeader>
        <Textarea
          value={Buffer.from(contentData.content).toString()}
          disabled
        />
        <Button
          onClick={async () => {
            console.log(
              "🚀 ~ file: DialogIPFSContent.tsx:59 ~ onClick={ ~ typeof contentData.content =:",
              typeof contentData.content,
              contentData.content
            );
            const contentBlob = new Blob([Buffer.from(contentData.content)]);
            const fileURL = window.URL.createObjectURL(contentBlob);
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = contentData.name ?? "ipfs-file.txt";
            alink.click();
            console.log(
              "🚀 ~ file: DialogIPFSContent.tsx:33 ~ onClick={ ~ resp:",
              contentData
            );
          }}
        >
          <ArrowBigDownDash className="cursor-pointer" />
          Download Data
        </Button>
      </DialogContent>
    </Dialog>
  );
}

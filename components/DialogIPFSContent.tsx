"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowBigDownDash } from "lucide-react";
import { useState } from "react";
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
            const contentBlob = new Blob([Buffer.from(contentData.content)]);
            const fileURL = window.URL.createObjectURL(contentBlob);
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = contentData.name ?? "ipfs-file.txt";
            alink.click();
          }}
        >
          <ArrowBigDownDash className="cursor-pointer" />
          Download Data
        </Button>
      </DialogContent>
    </Dialog>
  );
}

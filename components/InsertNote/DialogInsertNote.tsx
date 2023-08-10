"use client";
import { BookPlus } from "lucide-react";
import InsertNote from "@/components/InsertNote/InsertNote";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch } from "react";
import { tableDataActions } from "../../state/tableDataReducer";

type DialogInsertNoteProps = {
  dispatch: Dispatch<tableDataActions>;
};
export default function DialogInsertNote({ dispatch }: DialogInsertNoteProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Insert Notes/Files
          <BookPlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <InsertNote dispatch={dispatch} />
      </DialogContent>
    </Dialog>
  );
}

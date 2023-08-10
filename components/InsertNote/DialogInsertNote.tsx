"use client";
import InsertNote from "@/components/InsertNote/InsertNote";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookPlus } from "lucide-react";
import { Dispatch } from "react";
import { tableDataActions } from "../../state/tableDataReducer";

type DialogInsertNoteProps = {
  dispatch: Dispatch<tableDataActions>;
};
export default function DialogInsertNote({ dispatch }: DialogInsertNoteProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex bg-primary text-primary-foreground rounded-full p-3 ">
          Insert Notes/Files
          <BookPlus />
        </div>
      </DialogTrigger>
      <DialogContent>
        <InsertNote dispatch={dispatch} />
      </DialogContent>
    </Dialog>
  );
}

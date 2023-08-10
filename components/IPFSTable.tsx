"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeInfo, PinOffIcon } from "lucide-react";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { getNotes, unPinIPFSNote } from "../providers/handleIPFS";
import { TableData, tableDataActions } from "../state/tableDataReducer";
import DialogIPFSContent from "./DialogIPFSContent";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";

type IPFSTableProps = {
  dispatch: Dispatch<tableDataActions>;
  state: TableData[];
};
export default function IPFSTable({ dispatch, state }: IPFSTableProps) {
  const [loading, setLoading] = useState<Boolean>(false);

  const { toast } = useToast();

  const unPinNote = useCallback(
    async (cid: string) => {
      setLoading(true);
      unPinIPFSNote(cid)
        .then((res) => {
          console.log("🚀 ~ file: IPFSTable.tsx:33 ~ .then ~ res:", res);
          dispatch({
            type: "update",
            payload: state.filter((note) => note.cid !== cid),
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: "eror removing Pin" + err.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [toast, state, dispatch]
  );

  const toggleTableData = useCallback(
    (toggleState?: string) => {
      if (toggleState === "checked") {
        getNotes().then((res) => {
          dispatch({
            type: "update",
            payload: res ?? [],
          });
        });
      } else {
        dispatch({ type: "showNamed" });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getNotes()
      .then((res: any) => {
        dispatch({
          type: "update",
          payload: res ?? [],
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div>
      <div className="flex items-center px-4 justify-end space-x-2">
        <Switch
          onClick={(a) =>
            toggleTableData((a.target as HTMLElement).dataset.state)
          }
        />
        <Label>Hide blocks without name</Label>
      </div>

      <Table className={loading ? "animate-pulse cursor-wait" : ""}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>CID</TableHead>
            <TableHead>Get</TableHead>
            <TableHead>Unpin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state?.map((info, idx) => (
            <TableRow key={idx}>
              <TableCell>{info.name}</TableCell>
              <TableCell>{info.path}</TableCell>
              <TableCell>{info.type}</TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <BadgeInfo className="cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[50vw] text-center">
                    {info.cid}
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                <DialogIPFSContent cid={info.cid} />
              </TableCell>
              <TableCell>
                <PinOffIcon
                  className="cursor-pointer"
                  onClick={async () => {
                    const resp = await unPinNote(info.cid);
                    console.log("unPin", resp);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

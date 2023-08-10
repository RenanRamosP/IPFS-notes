"use client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import axios from "axios";
import { UseFormReturn, useForm } from "react-hook-form";
import FormFieldWrapper from "../FormFieldWrapper";
import { useToast } from "../ui/use-toast";
import { Dispatch } from "react";
import { tableDataActions } from "../../state/tableDataReducer";
import { getNotes } from "../../providers/handleIPFS";

type FormSchema = {
  path: string;
  note?: string;
  fileData?: any;
};

type InsertNoteProps = {
  dispatch: Dispatch<tableDataActions>;
};

export default function InsertNote({ dispatch }: InsertNoteProps) {
  const form = useForm<FormSchema>();
  const { toast } = useToast();

  const resetDataFields = ({
    all = false,
    form,
  }: {
    all?: boolean;
    form: UseFormReturn<FormSchema>;
  }) => {
    all ?? form.resetField("path");
    form.resetField("note");
    form.resetField("fileData");
  };

  const handleSubmit = async (formOutput: FormSchema) => {
    const formData = new FormData();

    formData.append("type", formOutput.fileData ? "file" : "text");
    formData.append("path", formOutput.path);
    formData.append(
      "content",
      formOutput.fileData ? formOutput.fileData[0] : String(formOutput.note)
    );

    axios
      .post("/api/ipfs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        getNotes().then((notes) => {
          dispatch({ type: "update", payload: notes });
        });
        toast({ title: "Success", description: "Note sent to IPFS" });
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to send note to IPFS" });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="text" className="w-[400px]">
          <div>
            <CardHeader>
              <CardTitle>Insert into IPFS</CardTitle>
              <CardDescription>
                Insert notes or files into the IPFS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsList
                className="grid w-full grid-cols-2"
                onClick={() => resetDataFields({ form })}
              >
                <TabsTrigger value="text">Note</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <div className="grid w-full gap-2">
                  <FormFieldWrapper form={form} fieldName="path" label="Path">
                    <Input placeholder="Enter a path" />
                  </FormFieldWrapper>
                  <FormFieldWrapper form={form} fieldName="note" label="Note">
                    <Textarea placeholder="Type your note here." />
                  </FormFieldWrapper>
                  <Button type="submit">Send note to IPFS</Button>
                </div>
              </TabsContent>
              <TabsContent value="file">
                <div className="grid w-full gap-2">
                  <FormFieldWrapper form={form} fieldName="path" label="Path">
                    <Input placeholder="Enter a path" />
                  </FormFieldWrapper>

                  <FormField
                    control={form.control}
                    name={"fileData"}
                    render={() => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input
                            id="fileData"
                            type="file"
                            {...form.register("fileData")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Send file to IPFS</Button>
                </div>
              </TabsContent>
            </CardContent>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}

"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

type FormFieldWrapperProps = {
  form: UseFormReturn<any>;
  label?: string;
  fieldName: string;
  description?: string;
  children: React.ReactElement;
};

export default function FormFieldWrapper(props: FormFieldWrapperProps) {
  const { form, label, fieldName, description, children } = props;

  const renderChildren = (field: ControllerRenderProps) => {
    return React.cloneElement(children, { ...field });
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{renderChildren(field)}</FormControl>
          {description && <FormDescription>description</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

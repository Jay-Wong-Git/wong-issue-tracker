"use client";

import { Button, TextField, Callout, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z, ZodType } from "zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            setError("An unexpected error occurred.");
          }
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        {errors.title && (
          <Text color="red" as="p">
            {errors.title.message}
          </Text>
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        {errors.description && (
          <Text color="red" as="p">
            {errors.description.message}
          </Text>
        )}
        <Button>Submit New Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;

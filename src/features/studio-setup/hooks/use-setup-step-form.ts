"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useEffect } from "react";
import { type DefaultValues, type FieldValues, useForm } from "react-hook-form";
import type { ZodType } from "zod";

/**
 * Shared RHF + debounced autosave wiring for wizard form steps.
 * Commits the draft synchronously on successful submit before advancing.
 */
export function useSetupStepForm<TValues extends FieldValues>({
  schema,
  defaultValues,
  onAutosave,
  onCommit,
  onValid,
}: {
  // Zod 4 schemas are Standard Schema compliant; keep the bound loose for factories.
  schema: ZodType<TValues, TValues>;
  defaultValues: DefaultValues<TValues>;
  onAutosave: (values: TValues) => void;
  onCommit: (values: TValues) => void;
  onValid: () => void;
}) {
  const form = useForm<TValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  const { watch, handleSubmit } = form;

  useEffect(() => {
    const subscription = watch((values) => {
      onAutosave(values as TValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, onAutosave]);

  const onSubmit = handleSubmit((values) => {
    onCommit(values);
    onValid();
  });

  return { form, onSubmit };
}

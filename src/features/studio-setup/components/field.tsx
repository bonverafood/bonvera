"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [errorId, !error ? hintId : undefined].filter(Boolean).join(" ") ||
    undefined;

  const control = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const element = child as ReactElement<Record<string, unknown>>;
    // Only wire a11y onto the element that owns this field id (supports composites).
    if (element.props.id !== id) return child;
    return cloneElement(element, {
      "aria-invalid": error ? true : element.props["aria-invalid"],
      "aria-describedby":
        describedBy ??
        (element.props["aria-describedby"] as string | undefined),
    });
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

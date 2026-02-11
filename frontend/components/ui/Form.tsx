"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

/* ================= ROOT ================= */

const Form = FormProvider

/* ================= FIELD CONTEXT ================= */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/* ================= ITEM CONTEXT ================= */

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, inline = false, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={cn(
            inline ? "flex items-center justify-between gap-3" : "space-y-4",
            className,
          )}
          {...props}
        />
      </FormItemContext.Provider>
    )
  },
)

FormItem.displayName = "FormItem"

/* ================= HOOK ================= */

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used within <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  }
}

/* ================= LABEL ================= */

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <label
      ref={ref}
      htmlFor={formItemId}
      className={`
        text-sm font-medium text-foreground
        ${error ? "text-error" : ""}
        ${className ?? ""}
      `}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

/* ================= CONTROL ================= */

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={error ? "true" : "false"}
      className={`${className ? className : ""} mt-2`}
      {...props}
    >
      {children}
    </div>
  )
})
FormControl.displayName = "FormControl"

/* ================= DESCRIPTION ================= */

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={`text-sm text-gray-500 ${className ?? ""}`}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

/* ================= MESSAGE ================= */

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const message = error?.message || children

  if (!message) return null

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={`text-sm font-medium text-error ${className ?? ""}`}
      {...props}
    >
      {String(message)}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

/* ================= EXPORT ================= */

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}

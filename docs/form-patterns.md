# Form Patterns

This codebase uses a consistent form pattern combining Zod validation, react-hook-form, and custom shadcn-style components.

## Zod Schema Pattern

File location: `src/lib/zodSchema.ts`

```typescript
import { z } from "zod";

export const exampleFormSchema = z.object({
  name: z.string().min(6).max(32),
  email: z.email().max(64).toLowerCase(),
  password: z.string().min(6).max(64),
});

export type ExampleFormType = z.infer<typeof exampleFormSchema>;
```

- Uses `zod` for schema validation
- Exports schema object with field-specific validations
- Exports TypeScript type via `z.infer<>` for type safety

## Form Component Pattern

File location: `src/components/Example/ExampleForm.tsx`

### Setup

```typescript
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExampleFormType, exampleFormSchema } from "@/lib/zodSchema";

const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(exampleFormSchema),
  defaultValues: { name: "", email: "", password: "" },
  mode: "all",
});
```

### Field Pattern (repeated for each field)

```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input
        {...field}
        id={field.name}
        type="text"
        aria-invalid={fieldState.invalid}
        placeholder="Placeholder"
        autoComplete="autocomplete-attribute"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Submit Button

```typescript
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? <LoaderIcon /> : <CheckIcon />}
</Button>
```

### Key Features

- `react-hook-form` + `zodResolver` for validation
- `Controller` component for each field (fine-grained control)
- Custom shadcn-style components (`Field`, `FieldLabel`, `FieldError`, `Input`, `Button`)
- Accessibility attributes (`aria-invalid`, `htmlFor`, `autoComplete`)
- Loading state with icon toggle
- Form `noValidate` to let react-hook-form handle validation
- Typed submission handler receiving `FormType`

### Component Imports

```typescript
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";
```

## Example: Complete Form Implementation

```typescript
"use client";

import { ExampleFormType, exampleFormSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";

const ExampleForm = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "all",
  });

  const exampleFormHandler = async (exampleFormData: ExampleFormType) => {
    // Form submission start logic here
    console.log(exampleFormData);
    // Form submission end logic here
  };

  return (
    <form
      onSubmit={handleSubmit(exampleFormHandler)}
      className="grid gap-4"
      noValidate>
      {/* Name field */}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="text"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Email field */}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Password field */}
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Submit button */}
      <Button
        className="w-full"
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <LoaderIcon className="animate-spin" /> Submitting..
          </>
        : <>
            <CheckIcon /> Submit
          </>
        }
      </Button>
    </form>
  );
};

export default ExampleForm;
```

## Usage Guidelines

1. **Schema Definition**: Define your form schema in `src/lib/zodSchema.ts`
2. **Type Export**: Always export the inferred type using `z.infer<typeof schema>`
3. **Form Setup**: Use `useForm` with `zodResolver` and appropriate default values
4. **Field Pattern**: Use the `Controller` pattern consistently for all fields
5. **Accessibility**: Include proper `aria-invalid`, `htmlFor`, and `autoComplete` attributes
6. **Loading States**: Show loading indicators during form submission
7. **Error Handling**: Use `FieldError` component for validation error display

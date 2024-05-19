import type { Control, FieldValues, Path } from "react-hook-form";
import { useFormState } from "react-hook-form";

/**
 * Isolate the formState subscription logic from the rest of the form
 * to avoid re-render impact on large and complex form application.
 */
export function FormState<T extends FieldValues>(props: {
  control?: Control<T, any> | undefined;
  disabled?: boolean | undefined;
  name?: Path<T> | Path<T>[] | readonly Path<T>[] | undefined;
  exact?: boolean | undefined;
  children: (formState: ReturnType<typeof useFormState>) => React.ReactNode;
}) {
  return <>{props.children(useFormState(props))}</>;
}

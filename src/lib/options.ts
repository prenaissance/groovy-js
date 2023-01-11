export type LabeledOption = { label: string; value: string };
export type Option = string | LabeledOption;

export const getUniformOptions = (options: Option[]) =>
  options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );

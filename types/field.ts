export type FieldDef = {
  name: string;
  label?: string;
  type?: string;
  mandatory?: boolean;
};

export type DocTypeMap = Record<string, FieldDef[]>;

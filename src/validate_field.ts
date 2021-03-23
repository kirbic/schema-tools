import { curry } from "ramda";

export const validate_field = curry(
  (schema: Record<string, unknown>, schema_key: string, field: string) => {
    if (!schema[field]) {
      throw new Error(
        `❌ Please, define the field [${field}] in the schema -> ${schema_key}`
      );
    }
    return schema[field];
  }
);

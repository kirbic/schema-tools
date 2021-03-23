require("ts-node").register();

import fs from "fs-extra";
import { compile } from "json-schema-to-typescript";
import { validate_field } from "./validate_field";

export const process_schemas = async () => {
  const file = `${process.cwd()}/src/schemas.ts`;
  const schemas = require(file);
  await fs.mkdirp("./src/generated_types");
  const types = await Promise.all(
    Object.keys(schemas).map(async (schema_key) => {
      const schema = (schemas as any)[schema_key].valueOf();
      const validator = validate_field(schema, schema_key);

      // Validate schema is properly documented
      const title: string = validator("title");
      validator("description");
      validator("$id");

      const ts = await compile(schema, title, { bannerComment: "" });
      await fs.writeFile(`./src/generated_types/${schema_key}.ts`, ts);
      return schema_key;
    })
  );
  console.log(types);

  // const imports = types
  //   .map((key) => `export * as ${key} from "./${key}";`)
  //   .join("\n");

  // await fs.writeFile("./src/generated_types/index.ts", `${imports}\n`);
};

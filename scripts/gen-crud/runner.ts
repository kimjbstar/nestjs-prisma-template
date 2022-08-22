import * as path from "path";
import * as fs from "fs";
import { camelCase, paramCase, pascalCase, snakeCase } from "change-case";
import pluralize from "pluralize";

function replaceFromObject(str, obj: Record<string, string>) {
  return Object.entries(obj).reduce((result, [k, v]) => {
    return result.replace(new RegExp(`${k}`, "g"), v);
  }, str);
}

async function run() {
  if (process.argv.length !== 3) {
    console.log("USAGE runner.ts foo(snake, singluar)");
    return 1;
  }
  const name = process.argv[2].toString();

  if (name.match(/^[a-z_]+$/) === null) {
    console.log("wrong name");
    return 1;
  }

  const pathReplaceMap = {
    CAMEL_SINGLE: pluralize.singular(camelCase(name)),
    CAMEL_PLURAL: pluralize(camelCase(name)),
    PASCAL_SINGLE: pluralize.singular(pascalCase(name)),
    PASCAL_PLURAL: pluralize(pascalCase(name)),
    KEBAB_SINGLE: pluralize.singular(paramCase(name)),
    KEBAB_PLURAL: pluralize(paramCase(name)),
    SNAKE_SINGLE: pluralize.singular(snakeCase(name)),
    SNAKE_PLURAL: pluralize(snakeCase(name)),
    "\\.template": "",
  };
  const fileReplaceMap = Object.entries(pathReplaceMap).reduce(
    (result, [k, v]) => {
      const key = `\\$\\!{${k}}`;
      result[key] = v;
      return result;
    },
    {}
  );

  const templateDir = path.resolve(__dirname, "templates");
  if (!fs.existsSync(templateDir)) {
    console.log("wrong dir");
    return 1;
  }

  const newDir = path.resolve(
    __dirname,
    "../../src/modules",
    pathReplaceMap.KEBAB_PLURAL
  );

  const templateFilePaths = [
    "./KEBAB_PLURAL.module.ts.template",
    "./KEBAB_PLURAL.resolver.ts.template",
    "./KEBAB_PLURAL.service.ts.template",
    "./dtos/KEBAB_SINGLE-create.dto.ts.template",
    "./dtos/KEBAB_SINGLE-update.dto.ts.template",
    "./args/KEBAB_SINGLE-list.args.ts.template",
    "./response/KEBAB_SINGLE.response.ts.template",
  ];

  const genMap = templateFilePaths.reduce(
    (result: { from: string; to: string; content: string }[], row) => {
      const from = path.resolve(templateDir, row);
      const toBeforeConvert = path.resolve(newDir, row);
      const to = replaceFromObject(toBeforeConvert, pathReplaceMap);
      const _content = fs.readFileSync(from).toString();
      const content = replaceFromObject(_content, fileReplaceMap);
      result.push({
        from,
        to,
        content,
      });
      return result;
    },
    []
  );

  // WRITE
  if (!fs.existsSync(path.resolve(newDir, "args"))) {
    fs.mkdirSync(path.resolve(newDir, "args"), { recursive: true });
  }
  if (!fs.existsSync(path.resolve(newDir, "dtos"))) {
    fs.mkdirSync(path.resolve(newDir, "dtos"), { recursive: true });
  }
  if (!fs.existsSync(path.resolve(newDir, "response"))) {
    fs.mkdirSync(path.resolve(newDir, "response"), { recursive: true });
  }
  genMap.forEach((genMapRow) => {
    fs.writeFileSync(genMapRow.to, genMapRow.content);
  });

  return 1;
}
run();

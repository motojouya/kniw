import Ajv from "ajv";
import { $Compiler, wrapCompilerAsTypeGuard } from "json-schema-to-ts";

const ajv = new Ajv();
const $compile: $Compiler = (schema) => ajv.compile(schema);

export const createValidationCompiler = () => wrapCompilerAsTypeGuard($compile);


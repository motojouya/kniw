import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { $Compiler } from 'json-schema-to-ts';
import { wrapCompilerAsTypeGuard } from 'json-schema-to-ts';

const ajv = new Ajv();
addFormats(ajv);
const $compile: $Compiler = schema => ajv.compile(schema);

export const createValidationCompiler = () => wrapCompilerAsTypeGuard($compile);

import { parse } from '@babel/parser';
import generate from '@babel/generator';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Refactors the input code by transforming the AST.
 *
 * @param code - The code to be refactored
 * @returns The refactored code as a string
 */
export const refactorCodeService = (code: string): string => {
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const transformations = {
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        if (!path.node.async) {
          path.node.async = true;
        }
      },
    };

    // Apply transformations
    traverse(ast, transformations);

    // Generate transformed code
    const { code: transformedCode } = generate(ast, { retainLines: true });
    return transformedCode;

  } catch (error) {
    console.error('Failed to refactor code:', error);
    return code; // Return original code as fallback
  }
};

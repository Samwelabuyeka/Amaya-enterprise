import * as ts from 'typescript';

// Polymorphic transformer: rewrites function names and adds a small wrapper layer
// This is a source-to-source transformer for experimentation only.

export function transformSource(source: string, options: { prefix?: string } = { prefix: 'poly_' }) {
  const sourceFile = ts.createSourceFile('file.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const newName = ts.factory.createIdentifier((options.prefix || 'poly_') + node.name.text);
        return ts.factory.updateFunctionDeclaration(
          node,
          node.modifiers,
          node.asteriskToken,
          newName,
          node.typeParameters,
          node.parameters,
          node.type,
          node.body || node.body
        );
      }
      return ts.visitEachChild(node, (n) => visit(n), context);
    }
    return ts.visitNode(rootNode, visit);
  };
  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter();
  const transformed = printer.printFile(result.transformed[0] as ts.SourceFile);
  result.dispose();
  return transformed;
}

export default { transformSource };

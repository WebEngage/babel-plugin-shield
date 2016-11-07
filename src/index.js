function replaceObject(t,expression,variable){
    switch(expression.type) {
      case 'MemberExpression' :
        expression.object = variable;
        break;
      case 'CallExpression' :
        expression.callee = variable;
        break;
    }
  return expression
}


function transformHelper (path,expression, t) {
  var leftExpr, rightExpr = expression, finalExpr = expression, refs=[],temp=[],newVar;
  if (expression) {
    switch(expression.type) {
      case 'MemberExpression' :
        [leftExpr,temp] = transformHelper(path,expression.object, t);
        break;
      case 'CallExpression' :
        [leftExpr,temp] = transformHelper(path,expression.callee, t);
        break;
    }
    if (leftExpr) {
            newVar=path.scope.generateUidIdentifier("uid")
            refs = temp.concat(t.variableDeclarator(newVar,leftExpr));  
            finalExpr = t.logicalExpression('&&', newVar , replaceObject(t,rightExpr,newVar));
    }
  }
  return [finalExpr, refs];
}

function transform (path,expression, t) {
  var [logicalExpr,refs] = transformHelper(path,expression.arguments[0], t,null);
  var blockArgs = [t.returnStatement (logicalExpr)];
  if(refs.length>0){
    blockArgs=[t.variableDeclaration('var',refs),t.returnStatement (logicalExpr)]
  }
    
  var newBlock = t.blockStatement(blockArgs);
  return t.expressionStatement(t.callExpression(t.callExpression(t.memberExpression(t.functionExpression(null, [], newBlock, false, false),t.identifier('bind')), [t.thisExpression()]),[]));
}


export default function ({types: t}) {
  return {
    visitor: {
      CallExpression (path) {
        let node = path.node;
        if (t.isIdentifier(node.callee, { name: 'shield_'})) {
          var finalexpr = transform(path,node, t);
          path.replaceWith(finalexpr);
        }
      }
    }
  };
}
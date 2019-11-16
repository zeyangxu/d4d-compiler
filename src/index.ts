import { buildBlockTree, registerBlocks, registerVariables, JToken } from './transformer';
import { buildWidget } from './generator';

import * as fs from 'fs';

export { compile }

export default generateWidget;

function compile(json: JToken):string {
  const varSet = registerVariables(json);
  const blockMap = registerBlocks(json, varSet);
  const blockTree = buildBlockTree(json, blockMap, varSet);

  const codes = buildWidget(json.name, blockMap, blockTree);
  return codes;
}

function generateWidget(json: JToken, path: string){
  const res = compile(json);
  fs.openSync(path, 'w');

  fs.writeFile(path, res, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    // success case, the file was saved
    console.log('Code saved!');
  });
}

import complete from '../test/mock/complete.json';

console.log(complete)
// const data = JSON.parse(complete);
generateWidget(complete, './test/output/integrate.jsx');


import * as _ from 'lodash';

export { buildBlockTree, registerBlocks, registerVariables };

export { Block, BlockNode, JToken }

interface JBlock {
  name: string,
  css: { [type: string]: string },
  children: string[]
}

interface JNode {
  blockName: string,
  children: (JNode | string)[]
}

interface JToken {
  name: string,
  version: number,
  wrapper: { [type: string]: string },
  tree: JNode[],
  variables: string[],
  blocks: JBlock[],
}

interface Block {
  name: string,
  css: string,
  // children?: StyledBlock[]
}

interface BlockNode {
  block: Block,
  children: (BlockNode | string)[]
}

function isRef(str: string): Boolean {
  if (str[0] === '$' && str[1] === '{' && str[str.length - 1] === '}') return true;
  return false;
}

function parseRef(str: string, set: Set<string>, isCss: boolean): string {
  if (!isRef(str)) return str;
  const refName = str.slice(2, -1);
  if (set.has(refName)) return isCss ? `\$\{props.${refName}\}` : `\{props.${refName}\}`;
  throw new Error('reference name not found');
}

function parseCSS(css: { [type: string]: string }, set: Set<string>): string {
  let res = "";
  for (let key in css) {
    res += `${key}: ${parseRef(css[key], set, true)};\n`
  }
  return res.slice(0, -1);
}

/**
 * Register all blocks
 * @param {Token} token json payload
 */
function registerBlocks(token: JToken, set: Set<string>): Map<string, Block> {
  let map: Map<string, Block> = new Map();
  const { blocks } = token;
  while (blocks.length > 0) {
    const block = blocks.shift();
    if (!block) throw new Error('an empty block is encounter in the json');
    let styled: Block = { name: block.name, css: parseCSS(block.css, set) };
    map.set(block.name, styled);
  }
  map.set('_Wrapper', { name: '_Wrapper', css: parseCSS(token.wrapper, set) })
  return map;
}

/**
 * Register all variables
 * @param {Token} token json payload
 */
function registerVariables(token: JToken): Set<string> {
  let set: Set<string> = new Set();
  const { variables } = token;
  while (variables.length > 0) {
    const variable = variables.shift();
    if (!variable || variable.length <= 0) throw new Error('an empty variable is encounter in the json');
    set.add(variable);
  }
  return set;
}

function buildNode(jnode: JNode, map: Map<string, Block>, set: Set<string>): BlockNode {
  const { blockName, children } = jnode;
  if (!map.has(blockName)) throw new Error(`block name ${blockName} not found`);
  let childrenList: (BlockNode | string)[] = [];
  children.forEach(i => {
    if (typeof i !== 'string') childrenList.push(buildNode(i, map, set));
    else childrenList.push(parseRef(i, set, false));
  })
  let node: BlockNode = { block: (map.get(blockName) as Block), children: childrenList }
  return node;
}

/**
 * Transform tokens to a dom tree data structure
 * @param {Toekn} tokens 
 * @param {Map <string, Block>} map 
 */
function buildBlockTree(token: JToken, map: Map<string, Block>, set: Set<string>): BlockNode[] {
  let blockTree: BlockNode[] = [];
  const { tree } = token;
  tree.forEach(jnode => {
    blockTree.push(buildNode(jnode, map, set));
  })
  return blockTree;
}

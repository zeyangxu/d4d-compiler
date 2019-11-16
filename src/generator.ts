import { Block, BlockNode } from './transformer';
import * as fs from 'fs';

export { buildStyledComponent, buildRender, buildWidget }

function buildStyledComponent(map: Map<string, Block>): string {
  let res = '';
  map.forEach((block, name) => {
    res += generateStyledComponent(block, name);
  })
  return res;
}

function buildRender(blockTree: BlockNode[]): string {
  let content = '';
  while (blockTree.length > 0) {
    const curBlock = blockTree.shift();
    if(!curBlock) throw new Error('there is an undefined node');
    content += createDom(3, curBlock);
  }
  const res = `<Wrapper>\n${content}\t\t</Wrapper>`
  return res;
}

function createDom(level: number, node: BlockNode | string): string {
  let res = '';
  if (typeof node === 'string') return `${'\t'.repeat(level)}${node}`
  const { block, children } = node as BlockNode;
  res = `${'\t'.repeat(level)}<${block.name}>\n${children.map(i => createDom(level + 1, i)).join('')}\n${'\t'.repeat(level)}</${block.name}>\n`
  return res;
}

function generateStyledComponent(block: Block, name: string): string {
  const res = `
const ${name} = styled.div\`
${block.css}
\`
`
  return res;
}

function buildWidget(widgetName: string, map: Map<string, Block>, blockTree: BlockNode[]){
  const styled = buildStyledComponent(map);
  const render = buildRender(blockTree);
  const res = `import React from 'react';
import styled from 'styled-components';

${styled}
export default function ${widgetName} (props) {
  return(
    ${render}
  )
}
`
  return res;
}

test();

function test() {
  const map = new Map([["Block1", {
    name: "Block1",
    css: "background-color: ${props.color};\ncolor: black;"
  }], ["Block2", {
    name: "Block2",
    css: `background-color: blue;\ncolor: black;`
  }], ["_Wrapper", { name: "_Wrapper", css: "" }]]);

  const blockTree = [
    {
      block: {
        name: "Block2",
        css: `background-color: blue;\ncolor: black;`
      },
      children: [
        {
          block: {
            name: "Block1",
            css: "background-color: ${props.color};\ncolor: black;"
          },
          children: ["{props.content1}"]
        },
        "Hello World"
      ]
    },
    {
      block: {
        name: "Block1",
        css: "background-color: ${props.color};\ncolor: black;\n"
      },
      children: ["{props.content2}"]
    }
  ]

const res = buildWidget('FirstWidget', map, blockTree);
fs.openSync('./output/render.js', 'w');
fs.openSync('./output/expected.js', 'w');

fs.writeFile('./output/render.js', res, (err) => {
  // throws an error, you could also catch it here
  if (err) throw err;
  // success case, the file was saved
  console.log('Code saved!');
});

// fs.writeFile('./output/expected.js', expected, (err) => {
//   // throws an error, you could also catch it here
//   if (err) throw err;
//   // success case, the file was saved
//   console.log('Expected saved!');
// });
}
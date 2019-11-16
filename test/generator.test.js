const { buildStyledComponent, buildRender, buildWidget } = require('../dist/generator');

describe('buildStyledComponent', function () {

  it('convert block map to styled components', function () {
    const map = new Map([["Block1", {
      name: "Block1",
      css: `background-color: pink;\ncolor: black;`
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;`
    }], ["_Wrapper", { name: "_Wrapper", css: "" }]]);
    const res = buildStyledComponent(map);
    const expected = `
const Block1 = styled.div\`
background-color: pink;
color: black;
\`

const Block2 = styled.div\`
background-color: blue;
color: black;
\`

const _Wrapper = styled.div\`

\`
`
    expect(res.split('')).toEqual(expected.split(''));
  });
});

describe('buildRender', function(){
  it('convert block tree to render function code', function(){
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
    ];
    const res = buildRender(blockTree);
    const expected = 
`<Wrapper>
\t\t\t<Block2>
\t\t\t\t<Block1>
\t\t\t\t\t{props.content1}
\t\t\t\t</Block1>
\t\t\t\tHello World
\t\t\t</Block2>
\t\t\t<Block1>
\t\t\t\t{props.content2}
\t\t\t</Block1>
\t\t</Wrapper>`
    expect(res).toEqual(expected);
  })
})

describe('buildWidget', function(){
  it('build a complet widget', function(){
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
    ];
    const expected = `import React from 'react';
import styled from 'styled-components';


const Block1 = styled.div\`
background-color: \$\{props.color\};
color: black;
\`

const Block2 = styled.div\`
background-color: blue;
color: black;
\`

const _Wrapper = styled.div\`

\`

export default function FirstWidget (props) {
  return(
    <Wrapper>
\t\t\t<Block2>
\t\t\t\t<Block1>
\t\t\t\t\t{props.content1}
\t\t\t\t</Block1>
\t\t\t\tHello World
\t\t\t</Block2>
\t\t\t<Block1>
\t\t\t\t{props.content2}
\t\t\t</Block1>
\t\t</Wrapper>
  )
}
`
    const res = buildWidget('FirstWidget', map, blockTree);
    expect(res).toEqual(expected);
  });
})
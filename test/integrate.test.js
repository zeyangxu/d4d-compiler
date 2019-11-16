const { compile } = require('../dist/index');
const generator = require('../dist/index').default;
const complete = require('./mock/complete.json');

describe('compiler()', function(){
  it('compile json to react widget code', function(){
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
    const res = compile(complete);
    expect(res).toEqual(expected);
  })
})

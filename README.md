# D4D - design for development System

Product design starts from the designer, it would be better to generate template code right after designing, it is faster to do front end development if the widget is ready to use

## Widget factory: define style and props

Work flow: 
Sketch/Figma -> D4D widget factory -> front end logic / connecting api / state management / testing

Risk: does second part really reduce the overall time consuming or it is unnecessary 

## Structure

A dumb component meta data

* styled dom (json -> css compiler)
* props variables (variables map)
* hierarchy of dom, how styled dom is structred (binary tree)

## Template of dumb component

```js
import ...

class WidgetName extends Component 
{
	const styled1 = styled.div``
	const styled2 = styled.div``
	const styled3 = styled.div``

	const Wrapper = styled.div``
	
	render() {
    return(
      <Wrapper>
        <styled1 />
        <styled2 />
        <styled3 />
      </Wrapper>
    )
	}

}
```

## JSON format

three main entries:
- tree: the dom structure of styled blocks
- variables: all props that can be referenced in block
- blocks: all block with type and css

variable is reference in ${var} syntax

variable can be referenced in *css* and *children*

```json
{
  "name": "FirstWidget",
  "version": 1573766132510,
  "wrapper": {},
  "tree": [
    {
      "blockName": "Block2",
      "children": [
        {
          "blockName": "Block1",
          "children": ["${content1}"]
        },
        "Hello World"
      ]
    },
    {
      "blockName": "Block1",
      "children": ["${content2}"]
    }
  ],
  "variables": ["content1", "content2", "color"],
  "blocks" : [
    {
      "name": "Block1",
      "type": "styled",
      "css": {
        "background-color": "${color}",
        "color": "black"
      }
    },
    {
      "name": "Block2",
      "type": "styled",
      "css": {
        "background-color": "blue",
        "color": "black"
      }
    }
  ]
}
```


## output

the generated react code

```jsx
import React from 'react';
import styled from 'styled-components';


const Block1 = styled.div`
background-color: ${props.color};
color: black;
`

const Block2 = styled.div`
background-color: blue;
color: black;
`

const _Wrapper = styled.div`

`

export default function FirstWidget (props) {
  return(
    <Wrapper>
			<Block2>
				<Block1>
					{props.content1}
				</Block1>
				Hello World
			</Block2>
			<Block1>
				{props.content2}
			</Block1>
		</Wrapper>
  )
}

```



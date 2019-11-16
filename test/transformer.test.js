const { buildBlockTree, registerBlocks, registerVariables } = require('../dist/transformer');
const styled = require('./mock/styled.json');
const ordered = require('./mock/ordered.json');
const nested = require('./mock/nested.json');
const variables = require('./mock/variables.json');
const wrapper = require('./mock/wrapper.json');

describe('registerBlocks()', function () {

  it('register all blocks', function () {
    const set = new Set(['color', 'content1', 'content2']);
    let result = registerBlocks(styled, set);
    const map = new Map([["Block1", {
      name: "Block1",
      css: `background-color: pink;\ncolor: black;`
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;`
    }], ["_Wrapper", { name: "_Wrapper", css: "" }]]);
    expect(result).toMatchObject(map);
  })

  it('register wrapper css', function () {
    let result = registerBlocks(wrapper);
    const map = new Map([["Block1", {
      name: "Block1",
      css: `background-color: pink;\ncolor: black;`
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;`
    }], ["_Wrapper", { name: "_Wrapper", css: "display: flex;\nbackground-color: gray;" }]]);
    expect(result).toMatchObject(map);
  })

  it('transform variable in css', function () {
    const set = new Set(['color', 'content1', 'content2']);
    let result = registerBlocks(variables, set);
    const map = new Map([["Block1", {
      name: "Block1",
      css: "background-color: ${props.color};\ncolor: black;"
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;`
    }], ["_Wrapper", { name: "_Wrapper", css: "" }]]);
    expect(result).toMatchObject(map);
  })
});

describe('buildBlockTree()', function(){
  it('create the ordered block tree', function () {
    const map = new Map([["Block1", {
      name: "Block1",
      css: `background-color: pink;\ncolor: black;\n`
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;\n`
    }]]);
    let result = buildBlockTree(ordered, map);
    expect(result).toMatchObject(
      [
        {
          block: {
            name: "Block2",
            css: `background-color: blue;\ncolor: black;\n`
          },
          children: []
        },
        {
          block: {
            name: "Block1",
            css: `background-color: pink;\ncolor: black;\n`
          },
          children: []
        }
      ]
    )
  })

  it('buld a nested block tree', function () {
    const map = new Map([["Block1", {
      name: "Block1",
      css: `background-color: pink;\ncolor: black;\n`
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;\n`
    }]]);
    let result = buildBlockTree(nested, map);
    expect(result).toMatchObject(
      [
        {
          block: {
            name: "Block2",
            css: `background-color: blue;\ncolor: black;\n`
          },
          children: [
            {
              block: {
                name: "Block1",
                css: `background-color: pink;\ncolor: black;\n`
              },
              children: []
            },
            "Hello World"
          ]
        },
        {
          block: {
            name: "Block1",
            css: `background-color: pink;\ncolor: black;\n`
          },
          children: ["zebxu"]
        }
      ]
    )
  })

  it('transform variable in children', function () {
    const set = new Set(['color', 'content1', 'content2']);
    const map = new Map([["Block1", {
      name: "Block1",
      css: "background-color: ${props.color};\ncolor: black;\n"
    }], ["Block2", {
      name: "Block2",
      css: `background-color: blue;\ncolor: black;\n`
    }], ["_Wrapper", { name: "_Wrapper", css: "" }]]);

    let result = buildBlockTree(variables, map, set);

    const expected = [
      {
        block: {
          name: "Block2",
          css: `background-color: blue;\ncolor: black;\n`
        },
        children: [
          {
            block: {
              name: "Block1",
              css: "background-color: ${props.color};\ncolor: black;\n"
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

    expect(result).toMatchObject(expected);
  })
})

describe('registerVariables()', function(){
  it('register all variables', function () {
    let result = registerVariables(variables);
    const set = new Set(['color', 'content1', 'content2']);
    expect(result).toMatchObject(set);
  })
})
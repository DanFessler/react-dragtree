import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import './App.css';

// TODO:
// prevent targeting currently dragged items
// handle dragging to empty script containers
// bug when dragging an item over c-block from bottom

class App extends Component {

  state = {
    shiftKey: false,
    nextKey: 0,
    rows: [
      {label:"test 0"},
      {label:"test 1"},
      {label:"test 2"},
      {label:"test 3"},
      {label:"block test 1", children:[
        {label:"block test 2", children:[
          {label:"test 11"},
          {label:"test 12"},
          {label:"test 13"},
        ]},
        {label:"test 12"},
        {label:"test 13"},
      ]},
      {label:"test 2"},
      {label:"test 3"},
      {label:"block test", children:[
        {label:"test 11"},
        {label:"test 12"},
        {label:"test 13"},
      ]},
    ],
    dragging: null
  }

  constructor(props) {
    super(props);
    window.addEventListener('mouseup', this.endDrag);
    this.assignKey(this.state.rows);
    console.log(this.decomposeScript(this.state.rows));
  }

  assignKey = (script) => {
    script.map(function(line, i){
      if (line.key === undefined)
        line.key = this.getAvailableKey();
      if (line.children)
        this.assignKey(line.children);
      return line;
    }, this);
  }

  getAvailableKey = () => {
    let key = this.state.nextKey;
    this.state.nextKey++;
    return key;
  }

  decomposeScript = (script, tabs) => {
    if (tabs === undefined) tabs = 0;
    let newScript = [];
    for (let i=0; i<script.length; i++) {

      if (script[i].children !== undefined) {
        newScript.push({label: script[i].label, tabs: tabs});
        newScript.push.apply(newScript, this.decomposeScript(script[i].children, tabs+1));
        newScript.push({label: "end " + script[i].label, tabs: tabs});
      }
      else {
        newScript.push({label: script[i].label, tabs: tabs});
      }
    }
    return newScript;
  }

  render() {
    return (
      <div className="App">
        <ReactCursorPosition>
          {
            this.decomposeScript(this.state.rows).map(function(block, i, arr) {
              return <Block block={block} />;
            }, this)
          }
        </ReactCursorPosition>
      </div>
    );
  }
}

class Block extends Component {

  handleClick = (e) => {
    e.stopPropagation();
    this.props.onMouseDown(this.props.index);
  }

  handleHover = (e) => {
    e.stopPropagation();
    this.props.onMouseOver(this.props.index);
  }

  render() {

    let style = {
      block: {
        padding: "4px 6px",
        borderBottom: "1px solid RGBA(0,0,0,0.125)",
      },
      line: {
        marginLeft: this.props.block.tabs * 10,
      }
    }

    return (
      <div style={style.block}>
        <div style={style.line}>{this.props.block.label}</div>
      </div>
    )
  }
}

export default App;

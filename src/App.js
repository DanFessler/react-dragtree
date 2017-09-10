import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import './App.css';

import COLORS from './Themes.js';
import BlockScript from './BlockScript.js'

// TODO:
// allow dragging of consecutive scripts
// animated transitions

class App extends Component {

  state = {
    shiftKey: false,
    nextKey: 0,
    rows: [
      {label:"test 0"},
      {label:"test 1"},
      {label:"test 2"},
      {label:"test 3"},
      {label:"block test", children:[
        {label:"block test", children:[
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
    dragging: null,
    hoverIndex: null,
  }

  constructor(props) {
    super(props);
    window.addEventListener('mouseup', this.endDrag);
    document.addEventListener('keydown', this.setShiftDown);
    document.addEventListener('keyup', this.setShiftUp);
    this.assignKey(this.state.rows);
  }

  setShiftDown = (event) => {
    if(event.keyCode === 16 || event.charCode === 16){
      this.setState({shiftKey: true});
    }
  };

  setShiftUp = (event) => {
    if(event.keyCode === 16 || event.charCode === 16){
      this.setState({shiftKey: false});
    }
  };

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

  moveLine(A, B) {
    let script = this.state.rows.slice();

    let scriptA = this.find(A, script, false, true);
    let scriptB = this.find(B, script, false, true);

    let line = Object.assign(scriptA.arr[scriptA.index], {});

    // remove the source index to replace somewhere else
    scriptA.arr.splice(scriptA.index, 1);
    // need to offset the target index if we've removed one up the chain
    scriptB.arr.splice(scriptB.index-(this.isMovingUp(A,B)? 0 : 1), 0, line);

    this.setState({rows: script});
  }

  isMovingUp(A, B) {
    return A.length !== B.length? true : A[A.length-1] >= B[B.length-1]? true : false;
  }

  find(x, script, consecutive, containingScript) {

    // consecutive = this.state.shiftKey;

    if (x.length > 1) {
      let newx = x.slice(); newx.splice(0,1);
      return this.find(newx, script? script[x[0]].children : null, consecutive, containingScript);
    }
    else {
      return containingScript? {arr: script, index: x[0]} :
             consecutive && script? script.slice(x[0]) :
             script? [script[x[0]]] : []; //need to check if script is valid first
    }
  }

  handleHover = (i, event) => {
    this.setState({hoverIndex: i});
  }

  startDrag = (i, position) => {

    if (this.state.dragging === null) {
      this.setState({dragging: {
        i: i,
        consecutive: this.state.shiftKey,
        offset: position,
      }});
    }
  }

  endDrag = (i) => {
    if (this.state.dragging !== null) {
      if (JSON.stringify(this.state.dragging.i) !== JSON.stringify(i)) {
        this.moveLine(this.state.dragging.i, this.state.hoverIndex);
      }
      this.setState({dragging: null});
    }
  }

  render() {
    let style = {
      app: {
        backgroundColor: COLORS.background,
      },
      container: {
        // margin: 10,
        borderBottom: "1px solid "+COLORS.border,
      }
    }

    let dragScript = this.state.dragging? <DragScript pos={this.state.dragging.offset}><BlockScript script={this.find(this.state.dragging.i, this.state.rows, this.state.dragging.consecutive)} dragScript={true} /></DragScript> : "";

    return (
      <div className="App" style={style.app}>
        <div style={style.container}>
          <ReactCursorPosition>
            <BlockScript
              index={[]}
              onMouseDown={this.startDrag}
              onMouseOver={this.handleHover}
              script={this.state.rows}
              dragBlock={this.state.dragging? this.state.dragging : null}
              hoverIndex={this.state.hoverIndex}
            />
            {dragScript}
          </ReactCursorPosition>
        </div>
      </div>
    );
  }
}

class DragScript extends Component {

  render() {

    let style = {
      dragScript: {
        backgroundColor: COLORS.background,
        position: "absolute",
        minWidth: 200,
        width: "100%",
        opacity: "0.5",
        boxShadow: "0 3px 6px RGBA(0,0,0,0.125)",
        top: this.props.cursorPosition.y - this.props.pos.y - 2,
        left: this.props.cursorPosition.x - this.props.pos.x - 2,

        pointerEvents: "none",
        border: "2px solid RGBA(255,255,255,0.25)", //+COLORS.border,
        // borderBottom: "1px solid RGBA(0,50,100,0.3)",
        borderRadius: "4px",
        overflow: "hidden",
      }
    }

    return (
      <div style={style.dragScript}>{this.props.children}</div>
    )
  }

}

export default App;

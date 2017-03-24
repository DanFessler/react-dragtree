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
    dragging: null
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
      this.moveLine([0],[1]);
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

    console.log(A);

    let line = Object.assign(scriptA.arr[scriptA.index], {});

    scriptA.arr.splice(scriptA.index, 1);
    scriptB.arr.splice(scriptB.index, 0, line);

    this.setState({rows: script});
  }

  find(x, script, consecutive, containingScript) {

    consecutive = this.state.shiftKey;

    if (x.length > 1) {
      let newx = x.slice(); newx.splice(0,1);
      return this.find(newx, script[x[0]].children, consecutive, containingScript);
    }
    else {
      return containingScript? {arr: script, index: x[0]} :
             consecutive? script.slice(x[0]) : [script[x[0]]];
    }
  }

  handleHover = (i, event) => {
    console.log(i);
    if (this.state.dragging !== null) {
      if (JSON.stringify(this.state.dragging) !== JSON.stringify(i)) {
        this.moveLine(this.state.dragging, i);
        this.setState({dragging: i});
      }
    }
  }

  startDrag = (i) => {
    if (this.state.dragging === null)
      this.setState({dragging: i});
  }

  endDrag = () => {
    if (this.state.dragging !== null)
      this.setState({dragging: null});
  }

  handleClick = (i) => {
    if (this.state.dragging === null) {
      this.setState({dragging: i});
    }
    else {
      this.setState({dragging: null});
    }
  }

  render() {
    let dragScript = this.state.dragging? <DragScript><BlockScript script={this.find(this.state.dragging, this.state.rows, true)} /></DragScript> : "";

    return (
      <div className="App">
        <ReactCursorPosition>
          <BlockScript
            index={[]}
            onMouseDown={this.startDrag}
            onMouseOver={this.handleHover}
            script={this.state.rows}
            dragBlock={this.state.dragging}
          />
          {dragScript}
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
    let isDragging = JSON.stringify(this.props.dragBlock) === JSON.stringify(this.props.index);

    let style = {
      label: {
        paddingRight: 10,
        color: "rgba(0,25,40,0.7)",
        padding: "6px 6px", paddingRight: 0,
      },
      block: {
        boxSizing: "border-box",
        pointerEvents: "auto",
        userSelect: "none",
        cursor: "default",
        backgroundColor: "white",
        borderBottom: this.props.last? "none" : "1px solid RGBA(0,25,50,0.1)",
        position: "relative",
        //borderRadius: 2,

        opacity: isDragging? 0.25 : 1,
        //visibility: isDragging? "hidden" : "inherit"
      },
    }

    return (
      <div style={style.block}
        onMouseOver={this.handleHover}
        onMouseDown={this.handleClick} >
        <div style={style.label}>{this.props.label}</div>
        {this.props.children}
      </div>
    )
  }
}

class BlockScript extends Component {

  handleClick = (i) => {
    if (this.props.onMouseDown) this.props.onMouseDown(i)
  }

  handleHover = (i) => {
    if (this.props.onMouseOver) this.props.onMouseOver(i)
  }

  preventPropegation = (e) => {
    e.stopPropagation();
  }

  render() {
    let style = {
      script: {
        backgroundColor: "RGBA(0,25,50,0.1)",
        pointerEvents: "none"
      },
      childScript: {
        backgroundColor: "white",
        border: "0.5px solid RGBA(0,25,50,0.1)",
        //borderBottom: "1px solid RGBA(0,50,100,0.3)",
        borderRight: "none",
        //borderRadius: "6px 0 0 6px",
        overflow: "hidden",
        position: "relative",
        marginLeft: 8,
        marginBottom: 8,
      },
    }



    return (
      <div style={style.script}>
        {
          this.props.script.map(function(block, i, arr) {
            let blockIndex = this.props.index ? this.props.index.concat(i) : null;
            let dragBlock = this.props.dragBlock;
            let isDragging = JSON.stringify(dragBlock) === JSON.stringify(blockIndex);

            return (
              <Block
                key={block.key}
                label={block.label}
                index={blockIndex}
                onMouseDown={this.handleClick}
                onMouseOver={this.handleHover}
                last={i+1===arr.length? true : false}
                dragBlock={dragBlock}
              >

                {
                  block.children && !isDragging?
                    <div style={style.childScript} onMouseDown={this.preventPropegation}>
                      <BlockScript
                        index={blockIndex}
                        onMouseDown={this.handleClick}
                        onMouseOver={this.handleHover}
                        script={block.children}
                        dragBlock={dragBlock}
                      />
                    </div> :
                  null
                }

              </Block>
            )
          }, this)
        }
      </div>
    );
  }
}

class DragScript extends Component {
  render() {
    let style = {
      dragScript: {
        backgroundColor: "white",
        position: "absolute",
        minWidth: 200,
        width: "100%",
        //opacity: "0.5",
        boxShadow: "0 3px 8px RGBA(0,0,0,0.125)",
        top: this.props.cursorPosition.y + 5,
        left: this.props.cursorPosition.x + 20,

        pointerEvents: "none",
        border: "0.5px solid RGBA(0,25,50,0.1)",
        // borderBottom: "1px solid RGBA(0,50,100,0.3)",
        // borderRadius: "6px",
        overflow: "hidden",
      }
    }
    return (
      <div style={style.dragScript}>{this.props.children}</div>
    )
  }
}

export default App;

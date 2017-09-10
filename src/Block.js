import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import COLORS from './Themes.js';
import HoverBar from './HoverBar.js';

class Block extends Component {

  handleClick = (e) => {
    e.stopPropagation();
    this.props.onMouseDown(this.props.index, this.props.cursorPosition);
  }

  handleHover = (e) => {
    e.stopPropagation();
    this.props.onMouseOver(this.props.index);
  }

  handleTopHover = (e) => {
    e.stopPropagation();
    if (!this.isDragging()) {
      this.props.onMouseOver(this.props.index);
    }
  }

  handleBottomHover = (e) => {
    e.stopPropagation();
    if (!this.isDragging()) {
      let newArr = this.props.index.concat();
      newArr[newArr.length-1]++;
      this.props.onMouseOver(newArr);
    }
  }

  isDragging = () => {
    return JSON.stringify(this.props.dragBlock? this.props.dragBlock.i : null) === JSON.stringify(this.props.index) && !this.props.dragScript;
  }

  render() {
    let isDragging = this.isDragging();

    let style = {
      label: {
        color: COLORS.text,
        padding: "6px 6px", paddingRight: 0,
        position: "relative"
      },
      block: {
        userSelect: "none",
        cursor: "default",
        pointerEvents: this.props.dragScript? "none" : "auto",
        position: "relative",
        // display: isDragging? "none" : "inherit",
        // maxHeight: isDragging? "0px" : "100px",
        // WebkitTransition: "max-height 0.5s",
      },
      blockContents: {
        backgroundColor: COLORS.background,
        paddingBottom: this.props.children? "9px" : "0",
        visibility: isDragging? "hidden" : "inherit",
      },
      hoverTop: {
        position: "absolute",
        width: "100%",
        height: "50%",
        top: 0, left: 0,
        // backgroundColor: "red", opacity: 0.5,
      },
      hoverBottom: {
        position: "absolute",
        width: "100%",
        height: "50%",
        bottom: 0, left: 0,
        borderBottom: this.props.last? "0" : "1px solid "+COLORS.border,
        boxSizing: "border-box",
        // backgroundColor: "blue", opacity: 0.5,
      },
    }

    // Make a highlight bar to mark drop location if we're dragging over a block
    let bar = this.props.isHovering && this.props.dragBlock? <HoverBar align={this.props.isHovering === 1? "top" : "bottom"} /> : "";

    return (
        <div
          style={style.block}
          onMouseOver={this.handleHover}
          onMouseDown={this.handleClick}
        >
          <div style={style.blockContents}>
            <div style={style.label}>{this.props.label}</div>
            <div style={style.hoverTop}    onMouseOver={this.handleTopHover}   ></div>
            <div style={style.hoverBottom} onMouseOver={this.handleBottomHover}></div>
            {this.props.children}
          </div>
          {bar}
        </div>
    )
  }
}

class BlockStub extends Component {

  handleHover = (e) => {
    e.stopPropagation();
    // if (!this.isDragging()) {
      this.props.onMouseOver(this.props.index);
    // }
  }

  isDragging = () => {
    return JSON.stringify(this.props.dragBlock? this.props.dragBlock.i : null) === JSON.stringify(this.props.index) && !this.props.dragScript;
  }

  render() {
    let style = {
      label: {
        color: COLORS.text,
        padding: "6px 6px", paddingRight: 0,
        position: "relative"
      },
      container: {
        position: "relative",
        // height: "3px",
        pointerEvents: this.props.dragScript? "none" : "auto",
      },
      hover: {
        // backgroundColor: "RGBA(255,0,0,0.5)",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0, left: 0,
      }
    }

    let bar = this.props.isHovering && this.props.dragBlock? <HoverBar align={"top"} /> : "";

    return (
      <div style={style.container}>
        <div style={style.label}>&nbsp;</div>
        <div style={style.hover} onMouseOver={this.handleHover}></div>
        {bar}
      </div>
    )
  }
}

// export default {Block, BlockStub};
module.exports = {
  Block,
  BlockStub
}

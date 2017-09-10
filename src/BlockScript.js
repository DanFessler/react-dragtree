import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import COLORS from './Themes.js';
import {Block, BlockStub} from './Block.js';

class BlockScript extends Component {

  handleClick = (i, blockPos) => {
    if (this.props.onMouseDown) this.props.onMouseDown(i, blockPos)
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
        backgroundColor: COLORS.backgroundDark,
        pointerEvents: "none",
        // minHeight: "3px",
      },
      childScript: {
        border: "1px solid "+COLORS.border,
        borderRight: "none",
        borderRadius: "2px 0 0 2px",
        position: "relative",
        marginLeft: 8,
        pointerEvents: "none",
      },
      test: {
        backgroundColor: "red",
        height: "3px",
      }
    }

    if (this.props.script.length > 0) {
      return (
        <div style={style.script}>
          {
            this.props.script.map(function(block, i, arr) {

              // copy the current block index
              let blockIndex = this.props.index ? this.props.index.concat(i) : null;

              // get the next block index (in case we need it for the highlight bar)
              let nextIndex = blockIndex? blockIndex.concat() : null;
              if (nextIndex) nextIndex[nextIndex.length-1]++;

              let isLast = i+1 === arr.length? true : false;

              let isHovering = (
                // hovering over the top
                JSON.stringify(blockIndex) === JSON.stringify(this.props.hoverIndex) ? 1 :
                // hovering over the bottom (only when last index in the blockscript)
                isLast && JSON.stringify(nextIndex) === JSON.stringify(this.props.hoverIndex)? 2 : 0
              );

              return block? (
                <ReactCursorPosition key={block.key}>
                  <Block

                    label={block.label}
                    index={blockIndex}
                    onMouseDown={this.handleClick}
                    onMouseOver={this.handleHover}
                    last={isLast}
                    dragBlock={this.props.dragBlock}
                    isHovering={isHovering}
                    dragScript={this.props.dragScript}
                  >

                    {
                      block.children?
                        <div style={style.childScript} onMouseDown={this.preventPropegation}>
                          <BlockScript
                            index={blockIndex}
                            onMouseDown={this.handleClick}
                            onMouseOver={this.handleHover}
                            script={block.children}
                            dragBlock={this.props.dragBlock}
                            hoverIndex={this.props.hoverIndex}
                            dragScript={this.props.dragScript}
                          />
                        </div> :
                      null
                    }

                  </Block>
                </ReactCursorPosition>
              ) : null;
            }, this)
          }
        </div>
      );
    }
    else {
      return (
        <div style={style.script}>
          <BlockStub
            index={this.props.index? this.props.index.concat([0]) : null}
            dragBlock={this.props.dragBlock}
            onMouseOver={this.handleHover}
            isHovering={JSON.stringify(this.props.index? this.props.index.concat([0]) : []) === JSON.stringify(this.props.hoverIndex)}
          />
        </div>
      )
    }
  }
}

export default BlockScript;

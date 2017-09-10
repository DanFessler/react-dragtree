import React, { Component } from 'react';

class HoverBar extends Component {
  render() {
    let style = {
      bar: {
        position: "absolute",
        width: "calc(100% + 2px)",
        height: "5px",
        backgroundColor: "rgb(0,150,250)",
        borderRadius: 5,
        top:     this.props.align === "top" ? -3 : "auto",
        bottom: !this.props.align === "bottom" ? -3 : "auto",
        left: -1,
        pointerEvents: "none",
      },
    }

    return (
      <div style={style.bar}></div>
    )
  }
}

export default HoverBar;

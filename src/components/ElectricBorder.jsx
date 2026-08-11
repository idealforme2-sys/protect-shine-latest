import React from "react";
import "./ElectricBorder.css";

export default function ElectricBorder({
  children,
  color = "#7df9ff",
  speed = 1,
  chaos = 0.12,
  thickness = 2,
  borderRadius = 16,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`electric-border ${className}`}
      style={{
        "--electric-color": color,
        "--electric-speed": `${speed}s`,
        "--electric-chaos": chaos,
        "--electric-thickness": `${thickness}px`,
        "--electric-radius":
          typeof borderRadius === "number"
            ? `${borderRadius}px`
            : borderRadius,
        ...style,
      }}
    >
      <div className="electric-border__glow" />
      <div className="electric-border__edge" />
      <div className="electric-border__content">{children}</div>
    </div>
  );
}

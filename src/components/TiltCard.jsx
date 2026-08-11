import { useRef, useState } from "react";
import "./TiltCard.css";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  scale = 1.035,
  perspective = 1100,
  speed = 0.18,
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
  );

  const handleMouseMove = (e) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;

    setTransform(
      `perspective(${perspective}px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       scale(${scale})`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      `perspective(${perspective}px)
       rotateX(0deg)
       rotateY(0deg)
       scale(1)`
    );
  };

  return (
    <div class="tilt-card-wrapper">
      <div
        ref={cardRef}
        className={`tilt-card ${className}`}
        style={{
          transform,
          transition: `transform ${speed}s ease-out`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}

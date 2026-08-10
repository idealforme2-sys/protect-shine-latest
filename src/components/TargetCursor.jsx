import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./TargetCursor.css";

const TargetCursor = ({
  targetSelector = ".package-target",
  cursorColor = "#b99ad9",
  hoverDuration = 0.22,
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef([]);
  const activeTargetRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    const corners = cornersRef.current;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentTarget = null;
    let animationFrame;

    // Start completely invisible.
    gsap.set(cursor, {
      autoAlpha: 0,
      x: mouseX,
      y: mouseY,
    });

    // --------------------------------------------------
    // Move the invisible targeting cursor with the mouse
    // --------------------------------------------------

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: "power3.out",
        overwrite: true,
      });

      if (currentTarget) {
        updateTargetPosition();
      }
    };

    // --------------------------------------------------
    // Position the four corners around the target
    // --------------------------------------------------

    const updateTargetPosition = () => {
      if (!currentTarget) return;

      const rect = currentTarget.getBoundingClientRect();

      const cursorRect = cursor.getBoundingClientRect();

      // Cursor's current position on screen.
      const cursorCenterX =
        cursorRect.left + cursorRect.width / 2;

      const cursorCenterY =
        cursorRect.top + cursorRect.height / 2;

      // Small offset so the brackets sit just outside
      // the card instead of touching it.
      const gap = 3;

      const positions = [
        // Top left
        {
          x: rect.left - cursorCenterX - gap,
          y: rect.top - cursorCenterY - gap,
        },

        // Top right
        {
          x:
            rect.right -
            cursorCenterX +
            gap -
            14,
          y: rect.top - cursorCenterY - gap,
        },

        // Bottom right
        {
          x:
            rect.right -
            cursorCenterX +
            gap -
            14,
          y:
            rect.bottom -
            cursorCenterY +
            gap -
            14,
        },

        // Bottom left
        {
          x: rect.left - cursorCenterX - gap,
          y:
            rect.bottom -
            cursorCenterY +
            gap -
            14,
        },
      ];

      corners.forEach((corner, index) => {
        if (!corner) return;

        gsap.to(corner, {
          x: positions[index].x,
          y: positions[index].y,
          duration: 0.16,
          ease: "power2.out",
          overwrite: true,
        });
      });
    };

    // --------------------------------------------------
    // Find the card being hovered
    // --------------------------------------------------

    const handleMouseOver = (event) => {
      const target = event.target.closest(targetSelector);

      if (!target) return;

      // Already targeting this card.
      if (currentTarget === target) return;

      currentTarget = target;
      activeTargetRef.current = target;

      // Stop any previous corner animations.
      corners.forEach((corner) => {
        gsap.killTweensOf(corner);
      });

      // Put the targeting cursor at the current mouse.
      gsap.set(cursor, {
        x: mouseX,
        y: mouseY,
      });

      // Calculate initial position.
      updateTargetPosition();

      // Reveal the targeting frame.
      gsap.to(cursor, {
        autoAlpha: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      // Slightly animate the corners into position.
      corners.forEach((corner) => {
        gsap.fromTo(
          corner,
          {
            scale: 0.7,
            opacity: 0.3,
          },
          {
            scale: 1,
            opacity: 1,
            duration: hoverDuration,
            ease: "power3.out",
          }
        );
      });
    };

    // --------------------------------------------------
    // Hide when leaving the card
    // --------------------------------------------------

    const handleMouseOut = (event) => {
      if (!currentTarget) return;

      const relatedTarget = event.relatedTarget;

      // If we're still somewhere inside the same card,
      // don't hide the targeting frame.
      if (
        relatedTarget &&
        currentTarget.contains(relatedTarget)
      ) {
        return;
      }

      // Make sure we're actually leaving the target.
      if (
        relatedTarget &&
        relatedTarget.closest &&
        relatedTarget.closest(targetSelector) === currentTarget
      ) {
        return;
      }

      currentTarget = null;
      activeTargetRef.current = null;

      // Retract the corners.
      corners.forEach((corner) => {
        gsap.to(corner, {
          scale: 0.65,
          opacity: 0,
          duration: 0.16,
          ease: "power2.in",
        });
      });

      // Then hide the entire targeting cursor.
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.14,
        delay: 0.06,
        ease: "power2.out",
      });
    };

    // --------------------------------------------------
    // Keep frame aligned if page is resized
    // --------------------------------------------------

    const handleResize = () => {
      if (currentTarget) {
        updateTargetPosition();
      }
    };

    // --------------------------------------------------
    // Keep frame aligned while scrolling
    // --------------------------------------------------

    const handleScroll = () => {
      if (currentTarget) {
        updateTargetPosition();
      }
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseover",
      handleMouseOver
    );

    window.addEventListener(
      "mouseout",
      handleMouseOut
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseover",
        handleMouseOver
      );

      window.removeEventListener(
        "mouseout",
        handleMouseOut
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      cancelAnimationFrame(animationFrame);
    };
  }, [targetSelector, hoverDuration]);

  return (
    <div
      ref={cursorRef}
      className="target-cursor-wrapper"
      aria-hidden="true"
    >
      <div
        ref={(el) => (cornersRef.current[0] = el)}
        className="target-cursor-corner corner-tl"
        style={{ borderColor: cursorColor }}
      />

      <div
        ref={(el) => (cornersRef.current[1] = el)}
        className="target-cursor-corner corner-tr"
        style={{ borderColor: cursorColor }}
      />

      <div
        ref={(el) => (cornersRef.current[2] = el)}
        className="target-cursor-corner corner-br"
        style={{ borderColor: cursorColor }}
      />

      <div
        ref={(el) => (cornersRef.current[3] = el)}
        className="target-cursor-corner corner-bl"
        style={{ borderColor: cursorColor }}
      />
    </div>
  );
};

export default TargetCursor;

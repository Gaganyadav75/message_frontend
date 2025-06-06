import React, { useCallback, useEffect, useRef, useState } from "react";

interface FloatingBoxProps {
  anchorId: string;
  children: React.ReactNode;
  offsetX?: number;
  offsetY?: number;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({
  anchorId,
  children,
  offsetX = 0,
  offsetY = 0,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, visible: false });

  const updatePosition = useCallback(() => {
    const anchor = document.getElementById(anchorId);
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY + offsetY,
        left: rect.left + window.scrollX + offsetX,
        visible: true,
      });
    } else {
      setPosition((prev) => ({ ...prev, visible: false }));
    }
  },[anchorId,offsetX,offsetY])

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [anchorId, offsetX, offsetY,updatePosition]);

  return position.visible ? (
    <div
      ref={boxRef}
      className="absolute bg-white shadow-lg border rounded p-4 z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>
  ) : null;
};

export default FloatingBox;

import React from "react";

interface FlyingAnimalProps {
  animal: string; // emoji or SVG
  show: boolean;
}

export const FlyingAnimal: React.FC<FlyingAnimalProps> = ({ animal, show }) => {
  if (!show) return null;

  return (
    <div
      className="flying-animal"
      style={{
        position: "fixed",
        top: "50%",
        left: 0,
        width: "100vw",
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center"
      }}
    >
      <span style={{ fontSize: "4rem", filter: "drop-shadow(2px 4px 6px #0002)" }}>{animal}</span>
    </div>
  );
}; 
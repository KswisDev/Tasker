import React from "react";

interface CelebrationOverlayProps {
  show: boolean;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      className="fixed-top d-flex justify-content-center align-items-center celebration-fade-in"
      style={{ height: "100vh", pointerEvents: "none" }}
    >
      <div className="display-3 text-warning fw-bold animate__animated animate__bounce">
        🎉 Done!
      </div>
    </div>
  );
}; 
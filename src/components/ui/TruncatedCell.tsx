// Create this file at: @/components/ui/TruncatedCell.tsx

import React, { useState, useRef, useEffect } from "react";

interface TruncatedCellProps {
  text: string | number;
  maxLength?: number;
  className?: string;
}

const TruncatedCell: React.FC<TruncatedCellProps> = ({
  text,
  maxLength = 50,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cellRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const textStr = String(text);
  const isTruncated = textStr.length > maxLength;
  const displayText = isTruncated
    ? `${textStr.substring(0, maxLength)}...`
    : textStr;

  useEffect(() => {
    if (showTooltip && cellRef.current && tooltipRef.current) {
      const cellRect = cellRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = cellRect.bottom + 8;
      let left = cellRect.left;

      // Adjust if tooltip goes beyond right edge
      if (left + tooltipRect.width > viewportWidth - 16) {
        left = viewportWidth - tooltipRect.width - 16;
      }

      // Adjust if tooltip goes beyond bottom edge
      if (top + tooltipRect.height > viewportHeight - 16) {
        top = cellRect.top - tooltipRect.height - 8;
      }

      setTooltipPosition({ top, left });
    }
  }, [showTooltip]);

  if (!isTruncated) {
    return <span className={className}>{textStr}</span>;
  }

  return (
    <>
      <div
        ref={cellRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-block cursor-help ${className}`}
      >
        {displayText}
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] max-w-md rounded-lg shadow-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-3"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="text-sm text-slate-900 dark:text-slate-100 break-words whitespace-pre-wrap">
            {textStr}
          </div>
        </div>
      )}
    </>
  );
};

export default TruncatedCell;

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const CollapsibleList = ({
  title = "On Examinations",
  items = ["One", "One"],
  badge = "1",
  defaultCollapsed = false,
  className = "",
  titleClassName = "",
  itemClassName = "",
  badgeClassName = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`w-full mx-auto bg-card dark:bg-[#54555F] rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-border justify-between p-4 cursor-pointer  transition-colors ${titleClassName}`}
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-3">
          <span className=" font-semibold text-lg">{title}</span>
          {badge && (
            <span
              className={`bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center ${badgeClassName}`}
            >
              {badge}
            </span>
          )}
        </div>

        <button
          className="text-white bg-primary hover:text-white transition-colors p-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
        >
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? "max-h-0" : "max-h-96"
        }`}
      >
        <div className="space-y-1 mt-2 pb-2 border-b border-border">
          {items.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-3 bg-background dark:bg-card  mx-2 rounded  transition-colors cursor-pointer ${itemClassName}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleList;

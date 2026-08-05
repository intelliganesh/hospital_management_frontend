import React from "react";
import { Link } from "react-router-dom";
import View from "../view";
import Text from "../text";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active }) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? "bg-primary-50 text-primary-600 font-medium" 
          : "text-text-light hover:bg-neutral-100"
      }`}
    >
      <View className="text-current">{icon}</View>
      <Text as="span">{label}</Text>
    </Link>
  );
};

export default SidebarItem;
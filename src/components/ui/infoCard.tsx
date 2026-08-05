import React from "react";
import Text from "../text";
import View from "../view";

interface InfoCardProps {
  label: string;
  value: string | React.ReactNode;
  subValue?: string;
  icon?: React.ReactNode;
  isLink?: boolean;
  className?: string;
  style?: React.CSSProperties;
  titleStyle?: string;
  valueStyle?: string;
  subValueStyle?: string;
  iconStyle?: string;
  onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  subValue = "",
  icon,
  isLink = false,
  className,
  style,
  titleStyle,
  valueStyle,
  subValueStyle,
  iconStyle,
  onClick,
}: InfoCardProps) => (
  <View
    className={`bg-white dark:bg-slate-800 rounded-lg p-4 shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 relative hover:shadow-medium transition-all duration-200 ${className}`}
    style={style}
    onClick={onClick}
  >
    <View className="flex items-center justify-between mb-2">
      <Text
        as="h3"
        className={`text-xs font-medium text-slate-600 dark:text-slate-400 ${
          titleStyle ? titleStyle : ""
        }`}
      >
        {label}
      </Text>
      {icon && (
        <View
          className={`p-2 rounded-lg bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 dark:from-primary-800/40 dark:via-primary-700/40 dark:to-primary-600/40 shadow-lg shadow-primary-500/25 dark:shadow-primary-400/20 ${
            iconStyle ? iconStyle : ""
          }`}
        >
          {icon}
        </View>
      )}
    </View>
    <Text
      weight="font-bold"
      className={`font-bold text-slate-900 dark:text-white mb-1 ${
        isLink ? "text-primary cursor-pointer hover:underline" : ""
      } ${valueStyle ? valueStyle : ""}`}
    >
      {value}
    </Text>
    {subValue && (
      <Text
        className={`text-sm text-slate-500 dark:text-slate-400 ${
          subValueStyle ? subValueStyle : ""
        }`}
      >
        {subValue}
      </Text>
    )}
  </View>
);

export default InfoCard;

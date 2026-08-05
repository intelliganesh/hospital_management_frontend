import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  titleFontWeight?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
  titleClassName = "",
  titleFontWeight = "font-bold",
}) => (
  <Card
    className={`p-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mb-6 bg-white dark:bg-slate-900 ${className}`}
  >
    <View className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
      <View className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-md">
        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      </View>
      <Text
        as="h3"
        weight={titleFontWeight}
        className={` text-sm uppercase text-slate-800 dark:text-slate-100 tracking-wide ${titleClassName}`}
      >
        {title}
      </Text>
    </View>
    <View className="p-5">{children}</View>
  </Card>
);

export default FormSection;

import View from "./view";
import Text from "./text";
import { FileX } from "lucide-react";

interface DataNotFoundProps {
  message?: string;
}

const DataNotFound: React.FC<{}> = ({
  message = "No Data Found!",
}: DataNotFoundProps) => {
  return (
    <View className="flex items-center justify-center min-h-64 p-8">
      <View className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* Icon container with subtle animation */}
        <View className="relative">
          <View className="absolute inset-0 bg-background rounded-full blur-xl opacity-50"></View>
          <View className="relative bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-full border border-primary-200 shadow-sm">
            <FileX size={48} className="text-primary stroke-[1.5]" />
          </View>
        </View>

        {/* Main message */}
        <View className="space-y-2">
          <Text as="h3" className="text-gray-800 text-xl font-semibold">
            {message}
          </Text>
          <Text
            as="p"
            className="text-muted-foreground text-sm leading-relaxed"
          >
            We couldn't find any data to display. Try adjusting your filters or
            check back later.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DataNotFound;

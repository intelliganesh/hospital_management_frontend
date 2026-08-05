import Text from "./text";
import View from "./view";

const OffLine: React.FC<{}> = () => {
  return (
    <View className="flex items-center justify-center h-screen bg-white">
      <View className="flex flex-col items-center gap-4">
        <View className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin">
          {null}
        </View>
        <Text as="p" className="text-gray-600 text-lg font-medium">
          Check your internet connection
        </Text>
      </View>
    </View>
  );
};

export default OffLine;

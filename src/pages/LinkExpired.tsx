import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import Button from "@/components/button";
import { LOGIN_URL } from "@/utils/urls/frontend";
import View from "@/components/view";
import Text from "@/components/text";

const ExpiredLink:React.FC<{}> = () => {
  return (
    <View className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
      <View className="bg-white rounded-lg shadow-card w-full max-w-md p-8 text-center">
        <View className="flex justify-center mb-6">
          <Clock className="h-16 w-16 text-primary" />
        </View>
        
        <Text as="h1" className="text-2xl font-bold text-text-DEFAULT mb-3">Link Expired</Text>
        <Text as="p" className="text-text-light mb-6">
          The link you're trying to access has expired or is no longer valid.
        </Text>
        
        <View className="space-y-4">
          <Link to={LOGIN_URL}>
            <Button className="w-full" variant="primary">
              Return to Login
            </Button>
          </Link>
          
        </View>
      </View>

      {/* Footer */}
      <View className="mt-8 text-center text-text-lighter text-sm">
        © {new Date().getFullYear()} MedCare Hospital Management System. All rights reserved.
      </View>
    </View>
  );
};

export default ExpiredLink;

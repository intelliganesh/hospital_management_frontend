// import React from "react";
import { useEffect } from "react";
import Button from "@/components/button";
import { FIRST_PAGE_URL } from "@/utils/urls/frontend";
import { useLocation, useNavigate } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <View className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-background p-4">
      <View className="max-w-md w-full text-center bg-card rounded-lg shadow-card p-8">
        <View className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </View>
        <Text as="h1" className="text-3xl font-bold text-text-DEFAULT mb-2 dark:text-white">404</Text>
        <Text as="p" className="text-lg text-text-light mb-6 dark:text-gray-400">Oops! The page you're looking for doesn't exist.</Text>
        <Button variant="primary" htmlType="button" onPress={() => {
          navigate(FIRST_PAGE_URL);
        }}>
          Return to Home
        </Button>
      </View>
    </View>
  );
};

export default NotFound;

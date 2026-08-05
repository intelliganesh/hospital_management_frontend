import React from "react";
import { PanelRightClose, Keyboard } from "lucide-react";
import Button from "@/components/button";
import { Link } from "react-router-dom";
import { USER_PROFILE_URL } from "@/utils/urls/backend";
import { useSelector } from "react-redux";
import View from "./view";
import ImageComponent from "./ui/ImageComponent";
import Text from "./text";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  openQuickKeys: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen, openQuickKeys }) => {
  const settingsData = useSelector(
    (state: any) => state.systemSettings.settings
  );

  const { role, name } = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails") as string)
    : null;

  return (
    <header className="h-16 border-b border-border dark:border-none bg-white dark:bg-card text-card-foreground shadow-soft dark:shadow-none transition-all duration-200 backdrop-blur-sm">
      <View className="flex h-full items-center justify-between px-6">
        {/* Left Section - Sidebar Toggle */}
        {!sidebarOpen && (
          <Button
            onClick={toggleSidebar}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-2 transition-all duration-200"
            variant="ghost"
          >
            <PanelRightClose size={20} />
          </Button>
        )}

        {/* Center Section - Search Bar */}
        <View className="hidden md:flex flex-1 max-w-md mx-8">
          {/* <View className="relative w-full">
            <View className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </View>
            <input
              type="search"
              placeholder="Search patients, appointments..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
            />
          </View> */}
        </View>

        {/* Right Section - Notifications & User Menu */}
        <View className="flex items-center gap-3">
          
           {/* Quick Keys Help Button */}
           <Button
            onClick={openQuickKeys}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            variant="ghost"
            title="Keyboard Shortcuts (Shift + ?)"
          >
            <Keyboard size={20} />
          </Button>

          {/* Notifications */}
          {/* <Button
            className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            variant="ghost"
          >
            <Bell size={18} />
            <View className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-slate-800"></View>
          </Button> */}

          {/* User Profile */}
          <Link to={USER_PROFILE_URL} className="flex items-center">
            <Button
              className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
              variant="ghost"
            >
              {settingsData?.profile_image ? (
                <View className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700">
                  <ImageComponent
                    src={
                      import.meta.env.VITE_APP_URL + settingsData?.profile_image
                    }
                    alt="User profile image"
                    className="rounded-full object-cover h-full w-full"
                  />
                </View>
              ) : (
                <View className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700">
                  <Text as="span" className="text-sm font-semibold text-white">
                    {settingsData?.hospital_name?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </Text>
                </View>
              )}

              {/* User Info - Hidden on mobile */}
              <View className="hidden lg:block text-left">
                <Text
                  as="p"
                  className="text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {name || "User"}
                </Text>
                <Text
                  as="p"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  {role || "N/A"}
                </Text>
              </View>
            </Button>
          </Link>
        </View>
      </View>
    </header>
  );
};

export default Header;

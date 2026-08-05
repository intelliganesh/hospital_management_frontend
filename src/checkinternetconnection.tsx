import App from "@/App";
import { useDispatch, useSelector } from "react-redux";
import OffLine from "@/components/offline";
import { RootState } from "./actions/store";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSystemSettings } from "@/actions/calls/systemSettings";
import { getLoginUserDetails } from "./actions/slices/auth";

const CheckInternetConnection: React.FC<{}> = () => {
  const { getSystemSettings } = useSystemSettings();
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const token = useSelector(
    (state: RootState) => state.authentication.tokenStatus
  );

  /* *
   *  useEffect used to check internet online and offline status.
   *
   *  */
  useEffect(() => {
    const syncOnlineStatus = (status: boolean) => {
      setIsOnline(status);
    };

    window.addEventListener("online", () => syncOnlineStatus(true));
    window.addEventListener("offline", () => syncOnlineStatus(false));
    return () => {
      window.removeEventListener("online", () => syncOnlineStatus(true));
      window.removeEventListener("offline", () => syncOnlineStatus(false));
    };
  }, []);

  // Load system settings when the app starts
  useEffect(() => {
    if (isOnline && token) {
      // const colorData = localStorage.getItem("colors")
      //   ? JSON.parse(localStorage.getItem("colors") as string)
      //   : null;
      getSystemSettings();
      dispatch(getLoginUserDetails());
    }
  }, [isOnline, token]);

  return (
    <>
      {isOnline ? (
        <BrowserRouter future={{ v7_startTransition: true }}>
          <App />
        </BrowserRouter>
      ) : (
        <OffLine />
      )}
    </>
  );
};
export default CheckInternetConnection;

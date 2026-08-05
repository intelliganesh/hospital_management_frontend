import Loading from "./pages/Loading";
import { RootState } from "./actions/store";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import React, { lazy, Suspense, useEffect } from "react";
import { getTokenStatusSlice } from "./actions/slices/auth";
import { ColorProvider } from "./contexts/ColorContext";

const WithLogin = lazy(() => import("./WithLogin"));
const WithoutLogin = lazy(() => import("./WithoutLogin"));

function App() {
  const colors = localStorage.getItem("colors") ? JSON.parse(localStorage.getItem("colors") as string) : null;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTokenStatusSlice());
  }, []);

  const token = useSelector(
    (state: RootState) => state.authentication.tokenStatus
  );
  const systemSettingsObj = useSelector(
    (state: RootState) => state.systemSettings.settings
  );

  // if (loading) return <Loading />;

  const AuthPages = {
    withLoginRoutes: (
      <ColorProvider>
        <ThemeProvider>
          <WithLogin />
        </ThemeProvider>
      </ColorProvider>
    ),
    withOutLoginRoutes: <WithoutLogin />,
  };

  return (
    <React.Fragment>
      <Suspense fallback={<Loading color={colors ? colors?.primary_color : systemSettingsObj?.primary_color} />}>
        {AuthPages[token ? "withLoginRoutes" : "withOutLoginRoutes"]}
      </Suspense>
      <Toaster />
    </React.Fragment>
  );
}

export default App;

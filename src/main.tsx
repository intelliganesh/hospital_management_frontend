import { StrictMode } from "react";
// import "@/utils/style/styleconfig.css";
import { createRoot } from "react-dom/client";
import CheckInternetConnection from "@/checkinternetconnection.tsx";
import "./input.css";
// import "@/utils/style/theme.css";
import { Provider } from "react-redux";
import { store } from "./actions/store";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store} >
       <CheckInternetConnection />
    </Provider>
  </StrictMode>
);

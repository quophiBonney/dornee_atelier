import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/parallax";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

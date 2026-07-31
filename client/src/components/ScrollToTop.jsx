import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // Resets scroll to top
  }, [pathname]); // Runs on path change
  return null;
}

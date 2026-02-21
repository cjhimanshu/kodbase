import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately jump to top on route change but offset by the navbar height
    // so content is not hidden behind a fixed header.
    const nav = document.querySelector("nav");
    const offset = nav && nav.offsetHeight ? nav.offsetHeight : 0;
    // Scroll to just below the navbar. Use 'auto' for immediate jump.
    window.scrollTo({ top: offset, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteEffects from "./components/RouteEffects";
import { usePageMeta } from "./hooks/usePageMeta";
import Home from "./pages/Home";
import WorkLanding from "./pages/WorkLanding";
import WorkCaseStudy from "./pages/WorkCaseStudy";
import Approach from "./pages/Approach";
import About from "./pages/About";
import InsightsLanding from "./pages/InsightsLanding";
import InsightsArticle from "./pages/InsightsArticle";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();
  usePageMeta();

  return (
    <SmoothScroll>
      <Navbar />
      <RouteEffects />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<WorkLanding />} />
            <Route path="/work/:slug" element={<WorkCaseStudy />} />
            <Route path="/approach" element={<Approach />} />
            <Route path="/about" element={<About />} />
            <Route path="/insights" element={<InsightsLanding />} />
            <Route path="/insights/:slug" element={<InsightsArticle />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </SmoothScroll>
  );
}

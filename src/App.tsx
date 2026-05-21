import { useRef, useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { Navbar } from "./app/components/layout/Navbar";
import { Hero } from "./app/pages/Hero";
import { AboutSection } from "./app/pages/AboutSection";
import { GameSelector } from "./app/pages/GameSelector";
import { Products } from "./app/pages/Products";
import { Stats } from "./app/pages/Stats";
import { Reviews } from "./app/pages/Reviews";
import { Footer } from "./app/components/layout/Footer";
import { Login } from "./app/pages/login";
import { Register } from "./app/pages/register";
import { ProductPage } from "./app/pages/ProductPage";
import { CartPage } from "./app/pages/CartPage";
import { ReviewsPage } from "./app/pages/ReviewsPage";
import { FaqPage } from "./app/pages/FaqPage";
import { ContactsPage } from "./app/pages/ContactsPage";
import Dashboard from "./app/pages/DashBoard";
import { useAuth } from "./app/context/AuthContext";
import { useCart } from "./app/context/CartContext";

function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { totalCount } = useCart();
  const location = useLocation();

  const gameSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);

  const handleSelectGame = useCallback((gameId: string) => {
    setSelectedGame(gameId);
    setTimeout(() => {
      productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const handleCTA = useCallback(() => {
    gameSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleLearnMore = useCallback(() => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gameId = params.get("game");

    if (gameId) {
      setSelectedGame((current) => (current === gameId ? current : gameId));
    }

    if (location.hash === "#catalog") {
      requestAnimationFrame(() => {
        productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    if (location.hash === "#about") {
      requestAnimationFrame(() => {
        aboutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash, location.search]);

  return (
    <div
      style={{
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#08080E",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar onSelectGame={handleSelectGame} cartCount={totalCount} />
      <Hero onCTA={handleCTA} onLearnMore={handleLearnMore} />
      <div ref={aboutSectionRef as React.RefObject<HTMLDivElement>}>
        <AboutSection />
      </div>
      <Stats />
      <GameSelector ref={gameSectionRef} selectedGame={selectedGame} onSelect={handleSelectGame} />
      <Products ref={productsSectionRef} selectedGame={selectedGame} />
      <Reviews />
      <Footer />
    </div>
  );
}

function DashboardRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
    </Routes>
  );
}

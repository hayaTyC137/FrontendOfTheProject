import { useRef, useState, useCallback } from "react";
import { Routes, Route } from "react-router";
import { Navbar } from "./app/components/layout/Navbar";
import { Hero } from "./app/pages/Hero";
import { GameSelector } from "./app/pages/GameSelector";
import { Products } from "./app/pages/Products";
import { Stats } from "./app/pages/Stats";
import { Reviews } from "./app/pages/Reviews";
import { Footer } from "./app/components/layout/Footer";
import { Login } from "./app/pages/login";
import { Register } from "./app/pages/register";
import { ProductPage } from "./app/pages/ProductPage";

function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const gameSectionRef = useRef<HTMLElement>(null);
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

  const handleAddToCart = useCallback(() => {
    setCartCount((c) => c + 1);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#08080E",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar onSelectGame={handleSelectGame} cartCount={cartCount} />
      <Hero onCTA={handleCTA} />
      <Stats />
      <GameSelector ref={gameSectionRef} selectedGame={selectedGame} onSelect={handleSelectGame} />
      <Products ref={productsSectionRef} selectedGame={selectedGame} onAddToCart={handleAddToCart} />
      <Reviews />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}
import { useRef, useState, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { GameSelector } from "./components/GameSelector";
import { Products } from "./components/Products";
import { Stats } from "./components/Stats";
import { Reviews } from "./components/Reviews";
import { Footer } from "./components/Footer";

export default function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const gameSectionRef = useRef<HTMLElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);

  const handleSelectGame = useCallback((gameId: string) => {
    setSelectedGame(gameId);
    // Scroll to products
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
      <Navbar
        onSelectGame={handleSelectGame}
        cartCount={cartCount}
      />

      <Hero onCTA={handleCTA} />

      <Stats />

      <GameSelector
        ref={gameSectionRef}
        selectedGame={selectedGame}
        onSelect={handleSelectGame}
      />

      <Products
        ref={productsSectionRef}
        selectedGame={selectedGame}
        onAddToCart={handleAddToCart}
      />

      <Reviews />

      <Footer />
    </div>
  );
}

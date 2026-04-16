import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, User, ChevronDown, Zap, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const games = [
  { id: "valorant", name: "Valorant", color: "#FF8A8A", currency: "Valorant Points" },
  { id: "clashroyale", name: "Clash Royale", color: "#7ABAFF", currency: "Gems" },
  { id: "fortnite", name: "Fortnite", color: "#B47AFF", currency: "V-Bucks" },
  { id: "apex", name: "Apex Legends", color: "#FFB07A", currency: "Apex Coins" },
];

interface NavbarProps {
  onSelectGame: (gameId: string) => void;
  cartCount: number;
}

export function Navbar({ onSelectGame, cartCount }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  const filteredGames = searchQuery.trim()
    ? games.filter((game) => {
        const query = searchQuery.toLowerCase();
        return (
          game.name.toLowerCase().includes(query) ||
          game.currency.toLowerCase().includes(query)
        );
      })
    : [];

  function handleSearchSelect(gameId: string) {
    onSelectGame(gameId);
    setSearchQuery("");
    setSearchFocused(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleProfileAction() {
    setProfileMenuOpen(false);
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    navigate("/login");
  }

  function handleLogoutAction() {
    setProfileMenuOpen(false);
    signOut();
    navigate("/");
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
      style={{
        background: "rgba(8, 8, 14, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 cursor-pointer select-none"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 100%)",
            boxShadow: "0 0 16px rgba(180, 122, 255, 0.4)",
          }}
        >
          <Zap size={16} className="text-white" />
        </div>
        <span
          className="text-white select-none"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em" }}
        >
          EgorkaCoins
        </span>
      </motion.div>

      {/* Center nav */}
      <div className="hidden md:flex items-center gap-6">
        {["Главная", "Каталог", "FAQ", "Контакты"].map((item) => (
          <motion.a
            key={item}
            href="#"
            className="text-sm text-white/50 hover:text-white/90 transition-colors"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {item}
          </motion.a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Product search */}
        <div className="relative hidden lg:block">
          <motion.div
            className="relative"
            animate={{
              boxShadow: searchFocused
                ? "0 0 0 1px rgba(180,122,255,0.45), 0 0 18px rgba(180,122,255,0.2)"
                : "0 0 0 1px rgba(255,255,255,0.1)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.07)",
            }}
          >
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 140)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredGames.length > 0) {
                  handleSearchSelect(filteredGames[0].id);
                }
              }}
              placeholder="Поиск игр"
              className="w-52 pl-9 pr-3 py-2 rounded-xl bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
              }}
            />
          </motion.div>

          <AnimatePresence>
            {searchFocused && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(14, 14, 22, 0.98)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <motion.button
                      key={`search-${game.id}`}
                      onClick={() => handleSearchSelect(game.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                      style={{ fontFamily: "Inter, sans-serif" }}
                      whileHover={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: game.color, boxShadow: `0 0 8px ${game.color}` }}
                      />
                      <div>
                        <div className="text-white text-sm" style={{ fontWeight: 600 }}>{game.name}</div>
                        <div className="text-white/40 text-xs">{game.currency}</div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div
                    className="px-4 py-3 text-sm text-white/40"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Ничего не найдено
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white transition-all"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              background: dropdownOpen
                ? "rgba(180,122,255,0.18)"
                : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            whileHover={{ scale: 1.03, background: "rgba(180,122,255,0.15)" }}
            whileTap={{ scale: 0.97 }}
          >
            Выбрать игру
            <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(14, 14, 22, 0.98)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {games.map((game) => (
                  <motion.button
                    key={game.id}
                    onClick={() => {
                      onSelectGame(game.id);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    whileHover={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: game.color, boxShadow: `0 0 8px ${game.color}` }}
                    />
                    <div>
                      <div className="text-white text-sm" style={{ fontWeight: 600 }}>{game.name}</div>
                      <div className="text-white/40 text-xs">{game.currency}</div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart */}
        <motion.button
          onClick={() => navigate("/cart")}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ background: "#FF8A8A", fontSize: "10px", fontWeight: 700 }}
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>

        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          <motion.button
            onClick={() => setProfileMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
          >
            <User size={18} />
          </motion.button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(14, 14, 22, 0.98)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleProfileAction}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:text-white"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      Профиль
                    </button>
                    <button
                      onClick={handleLogoutAction}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-white"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:text-white"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      Войти
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/register");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-white"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      Регистрация
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

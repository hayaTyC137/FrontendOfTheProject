import { type ReactNode, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface StaticPageLayoutProps {
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function StaticPageLayout({
  badge,
  title,
  description,
  children,
}: StaticPageLayoutProps) {
  const navigate = useNavigate();
  const { totalCount } = useCart();

  const handleSelectGame = useCallback(
    (gameId: string) => {
      navigate({
        pathname: "/",
        search: `?game=${encodeURIComponent(gameId)}`,
        hash: "#catalog",
      });
    },
    [navigate],
  );

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

      <main className="relative overflow-hidden px-6 pb-20 pt-32">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full opacity-18"
            style={{
              background: "radial-gradient(circle, rgba(180,122,255,0.28) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute right-[10%] top-[18%] h-[320px] w-[320px] rounded-full opacity-12"
            style={{
              background: "radial-gradient(circle, rgba(255,138,138,0.28) 0%, transparent 72%)",
              filter: "blur(70px)",
            }}
          />
          <div
            className="absolute left-[12%] top-[28%] h-[280px] w-[280px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(122,186,255,0.26) 0%, transparent 72%)",
              filter: "blur(70px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-[32px] p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(180,122,255,0.08) 48%, rgba(255,138,138,0.06) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
            }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-white/60"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontWeight: 600,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: "#B47AFF", boxShadow: "0 0 10px #B47AFF" }}
              />
              {badge}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div>
                <h1
                  className="max-w-3xl text-white"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(2.1rem, 5vw, 4rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {title}
                </h1>
                <p
                  className="mt-5 max-w-2xl text-white/52"
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.75,
                  }}
                >
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <motion.button
                  type="button"
                  onClick={() => navigate({ pathname: "/", hash: "#catalog" })}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm text-white"
                  style={{
                    background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                    boxShadow: "0 0 26px rgba(180,122,255,0.26)",
                    fontWeight: 700,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  К каталогу
                  <ArrowRight size={15} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm text-white/75"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    fontWeight: 600,
                  }}
                  whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Home size={15} />
                  На главную
                </motion.button>
              </div>
            </div>
          </motion.section>

          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

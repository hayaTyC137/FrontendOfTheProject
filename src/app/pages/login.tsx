import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Mail, Lock, Zap, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onNavigateRegister?: () => void;
}

export function Login({ onNavigateRegister }: LoginProps) {
  const navigate = useNavigate();
  const goToRegister = onNavigateRegister ?? (() => navigate("/register"));
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ background: "#08080E", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #B47AFF 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FF8A8A 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7ABAFF 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 100%)",
              boxShadow: "0 0 24px rgba(180, 122, 255, 0.5)",
            }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <span
            className="text-white"
            style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em" }}
          >
            EgorkaCoins
          </span>
        </div>

        {/* Title */}
        <div className="mb-7 text-center">
          <h1
            className="text-white mb-1.5"
            style={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em" }}
          >
            Добро пожаловать
          </h1>
          <p className="text-white/40" style={{ fontWeight: 400, fontSize: "0.9rem" }}>
            Войдите в свой аккаунт
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Email */}
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
              style={{ color: emailFocused ? "#B47AFF" : "rgba(255,255,255,0.3)" }}
            />
            <input
              type="text"
              placeholder="Email или никнейм"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: emailFocused
                  ? "1px solid rgba(180,122,255,0.6)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: emailFocused ? "0 0 0 3px rgba(180,122,255,0.1)" : "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
              style={{ color: passwordFocused ? "#B47AFF" : "rgba(255,255,255,0.3)" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full pl-10 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: passwordFocused
                  ? "1px solid rgba(180,122,255,0.6)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: passwordFocused ? "0 0 0 3px rgba(180,122,255,0.1)" : "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.3)" }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end mb-6">
          <button
            className="text-xs transition-colors duration-200 hover:text-white/70"
            style={{ color: "rgba(180,122,255,0.7)", fontWeight: 500 }}
          >
            Забыли пароль?
          </button>
        </div>

        {/* Submit */}
        <motion.button
          className="w-full py-3.5 rounded-xl text-white text-sm mb-5"
          style={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
            boxShadow: "0 0 28px rgba(180,122,255,0.35), 0 4px 20px rgba(0,0,0,0.3)",
            fontFamily: "Inter, sans-serif",
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 40px rgba(180,122,255,0.55), 0 4px 24px rgba(0,0,0,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Войти
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
            или
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3 mb-7">
          {/* Google */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-white/70 text-sm transition-colors duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
            whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.07)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </motion.button>

          {/* Discord */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-white/70 text-sm transition-colors duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
            whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.07)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.033.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </motion.button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Нет аккаунта?{" "}
          <button
            onClick={goToRegister}
            className="transition-colors duration-200 hover:text-white/80"
            style={{ color: "rgba(180,122,255,0.85)", fontWeight: 600 }}
          >
            Зарегистрироваться
          </button>
        </p>
      </motion.div>
    </div>
  );
}
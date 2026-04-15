import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Mail, Lock, User, Zap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface RegisterProps {
  onNavigateLogin?: () => void;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "#FF8A8A" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Слабый", color: "#FF8A8A" };
  if (score <= 2) return { score, label: "Средний", color: "#FFB07A" };
  if (score <= 3) return { score, label: "Хороший", color: "#7ABAFF" };
  return { score, label: "Надёжный", color: "#7AFF9B" };
}

export function Register({ onNavigateLogin }: RegisterProps) {
  const navigate = useNavigate();
  const goToLogin = onNavigateLogin ?? (() => navigate("/login"));
  const { signUp, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const [nickFocused, setNickFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!agreed) {
      setError("Подтвердите согласие с условиями использования");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    const result = signUp({ username: nickname, email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError("");
    navigate("/dashboard");
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden"
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
          style={{ background: "radial-gradient(circle, #FFB07A 0%, transparent 70%)", filter: "blur(80px)" }}
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
          <span className="text-white" style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
            EgorkaCoins
          </span>
        </div>

        {/* Title */}
        <div className="mb-7 text-center">
          <h1 className="text-white mb-1.5" style={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em" }}>
            Создать аккаунт
          </h1>
          <p className="text-white/40" style={{ fontWeight: 400, fontSize: "0.9rem" }}>
            Присоединяйтесь к тысячам игроков
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Fields */}
          <div className="flex flex-col gap-3 mb-4">
          {/* Nickname */}
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
              style={{ color: nickFocused ? "#B47AFF" : "rgba(255,255,255,0.3)" }}
            />
            <input
              type="text"
              placeholder="Никнейм"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={() => setNickFocused(true)}
              onBlur={() => setNickFocused(false)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: nickFocused ? "1px solid rgba(180,122,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: nickFocused ? "0 0 0 3px rgba(180,122,255,0.1)" : "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
              style={{ color: emailFocused ? "#B47AFF" : "rgba(255,255,255,0.3)" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: emailFocused ? "1px solid rgba(180,122,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: emailFocused ? "0 0 0 3px rgba(180,122,255,0.1)" : "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
                style={{ color: passwordFocused ? "#B47AFF" : "rgba(255,255,255,0.3)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full pl-10 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: passwordFocused ? "1px solid rgba(180,122,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
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

            {/* Strength bar */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 px-0.5"
              >
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-0.5 rounded-full transition-all duration-300"
                      style={{
                        background:
                          i <= strength.score
                            ? `linear-gradient(90deg, #FF8A8A, ${strength.color})`
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs" style={{ color: strength.color, fontWeight: 500 }}>
                  {strength.label}
                </span>
              </motion.div>
            )}
          </div>

          {/* Confirm password */}
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
              style={{ color: confirmFocused ? "#B47AFF" : "rgba(255,255,255,0.3)" }}
            />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Подтверждение пароля"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              className="w-full pl-10 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: confirmFocused ? "1px solid rgba(180,122,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: confirmFocused ? "0 0 0 3px rgba(180,122,255,0.1)" : "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.3)" }}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 mb-6">
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            className="flex-shrink-0 mt-0.5 w-4.5 h-4.5 rounded flex items-center justify-center transition-all duration-200"
            style={{
              width: 18,
              height: 18,
              background: agreed ? "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)" : "rgba(255,255,255,0.06)",
              border: agreed ? "none" : "1px solid rgba(255,255,255,0.15)",
              boxShadow: agreed ? "0 0 12px rgba(180,122,255,0.4)" : "none",
            }}
          >
            {agreed && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <span className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
            Принимаю{" "}
            <button className="transition-colors duration-200 hover:text-white/70" style={{ color: "rgba(180,122,255,0.8)", fontWeight: 500 }}>
              условия использования
            </button>{" "}
            и{" "}
            <button className="transition-colors duration-200 hover:text-white/70" style={{ color: "rgba(180,122,255,0.8)", fontWeight: 500 }}>
              политику конфиденциальности
            </button>
          </span>
          </div>

          {error && (
            <p className="text-sm mb-4" style={{ color: "#FF8A8A", fontWeight: 500 }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white text-sm mb-5"
            style={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
              boxShadow: "0 0 28px rgba(180,122,255,0.35), 0 4px 20px rgba(0,0,0,0.3)",
              fontFamily: "Inter, sans-serif",
              opacity: agreed ? 1 : 0.5,
              cursor: agreed ? "pointer" : "not-allowed",
            }}
            whileHover={agreed ? {
              scale: 1.02,
              boxShadow: "0 0 40px rgba(180,122,255,0.55), 0 4px 24px rgba(0,0,0,0.4)",
            } : {}}
            whileTap={agreed ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Зарегистрироваться
          </motion.button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Уже есть аккаунт?{" "}
          <button
            onClick={goToLogin}
            className="transition-colors duration-200 hover:text-white/80"
            style={{ color: "rgba(180,122,255,0.85)", fontWeight: 600 }}
          >
            Войти
          </button>
        </p>
      </motion.div>
    </div>
  );
}
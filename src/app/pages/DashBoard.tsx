import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Shield,
  Crown,
  Zap,
  ChevronRight,
  Copy,
  Check,
  Bell,
  Star,
  TrendingUp,
  Clock,
  Package,
  CreditCard,
  Lock,
  Mail,
  Edit3,
  Eye,
  EyeOff,
  AlertTriangle,
  BarChart2,
  Users,
  Trash2,
  Ban,
} from "lucide-react";
import { useAuth, type AuthUser, type Role } from "../context/AuthContext";
import { useUserOrders } from "../hooks/useUserOrders.ts";
import type { OrderRecord } from "../services/ordersStorage.ts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: Role;
  balance: number;
  totalSpent: number;
  ordersCount: number;
  joinedAt: string;
  level: number;
  xp: number;
  xpToNext: number;
  verified: boolean;
}

type Order = {
  id: string;
  game: string;
  gameColor: string;
  item: string;
  amount: string;
  price: number;
  status: "completed" | "pending" | "failed";
  date: string;
};

const adminUsers = [
  { id: "usr_8271", username: "Egorka_Pro", role: "user", email: "egorka@gmail.com", orders: 14, spent: 342.87, status: "active" },
  { id: "usr_5512", username: "Dragon_777", role: "moderator", email: "dragon@mail.ru", orders: 8, spent: 180.0, status: "active" },
  { id: "usr_3349", username: "NightWolf", role: "user", email: "wolf@yandex.ru", orders: 3, spent: 59.97, status: "banned" },
  { id: "usr_1187", username: "StarCraft99", role: "user", email: "star@gmail.com", orders: 22, spent: 719.5, status: "active" },
];

// ─── Role config ──────────────────────────────────────────────────────────────

const roleConfig: Record<Role, { label: string; color: string; bg: string; icon: typeof User }> = {
  user: { label: "Пользователь", color: "#7ABAFF", bg: "rgba(122,186,255,0.12)", icon: User },
  moderator: { label: "Модератор", color: "#B47AFF", bg: "rgba(180,122,255,0.12)", icon: Shield },
  admin: { label: "Администратор", color: "#FFB07A", bg: "rgba(255,176,122,0.12)", icon: Crown },
};

const statusConfig = {
  completed: { label: "Выполнен", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  pending: { label: "В обработке", color: "#FFB07A", bg: "rgba(255,176,122,0.1)" },
  failed: { label: "Ошибка", color: "#FF8A8A", bg: "rgba(255,138,138,0.1)" },
};

// ─── Background Glows ─────────────────────────────────────────────────────────

function BgGlows() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle, #B47AFF 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #7ABAFF 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #FF8A8A 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems: { id: string; label: string; icon: typeof User; roles: Role[] }[] = [
  { id: "overview", label: "Обзор", icon: BarChart2, roles: ["user", "moderator", "admin"] },
  { id: "orders", label: "Мои заказы", icon: ShoppingBag, roles: ["user", "moderator", "admin"] },
  { id: "settings", label: "Настройки", icon: Settings, roles: ["user", "moderator", "admin"] },
  { id: "moderation", label: "Модерация", icon: Shield, roles: ["moderator", "admin"] },
  { id: "admin", label: "Панель Админа", icon: Crown, roles: ["admin"] },
];

function Sidebar({
  user,
  activeTab,
  setActiveTab,
  onLogout,
}: {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (t: string) => void;
  onLogout: () => void;
}) {
  const rc = roleConfig[user.role];
  const RoleIcon = rc.icon;

  const xpPercent = Math.round((user.xp / user.xpToNext) * 100);
  const visibleItems = navItems.filter((n) => n.roles.includes(user.role));

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1.25rem",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Avatar block */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold select-none"
              style={{
                background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                boxShadow: "0 0 24px rgba(180,122,255,0.35)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {user.username[0]}
            </div>
            {user.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#4ade80", border: "2px solid #08080E" }}
              >
                <Check size={10} className="text-black" strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-white text-sm truncate"
              style={{ fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
            >
              {user.username}
            </p>
            <p className="text-white/40 text-xs truncate mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
              {user.email}
            </p>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md text-xs"
              style={{ background: rc.bg, color: rc.color, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
            >
              <RoleIcon size={10} />
              {rc.label}
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Уровень {user.level}
            </span>
            <span className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              {user.xp} / {user.xpToNext} XP
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #B47AFF 0%, #FF8A8A 100%)" }}
            />
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="px-6 py-4 border-b border-white/5">
        <div
          className="px-4 py-3 rounded-xl"
          style={{ background: "rgba(180,122,255,0.08)", border: "1px solid rgba(180,122,255,0.15)" }}
        >
          <p className="text-white/40 text-xs mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
            Баланс аккаунта
          </p>
          <p className="text-white text-xl" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
            ${user.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all"
              style={{
                color: isActive ? "white" : "rgba(255,255,255,0.45)",
                background: isActive ? "rgba(180,122,255,0.15)" : "transparent",
                border: isActive ? "1px solid rgba(180,122,255,0.2)" : "1px solid transparent",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                textAlign: "left",
              }}
              whileHover={{ x: 2 }}
            >
              <Icon size={15} style={{ color: isActive ? "#B47AFF" : "rgba(255,255,255,0.3)" }} />
              {item.label}
              {isActive && <ChevronRight size={12} className="ml-auto" style={{ color: "#B47AFF" }} />}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
        >
          <LogOut size={15} />
          Выйти
        </button>
      </div>
    </aside>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function mapOrderRecord(record: OrderRecord): Order {
  return {
    id: record.id,
    game: record.game,
    gameColor: record.gameColor,
    item: record.item,
    amount: record.amount,
    price: record.price,
    status: record.status,
    date: new Date(record.createdAt).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

function OverviewTab({ user, orders }: { user: UserProfile; orders: Order[] }) {
  const [copied, setCopied] = useState(false);

  function copyId() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const stats = [
    { label: "Всего заказов", value: user.ordersCount, icon: ShoppingBag, color: "#7ABAFF" },
    { label: "Потрачено", value: `$${user.totalSpent.toFixed(2)}`, icon: CreditCard, color: "#B47AFF" },
    { label: "Уровень", value: user.level, icon: Star, color: "#FFB07A" },
    { label: "На сайте с", value: user.joinedAt, icon: Clock, color: "#4ade80" },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, rgba(180,122,255,0.12) 0%, rgba(255,138,138,0.06) 100%)",
          border: "1px solid rgba(180,122,255,0.2)",
        }}
      >
        <div
          className="absolute right-0 top-0 w-64 h-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 50%, #B47AFF 0%, transparent 60%)",
            filter: "blur(30px)",
          }}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/50 text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
              Добро пожаловать обратно 👋
            </p>
            <h2
              className="text-white text-2xl mb-1"
              style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.03em" }}
            >
              {user.username}
            </h2>
            <div className="flex items-center gap-2 text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              <span>ID: {user.id}</span>
              <button onClick={copyId} className="hover:text-white/60 transition-colors">
                {copied ? <Check size={12} style={{ color: "#4ade80" }} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 100%)",
              boxShadow: "0 0 24px rgba(180,122,255,0.4)",
            }}
          >
            <Zap size={22} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 + 0.15, duration: 0.35 }}
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${stat.color}18` }}
              >
                <Icon size={15} style={{ color: stat.color }} />
              </div>
              <p
                className="text-white text-xl mb-0.5"
                style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                {stat.value}
              </p>
              <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Последние заказы
          </h3>
          <span className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            {recentOrders.length} из {orders.length}
          </span>
        </div>
        {recentOrders.length > 0 ? (
          recentOrders.map((order, i) => (
            <OrderRow key={order.id} order={order} index={i} />
          ))
        ) : (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Заказов пока нет
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({ order, index }: { order: Order; index: number }) {
  const sc = statusConfig[order.status];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
    >
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0"
        style={{ background: `${order.gameColor}18`, border: `1px solid ${order.gameColor}30` }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Package size={14} style={{ color: order.gameColor }} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
          {order.item}
        </p>
        <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
          {order.game} · {order.date}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
          ${order.price.toFixed(2)}
        </p>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: sc.bg, color: sc.color, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          {sc.label}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ orders }: { orders: Order[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
          История заказов
        </h2>
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{ background: "rgba(180,122,255,0.12)", color: "#B47AFF", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          {orders.length} заказов
        </span>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="grid px-5 py-3 border-b border-white/5 text-white/25 text-xs"
          style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
        >
          <span>Дата</span>
          <span>Товар</span>
          <span>Сумма</span>
          <span>Статус</span>
        </div>
        {orders.length === 0 && (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            У вас пока нет заказов
          </div>
        )}
        {orders.map((order, i) => {
          const sc = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="grid px-5 py-3.5 border-b border-white/[0.03] last:border-0 items-center hover:bg-white/[0.02] transition-colors"
              style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr" }}
            >
              <div>
                <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{order.date}</p>
                <p className="text-white/25 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{order.id}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded-md flex-shrink-0"
                  style={{ background: `${order.gameColor}18`, border: `1px solid ${order.gameColor}30` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: order.gameColor, display: "inline-block" }} />
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{order.item}</p>
                  <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{order.game}</p>
                </div>
              </div>
              <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                ${order.price.toFixed(2)}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full inline-block w-fit"
                style={{ background: sc.bg, color: sc.color, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
              >
                {sc.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ user }: { user: UserProfile }) {
  const [emailFocused, setEmailFocused] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [notifications, setNotifications] = useState({ orders: true, promo: false, security: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
        Настройки
      </h2>

      {/* Profile section */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Профиль
          </h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                boxShadow: "0 0 24px rgba(180,122,255,0.3)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {user.username[0]}
            </div>
            <div>
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/70"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Edit3 size={13} />
                Изменить аватар
              </motion.button>
              <p className="text-white/25 text-xs mt-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                PNG, JPG до 2MB
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-xs mb-1.5 block" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                Никнейм
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: usernameFocused ? "#B47AFF" : "rgba(255,255,255,0.25)" }}
                />
                <input
                  defaultValue={user.username}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: usernameFocused ? "1px solid rgba(180,122,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: usernameFocused ? "0 0 0 3px rgba(180,122,255,0.08)" : "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                Email
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: emailFocused ? "#B47AFF" : "rgba(255,255,255,0.25)" }}
                />
                <input
                  defaultValue={user.email}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: emailFocused ? "1px solid rgba(180,122,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: emailFocused ? "0 0 0 3px rgba(180,122,255,0.08)" : "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>
          </div>

          <motion.button
            className="self-start px-5 py-2.5 rounded-xl text-white text-sm"
            style={{
              background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
              boxShadow: "0 0 20px rgba(180,122,255,0.25)",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
            }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(180,122,255,0.45)" }}
            whileTap={{ scale: 0.97 }}
          >
            Сохранить изменения
          </motion.button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Безопасность
          </h3>
        </div>
        <div className="p-5">
          <label className="text-white/50 text-xs mb-1.5 block" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            Новый пароль
          </label>
          <div className="relative max-w-sm">
            <Lock
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.25)" }}
            />
            <input
              type={passVisible ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              type="button"
              onClick={() => setPassVisible((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
            >
              {passVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Уведомления
          </h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {[
            { key: "orders" as const, label: "Статус заказов", desc: "Уведомления об обновлении заказов" },
            { key: "promo" as const, label: "Акции и скидки", desc: "Специальные предложения и акции" },
            { key: "security" as const, label: "Безопасность", desc: "Вход с нового устройства" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{n.label}</p>
                <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{n.desc}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                style={{
                  background: notifications[n.key]
                    ? "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: notifications[n.key] ? "0 0 12px rgba(180,122,255,0.3)" : "none",
                }}
              >
                <span
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: notifications[n.key] ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Moderation Tab ───────────────────────────────────────────────────────────

function ModerationTab() {
  const reports = [
    { id: "#REP-221", user: "NightWolf", reason: "Спам в отзывах", date: "14 апр", status: "open" },
    { id: "#REP-219", user: "spam_acc_44", reason: "Подозрительная активность", date: "13 апр", status: "open" },
    { id: "#REP-217", user: "ProGamer2000", reason: "Нарушение правил", date: "12 апр", status: "resolved" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
          Модерация
        </h2>
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{ background: "rgba(255,138,138,0.12)", color: "#FF8A8A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          2 открытых жалобы
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Жалобы пользователей
          </h3>
        </div>
        {reports.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.03] last:border-0"
          >
            <AlertTriangle size={16} style={{ color: r.status === "open" ? "#FFB07A" : "rgba(255,255,255,0.2)" }} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                {r.user} <span className="text-white/30 font-normal">{r.id}</span>
              </p>
              <p className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                {r.reason} · {r.date}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: r.status === "open" ? "rgba(255,176,122,0.1)" : "rgba(255,255,255,0.05)",
                color: r.status === "open" ? "#FFB07A" : "rgba(255,255,255,0.25)",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {r.status === "open" ? "Открыта" : "Решена"}
            </span>
            {r.status === "open" && (
              <motion.button
                className="px-3 py-1 rounded-lg text-xs text-white/60"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Рассмотреть
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Admin Tab ────────────────────────────────────────────────────────────────

function AdminTab() {
  const siteStats = [
    { label: "Пользователей", value: "1 248", icon: Users, color: "#7ABAFF", change: "+12%" },
    { label: "Заказов сегодня", value: "87", icon: ShoppingBag, color: "#B47AFF", change: "+5%" },
    { label: "Выручка", value: "$4 219", icon: TrendingUp, color: "#4ade80", change: "+18%" },
    { label: "Жалоб", value: "2", icon: AlertTriangle, color: "#FF8A8A", change: "-3" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
          Панель Администратора
        </h2>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{ background: "rgba(255,176,122,0.12)", color: "#FFB07A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          <Crown size={11} />
          Admin
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {siteStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}18` }}
                >
                  <Icon size={15} style={{ color: s.color }} />
                </div>
                <span
                  className="text-xs"
                  style={{ color: s.change.startsWith("+") ? "#4ade80" : "#FF8A8A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
                >
                  {s.change}
                </span>
              </div>
              <p className="text-white text-xl" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Users table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Управление пользователями
          </h3>
        </div>
        {adminUsers.map((u, i) => {
          const rc = roleConfig[u.role as Role];
          const RoleIcon = rc.icon;
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #B47AFF33 0%, #FF8A8A33 100%)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {u.username[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                    {u.username}
                  </p>
                  {u.status === "banned" && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,138,138,0.1)", color: "#FF8A8A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
                    >
                      Бан
                    </span>
                  )}
                </div>
                <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{u.email}</p>
              </div>
              <div className="hidden md:flex items-center gap-3 text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                <span>{u.orders} заказов</span>
                <span>${u.spent.toFixed(0)}</span>
              </div>
              <span
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md flex-shrink-0"
                style={{ background: rc.bg, color: rc.color, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
              >
                <RoleIcon size={9} />
                {rc.label}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <motion.button
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Edit3 size={11} />
                </motion.button>
                <motion.button
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: u.status === "banned" ? "rgba(74,222,128,0.08)" : "rgba(255,138,138,0.08)",
                    border: u.status === "banned" ? "1px solid rgba(74,222,128,0.15)" : "1px solid rgba(255,138,138,0.15)",
                    color: u.status === "banned" ? "#4ade80" : "#FF8A8A",
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Ban size={11} />
                </motion.button>
                <motion.button
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Trash2 size={11} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function mapAuthUserToProfile(user: AuthUser): UserProfile {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    balance: user.balance,
    totalSpent: user.totalSpent,
    ordersCount: user.ordersCount,
    joinedAt: user.joinedAt,
    level: user.level,
    xp: user.xp,
    xpToNext: user.xpToNext,
    verified: user.verified,
  };
}

function getInitialTabByRole(role: Role) {
  if (role === "admin") return "admin";
  if (role === "moderator") return "moderation";
  return "overview";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { orders, ordersCount, totalSpent } = useUserOrders(user?.id);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    setActiveTab(getInitialTabByRole(user.role));
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  const profile = {
    ...mapAuthUserToProfile(user),
    ordersCount,
    totalSpent,
  };
  const mappedOrders = orders.map(mapOrderRecord);

  function handleLogout() {
    signOut();
    navigate("/");
  }

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "#08080E", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <BgGlows />

      {/* Topbar */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(8,8,14,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF8A8A 0%, #B47AFF 100%)",
              boxShadow: "0 0 14px rgba(180,122,255,0.35)",
            }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-white text-sm" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            EgorkaCoins
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="text-white/30 text-xs hover:text-white/50 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Выйти
          </button>
          <button
            className="relative w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Bell size={15} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: "#B47AFF", boxShadow: "0 0 6px #B47AFF" }}
            />
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="relative z-10 flex gap-5 p-5 md:p-6 max-w-6xl mx-auto">
        <Sidebar user={profile} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && <OverviewTab user={profile} orders={mappedOrders} />}
              {activeTab === "orders" && <OrdersTab orders={mappedOrders} />}
              {activeTab === "settings" && <SettingsTab user={profile} />}
              {activeTab === "moderation" && (profile.role === "moderator" || profile.role === "admin") && <ModerationTab />}
              {activeTab === "admin" && profile.role === "admin" && <AdminTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
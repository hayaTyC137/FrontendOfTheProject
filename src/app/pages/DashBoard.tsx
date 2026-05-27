import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { GamesAdminSection } from "../components/GamesAdminSection";
import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  MessageCircle,
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
import {
  fetchAdminStats,
  fetchAllUsers,
  banUser,
  deleteUser,
  setUserRole,
  type AdminStats,
  type UserAdmin,
} from "../../api/admin";
import {
  changeMyPassword,
  updateMyProfile,
  uploadMyAvatar,
} from "../../api/users";
import {
  deleteReview,
  deleteMyReview,
  fetchReviews,
  fetchMyReviews,
  updateReview,
  type ReviewApi,
} from "../../api/reviews";
import {
  fetchMyReports,
  fetchReports,
  updateReportStatus,
  type ReportApi,
  type ReportStatus,
} from "../../api/reports";
import { fetchGames, type GameApi } from "../../api/games";
import { GameReviewSelect } from "../components/GameReviewSelect";
import { getUserInitials, resolveUserAvatar } from "../utils/userAvatar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number;
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
  notifyOrders: boolean;
  notifyPromo: boolean;
  notifySecurity: boolean;
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


// ─── Role config ──────────────────────────────────────────────────────────────

const roleConfig: Record<Role, { label: string; color: string; bg: string; icon: typeof User }> = {
  user: { label: "Пользователь", color: "#7ABAFF", bg: "rgba(122,186,255,0.12)", icon: User },
  moderator: { label: "Модератор", color: "#B47AFF", bg: "rgba(180,122,255,0.12)", icon: Shield },
  admin: { label: "Администратор", color: "#FFB07A", bg: "rgba(255,176,122,0.12)", icon: Crown },
};

const roleOptions: Role[] = ["user", "moderator", "admin"];

const statusConfig = {
  completed: { label: "Выполнен", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  pending: { label: "В обработке", color: "#FFB07A", bg: "rgba(255,176,122,0.1)" },
  failed: { label: "Ошибка", color: "#FF8A8A", bg: "rgba(255,138,138,0.1)" },
};

const reportStatusConfig: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Открыта", color: "#FFB07A", bg: "rgba(255,176,122,0.1)" },
  in_review: { label: "На рассмотрении", color: "#B47AFF", bg: "rgba(180,122,255,0.12)" },
  resolved: { label: "Решена", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  rejected: { label: "Отклонена", color: "#FF8A8A", bg: "rgba(255,138,138,0.1)" },
};

function formatReportDate(value?: string | null) {
  if (!value) return "Недавно";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Недавно";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AvatarBox({
  name,
  avatar,
  className,
  style,
  fallbackClassName,
}: {
  name: string;
  avatar?: string;
  className: string;
  style: CSSProperties;
  fallbackClassName: string;
}) {
  const avatarUrl = resolveUserAvatar(avatar);

  return (
    <div className={className} style={style}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className={fallbackClassName}>{getUserInitials(name)}</span>
      )}
    </div>
  );
}

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
  { id: "reviews", label: "Мои отзывы", icon: MessageCircle, roles: ["user", "moderator", "admin"] },
  { id: "reports", label: "Мои жалобы", icon: AlertTriangle, roles: ["user", "moderator", "admin"] },
  { id: "settings", label: "Настройки", icon: Settings, roles: ["user", "moderator", "admin"] },
  { id: "moderation", label: "Модерация", icon: Shield, roles: ["moderator", "admin"] },
  { id: "catalog", label: "Товары", icon: Package, roles: ["moderator", "admin"] },
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
      className="w-64 flex-shrink-0 self-start flex flex-col"
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
            <AvatarBox
              name={user.username}
              avatar={user.avatar}
              className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden select-none"
              style={{
                background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                boxShadow: "0 0 24px rgba(180,122,255,0.35)",
              }}
              fallbackClassName="text-white text-xl font-bold"
            />
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

// ─── My Reviews Tab ──────────────────────────────────────────────────────────

function formatDate(value?: string) {
  if (!value) return "Недавно";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Недавно";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyReviewsTab() {
  const [reviews, setReviews] = useState<ReviewApi[]>([]);
  const [games, setGames] = useState<GameApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [editGameId, setEditGameId] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchMyReviews(), fetchGames()]).then(([result, gameItems]) => {
      if (!mounted) return;

      if (result.ok) {
        setReviews(result.data);
        setError(null);
      } else {
        setError(result.error);
      }

      setGames(gameItems);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  function startEdit(review: ReviewApi) {
    const matchedGame = games.find((game) => game.name === review.game);
    setEditingId(review.id);
    setEditGameId(matchedGame?.id ?? games[0]?.id ?? "");
    setEditStars(Math.min(5, Math.max(1, Math.round(review.stars))));
    setEditText(review.text);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditGameId("");
    setEditStars(5);
    setEditText("");
  }

  async function handleSave(review: ReviewApi) {
    const text = editText.trim();
    if (text.length < 5) {
      setError("Напишите отзыв чуть подробнее");
      return;
    }

    const selectedGame = games.find((game) => game.id === editGameId);
    setSavingId(review.id);
    setError(null);

    const result = await updateReview(review.id, {
      game: selectedGame?.name ?? review.game,
      gameColor: selectedGame?.color ?? review.gameColor ?? "#B47AFF",
      text,
      stars: editStars,
    });

    setSavingId(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setReviews((current) =>
      current.map((item) => (item.id === review.id ? result.data : item))
    );
    cancelEdit();
  }

  async function handleDelete(id: number | string) {
    setDeletingId(id);
    setError(null);

    const result = await deleteMyReview(id);
    setDeletingId(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setReviews((current) => current.filter((review) => review.id !== id));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
            Мои отзывы
          </h2>
          <p className="mt-1 text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Здесь можно посмотреть, отредактировать и удалить свои опубликованные отзывы.
          </p>
        </div>
        <span
          className="w-fit rounded-full px-3 py-1 text-xs"
          style={{ background: "rgba(180,122,255,0.12)", color: "#B47AFF", fontWeight: 700, fontFamily: "Inter, sans-serif" }}
        >
          {reviews.length} отзывов
        </span>
      </div>

      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm text-red-200"
          style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif" }}
        >
          {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {loading && (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Загрузка отзывов...
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="px-5 py-12 text-center">
            <MessageCircle size={28} className="mx-auto mb-3 text-white/20" />
            <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              У вас пока нет отзывов
            </p>
            <p className="mt-1 text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              Оставить отзыв можно на странице отзывов.
            </p>
          </div>
        )}

        {!loading && reviews.map((review, index) => {
          const isEditing = editingId === review.id;
          const selectedEditGame = games.find((game) => game.id === editGameId);
          const accent = isEditing
            ? selectedEditGame?.color ?? review.gameColor ?? "#B47AFF"
            : review.gameColor ?? "#B47AFF";

          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col gap-4 border-b border-white/[0.03] px-5 py-4 last:border-0"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <AvatarBox
                  name={review.name || "Пользователь"}
                  avatar={review.avatar}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm"
                  style={{
                    background: `${accent}18`,
                    border: `1px solid ${accent}30`,
                    color: accent,
                  }}
                  fallbackClassName="font-bold"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                      {isEditing ? selectedEditGame?.name ?? review.game : review.game}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px]"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                    >
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {!isEditing && (
                    <>
                      <div className="mb-3 flex gap-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => {
                          const filled = starIndex < review.stars;
                          return (
                            <Star
                              key={starIndex}
                              size={14}
                              style={{ color: filled ? accent : "rgba(255,255,255,0.14)" }}
                              fill={filled ? accent : "transparent"}
                            />
                          );
                        })}
                      </div>

                      <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                        {review.text}
                      </p>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      type="button"
                      onClick={() => startEdit(review)}
                      className="inline-flex h-9 w-fit items-center gap-2 rounded-xl px-3 text-xs text-white/70 transition-colors"
                      style={{ background: "rgba(180,122,255,0.1)", border: "1px solid rgba(180,122,255,0.18)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Edit3 size={13} />
                      Изменить
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="inline-flex h-9 w-fit items-center gap-2 rounded-xl px-3 text-xs text-red-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
                      whileHover={deletingId === review.id ? undefined : { scale: 1.04 }}
                      whileTap={deletingId === review.id ? undefined : { scale: 0.96 }}
                    >
                      <Trash2 size={13} />
                      {deletingId === review.id ? "Удаление" : "Удалить"}
                    </motion.button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(8,8,14,0.46)",
                    border: `1px solid ${accent}24`,
                    boxShadow: `0 0 24px ${accent}10`,
                  }}
                >
                  <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                    <GameReviewSelect
                      games={games}
                      value={editGameId}
                      onChange={setEditGameId}
                    />

                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
                        Оценка
                      </span>
                      <div className="flex h-12 items-center gap-1 rounded-xl px-3" style={{ background: "rgba(8,8,14,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {Array.from({ length: 5 }).map((_, starIndex) => {
                          const value = starIndex + 1;
                          const filled = value <= editStars;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setEditStars(value)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
                              aria-label={`Оценка ${value}`}
                            >
                              <Star
                                size={18}
                                style={{ color: filled ? accent : "rgba(255,255,255,0.18)" }}
                                fill={filled ? accent : "transparent"}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <label className="mt-4 flex flex-col gap-2">
                    <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
                      Текст отзыва
                    </span>
                    <textarea
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      rows={4}
                      className="resize-none rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                      style={{
                        background: "rgba(8,8,14,0.55)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        lineHeight: 1.55,
                        fontFamily: "Inter, sans-serif",
                      }}
                    />
                  </label>

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="h-10 rounded-xl px-4 text-sm text-white/45 transition-colors hover:text-white/70"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
                    >
                      Отмена
                    </button>

                    <motion.button
                      type="button"
                      onClick={() => handleSave(review)}
                      disabled={savingId === review.id}
                      className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: `${accent}28`, border: `1px solid ${accent}44`, fontFamily: "Inter, sans-serif", fontWeight: 800 }}
                      whileHover={savingId === review.id ? undefined : { scale: 1.03 }}
                      whileTap={savingId === review.id ? undefined : { scale: 0.97 }}
                    >
                      <Check size={14} />
                      {savingId === review.id ? "Сохранение" : "Сохранить"}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({
  user,
  onUserUpdated,
}: {
  user: UserProfile;
  onUserUpdated: (user: AuthUser) => void;
}) {
  const [emailFocused, setEmailFocused] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [notifications, setNotifications] = useState({
    orders: user.notifyOrders,
    promo: user.notifyPromo,
    security: user.notifySecurity,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsername(user.username);
    setNotifications({
      orders: user.notifyOrders,
      promo: user.notifyPromo,
      security: user.notifySecurity,
    });
  }, [user.username, user.notifyOrders, user.notifyPromo, user.notifySecurity]);

  async function handleSaveProfile() {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
      setProfileError("Никнейм должен быть длиной от 3 до 24 символов");
      setProfileMessage(null);
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileMessage(null);

    const result = await updateMyProfile({
      username: trimmedUsername,
      notifyOrders: notifications.orders,
      notifyPromo: notifications.promo,
      notifySecurity: notifications.security,
    });

    setIsSavingProfile(false);

    if (!result.ok) {
      setProfileError(result.error);
      return;
    }

    onUserUpdated(result.data);
    setUsername(result.data.username);
    setNotifications({
      orders: result.data.notifyOrders,
      promo: result.data.notifyPromo,
      security: result.data.notifySecurity,
    });
    setProfileMessage("Настройки профиля сохранены");
  }

  async function handleSavePassword() {
    if (!currentPassword.trim() || !newPassword.trim()) {
      setPasswordError("Заполните текущий и новый пароль");
      setPasswordMessage(null);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Новый пароль должен содержать минимум 8 символов");
      setPasswordMessage(null);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Подтверждение пароля не совпадает");
      setPasswordMessage(null);
      return;
    }

    setIsSavingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);

    const result = await changeMyPassword({
      currentPassword,
      newPassword,
    });

    setIsSavingPassword(false);

    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage(result.message ?? "Пароль обновлён");
  }

  async function handleAvatarSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Разрешены только PNG, JPG, JPEG и WEBP");
      setAvatarMessage(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Размер файла не должен превышать 2 МБ");
      setAvatarMessage(null);
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError(null);
    setAvatarMessage(null);

    const result = await uploadMyAvatar(file);
    setIsUploadingAvatar(false);

    if (!result.ok) {
      setAvatarError(result.error);
      return;
    }

    onUserUpdated(result.data);
    setAvatarMessage("Аватар обновлён");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex w-full min-w-0 flex-col gap-5"
    >
      <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
        Настройки
      </h2>

      <div className="w-full min-w-0 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Профиль
          </h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <AvatarBox
              name={user.username}
              avatar={user.avatar}
              className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
                boxShadow: "0 0 24px rgba(180,122,255,0.3)",
              }}
              fallbackClassName="text-white text-2xl font-bold"
            />
            <div className="min-w-0">
              <input
                ref={avatarInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleAvatarSelected}
              />
              <motion.button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
                whileHover={isUploadingAvatar ? undefined : { scale: 1.02 }}
                whileTap={isUploadingAvatar ? undefined : { scale: 0.97 }}
              >
                <Edit3 size={13} />
                {isUploadingAvatar ? "Загрузка..." : "Изменить аватар"}
              </motion.button>
              <p className="text-white/25 text-xs mt-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                PNG, JPG, WEBP до 2MB
              </p>
              {avatarError && (
                <p className="text-red-300 text-xs mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  {avatarError}
                </p>
              )}
              {avatarMessage && (
                <p className="text-emerald-300 text-xs mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  {avatarMessage}
                </p>
              )}
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
            <div className="min-w-0">
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
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
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
            <div className="min-w-0">
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
                  value={user.email}
                  readOnly
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white/70 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: emailFocused ? "1px solid rgba(180,122,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: emailFocused ? "0 0 0 3px rgba(180,122,255,0.08)" : "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <p className="text-white/25 text-xs mt-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                Смена email пока недоступна
              </p>
            </div>
          </div>

          {profileError && (
            <p className="text-red-300 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              {profileError}
            </p>
          )}
          {profileMessage && (
            <p className="text-emerald-300 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              {profileMessage}
            </p>
          )}

          <motion.button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="self-start px-5 py-2.5 rounded-xl text-white text-sm disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #B47AFF 0%, #FF8A8A 100%)",
              boxShadow: "0 0 20px rgba(180,122,255,0.25)",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
            }}
            whileHover={isSavingProfile ? undefined : { scale: 1.03, boxShadow: "0 0 32px rgba(180,122,255,0.45)" }}
            whileTap={isSavingProfile ? undefined : { scale: 0.97 }}
          >
            {isSavingProfile ? "Сохранение..." : "Сохранить изменения"}
          </motion.button>
        </div>
      </div>

      <div className="w-full min-w-0 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Безопасность
          </h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-white/50 text-xs mb-1.5 block" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                Текущий пароль
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  type={passVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-white/50 text-xs mb-1.5 block" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                Новый пароль
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  type={passVisible ? "text" : "password"}
                  placeholder="Минимум 8 символов"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPassVisible((value) => !value)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {passVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <label className="text-white/50 text-xs mb-1.5 block" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              Подтверждение нового пароля
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.25)" }}
              />
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={passVisible ? "text" : "password"}
                placeholder="Повторите пароль"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-red-300 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              {passwordError}
            </p>
          )}
          {passwordMessage && (
            <p className="text-emerald-300 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              {passwordMessage}
            </p>
          )}

          <motion.button
            type="button"
            onClick={handleSavePassword}
            disabled={isSavingPassword}
            className="self-start px-5 py-2.5 rounded-xl text-white text-sm disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
            }}
            whileHover={isSavingPassword ? undefined : { scale: 1.03 }}
            whileTap={isSavingPassword ? undefined : { scale: 0.97 }}
          >
            {isSavingPassword ? "Обновление..." : "Обновить пароль"}
          </motion.button>
        </div>
      </div>

      <div className="w-full min-w-0 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
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
            <div key={n.key} className="flex min-w-0 items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-white text-sm" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{n.label}</p>
                <p className="truncate text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{n.desc}</p>
              </div>
              <button
                type="button"
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

function MyReportsTab() {
  const [reports, setReports] = useState<ReportApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchMyReports().then((result) => {
      if (!mounted) return;

      if (result.ok) {
        setReports(result.data);
        setError(null);
      } else {
        setError(result.error);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
          Мои жалобы
        </h2>
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{ background: "rgba(255,176,122,0.12)", color: "#FFB07A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          {reports.length} всего
        </span>
      </div>

      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm text-red-200"
          style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif" }}
        >
          {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            История обращений
          </h3>
        </div>

        {loading && (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Загрузка жалоб...
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="px-5 py-10 text-center">
            <AlertTriangle size={28} className="mx-auto mb-3 text-white/20" />
            <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              Жалоб пока нет
            </p>
            <p className="mt-2 text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Если заметите нарушение, сможете пожаловаться на пользователя со страницы отзывов.
            </p>
          </div>
        )}

        {!loading && reports.map((report, index) => {
          const status = reportStatusConfig[report.status];
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col gap-3 px-5 py-4 border-b border-white/[0.03] last:border-0"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                    Жалоба на {report.reportedUsername}
                  </p>
                  <p className="mt-1 text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                    Отправлена {formatReportDate(report.createdAt)}
                  </p>
                </div>
                <span
                  className="w-fit rounded-full px-2.5 py-1 text-xs"
                  style={{ background: status.bg, color: status.color, fontWeight: 700, fontFamily: "Inter, sans-serif" }}
                >
                  {status.label}
                </span>
              </div>

              <div
                className="rounded-xl px-4 py-3 text-sm text-white/60"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "Inter, sans-serif" }}
              >
                {report.reason}
              </div>

              {report.reviewedByUsername && (
                <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                  Рассмотрел: {report.reviewedByUsername}
                  {report.statusChangedAt ? ` · ${formatReportDate(report.statusChangedAt)}` : ""}
                </p>
              )}

              {report.moderatorComment && (
                <div
                  className="rounded-xl px-4 py-3 text-sm text-white/65"
                  style={{ background: "rgba(180,122,255,0.08)", border: "1px solid rgba(180,122,255,0.16)", fontFamily: "Inter, sans-serif" }}
                >
                  <p className="mb-1 text-xs text-white/35" style={{ fontWeight: 700 }}>
                    Комментарий модератора
                  </p>
                  {report.moderatorComment}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ModerationTab() {
  const [reviews, setReviews] = useState<ReviewApi[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<number | string | null>(null);
  const [reports, setReports] = useState<ReportApi[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null);
  const [statusDraftReportId, setStatusDraftReportId] = useState<number | null>(null);
  const [statusDraft, setStatusDraft] = useState<"resolved" | "rejected">("resolved");
  const [moderatorComment, setModeratorComment] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchReviews(), fetchReports()]).then(([reviewsResult, reportsResult]) => {
      if (!mounted) return;

      if (reviewsResult.ok) {
        setReviews(reviewsResult.data);
        setReviewsError(null);
      } else {
        setReviewsError(reviewsResult.error);
      }

      if (reportsResult.ok) {
        setReports(reportsResult.data);
        setReportsError(null);
      } else {
        setReportsError(reportsResult.error);
      }

      setReviewsLoading(false);
      setReportsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDeleteReview(id: number | string) {
    setDeletingReviewId(id);
    setReviewsError(null);

    const result = await deleteReview(id);
    setDeletingReviewId(null);

    if (!result.ok) {
      setReviewsError(result.error);
      return;
    }

    setReviews((current) => current.filter((review) => review.id !== id));
  }

  async function handleReportStatus(
    reportId: number,
    status: "in_review" | "resolved" | "rejected",
    comment?: string
  ) {
    setUpdatingReportId(reportId);
    setReportsError(null);

    const result = await updateReportStatus(reportId, {
      status,
      moderatorComment: comment,
    });

    setUpdatingReportId(null);

    if (!result.ok) {
      setReportsError(result.error);
      return;
    }

    setReports((current) =>
      current.map((report) => (report.id === reportId ? result.data : report))
    );

    setStatusDraftReportId(null);
    setModeratorComment("");
  }

  const openReportsCount = reports.filter((report) => report.status === "open").length;

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
          {openReportsCount} открытых жалоб
        </span>
      </div>

      {reportsError && (
        <div
          className="rounded-2xl px-5 py-4 text-sm text-red-200"
          style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif" }}
        >
          {reportsError}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            Жалобы пользователей
          </h3>
        </div>

        {reportsLoading && (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Загрузка жалоб...
          </div>
        )}

        {!reportsLoading && reports.length === 0 && (
          <div className="px-5 py-10 text-center">
            <AlertTriangle size={28} className="mx-auto mb-3 text-white/20" />
            <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              Жалоб пока нет
            </p>
          </div>
        )}

        {!reportsLoading && reports.map((r, i) => {
          const status = reportStatusConfig[r.status];
          const canTake = r.status === "open";
          const canFinish = r.status === "open" || r.status === "in_review";

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col gap-3 px-5 py-4 border-b border-white/[0.03] last:border-0"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                <AlertTriangle size={16} style={{ color: status.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                        {r.reportedUsername} <span className="text-white/30 font-normal">#{r.id}</span>
                      </p>
                      <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                        Жалоба от {r.reporterUsername} · {formatReportDate(r.createdAt)}
                      </p>
                    </div>
                    <span
                      className="w-fit rounded-full px-2.5 py-1 text-xs"
                      style={{
                        background: status.bg,
                        color: status.color,
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div
                    className="mt-3 rounded-xl px-4 py-3 text-sm text-white/60"
                    style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "Inter, sans-serif" }}
                  >
                    {r.reason}
                  </div>

                  {(r.reviewedByUsername || r.moderatorComment) && (
                    <div className="mt-3 flex flex-col gap-2">
                      {r.reviewedByUsername && (
                        <p className="text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                          Рассмотрел: {r.reviewedByUsername}
                          {r.statusChangedAt ? ` · ${formatReportDate(r.statusChangedAt)}` : ""}
                        </p>
                      )}

                      {r.moderatorComment && (
                        <div
                          className="rounded-xl px-4 py-3 text-sm text-white/65"
                          style={{ background: "rgba(180,122,255,0.08)", border: "1px solid rgba(180,122,255,0.16)", fontFamily: "Inter, sans-serif" }}
                        >
                          <p className="mb-1 text-xs text-white/35" style={{ fontWeight: 700 }}>
                            Комментарий модератора
                          </p>
                          {r.moderatorComment}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 lg:w-[220px] lg:justify-end">
                  {canTake && (
                    <motion.button
                      type="button"
                      disabled={updatingReportId === r.id}
                      onClick={() => void handleReportStatus(r.id, "in_review")}
                      className="px-3 py-1 rounded-lg text-xs text-white/70 disabled:opacity-60"
                      style={{
                        background: "rgba(180,122,255,0.1)",
                        border: "1px solid rgba(180,122,255,0.22)",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Взять в работу
                    </motion.button>
                  )}

                  {canFinish && (
                    <>
                      <motion.button
                        type="button"
                        disabled={updatingReportId === r.id}
                        onClick={() => {
                          setStatusDraftReportId(r.id);
                          setStatusDraft("resolved");
                          setModeratorComment(r.moderatorComment ?? "");
                        }}
                        className="px-3 py-1 rounded-lg text-xs text-white/70 disabled:opacity-60"
                        style={{
                          background: "rgba(74,222,128,0.08)",
                          border: "1px solid rgba(74,222,128,0.16)",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Решить
                      </motion.button>

                      <motion.button
                        type="button"
                        disabled={updatingReportId === r.id}
                        onClick={() => {
                          setStatusDraftReportId(r.id);
                          setStatusDraft("rejected");
                          setModeratorComment(r.moderatorComment ?? "");
                        }}
                        className="px-3 py-1 rounded-lg text-xs text-white/70 disabled:opacity-60"
                        style={{
                          background: "rgba(255,138,138,0.08)",
                          border: "1px solid rgba(255,138,138,0.16)",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Отклонить
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {statusDraftReportId === r.id && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="mb-2 text-sm text-white" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                    {statusDraft === "resolved" ? "Завершить жалобу" : "Отклонить жалобу"}
                  </p>
                  <textarea
                    value={moderatorComment}
                    onChange={(event) => setModeratorComment(event.target.value)}
                    rows={3}
                    placeholder="Короткий комментарий для пользователя"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                    style={{
                      background: "rgba(8,8,14,0.5)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <motion.button
                      type="button"
                      disabled={updatingReportId === r.id}
                      onClick={() => void handleReportStatus(r.id, statusDraft, moderatorComment)}
                      className="px-4 py-2 rounded-xl text-sm text-white disabled:opacity-60"
                      style={{
                        background: statusDraft === "resolved"
                          ? "rgba(74,222,128,0.14)"
                          : "rgba(255,138,138,0.14)",
                        border: statusDraft === "resolved"
                          ? "1px solid rgba(74,222,128,0.24)"
                          : "1px solid rgba(255,138,138,0.24)",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Сохранить
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setStatusDraftReportId(null);
                        setModeratorComment("");
                      }}
                      className="px-4 py-2 rounded-xl text-sm text-white/55"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Отмена
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex flex-col gap-2 px-5 py-4 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              Отзывы пользователей
            </h3>
            <p className="mt-1 text-white/35 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Администраторы и модераторы могут удалить любой опубликованный отзыв.
            </p>
          </div>
          <span
            className="w-fit rounded-full px-3 py-1 text-xs"
            style={{ background: "rgba(180,122,255,0.12)", color: "#B47AFF", fontWeight: 700, fontFamily: "Inter, sans-serif" }}
          >
            {reviews.length} отзывов
          </span>
        </div>

        {reviewsError && (
          <div
            className="mx-5 mt-4 rounded-xl px-4 py-3 text-sm text-red-200"
            style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif" }}
          >
            {reviewsError}
          </div>
        )}

        {reviewsLoading && (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Загрузка отзывов...
          </div>
        )}

        {!reviewsLoading && reviews.length === 0 && (
          <div className="px-5 py-10 text-center">
            <MessageCircle size={28} className="mx-auto mb-3 text-white/20" />
            <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              Отзывов пока нет
            </p>
          </div>
        )}

        {!reviewsLoading && reviews.map((review, index) => {
          const accent = review.gameColor ?? "#B47AFF";
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.04 }}
              className="flex flex-col gap-4 px-5 py-4 border-b border-white/[0.03] last:border-0 lg:flex-row lg:items-start"
            >
              <AvatarBox
                name={review.name || "Пользователь"}
                avatar={review.avatar}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm"
                style={{
                  background: `${accent}18`,
                  border: `1px solid ${accent}30`,
                  color: accent,
                }}
                fallbackClassName="font-bold"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                    {review.name || "Пользователь"}
                  </span>
                  <span className="text-xs" style={{ color: accent, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                    {review.game}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => {
                    const filled = starIndex < review.stars;
                    return (
                      <Star
                        key={starIndex}
                        size={14}
                        style={{ color: filled ? accent : "rgba(255,255,255,0.14)" }}
                        fill={filled ? accent : "transparent"}
                      />
                    );
                  })}
                </div>

                <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {review.text}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => handleDeleteReview(review.id)}
                disabled={deletingReviewId === review.id}
                className="inline-flex h-9 w-fit items-center gap-2 rounded-xl px-3 text-xs text-red-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
                whileHover={deletingReviewId === review.id ? undefined : { scale: 1.04 }}
                whileTap={deletingReviewId === review.id ? undefined : { scale: 0.96 }}
              >
                <Trash2 size={13} />
                {deletingReviewId === review.id ? "Удаление" : "Удалить"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProductManagementTab({ role }: { role: Role }) {
  const isAdmin = role === "admin";
  const accent = isAdmin ? "#FFB07A" : "#B47AFF";
  const badgeBg = isAdmin ? "rgba(255,176,122,0.12)" : "rgba(180,122,255,0.12)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-white text-lg" style={{ fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
          Управление товарами
        </h2>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{ background: badgeBg, color: accent, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
        >
          <Package size={11} />
          {isAdmin ? "Admin access" : "Moderator access"}
        </div>
      </div>

      <GamesAdminSection />
    </motion.div>
  );
}

// ─── Admin Tab ────────────────────────────────────────────────────────────────

function AdminTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchAllUsers()]).then(
      ([statsData, usersData]) => {
        setStats(statsData);
        setUsers(usersData);
        setLoading(false);
      }
    );
  }, []);

  async function handleBan(id: number, isBanned: boolean) {
    await banUser(id, !isBanned);
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, isBanned: !isBanned } : u)
    );
  }

  async function handleDelete(id: number) {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  async function handleRoleChange(id: number, newRole: string) {
    await setUserRole(id, newRole);
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, role: newRole } : u)
    );
  }

  const siteStats = stats
    ? [
        { label: "Пользователей",  value: String(stats.totalUsers),          icon: Users,         color: "#7ABAFF", change: "" },
        { label: "Заказов сегодня", value: String(stats.ordersToday),         icon: ShoppingBag,   color: "#B47AFF", change: "" },
        { label: "Выручка",         value: `$${stats.totalRevenue.toFixed(0)}`, icon: TrendingUp,  color: "#4ade80", change: "" },
        { label: "Жалоб",           value: String(stats.openReports),         icon: AlertTriangle, color: "#FF8A8A", change: "" },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/30 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          Загрузка...
        </p>
      </div>
    );
  }

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
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
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

        {users.length === 0 && (
          <div className="px-5 py-8 text-center text-white/35 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Пользователей нет
          </div>
        )}

        {users.map((u, i) => {
          const rc = roleConfig[u.role as Role] ?? roleConfig.user;
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
                style={{ background: "linear-gradient(135deg, #B47AFF33 0%, #FF8A8A33 100%)", fontFamily: "Inter, sans-serif" }}
              >
                {u.username[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                    {u.username}
                  </p>
                  {u.isBanned && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,138,138,0.1)", color: "#FF8A8A", fontWeight: 600 }}>
                      Бан
                    </span>
                  )}
                </div>
                <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{u.email}</p>
              </div>

              <div className="hidden md:flex items-center gap-3 text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                <span>{u.ordersCount} заказов</span>
                <span>${u.totalSpent.toFixed(0)}</span>
              </div>

              {/* Role switcher */}
              <div
                className="flex items-center gap-1 rounded-xl p-1 flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mr-1"
                  style={{
                    background: rc.bg,
                    color: rc.color,
                    border: `1px solid ${rc.color}26`,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <RoleIcon size={11} />
                  <span className="text-[11px]">{rc.label}</span>
                </div>

                {roleOptions.map((role) => {
                  const option = roleConfig[role];
                  const OptionIcon = option.icon;
                  const selected = u.role === role;

                  return (
                    <motion.button
                      key={role}
                      type="button"
                      onClick={() => {
                        if (!selected) handleRoleChange(u.id, role);
                      }}
                      className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        color: selected ? option.color : "rgba(255,255,255,0.32)",
                        background: selected ? option.bg : "transparent",
                        border: selected ? `1px solid ${option.color}35` : "1px solid transparent",
                        boxShadow: selected ? `0 0 16px ${option.color}22` : "none",
                      }}
                      whileHover={{
                        scale: 1.06,
                        background: selected ? option.bg : "rgba(255,255,255,0.06)",
                        color: selected ? option.color : "rgba(255,255,255,0.7)",
                      }}
                      whileTap={{ scale: 0.94 }}
                      title={`Сделать роль: ${option.label}`}
                      aria-label={`Сделать роль: ${option.label}`}
                      aria-pressed={selected}
                    >
                      <OptionIcon size={13} />
                      {selected && (
                        <span
                          className="absolute -bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full"
                          style={{ background: option.color, boxShadow: `0 0 8px ${option.color}` }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Ban/Unban */}
                <motion.button
                  onClick={() => handleBan(u.id, u.isBanned)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: u.isBanned ? "rgba(74,222,128,0.08)" : "rgba(255,138,138,0.08)",
                    border: u.isBanned ? "1px solid rgba(74,222,128,0.15)" : "1px solid rgba(255,138,138,0.15)",
                    color: u.isBanned ? "#4ade80" : "#FF8A8A",
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  title={u.isBanned ? "Разбанить" : "Забанить"}
                >
                  <Ban size={11} />
                </motion.button>

                {/* Delete */}
                <motion.button
                  onClick={() => handleDelete(u.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  title="Удалить пользователя"
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
    avatar: user.avatarUrl,
    role: user.role,
    balance: user.balance,
    totalSpent: user.totalSpent,
    ordersCount: user.ordersCount,
    joinedAt: new Date(user.createdAt).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    level: user.level,
    xp: user.xp,
    xpToNext: user.xpToNext,
    verified: user.verified,
    notifyOrders: user.notifyOrders,
    notifyPromo: user.notifyPromo,
    notifySecurity: user.notifySecurity,
  };
}

function getInitialTabByRole(role: Role) {
  if (role === "admin") return "admin";
  if (role === "moderator") return "moderation";
  return "overview";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { orders, ordersCount, totalSpent } = useUserOrders(
  user?.id != null ? String(user.id) : null
);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    setActiveTab(getInitialTabByRole(user.role));
  }, [navigate, user?.id, user?.role]);

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
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/20"
          title="На главную"
        >
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
        </button>
        <div className="flex items-center gap-3">
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
              className="w-full min-w-0"
            >
              {activeTab === "overview" && <OverviewTab user={profile} orders={mappedOrders} />}
              {activeTab === "orders" && <OrdersTab orders={mappedOrders} />}
              {activeTab === "reviews" && <MyReviewsTab />}
              {activeTab === "reports" && <MyReportsTab />}
              {activeTab === "settings" && <SettingsTab user={profile} onUserUpdated={updateUser} />}
              {activeTab === "moderation" && (profile.role === "moderator" || profile.role === "admin") && <ModerationTab />}
              {activeTab === "catalog" && (profile.role === "moderator" || profile.role === "admin") && <ProductManagementTab role={profile.role} />}
              {activeTab === "admin" && profile.role === "admin" && <AdminTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

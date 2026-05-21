import { useEffect, useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Edit3, Trash2, Check, X, ChevronDown, ChevronUp,
  Package, Gamepad2,
} from "lucide-react";
import {
  fetchGames,
  createGame,
  updateGame,
  deleteGame,
  fetchAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  type GameApi,
  type PackageApi,
} from "../../api/games";

// ─── Пустые шаблоны ───────────────────────────────────────────────────────────

const EMPTY_GAME: GameApi = {
  id: "", name: "", currency: "", abbr: "", color: "#B47AFF",
  icon: "", description: "", tag: "", banner: "", about: "",
};

const EMPTY_PKG: Omit<PackageApi, "gameId"> & { gameId: string } = {
  id: "", gameId: "", amount: 0, label: "", price: 0,
  oldPrice: undefined, bonus: undefined, badge: undefined, popular: false,
};

const INPUT_STYLE = {
  background: "rgba(8,8,14,0.55)",
  border: "1px solid rgba(255,255,255,0.08)",
  fontFamily: "Inter, sans-serif",
} as const;

function isHexColor(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normalizeColorForPicker(value: string) {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed.slice(1).split("").map((char) => char + char).join("")}`;
  }
  return "#B47AFF";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

// ─── Поле ввода ───────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder = "", type = "text", small = false,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  small?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className={`flex flex-col gap-1.5 ${small ? "" : "col-span-1"}`}>
      <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
        style={{
          ...INPUT_STYLE,
          border: focused
            ? "1px solid rgba(180,122,255,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(180,122,255,0.08)" : "none",
        }}
      />
    </label>
  );
}

function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const previewColor = isHexColor(value) ? normalizeColorForPicker(value) : "#B47AFF";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
        Цвет
      </span>
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
        style={{
          ...INPUT_STYLE,
          border: focused
            ? "1px solid rgba(180,122,255,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(180,122,255,0.08)" : "none",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0"
          style={{
            background: previewColor,
            boxShadow: `0 0 16px ${previewColor}55`,
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        />
        <input
          type="color"
          value={normalizeColorForPicker(value)}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          aria-label="Палитра цвета"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="#FF8A8A"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      </div>
      <span className="text-[11px] text-white/30" style={{ fontFamily: "Inter, sans-serif" }}>
        Палитра для выбора оттенка, текстовое поле для точного HEX.
      </span>
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [value]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLoadingFile(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } finally {
      setLoadingFile(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 md:col-span-2">
      <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
        {label}
      </span>
      <div
        className="rounded-2xl p-3 transition-all"
        style={{
          ...INPUT_STYLE,
          border: focused
            ? "1px solid rgba(180,122,255,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(180,122,255,0.08)" : "none",
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <div
            className="h-28 w-full overflow-hidden rounded-xl md:w-44"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {value && !previewError ? (
              <img
                src={value}
                alt={label}
                className="h-full w-full object-cover"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div
                className="flex h-full items-center justify-center px-3 text-center text-xs text-white/28"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {value ? "Не удалось показать изображение" : "Изображение не выбрано"}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="https://... или data:image/..."
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
              style={INPUT_STYLE}
            />
            <div className="flex flex-wrap gap-2">
              <label
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm text-white"
                style={{
                  background: "rgba(180,122,255,0.15)",
                  border: "1px solid rgba(180,122,255,0.25)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                }}
              >
                <Plus size={14} />
                {loadingFile ? "Загрузка..." : "Выбрать файл"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={!value}
                className="inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm text-white/70 disabled:cursor-not-allowed disabled:text-white/25"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                }}
              >
                <X size={14} />
                Очистить
              </button>
            </div>
            <span className="text-[11px] text-white/30" style={{ fontFamily: "Inter, sans-serif" }}>
              Можно вставить URL вручную или выбрать файл с компьютера. Файл сохранится как `data:image/...`.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Форма игры ───────────────────────────────────────────────────────────────

function GameForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: GameApi;
  onSave: (g: GameApi) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<GameApi>(initial);
  const set = (key: keyof GameApi) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(8,8,14,0.7)",
        border: "1px solid rgba(180,122,255,0.2)",
        boxShadow: "0 0 40px rgba(180,122,255,0.08)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="ID (уникальный)" value={form.id} onChange={set("id")} placeholder="valorant" />
        <Field label="Название" value={form.name} onChange={set("name")} placeholder="Valorant" />
        <Field label="Валюта" value={form.currency} onChange={set("currency")} placeholder="Valorant Points" />
        <Field label="Сокращение" value={form.abbr} onChange={set("abbr")} placeholder="VP" />
        <ColorField value={form.color} onChange={set("color")} />
        <Field label="Тег" value={form.tag} onChange={set("tag")} placeholder="Популярно" />
        <Field label="Описание (короткое)" value={form.description} onChange={set("description")} placeholder="Скины, боевые пасы" />
        <ImageField label="Иконка" value={form.icon} onChange={set("icon")} />
        <ImageField label="Баннер" value={form.banner} onChange={set("banner")} />
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>
          Описание (полное)
        </span>
        <textarea
          rows={3}
          value={form.about}
          onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
          className="resize-none rounded-xl px-3 py-2.5 text-sm text-white outline-none"
          style={{
            ...INPUT_STYLE,
          }}
        />
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 px-4 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
        >
          Отмена
        </button>
        <motion.button
          type="button"
          onClick={() => onSave(form)}
          disabled={saving || !form.id || !form.name}
          className="inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "rgba(180,122,255,0.2)", border: "1px solid rgba(180,122,255,0.35)", fontFamily: "Inter, sans-serif", fontWeight: 800 }}
          whileHover={saving ? undefined : { scale: 1.03 }}
          whileTap={saving ? undefined : { scale: 0.97 }}
        >
          <Check size={14} />
          {saving ? "Сохранение..." : "Сохранить"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Форма пакета ─────────────────────────────────────────────────────────────

function PackageForm({
  initial,
  games,
  onSave,
  onCancel,
  saving,
}: {
  initial: PackageApi;
  games: GameApi[];
  onSave: (p: PackageApi) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PackageApi>(initial);
  const set = (key: keyof PackageApi) => (v: string) =>
    setForm((prev) => ({
      ...prev,
      [key]: ["amount", "price", "oldPrice"].includes(key)
        ? v === "" ? undefined : Number(v)
        : v,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(8,8,14,0.7)",
        border: "1px solid rgba(255,176,122,0.2)",
        boxShadow: "0 0 40px rgba(255,176,122,0.06)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="ID пакета" value={form.id} onChange={set("id")} placeholder="vp1" />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-white/35" style={{ fontWeight: 700 }}>Игра</span>
          <select
            value={form.gameId}
            onChange={(e) => setForm((p) => ({ ...p, gameId: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
            style={{ background: "rgba(8,8,14,0.55)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter, sans-serif" }}
          >
            <option value="">— выберите игру —</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </label>
        <Field label="Название пакета" value={form.label} onChange={set("label")} placeholder="1 000 VP" />
        <Field label="Количество" value={form.amount} onChange={set("amount")} type="number" placeholder="1000" />
        <Field label="Цена ($)" value={form.price} onChange={set("price")} type="number" placeholder="9.99" />
        <Field label="Старая цена ($)" value={form.oldPrice ?? ""} onChange={set("oldPrice")} type="number" placeholder="11.99" />
        <Field label="Бонус" value={form.bonus ?? ""} onChange={set("bonus")} placeholder="+50 VP бонус" />
        <Field label="Бейдж" value={form.badge ?? ""} onChange={set("badge")} placeholder="Выгодно" />
      </div>
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, popular: !p.popular }))}
          className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
          style={{
            background: form.popular ? "linear-gradient(135deg, #B47AFF, #FF8A8A)" : "rgba(255,255,255,0.06)",
            border: form.popular ? "none" : "1px solid rgba(255,255,255,0.15)",
            boxShadow: form.popular ? "0 0 12px rgba(180,122,255,0.4)" : "none",
          }}
        >
          {form.popular && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>
        <span className="text-sm text-white/55" style={{ fontFamily: "Inter, sans-serif" }}>
          Популярный пакет
        </span>
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 px-4 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
        >
          Отмена
        </button>
        <motion.button
          type="button"
          onClick={() => onSave(form)}
          disabled={saving || !form.id || !form.gameId}
          className="inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,176,122,0.16)", border: "1px solid rgba(255,176,122,0.3)", fontFamily: "Inter, sans-serif", fontWeight: 800 }}
          whileHover={saving ? undefined : { scale: 1.03 }}
          whileTap={saving ? undefined : { scale: 0.97 }}
        >
          <Check size={14} />
          {saving ? "Сохранение..." : "Сохранить"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function GamesAdminSection() {
  const [games, setGames] = useState<GameApi[]>([]);
  const [packages, setPackages] = useState<PackageApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние форм игр
  const [addingGame, setAddingGame] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [savingGame, setSavingGame] = useState(false);
  const [deletingGameId, setDeletingGameId] = useState<string | null>(null);

  // Состояние форм пакетов
  const [addingPkg, setAddingPkg] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [savingPkg, setSavingPkg] = useState(false);
  const [deletingPkgId, setDeletingPkgId] = useState<string | null>(null);

  // Раскрытые секции по игре
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchGames(), fetchAllPackages()]).then(([g, p]) => {
      setGames(g);
      setPackages(p);
      setLoading(false);
    });
  }, []);

  // ── Игры ──────────────────────────────────────────────────────────────────

  async function handleAddGame(game: GameApi) {
    setSavingGame(true);
    setError(null);
    const res = await createGame(game);
    setSavingGame(false);
    if (!res.ok) { setError(res.error ?? "Ошибка"); return; }
    setGames((prev) => [...prev, res.data!]);
    setAddingGame(false);
  }

  async function handleUpdateGame(game: GameApi) {
    setSavingGame(true);
    setError(null);
    const res = await updateGame(game.id, game);
    setSavingGame(false);
    if (!res.ok) { setError(res.error ?? "Ошибка"); return; }
    setGames((prev) => prev.map((g) => g.id === game.id ? res.data! : g));
    setEditingGameId(null);
  }

  async function handleDeleteGame(id: string) {
    setDeletingGameId(id);
    setError(null);
    const res = await deleteGame(id);
    setDeletingGameId(null);
    if (!res.ok) { setError(res.error ?? "Ошибка"); return; }
    setGames((prev) => prev.filter((g) => g.id !== id));
    setPackages((prev) => prev.filter((p) => p.gameId !== id));
  }

  // ── Пакеты ────────────────────────────────────────────────────────────────

  async function handleAddPkg(pkg: PackageApi) {
    setSavingPkg(true);
    setError(null);
    const res = await createPackage(pkg);
    setSavingPkg(false);
    if (!res.ok) { setError(res.error ?? "Ошибка"); return; }
    setPackages((prev) => [...prev, res.data!]);
    setAddingPkg(false);
  }

  async function handleUpdatePkg(pkg: PackageApi) {
    setSavingPkg(true);
    setError(null);
    const res = await updatePackage(pkg.id, pkg);
    setSavingPkg(false);
    if (!res.ok) { setError(res.error ?? "Ошибка"); return; }
    setPackages((prev) => prev.map((p) => p.id === pkg.id ? res.data! : p));
    setEditingPkgId(null);
  }

  async function handleDeletePkg(id: string) {
    setDeletingPkgId(id);
    setError(null);
    const res = await deletePackage(id);
    setDeletingPkgId(null);
    if (!res.ok) { setError(res.error ?? "Ошибка"); return; }
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-white/30 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          Загрузка...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Ошибка ── */}
      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm text-red-200"
          style={{ background: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.16)", fontFamily: "Inter, sans-serif" }}
        >
          {error}
        </div>
      )}

      {/* ══════════════════════════════════════════
          ИГРЫ
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Заголовок секции */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Gamepad2 size={16} style={{ color: "#B47AFF" }} />
            <h3 className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              Управление играми
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(180,122,255,0.12)", color: "#B47AFF", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
            >
              {games.length}
            </span>
          </div>
          <motion.button
            type="button"
            onClick={() => { setAddingGame(true); setEditingGameId(null); }}
            className="inline-flex h-8 items-center gap-2 rounded-xl px-3 text-xs text-white"
            style={{ background: "rgba(180,122,255,0.15)", border: "1px solid rgba(180,122,255,0.25)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Plus size={13} />
            Добавить
          </motion.button>
        </div>

        {/* Форма добавления игры */}
        <AnimatePresence>
          {addingGame && (
            <div className="px-5 pt-4 pb-2">
              <GameForm
                initial={{ ...EMPTY_GAME }}
                onSave={handleAddGame}
                onCancel={() => setAddingGame(false)}
                saving={savingGame}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Список игр */}
        {games.length === 0 && !addingGame && (
          <div className="px-5 py-8 text-center text-white/30 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Игр пока нет
          </div>
        )}

        {games.map((game, i) => {
          const isEditing = editingGameId === game.id;
          const isExpanded = expandedGameId === game.id;
          const gamePkgs = packages.filter((p) => p.gameId === game.id);

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-white/[0.03] last:border-0"
            >
              {/* Строка игры */}
              <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                {/* Цветовой индикатор */}
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${game.color}18`, border: `1px solid ${game.color}30` }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: game.color, boxShadow: `0 0 8px ${game.color}` }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                    {game.name}
                  </p>
                  <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                    {game.id} · {game.currency} · {gamePkgs.length} пакетов
                  </p>
                </div>

                {/* Тег */}
                <span
                  className="hidden md:inline text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${game.color}14`, color: game.color, border: `1px solid ${game.color}25`, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
                >
                  {game.tag}
                </span>

                {/* Кнопки */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Раскрыть пакеты */}
                  <motion.button
                    type="button"
                    onClick={() => setExpandedGameId(isExpanded ? null : game.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    whileHover={{ scale: 1.08, color: "white" }}
                    whileTap={{ scale: 0.93 }}
                    title="Пакеты"
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </motion.button>

                  {/* Редактировать */}
                  <motion.button
                    type="button"
                    onClick={() => { setEditingGameId(isEditing ? null : game.id); setAddingGame(false); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      color: isEditing ? "#B47AFF" : "rgba(255,255,255,0.35)",
                      background: isEditing ? "rgba(180,122,255,0.12)" : "rgba(255,255,255,0.04)",
                      border: isEditing ? "1px solid rgba(180,122,255,0.25)" : "1px solid rgba(255,255,255,0.07)",
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    title="Редактировать"
                  >
                    <Edit3 size={12} />
                  </motion.button>

                  {/* Удалить */}
                  <motion.button
                    type="button"
                    onClick={() => handleDeleteGame(game.id)}
                    disabled={deletingGameId === game.id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                    style={{ color: "#FF8A8A", background: "rgba(255,138,138,0.06)", border: "1px solid rgba(255,138,138,0.12)" }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    title="Удалить"
                  >
                    <Trash2 size={12} />
                  </motion.button>
                </div>
              </div>

              {/* Форма редактирования игры */}
              <AnimatePresence>
                {isEditing && (
                  <div className="px-5 pb-4">
                    <GameForm
                      initial={{ ...game }}
                      onSave={handleUpdateGame}
                      onCancel={() => setEditingGameId(null)}
                      saving={savingGame}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* Пакеты этой игры */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <div
                        className="rounded-xl overflow-hidden"
                        style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${game.color}18` }}
                      >
                        {/* Заголовок пакетов */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                          <div className="flex items-center gap-2">
                            <Package size={13} style={{ color: game.color }} />
                            <span className="text-xs text-white/50" style={{ fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                              Пакеты — {game.name}
                            </span>
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => { setAddingPkg(true); setEditingPkgId(null); }}
                            className="inline-flex h-6 items-center gap-1.5 rounded-lg px-2 text-[11px] text-white"
                            style={{ background: `${game.color}18`, border: `1px solid ${game.color}30`, fontFamily: "Inter, sans-serif", fontWeight: 700, color: game.color }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            <Plus size={11} />
                            Добавить
                          </motion.button>
                        </div>

                        {/* Форма нового пакета */}
                        <AnimatePresence>
                          {addingPkg && (
                            <div className="p-4">
                              <PackageForm
                                initial={{ ...EMPTY_PKG, gameId: game.id } as PackageApi}
                                games={games}
                                onSave={handleAddPkg}
                                onCancel={() => setAddingPkg(false)}
                                saving={savingPkg}
                              />
                            </div>
                          )}
                        </AnimatePresence>

                        {/* Список пакетов */}
                        {gamePkgs.length === 0 && !addingPkg && (
                          <div className="px-4 py-6 text-center text-white/25 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                            Нет пакетов
                          </div>
                        )}

                        {gamePkgs.map((pkg) => {
                          const isEditingPkg = editingPkgId === pkg.id;
                          return (
                            <div key={pkg.id} className="border-t border-white/[0.03] first:border-0">
                              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white/80 text-xs truncate" style={{ fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                    {pkg.label}
                                  </p>
                                  <p className="text-white/30 text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
                                    ${pkg.price}
                                    {pkg.oldPrice && ` (было $${pkg.oldPrice})`}
                                    {pkg.popular && " · Популярный"}
                                    {pkg.badge && ` · ${pkg.badge}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <motion.button
                                    type="button"
                                    onClick={() => { setEditingPkgId(isEditingPkg ? null : pkg.id); setAddingPkg(false); }}
                                    className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                                    style={{
                                      color: isEditingPkg ? "#B47AFF" : "rgba(255,255,255,0.3)",
                                      background: isEditingPkg ? "rgba(180,122,255,0.12)" : "rgba(255,255,255,0.04)",
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Edit3 size={11} />
                                  </motion.button>
                                  <motion.button
                                    type="button"
                                    onClick={() => handleDeletePkg(pkg.id)}
                                    disabled={deletingPkgId === pkg.id}
                                    className="w-6 h-6 rounded-md flex items-center justify-center transition-colors disabled:opacity-50"
                                    style={{ color: "#FF8A8A", background: "rgba(255,138,138,0.06)" }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {deletingPkgId === pkg.id ? <X size={11} /> : <Trash2 size={11} />}
                                  </motion.button>
                                </div>
                              </div>

                              {/* Форма редактирования пакета */}
                              <AnimatePresence>
                                {isEditingPkg && (
                                  <div className="px-4 pb-4">
                                    <PackageForm
                                      initial={{ ...pkg }}
                                      games={games}
                                      onSave={handleUpdatePkg}
                                      onCancel={() => setEditingPkgId(null)}
                                      saving={savingPkg}
                                    />
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

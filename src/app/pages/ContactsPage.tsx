import { motion } from "motion/react";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MessageCircleMore,
  ShieldCheck,
  Send,
} from "lucide-react";
import { StaticPageLayout } from "../components/layout/StaticPageLayout";

const channels = [
  {
    title: "Telegram",
    value: "@egorkacoins_support",
    description: "Основной канал для быстрых вопросов по заказам и уточнения статусов.",
    href: "https://t.me/egorkacoins_support",
    icon: Send,
    color: "#B47AFF",
  },
  {
    title: "Email",
    value: "support@egorkacoins.shop",
    description: "Подходит для детальных обращений, возвратов и разборов спорных ситуаций.",
    href: "mailto:support@egorkacoins.shop",
    icon: Mail,
    color: "#7ABAFF",
  },
  {
    title: "Discord",
    value: "discord.gg/egorkacoins",
    description: "Удобно для связи с комьюнити и быстрой эскалации простых вопросов.",
    href: "https://discord.gg/egorkacoins",
    icon: MessageCircleMore,
    color: "#FF8A8A",
  },
];

const trustBlocks = [
  { icon: Clock3, title: "Среднее время ответа", text: "Чаще всего поддержка отвечает в течение 5–15 минут.", color: "#B47AFF" },
  { icon: ShieldCheck, title: "Приоритет обращений", text: "Заказы в обработке и вопросы по оплате разбираются в первую очередь.", color: "#7ABAFF" },
];

export function ContactsPage() {
  return (
    <StaticPageLayout
      badge="Поддержка и контакты"
      title="Если возник вопрос по заказу, не нужно искать куда писать"
      description="На этой странице собраны основные каналы связи и ожидаемый формат обращения. Чем точнее вы напишете игру, пакет и номер заказа, тем быстрее будет ответ."
    >
      <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[30px] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
          }}
        >
          <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.03em" }}>
            Как написать, чтобы ответ был быстрее
          </h2>
          <div className="mt-5 space-y-4">
            {[
              "Укажите игру и конкретный пакет, который оформляли.",
              "Если есть номер заказа, приложите его в первом сообщении.",
              "Кратко опишите проблему: оплата, задержка, неверный пакет или другой вопрос.",
              "Если вопрос связан со статусом, отправьте время покупки и сумму.",
            ].map((text, index) => (
              <div
                key={text}
                className="flex gap-3 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
                  style={{
                    background: "linear-gradient(135deg, rgba(180,122,255,0.9) 0%, rgba(255,138,138,0.9) 100%)",
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </div>
                <p className="text-sm text-white/52" style={{ lineHeight: 1.7 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {trustBlocks.map(({ icon: Icon, title, text, color }) => (
              <div
                key={title}
                className="rounded-2xl p-4"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}26`,
                }}
              >
                <Icon size={17} style={{ color }} />
                <h3 className="mt-3 text-white text-sm" style={{ fontWeight: 700 }}>
                  {title}
                </h3>
                <p className="mt-2 text-xs text-white/48" style={{ lineHeight: 1.65 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </motion.article>

        <div className="grid gap-4">
          {channels.map(({ title, value, description, href, icon: Icon, color }, index) => (
            <motion.a
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[30px] p-6 transition-colors"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={19} style={{ color }} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-white/25 transition-colors group-hover:text-white/70"
                />
              </div>

              <h2
                className="mt-5 text-white"
                style={{ fontWeight: 800, fontSize: "1.12rem", letterSpacing: "-0.03em" }}
              >
                {title}
              </h2>
              <p className="mt-1 text-sm" style={{ color, fontWeight: 700 }}>
                {value}
              </p>
              <p className="mt-4 text-sm text-white/50" style={{ lineHeight: 1.7 }}>
                {description}
              </p>
            </motion.a>
          ))}
        </div>
      </section>
    </StaticPageLayout>
  );
}

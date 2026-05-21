import { motion } from "motion/react";
import { HelpCircle, ShieldCheck, TimerReset, WalletCards } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { StaticPageLayout } from "../components/layout/StaticPageLayout";

const faqItems = [
  {
    id: "delivery",
    question: "Как быстро приходит игровая валюта после оплаты?",
    answer:
      "Обычно заказ обрабатывается в течение 1–5 минут. В часы пик или если платеж требует дополнительной проверки, обработка может занять немного больше времени.",
  },
  {
    id: "payment",
    question: "Какие способы оплаты поддерживаются?",
    answer:
      "Витрина рассчитана на стандартную онлайн-оплату. Финальный список способов зависит от доступных платежных методов, подключенных на стороне магазина.",
  },
  {
    id: "safety",
    question: "Насколько безопасна покупка через магазин?",
    answer:
      "Мы показываем только понятные карточки товаров, цены и статусы заказа. Сам процесс оформлен так, чтобы пользователь заранее видел игру, пакет и сумму без скрытых шагов.",
  },
  {
    id: "wrong-order",
    question: "Что делать, если я выбрал не тот пакет?",
    answer:
      "Если заказ еще не ушел в обработку, лучше сразу написать в поддержку со страницы контактов. Чем раньше вы обратитесь, тем проще остановить или скорректировать заказ.",
  },
  {
    id: "refund",
    question: "Возможен ли возврат средств?",
    answer:
      "Возврат зависит от статуса конкретного заказа. Если валюта еще не была зачислена или заказ не был обработан, вопрос обычно решается быстрее через поддержку.",
  },
  {
    id: "account-data",
    question: "Какие данные нужны для выполнения заказа?",
    answer:
      "Только те данные, которые реально требуются для выбранной игры и способа пополнения. В интерфейсе не должно запрашиваться ничего лишнего относительно текущего сценария покупки.",
  },
  {
    id: "support",
    question: "Куда писать, если заказ завис или возникла ошибка?",
    answer:
      "Используйте страницу контактов и приложите номер заказа, игру и краткое описание проблемы. Так поддержка сможет быстрее сопоставить обращение с конкретной покупкой.",
  },
];

const highlights = [
  { icon: TimerReset, title: "Быстрая обработка", text: "Большая часть заказов проходит без ручных задержек.", color: "#B47AFF" },
  { icon: ShieldCheck, title: "Прозрачный процесс", text: "Цена, пакет и выбранная игра видны до подтверждения.", color: "#7ABAFF" },
  { icon: WalletCards, title: "Понятные условия", text: "FAQ закрывает ключевые вопросы до обращения в поддержку.", color: "#FF8A8A" },
];

export function FaqPage() {
  return (
    <StaticPageLayout
      badge="Справочный центр"
      title="Ответы на частые вопросы без лишней воды"
      description="FAQ собран вокруг реальных сценариев покупки: скорость обработки, безопасность, возвраты, корректировка заказа и связь с поддержкой."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, text, color }, index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="rounded-3xl p-5"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
            }}
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: `${color}18`,
                border: `1px solid ${color}32`,
              }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
              {title}
            </h2>
            <p className="mt-2 text-sm text-white/50" style={{ lineHeight: 1.7 }}>
              {text}
            </p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
        className="rounded-[30px] p-6 md:p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(180,122,255,0.15)",
              border: "1px solid rgba(180,122,255,0.28)",
            }}
          >
            <HelpCircle size={18} style={{ color: "#B47AFF" }} />
          </div>
          <div>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.03em" }}>
              Популярные вопросы
            </h2>
            <p className="mt-1 text-sm text-white/42">
              Коротко и по делу, чтобы пользователь понимал процесс до покупки.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b border-white/[0.06]"
            >
              <AccordionTrigger className="py-5 text-white hover:no-underline">
                <span
                  className="pr-6 text-left"
                  style={{ fontWeight: 700, fontSize: "0.98rem", letterSpacing: "-0.02em" }}
                >
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-white/50" style={{ lineHeight: 1.75 }}>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>
    </StaticPageLayout>
  );
}

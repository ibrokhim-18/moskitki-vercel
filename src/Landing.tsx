import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Send,
  ShieldCheck,
  Clock,
  Hammer,
  Star,
  ChevronRight,
  Sparkles,
  Wrench,
  Wind,
} from "lucide-react";

// === Контакты ===
const PHONE_NUMBER = "+998 99 055 06 60";
const PHONE_LINK = "tel:+998990550660";
const TELEGRAM_USERNAME = "moskitki_uz";
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_USERNAME}`;

// === Услуги (тексты будут браться из t(), но цены и ключи остаются) ===
const SERVICES = [
  {
    key: "moskitnaya-setka",
    titleKey: "service_mosquito_title",
    price: "от 120 000 сум",
    old: "от 150 000 сум",
    descKey: "service_mosquito_desc",
    icon: <Wind className="h-6 w-6" />,
    featuresKeys: ["free_measure", "one_day", "year_guarantee"],
  },
  {
    key: "zhalyuzi",
    titleKey: "service_blinds_title",
    price: "от 250 000 сум",
    old: "от 320 000 сум",
    descKey: "service_blinds_desc",
    icon: <Sparkles className="h-6 w-6" />,
    featuresKeys: ["colors_50", "fabric_aluminum", "mounting_included"],
  },
  {
    key: "remont-okon",
    titleKey: "service_window_title",
    price: "от 50 000 сум",
    descKey: "service_window_desc",
    icon: <Wrench className="h-6 w-6" />,
    featuresKeys: ["master_visit", "parts_stock", "receipt_guarantee"],
  },
];

// === Форматирование телефона ===
function formatPhone(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 12);
  let out = "+";
  out += digits.slice(0, 3);
  if (digits.length > 3) out += " (" + digits.slice(3, 5);
  if (digits.length >= 5) out += ")";
  if (digits.length > 5) out += " " + digits.slice(5, 8);
  if (digits.length > 8) out += "-" + digits.slice(8, 10);
  if (digits.length > 10) out += "-" + digits.slice(10, 12);
  return out;
}

export default function Landing() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const [selectedService, setSelectedService] = useState(SERVICES[0].titleKey);
  const [phone, setPhone] = useState("+998 ");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 59,
    seconds: 41,
  });

  // Таймер
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        if (hours === 0 && minutes === 0 && seconds === 0) {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Отправка формы
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      setError(t("error_invalid_phone"));
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: t(selectedService),
          phone,
          name,
        }),
      });
      setSubmitted(true);
      setPhone("+998 ");
      setName("");
    } catch {
      setError(t("error_send"));
    } finally {
      setSubmitting(false);
    }
  }

  const formatTime = (n: number) => String(n).padStart(2, "0");

  // Получение переведённых названий услуг для выпадающего списка
  const getServiceTitle = (key: string) => t(key);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Шапка с переключателем языка */}
      <header className="flex flex-wrap items-center justify-between px-4 py-3 max-w-6xl mx-auto gap-2">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold">{t("header")}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeLanguage("ru")}
            className={`px-3 py-1 rounded-md transition ${
              i18n.language === "ru"
                ? "bg-green-500 text-black font-semibold"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Русский
          </button>
          <button
            onClick={() => changeLanguage("uz")}
            className={`px-3 py-1 rounded-md transition ${
              i18n.language === "uz"
                ? "bg-green-500 text-black font-semibold"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            O‘zbekcha
          </button>
        </div>
        <div className="text-sm text-gray-400">{t("city_since")}</div>
      </header>

      {/* Герой */}
      <section className="text-center px-4 py-8 max-w-4xl mx-auto">
        <div className="inline-block bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm mb-4">
          {t("badge_sale")}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          {t("hero_title")}
        </h1>
        <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
          {t("hero_desc")}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={PHONE_LINK}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-xl transition"
          >
            <Phone className="h-5 w-5" /> {t("call_btn")}
          </a>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            <Send className="h-5 w-5" /> {t("telegram_btn")}
          </a>
        </div>
      </section>

      {/* Преимущества */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Clock className="h-6 w-6 mx-auto text-green-400" />, titleKey: "benefit_1_title", subKey: "benefit_1_sub" },
            { icon: <ShieldCheck className="h-6 w-6 mx-auto text-green-400" />, titleKey: "benefit_2_title", subKey: "benefit_2_sub" },
            { icon: <Hammer className="h-6 w-6 mx-auto text-green-400" />, titleKey: "benefit_3_title", subKey: "benefit_3_sub" },
            { icon: <Star className="h-6 w-6 mx-auto text-green-400" />, titleKey: "benefit_4_title", subKey: "benefit_4_sub" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl backdrop-blur">
              {item.icon}
              <div className="font-semibold mt-2">{t(item.titleKey)}</div>
              <div className="text-gray-400 text-xs mt-1">{t(item.subKey)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Таймер */}
      <section className="text-center pb-10">
        <p className="text-gray-400 mb-2">{t("discount_ends")}</p>
        <div className="flex justify-center gap-3 text-3xl font-mono font-bold">
          <span className="bg-white/10 px-4 py-2 rounded-xl">{formatTime(timeLeft.hours)}</span>
          <span className="text-gray-500">:</span>
          <span className="bg-white/10 px-4 py-2 rounded-xl">{formatTime(timeLeft.minutes)}</span>
          <span className="text-gray-500">:</span>
          <span className="bg-white/10 px-4 py-2 rounded-xl">{formatTime(timeLeft.seconds)}</span>
        </div>
      </section>

      {/* Услуги */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-center mb-8">{t("services_title")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.key}
              className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10 flex flex-col"
            >
              <div className="text-green-400 mb-3">{s.icon}</div>
              <h3 className="font-bold text-lg mb-1">{t(s.titleKey)}</h3>
              <p className="text-gray-400 text-sm mb-3">{t(s.descKey)}</p>
              <div className="mb-3">
                <span className="text-green-400 font-bold whitespace-pre-line">{s.price}</span>
                {s.old && <span className="text-gray-500 line-through text-sm ml-2 whitespace-pre-line">{s.old}</span>}
              </div>
              <ul className="space-y-1 mb-4">
                {s.featuresKeys.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400 text-lg leading-none">☐</span> {t(f)}
                  </li>
                ))}
              </ul>
              <a
                href="#form"
                className="mt-auto flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-xl transition"
              >
                {t("order_btn")} <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Форма заказа */}
      <section id="form" className="max-w-xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-6">{t("form_title")}</h2>
        <form
          onSubmit={onSubmit}
          className="bg-white/5 backdrop-blur rounded-2xl p-6 space-y-4 border border-white/10"
        >
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t("service_label")}</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
            >
              {SERVICES.map((s) => (
                <option key={s.key} value={s.titleKey} className="text-black">
                  {t(s.titleKey)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t("name_label")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name_placeholder")}
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t("phone_label")}</label>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="+998..."
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-500"
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {submitted ? (
            <div className="text-green-400 text-center font-semibold py-3">
              ✅ {t("success_message")}
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {submitting ? t("submitting") : <>{t("order_btn")} <ChevronRight className="h-5 w-5" /></>}
            </button>
          )}
          <p className="text-gray-500 text-xs text-center">{t("consent_text")}</p>
        </form>
      </section>

      {/* Контакты */}
      <section className="max-w-4xl mx-auto px-4 pb-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("ready_title")}</h2>
        <p className="text-gray-400 mb-6">{t("ready_desc")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={PHONE_LINK}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-xl text-lg transition"
          >
            <Phone className="h-5 w-5" /> {PHONE_NUMBER}
          </a>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
          >
            <Send className="h-5 w-5" /> {t("telegram_write")}
          </a>
        </div>
      </section>

      {/* ОТЗЫВЫ (ручное добавление) */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-center mb-4">{t("reviews_title")}</h2>
        <p className="text-gray-400 text-center mb-8">{t("reviews_subtitle")}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 rounded-full w-10 h-10 flex items-center justify-center text-green-400 font-bold">А</div>
              <div>
                <div className="font-semibold">Анна К.</div>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-300">{t("review_1_text")}</p>
            <div className="text-green-400 text-xs mt-3">✅ {t("review_verified")}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 rounded-full w-10 h-10 flex items-center justify-center text-green-400 font-bold">Б</div>
              <div>
                <div className="font-semibold">Бахром Н.</div>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-300">{t("review_2_text")}</p>
            <div className="text-green-400 text-xs mt-3">✅ {t("review_verified")}</div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            <Send className="h-5 w-5" /> {t("leave_review_btn")}
          </a>
          <p className="text-gray-500 text-xs mt-2">{t("review_hint")}</p>
        </div>
      </section>

      {/* Футер */}
      <footer className="text-center text-gray-600 text-sm py-6 border-t border-white/5">
        <div className="mb-2">
          Moskitki.uz © 2019 – {new Date().getFullYear()} — {t("footer_city")}
        </div>
        <div id="counter-container" style={{ display: 'none' }}>
          <a href="https://www.hitwebcounter.com/protect-pdf" target="_blank" rel="noopener" title="hitwebcounter.com Password PDFs">
            <img
              src="https://www.hitwebcounter.com/counter/counter.php?page=21497695&amp;style=0006&amp;nbdigits=5&amp;type=page"
              alt="счётчик"
              decoding="async"
              style={{ border: 0, maxWidth: "100%", height: "auto" }}
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

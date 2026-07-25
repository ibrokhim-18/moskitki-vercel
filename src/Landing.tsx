import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation, Switch, Route, Link } from 'wouter';
import ReactGA from "react-ga4";
import {
  Phone, Send, ShieldCheck, Clock, Hammer, Star, ChevronRight,
  Wrench, Wind, Snowflake, ArrowUpDown, Droplets, Menu
} from "lucide-react";
import { Analytics } from '@vercel/analytics/react';

const PHONE_NUMBER = "+998 99 055 06 60";
const PHONE_LINK = "tel:+998990550660";
const TELEGRAM_USERNAME = "moskitki_uz";
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_USERNAME}`;

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

// ------------------------------------------------------------
// ОБЩИЕ КОМПОНЕНТЫ
// ------------------------------------------------------------

function Header() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-3 max-w-6xl mx-auto gap-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <Wind className="h-6 w-6 text-green-600" />
        <span className="text-xl font-bold text-gray-800">{t("header")}</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => changeLanguage("ru")} className={`px-3 py-1 rounded-md transition ${i18n.language === "ru" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>Русский</button>
        <button onClick={() => changeLanguage("uz")} className={`px-3 py-1 rounded-md transition ${i18n.language === "uz" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>O‘zbekcha</button>
      </div>
      <div className="text-sm text-gray-500">{t("city_since")}</div>
    </header>
  );
}

function Benefits() {
  const { t } = useTranslation();
  const items = [
    { icon: <Clock className="h-6 w-6 mx-auto text-green-600" />, titleKey: "benefit_1_title", subKey: "benefit_1_sub" },
    { icon: <ShieldCheck className="h-6 w-6 mx-auto text-green-600" />, titleKey: "benefit_2_title", subKey: "benefit_2_sub" },
    { icon: <Hammer className="h-6 w-6 mx-auto text-green-600" />, titleKey: "benefit_3_title", subKey: "benefit_3_sub" },
    { icon: <Star className="h-6 w-6 mx-auto text-green-600" />, titleKey: "benefit_4_title", subKey: "benefit_4_sub" },
  ];
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{t("why_we")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            {item.icon}
            <div className="font-semibold mt-2 text-gray-800">{t(item.titleKey)}</div>
            <div className="text-gray-500 text-xs mt-1">{t(item.subKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ГАЛЕРЕЯ готовых проектов (4 фото)
function Gallery() {
  const { t } = useTranslation();
  const items = [
    {
      img: "/images/standart.png", // замените на реальные фото
      title: "mosquito_title",
      desc: "gallery_mosquito_desc",
      link: "/moskitnye-setki",
      bg: "bg-green-100"
    },
    {
      img: "/images/gorizontal.png",
      title: "blinds_title",
      desc: "gallery_blinds_desc",
      link: "/zhalyuzi",
      bg: "bg-yellow-100"
    },
    {
      img: "/images/ac_install.jpg", // если нет, используйте иконку
      title: "ac_services_title",
      desc: "gallery_ac_desc",
      link: "/montazh-konditsionerov",
      bg: "bg-blue-100"
    },
    {
      img: "/images/window_repair.jpg", // если нет, используйте иконку
      title: "window_repair_title",
      desc: "gallery_repair_desc",
      link: "/remont-okon",
      bg: "bg-orange-100"
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">{t("gallery_title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className={`${item.bg} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300`}>
            <img src={item.img} alt={t(item.title)} className="w-full h-48 object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-gray-800">{t(item.title)}</h3>
              <p className="text-gray-600 text-sm mt-1">{t(item.desc)}</p>
              <Link href={item.link} className="inline-block mt-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-full text-sm transition shadow">
                {t("more_btn")} <ChevronRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  const { t } = useTranslation();
  const reviews = [
    { initial: "А", name: "Анна К.", textKey: "review_1_text", bg: "bg-green-100", textColor: "text-green-700" },
    { initial: "Б", name: "Бахром Н.", textKey: "review_2_text", bg: "bg-yellow-100", textColor: "text-yellow-700" },
    { initial: "С", name: "Сергей М.", textKey: "review_3_text", bg: "bg-blue-100", textColor: "text-blue-700" },
    { initial: "Д", name: "Динара Ш.", textKey: "review_4_text", bg: "bg-orange-100", textColor: "text-orange-700" },
  ];
  return (
    <section className="max-w-5xl mx-auto px-4 pb-12">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">{t("reviews_title")}</h2>
      <p className="text-gray-500 text-center mb-8">{t("reviews_subtitle")}</p>
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((rev, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${rev.bg} rounded-full w-10 h-10 flex items-center justify-center ${rev.textColor} font-bold`}>{rev.initial}</div>
              <div>
                <div className="font-semibold text-gray-800">{rev.name}</div>
                <div className="text-yellow-500 text-sm">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600">{t(rev.textKey)}</p>
            <div className="text-green-600 text-xs mt-3">✅ {t("review_verified")}</div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <a href={TELEGRAM_LINK} target="_blank" className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition">
          <Send className="h-5 w-5" /> {t("leave_review_btn")}
        </a>
        <p className="text-gray-400 text-xs mt-2">{t("review_hint")}</p>
      </div>
    </section>
  );
}

function Contacts() {
  const { t } = useTranslation();
  return (
    <section className="max-w-4xl mx-auto px-4 pb-12 text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("ready_title")}</h2>
      <p className="text-gray-600 mb-6">{t("ready_desc")}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <a href={PHONE_LINK} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
          <Phone className="h-5 w-5" /> {PHONE_NUMBER}
        </a>
        <a href={TELEGRAM_LINK} target="_blank" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
          <Send className="h-5 w-5" /> {t("telegram_write")}
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200 bg-white">
      Moskitki.uz © 2019 – {new Date().getFullYear()} — {t("Toshkent")}
    </footer>
  );
}

// ------------------------------------------------------------
// БЛОКИ УСЛУГ (для страниц услуг)
// ------------------------------------------------------------

function ACBlock({ onOrderClick }: { onOrderClick: (service: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="scroll-mt-16">
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">{t("ac_services_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <Snowflake className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800">{t("ac_install_title")}</h3>
              <p className="text-gray-500 text-sm mt-1">{t("ac_install_desc")}</p>
              <div className="mt-2"><span className="text-green-600 font-bold text-xl">{t("ac_install_price")}</span></div>
              <ul className="text-left max-w-xs mx-auto mt-3 space-y-1 text-sm text-gray-600">
                <li>☐ {t("feature_professional_mount")}</li>
                <li>☐ {t("feature_connect_units")}</li>
                <li>☐ {t("feature_test_run")}</li>
              </ul>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <ArrowUpDown className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800">{t("ac_dismantle_title")}</h3>
              <p className="text-gray-500 text-sm mt-1">{t("ac_dismantle_desc")}</p>
              <div className="mt-2"><span className="text-green-600 font-bold text-xl">{t("ac_dismantle_price")}</span></div>
              <ul className="text-left max-w-xs mx-auto mt-3 space-y-1 text-sm text-gray-600">
                <li>☐ {t("feature_safe_removal")}</li>
                <li>☐ {t("feature_freon_collect")}</li>
                <li>☐ {t("feature_dismantle_quick")}</li>
              </ul>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <Droplets className="h-12 w-12 text-cyan-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800">{t("ac_refill_title")}</h3>
              <p className="text-gray-500 text-sm mt-1">{t("ac_refill_desc")}</p>
              <div className="mt-2"><span className="text-green-600 font-bold text-xl">{t("ac_refill_price")}</span></div>
              <ul className="text-left max-w-xs mx-auto mt-3 space-y-1 text-sm text-gray-600">
                <li>☐ {t("feature_leak_search")}</li>
                <li>☐ {t("feature_refill_r410a")}</li>
                <li>☐ {t("feature_pressure_check")}</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-6">
            <button onClick={() => onOrderClick(t("ac_services_title"))} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">
              {t("order_ac_btn")} <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MosquitoBlock({ onOrderClick }: { onOrderClick: (service: string) => void }) {
  const { t } = useTranslation();
  const items = [
    { img: "/images/standart.png", title: "standart_title", desc: "standart_desc", price: "standart_price_from", old: "standart_price_old", features: ["feature_free_measure", "feature_one_day", "feature_year_guarantee"] },
    { img: "/images/synax.png", title: "synax_title", desc: "synax_desc", price: "synax_price_from", old: "synax_price_old", features: ["feature_no_drilling", "feature_one_day", "feature_year_guarantee"] },
    { img: "/images/uni.png", title: "uni_title", desc: "uni_desc", price: "uni_price_from", old: "uni_price_old", features: ["feature_universal_mount", "feature_reinforced_frame", "feature_year_guarantee"] },
    { img: "/images/plise.png", title: "plise_title", desc: "plise_desc", price: "plise_price_from", old: "plise_price_old", features: ["feature_folding", "feature_large_openings", "feature_year_guarantee"] },
  ];
  return (
    <div className="scroll-mt-16">
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-700">{t("mosquito_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div key={idx} className="text-center group hover:scale-105 transition-transform duration-300">
                <img src={item.img} alt={t(item.title)} className="w-full h-auto rounded-xl mb-3 shadow-md group-hover:shadow-green-500/30 transition" />
                <h3 className="text-lg font-bold text-gray-800">{t(item.title)}</h3>
                <p className="text-gray-500 text-sm mt-1">{t(item.desc)}</p>
                <div className="mt-2">
                  <span className="text-green-600 font-bold text-xl">{t(item.price)}</span>
                  <span className="text-gray-400 line-through text-sm ml-2">{t(item.old)}</span>
                </div>
                <ul className="text-left mt-3 space-y-1 text-sm text-gray-600">
                  {item.features.map((f, i) => <li key={i}>☐ {t(f)}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button onClick={() => onOrderClick(t("mosquito_title"))} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">
              {t("order_mosquito_btn")} <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlindsBlock({ onOrderClick }: { onOrderClick: (service: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="scroll-mt-16">
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-700">{t("blinds_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <img src="/images/gorizontal.png" alt="Gorizontal" className="w-full h-auto rounded-xl mb-3 shadow-md group-hover:shadow-yellow-500/30 transition" />
              <h3 className="text-lg font-bold text-gray-800">{t("horizontal_title")}</h3>
              <p className="text-gray-500 text-sm mt-1">{t("horizontal_desc")}</p>
              <div className="mt-2">
                <span className="text-green-600 font-bold text-xl">{t("horizontal_price_from")}</span>
                <span className="text-gray-400 line-through text-sm ml-2">{t("horizontal_price_old")}</span>
              </div>
              <ul className="text-left mt-3 space-y-1 text-sm text-gray-600">
                <li>☐ {t("feature_50_colors")}</li>
                <li>☐ {t("feature_material_aluminum")}</li>
                <li>☐ {t("feature_mounting_included")}</li>
              </ul>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <img src="/images/vertical.png" alt="Vertical" className="w-full h-auto rounded-xl mb-3 shadow-md group-hover:shadow-yellow-500/30 transition" />
              <h3 className="text-lg font-bold text-gray-800">{t("vertical_title")}</h3>
              <p className="text-gray-500 text-sm mt-1">{t("vertical_desc")}</p>
              <div className="mt-2">
                <span className="text-green-600 font-bold text-xl">{t("vertical_price_from")}</span>
                <span className="text-gray-400 line-through text-sm ml-2">{t("vertical_price_old")}</span>
              </div>
              <ul className="text-left mt-3 space-y-1 text-sm text-gray-600">
                <li>☐ {t("feature_fabric_density")}</li>
                <li>☐ {t("feature_measure_install")}</li>
                <li>☐ {t("feature_year_guarantee")}</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-6">
            <button onClick={() => onOrderClick(t("blinds_title"))} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">
              {t("order_blinds_btn")} <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RepairBlock({ onOrderClick }: { onOrderClick: (service: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="scroll-mt-16">
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-orange-700">{t("window_repair_title")}</h2>
          <div className="max-w-md mx-auto text-center">
            <Wrench className="h-12 w-12 text-orange-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">{t("window_repair_desc")}</p>
            <div className="mt-2"><span className="text-green-600 font-bold text-2xl">{t("repair_price")}</span></div>
            <ul className="text-left max-w-xs mx-auto mt-4 space-y-1 text-sm text-gray-600">
              <li>☐ {t("feature_master_visit")}</li>
              <li>☐ {t("feature_parts_stock")}</li>
              <li>☐ {t("feature_receipt_guarantee")}</li>
            </ul>
          </div>
          <div className="text-center mt-6">
            <button onClick={() => onOrderClick(t("window_repair_title"))} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">
              {t("order_repair_btn")} <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ------------------------------------------------------------
// НАВИГАЦИОННЫЕ КНОПКИ (всегда ведут на страницы)
// ------------------------------------------------------------
function NavButtons() {
  const { t } = useTranslation();
  const navItems = [
    { label: "nav_ac", icon: <Snowflake className="h-8 w-8 group-hover:scale-110 transition" />, path: "/montazh-konditsionerov", color: "blue" },
    { label: "nav_mosquito", icon: <Wind className="h-8 w-8 group-hover:scale-110 transition" />, path: "/moskitnye-setki", color: "green" },
    { label: "nav_blinds", icon: <Menu className="h-8 w-8 group-hover:scale-110 transition" />, path: "/zhalyuzi", color: "yellow" },
    { label: "nav_repair", icon: <Wrench className="h-8 w-8 group-hover:scale-110 transition" />, path: "/remont-okon", color: "orange" },
  ];
  const colorClasses = {
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
    green: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
    yellow: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700",
    orange: "bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700",
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className={`group p-4 rounded-xl border transition flex flex-col items-center gap-2 ${colorClasses[item.color as keyof typeof colorClasses]}`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{t(item.label)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// HERO (только на главной)
// ------------------------------------------------------------
function Hero() {
  const { t } = useTranslation();
  return (
    <section className="text-center px-4 py-12 max-w-4xl mx-auto">
      <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mb-4">{t("badge_sale")}</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900">{t("hero_title")}</h1>
      <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">{t("hero_desc")}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <a href={PHONE_LINK} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition">
          <Phone className="h-5 w-5" /> {t("call_btn")}
        </a>
        <a href={TELEGRAM_LINK} target="_blank" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
          <Send className="h-5 w-5" /> {t("telegram_btn")}
        </a>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// ФОРМА ЗАКАЗА (принимает selectedService и setter)
// ------------------------------------------------------------
function OrderForm({
  selectedService,
  setSelectedService
}: {
  selectedService: string;
  setSelectedService: (service: string) => void;
}) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("+998 ");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ service: selectedService, phone, name }),
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

  return (
    <section id="form" className="max-w-xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{t("form_title")}</h2>
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 space-y-4 shadow-lg border border-gray-200">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">{t("service_label")}</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-green-500"
          >
            <option>{t("ac_services_title")}</option>
            <option>{t("mosquito_title")}</option>
            <option>{t("blinds_title")}</option>
            <option>{t("window_repair_title")}</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">{t("name_label")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name_placeholder")} className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">{t("phone_label")}</label>
          <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="+998..." className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-green-500" />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {submitted ? (
          <div className="text-green-600 text-center font-semibold py-3">✅ {t("success_message")}</div>
        ) : (
          <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
            {submitting ? t("submitting") : <>{t("order_btn")} <ChevronRight className="h-5 w-5" /></>}
          </button>
        )}
        <p className="text-gray-400 text-xs text-center">{t("consent_text")}</p>
      </form>
    </section>
  );
}

// ------------------------------------------------------------
// ГЛАВНЫЙ КОМПОНЕНТ
// ------------------------------------------------------------
export default function Landing() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [selectedService, setSelectedService] = useState(t("mosquito_title"));

  // Отслеживаем просмотры страниц для Google Analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location });
  }, [location]);

  // При переходе на страницу услуги обновляем выбранную услугу в форме
  useEffect(() => {
    if (location === "/montazh-konditsionerov") setSelectedService(t("ac_services_title"));
    else if (location === "/moskitnye-setki") setSelectedService(t("mosquito_title"));
    else if (location === "/zhalyuzi") setSelectedService(t("blinds_title"));
    else if (location === "/remont-okon") setSelectedService(t("window_repair_title"));
  }, [location, t]);

  const scrollToForm = (service: string) => {
    setSelectedService(service);
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <NavButtons />

      <Switch>
        {/* Главная страница */}
        <Route path="/">
          <Hero />
          <Benefits />
          <Gallery />
          <Reviews />
          <OrderForm selectedService={selectedService} setSelectedService={setSelectedService} />
          <Contacts />
          <Footer />
        </Route>

        {/* Страница кондиционеров */}
        <Route path="/montazh-konditsionerov">
          <Benefits />
          <ACBlock onOrderClick={scrollToForm} />
          <OrderForm selectedService={selectedService} setSelectedService={setSelectedService} />
          <Reviews />
          <Contacts />
          <Footer />
        </Route>

        {/* Страница москитных сеток */}
        <Route path="/moskitnye-setki">
          <Benefits />
          <MosquitoBlock onOrderClick={scrollToForm} />
          <OrderForm selectedService={selectedService} setSelectedService={setSelectedService} />
          <Reviews />
          <Contacts />
          <Footer />
        </Route>

        {/* Страница жалюзи */}
        <Route path="/zhalyuzi">
          <Benefits />
          <BlindsBlock onOrderClick={scrollToForm} />
          <OrderForm selectedService={selectedService} setSelectedService={setSelectedService} />
          <Reviews />
          <Contacts />
          <Footer />
        </Route>

        {/* Страница ремонта окон */}
        <Route path="/remont-okon">
          <Benefits />
          <RepairBlock onOrderClick={scrollToForm} />
          <OrderForm selectedService={selectedService} setSelectedService={setSelectedService} />
          <Reviews />
          <Contacts />
          <Footer />
        </Route>

        {/* 404 */}
        <Route>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold">404</h1>
            <p>Страница не найдена</p>
            <Link href="/" className="text-green-600 underline">Вернуться на главную</Link>
          </div>
        </Route>
      </Switch>

      <Analytics />
    </div>
  );
}

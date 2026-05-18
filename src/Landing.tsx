import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import ReactGA from "react-ga4";
import {
  Phone,
  Send,
  ShieldCheck,
  Clock,
  Hammer,
  Star,
  ChevronRight,
  Wrench,
  Wind,
} from "lucide-react";

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

export default function Landing() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  const [location] = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location });
  }, [location]);

  const [selectedService, setSelectedService] = useState(t("mosquito_title"));
  const [phone, setPhone] = useState("+998 ");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderClick = (serviceTitleKey: string) => {
    setSelectedService(serviceTitleKey);
    setSubmitted(false);
    setError(null);
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          service: selectedService,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <header className="flex flex-wrap items-center justify-between px-4 py-3 max-w-6xl mx-auto gap-2">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold">{t("header")}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => changeLanguage("ru")} className={`px-3 py-1 rounded-md transition ${i18n.language === "ru" ? "bg-green-500 text-black font-semibold" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>Русский</button>
          <button onClick={() => changeLanguage("uz")} className={`px-3 py-1 rounded-md transition ${i18n.language === "uz" ? "bg-green-500 text-black font-semibold" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>O‘zbekcha</button>
        </div>
        <div className="text-sm text-gray-400">{t("city_since")}</div>
      </header>

      <section className="text-center px-4 py-8 max-w-4xl mx-auto">
        <div className="inline-block bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm mb-4">{t("badge_sale")}</div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{t("hero_title")}</h1>
        <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">{t("hero_desc")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href={PHONE_LINK} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-xl transition"><Phone className="h-5 w-5" /> {t("call_btn")}</a>
          <a href={TELEGRAM_LINK} target="_blank" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition"><Send className="h-5 w-5" /> {t("telegram_btn")}</a>
        </div>
      </section>

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

      {/* КАРТОЧКА 1: МОСКИТНЫЕ СЕТКИ */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
          <h2 className="text-2xl font-bold text-center mb-6">{t("mosquito_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <img src="/images/standart.png" alt="Standart" className="w-full h-auto rounded-xl mb-3" />
              <h3 className="text-lg font-bold">{t("standart_title")}</h3>
              <p className="text-gray-400 text-sm mt-1">{t("standart_desc")}</p>
              <div className="mt-2">
                <span className="text-green-400 font-bold text-xl">{t("standart_price_from")}</span>
                <span className="text-gray-500 line-through text-sm ml-2">{t("standart_price_old")}</span>
              </div>
              <ul className="text-left mt-3 space-y-1 text-sm text-gray-300">
                <li>☐ {t("feature_free_measure")}</li>
                <li>☐ {t("feature_one_day")}</li>
                <li>☐ {t("feature_year_guarantee")}</li>
              </ul>
            </div>
            <div className="text-center">
              <img src="/images/synax.png" alt="Synax" className="w-full h-auto rounded-xl mb-3" />
              <h3 className="text-lg font-bold">{t("synax_title")}</h3>
              <p className="text-gray-400 text-sm mt-1">{t("synax_desc")}</p>
              <div className="mt-2">
                <span className="text-green-400 font-bold text-xl">{t("synax_price_from")}</span>
                <span className="text-gray-500 line-through text-sm ml-2">{t("synax_price_old")}</span>
              </div>
              <ul className="text-left mt-3 space-y-1 text-sm text-gray-300">
                <li>☐ {t("feature_no_drilling")}</li>
                <li>☐ {t("feature_one_day")}</li>
                <li>☐ {t("feature_year_guarantee")}</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-6">
            <button onClick={() => handleOrderClick(t("mosquito_title"))} className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">{t("order_mosquito_btn")} <ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </section>

      {/* КАРТОЧКА 2: ЖАЛЮЗИ */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
          <h2 className="text-2xl font-bold text-center mb-6">{t("blinds_title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <img src="/images/gorizontal.png" alt="Gorizontal" className="w-full h-auto rounded-xl mb-3" />
              <h3 className="text-lg font-bold">{t("horizontal_title")}</h3>
              <p className="text-gray-400 text-sm mt-1">{t("horizontal_desc")}</p>
              <div className="mt-2">
                <span className="text-green-400 font-bold text-xl">{t("horizontal_price_from")}</span>
                <span className="text-gray-500 line-through text-sm ml-2">{t("horizontal_price_old")}</span>
              </div>
              <ul className="text-left mt-3 space-y-1 text-sm text-gray-300">
                <li>☐ {t("feature_50_colors")}</li>
                <li>☐ {t("feature_material_aluminum")}</li>
                <li>☐ {t("feature_mounting_included")}</li>
              </ul>
            </div>
            <div className="text-center">
              <img src="/images/vertical.png" alt="Vertical" className="w-full h-auto rounded-xl mb-3" />
              <h3 className="text-lg font-bold">{t("vertical_title")}</h3>
              <p className="text-gray-400 text-sm mt-1">{t("vertical_desc")}</p>
              <div className="mt-2">
                <span className="text-green-400 font-bold text-xl">{t("vertical_price_from")}</span>
                <span className="text-gray-500 line-through text-sm ml-2">{t("vertical_price_old")}</span>
              </div>
              <ul className="text-left mt-3 space-y-1 text-sm text-gray-300">
                <li>☐ {t("feature_fabric_density")}</li>
                <li>☐ {t("feature_measure_install")}</li>
                <li>☐ {t("feature_year_guarantee")}</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-6">
            <button onClick={() => handleOrderClick(t("blinds_title"))} className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">{t("order_blinds_btn")} <ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </section>

      {/* КАРТОЧКА 3: РЕМОНТ ОКОН */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
          <h2 className="text-2xl font-bold text-center mb-6">{t("window_repair_title")}</h2>
          <div className="max-w-md mx-auto text-center">
            <Wrench className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-300 mb-3">{t("window_repair_desc")}</p>
            <div className="mt-2">
              <span className="text-green-400 font-bold text-2xl">{t("repair_price")}</span>
            </div>
            <ul className="text-left max-w-xs mx-auto mt-4 space-y-1 text-sm text-gray-300">
              <li>☐ {t("feature_master_visit")}</li>
              <li>☐ {t("feature_parts_stock")}</li>
              <li>☐ {t("feature_receipt_guarantee")}</li>
            </ul>
          </div>
          <div className="text-center mt-6">
            <button onClick={() => handleOrderClick(t("window_repair_title"))} className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-xl transition inline-flex items-center gap-2">{t("order_repair_btn")} <ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАКАЗА */}
      <section id="form" className="max-w-xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-6">{t("form_title")}</h2>
        <form onSubmit={onSubmit} className="bg-white/5 backdrop-blur rounded-2xl p-6 space-y-4 border border-white/10">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t("service_label")}</label>
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)} 
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
            >
              <option>{t("mosquito_title")}</option>
              <option>{t("blinds_title")}</option>
              <option>{t("window_repair_title")}</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t("name_label")}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name_placeholder")} className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t("phone_label")}</label>
            <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="+998..." className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-500" />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {submitted ? (
            <div className="text-green-400 text-center font-semibold py-3">✅ {t("success_message")}</div>
          ) : (
            <button type="submit" disabled={submitting} className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
              {submitting ? t("submitting") : <>{t("order_btn")} <ChevronRight className="h-5 w-5" /></>}
            </button>
          )}
          <p className="text-gray-500 text-xs text-center">{t("consent_text")}</p>
        </form>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("ready_title")}</h2>
        <p className="text-gray-400 mb-6">{t("ready_desc")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href={PHONE_LINK} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-xl text-lg transition"><Phone className="h-5 w-5" /> {PHONE_NUMBER}</a>
          <a href={TELEGRAM_LINK} target="_blank" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"><Send className="h-5 w-5" /> {t("telegram_write")}</a>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-center mb-4">{t("reviews_title")}</h2>
        <p className="text-gray-400 text-center mb-8">{t("reviews_subtitle")}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
            <div className="flex items-center gap-3 mb-3"><div className="bg-green-500/20 rounded-full w-10 h-10 flex items-center justify-center text-green-400 font-bold">А</div><div><div className="font-semibold">Анна К.</div><div className="text-yellow-400 text-sm">★★★★★</div></div></div>
            <p className="text-gray-300">{t("review_1_text")}</p>
            <div className="text-green-400 text-xs mt-3">✅ {t("review_verified")}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur border border-white/10">
            <div className="flex items-center gap-3 mb-3"><div className="bg-green-500/20 rounded-full w-10 h-10 flex items-center justify-center text-green-400 font-bold">Б</div><div><div className="font-semibold">Бахром Н.</div><div className="text-yellow-400 text-sm">★★★★★</div></div></div>
            <p className="text-gray-300">{t("review_2_text")}</p>
            <div className="text-green-400 text-xs mt-3">✅ {t("review_verified")}</div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href={TELEGRAM_LINK} target="_blank" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition"><Send className="h-5 w-5" /> {t("leave_review_btn")}</a>
          <p className="text-gray-500 text-xs mt-2">{t("review_hint")}</p>
        </div>
      </section>

      <footer className="text-center text-gray-600 text-sm py-6 border-t border-white/5">Moskitki.uz © 2019 – {new Date().getFullYear()} — {t("footer_city")}</footer>
    </div>
  );
}

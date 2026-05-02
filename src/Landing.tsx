// УДАЛЕНО: import { createOrder } from "@/lib/api";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  Phone,
  Send,
  ShieldCheck,
  Clock,
  Hammer,
  CheckCircle2,
  Star,
  ChevronRight,
  Sparkles,
  Wrench,
  Wind,
} from "lucide-react";

// === CONTACTS ===
const PHONE_NUMBER = "+998 99 055 06 60";
const PHONE_LINK = "tel:+998990550660";
const TELEGRAM_USERNAME = "moskitki_uz";
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_USERNAME}`;
// =================

type ServiceKey = "moskitnaya-setka" | "zhalyuzi" | "remont-okon";

const SERVICES = [
  {
    key: "moskitnaya-setka",
    title: "Москитные сетки",
    price: "Форточки от 75 000 сум\nОкна от 120 000 сум",
    old: "Форточки от 100 000 сум\nОкна от 150 000 сум",
    desc: "Защита от комаров, мошек и пыли. Изготовление за 1 день.",
    icon: <Wind className="h-6 w-6" />,
    features: ["Замер бесплатно", "Срок 1 день", "Гарантия 1 года"],
  },
  {
    key: "zhalyuzi",
    title: "Жалюзи и рулонные шторы",
    price: "от 250 000 сум",
    old: "от 320 000 сум",
    desc: "Горизонтальные, вертикальные, рулонные.",
    icon: <Sparkles className="h-6 w-6" />,
    features: ["50+ цветов", "Монтаж включён"],
  },
  {
    key: "remont-okon",
    title: "Ремонт окон",
    price: "от 50 000 сум",
    desc: "Замена фурнитуры, регулировка.",
    icon: <Wrench className="h-6 w-6" />,
    features: ["Выезд мастера", "Гарантия"],
  },
];

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
  const [selectedService, setSelectedService] = useState(SERVICES[0].title);
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
      setError("Введите корректный номер");
      return;
    }

    setSubmitting(true);

    try {
      await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      setError("Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold">Москитки.uz</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full p-2 text-black"
        >
          {SERVICES.map((s) => (
            <option key={s.key}>{s.title}</option>
          ))}
        </select>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
          className="w-full p-2 text-black"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="+998..."
          className="w-full p-2 text-black"
        />

        {error && <div className="text-red-400">{error}</div>}

        {submitted ? (
          <div className="text-green-400">Заявка отправлена</div>
        ) : (
          <button className="bg-green-400 text-black px-4 py-2">
            Заказать
          </button>
        )}
      </form>
    </div>
  );
}

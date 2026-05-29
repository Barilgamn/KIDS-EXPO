import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  CalendarDays,
  MapPin,
  Users,
  TrendingUp,
  Star,
  Store,
  Palette,
  Gamepad2,
  Pizza,
  Coffee,
  CircleCheck,
  Truck,
  Ticket,
  Camera,
  Check,
  ArrowRight,
  Phone,
  Mail,
  Facebook,
  ArrowUp,
  X,
  Loader2,
  Menu,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { db, collection, addDoc, serverTimestamp, OperationType, handleFirestoreError, testConnection } from "./lib/firebase";
import AdminPanel from "./components/AdminPanel";

const participants = [
  "Friut house",
  "Хүүхдийн бэлгийн багц, тоглоом",
  "Dudi.S store Дархлаа дэмжих ванн дүрлэг",
  "Toys&Treats",
  "Bamboo express bubble tea",
  "MAGIC BAKERY АМТАТ ТАРТ",
  "Dembee’s online shop",
  "Cafe de Lolita anime and maid cafe",
  "Happiness brand",
  "НАРАН КИДС СТОР ХХК",
  "КОЛОМЕНСКИЙ БРЭНД   НОМУН КОНДИТЕР ХХК",
  "Ами тами солонгос бараа",
  "Хайрын амт KOZED",
  "Монгол арвайтай шоколад",
  "TOY SLAYER MN",
  "Star kids store",
  "Урко сүүн зайрмаг",
  "Tselmeg Digital International School",
  "BABYMOM&FUTURE",
  "MIRAI OPTIC CENTER",
  "“Narlag camp”  “ Shine bright shop”",
  "KIDSWELL JELLY STRAWS",
  "Garden books",
  "THE ENGLISH SCHOOL OF ULAANBAATAR",
  "Goo sweet corner Зайрмаг чихэр",
  "Haakaa Brand  - Эх нярайн New Zealand брэнд",
  "PN Kids Brand - USA Гамми хүүхдийн витамин",
  "DONER COLA KEBAB",
  "BAMBOO BUBBLE TEA",
  "AWARDTOYS - MOONKIE",
  "Tenuunkids shop",
  "Азифарма Дистрибьюшн",
  "Parle Mongolia, Yobick Mongolia",
  "Tongtai Mongolia",
  "Гамба Органик ХХК Монгол мөөг",
  "Хүүхдийн Танин Мэдэхүйн Карт",
  "Биомон кидс Санитас",
  "MARSHAL RESTAURANT & LOUNGE",
  "МОМИВА МОНГОЛИА ЭХ ХҮҮХДИЙН ТӨРСНИЙ ДАРААХ АСАРГАА",
  "Саахалт брэнд & Hangai Pinenut",
  "Demon Huntrix Pop up store",
  "Уудаг ээзгий / Сүүн зайрмаг - Ice cream delicious",
  "Korean toys",
  "Nandin brand store хүүхдийн хувцас, тоглоом",
  "Little Montessori House-хүүхдийн органик,сэтгэхүй хөгжүүлэх тоглоом.",
  "Magic Craft Mongolia",
  "Vitasub Mongolia",
  "Aylora Camp",
  "CATCH ME тоглоомын төв",
  "Бомбордук хүүхдийн уламжлалт эмнэлэг",
  "Abizi brand 🇲🇳",
  "KM ONLINE SHOP, ХҮҮХДИЙН ТОГЛООМ",
  "DEMON HUNTRIX POP UP STORE"
];

const KidsExpoLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col items-center justify-center select-none ${className}`}>
    <div className="flex items-center -mb-2">
      <span className="text-[#FBCB13] font-black text-[32px] md:text-[44px] leading-none tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>K</span>
      <img src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-01-1.png?w=1959&ssl=1" alt="Heart" className="h-[36px] md:h-[50px] object-contain mx-[-2px] md:mx-[-4px] z-10" />
      <span className="text-[#089E46] font-black text-[32px] md:text-[44px] leading-none tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>D</span>
      <span className="text-[#F2539D] font-black text-[32px] md:text-[44px] leading-none tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>S</span>
    </div>
    <div className="flex items-center gap-1 md:gap-[5px]">
      <div className="bg-[#E23D28] text-white font-black text-[22px] md:text-[30px] w-[26px] h-[26px] md:w-[36px] md:h-[36px] flex items-center justify-center transform -rotate-[4deg] rounded md:rounded-md shadow-sm border border-[#c1301c]">E</div>
      <div className="bg-[#F19B1A] text-white font-black text-[22px] md:text-[30px] w-[26px] h-[26px] md:w-[36px] md:h-[36px] flex items-center justify-center transform rotate-[2deg] rounded md:rounded-md shadow-sm border border-[#d68713]">X</div>
      <div className="bg-[#2A5BAE] text-white font-black text-[22px] md:text-[30px] w-[26px] h-[26px] md:w-[36px] md:h-[36px] flex items-center justify-center transform rotate-[4deg] rounded md:rounded-md shadow-sm border border-[#1f488f]">P</div>
      <div className="bg-[#A7D13E] text-white font-black text-[22px] md:text-[30px] w-[26px] h-[26px] md:w-[36px] md:h-[36px] flex items-center justify-center transform rotate-[-2deg] rounded md:rounded-md shadow-sm border border-[#8caf2f]">O</div>
    </div>
  </div>
);

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);

  const videoContainerRef = useRef(null);
  const isVideoInView = useInView(videoContainerRef, { amount: 0.5, once: true });

  const REGISTRATION_LINK = "https://forms.gle/Dry6d51EJSChZA6d8";
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "visitor",
    message: "",
  });

  const [isAdminView, setIsAdminView] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    // Basic routing via URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminView(true);
    }
  }, []);

  if (isAdminView) {
    return <AdminPanel onBack={() => {
      setIsAdminView(false);
      window.history.pushState({}, '', window.location.pathname);
    }} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "registrations"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF3366", "#FFD700", "#00DF9A", "#007AFF"],
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
        setFormData({ name: "", email: "", phone: "", type: "visitor", message: "" });
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "registrations");
      setError("Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shuffledParticipants = useMemo(() => {
    return [...participants].sort(() => Math.random() - 0.5);
  }, []);

  const scheduleData = [
    {
      date: "05.29",
      day: "БААСАН",
      events: [
        { time: "09:00", description: '"KIDS EXPO 2026" эх, үрсэд зориулсан үзэсгэлэн, худалдаа нээнэ' },
        { time: "11:30", description: 'Хүндэт зочдыг угтах' },
        { time: "11:40", description: 'Хэвлэл мэдээлэлийн цаг' },
        { time: "12:00 - 12:05", description: 'Нээлтийн үйл ажиллагаа' },
        { time: "12:30 - 12:35", description: 'Баярын тууз хайчлах ёслол' },
        { time: "12:35 - 12:50", description: 'Урлагийн тоглолт ' },
        { time: "12:50 - 13:05", description: 'Спонсорын талархал' },
        { time: "13:05 - 13:25", description: 'Мөнх тунх - Маскот бүжгийн шоу' },
        { time: "13:25 - 13:35", description: 'Үзэсгэлэн, яармагтай танилцах аялал' },
        { time: "13:35", description: 'Хүндэт зочдын үдийн зоог' },
        { time: "12:30 - 13:30", description: 'LIVE үзэсгэлэнд оролцогчдын шууд дамжуулалт' },
        { time: "13:30 - 14:00", description: 'Хүүхэд, гэр бүлийн хөгжил, хамгааллын ерөнхий газар (108 Таны Дотны найз )' },
        { time: "14:00 - 16:00", description: 'Оролцогч байгуулгуудын танилцуулга' },
      ]
    },
    {
      date: "05.30",
      day: "БЯМБА",
      events: [
        { time: "10:00 - 11:00", description: 'Barilga mn болон Barilgachin group-ийн хүүхдүүдэд бэлэг гардуулах' },
        { time: "12:00 - 12:20", description: 'Мөнх тунх маскот (POCKET )' },
        { time: "12:30 - 13:30", description: 'KIDS GOT TALENT (Манайхаас)' },
        { time: "13:30 - 14:30", description: 'Хөгжөөнт тоглоом (Шууд тайзан дээр )' },
        { time: "14:00 - 14:30", description: 'Хүүхэд, гэр бүлийн хөгжил, хамгааллын ерөнхий газар (108 Таны Дотны найз )' },
        { time: "14:30 - 16:30", description: 'Оролцогч байгуулгуудын танилцуулга' },
      ]
    },
    {
      date: "05.31",
      day: "НЯМ",
      events: [
        { time: "12:00 - 14:00", description: '"Загварын шоу" Naran life style OVS brand (Мандухай)' },
        { time: "14:00 - 14:30", description: 'Хүүхэд, гэр бүлийн хөгжил, хамгааллын ерөнхий газар (108 Таны Дотны найз )' },
        { time: "15:00 - 17:00", description: 'Оролцогч байгуулгуудын танилцуулга' },
      ]
    },
    {
      date: "06.01",
      day: "ДАВАА",
      events: [
        { time: "12:00 - 13:00", description: 'ENTERTAINMENT MN ЖҮЖИГ' },
        { time: "13:00 - 13:30", description: 'Хүүхэд, гэр бүлийн хөгжил, хамгааллын ерөнхий газар (108 Таны Дотны найз )' },
        { time: "13:30 - 13:45", description: '"Үлэг гүрвэл" Nigth train хамтлаг' },
        { time: "14:45 - 15:15", description: 'HAPPY FAMILY CHALLENGE фото уралдаан шагнал гардуулалт' },
        { time: "15:15 - 15:30", description: '"Үлэг гүрвэл" Nigth train хамтлаг' },
      ]
    }
  ];

  const balloonColors = [
    { bg: "bg-[#FF6B6B]", text: "text-white" }, // Red
    { bg: "bg-[#4ECDC4]", text: "text-white" }, // Teal
    { bg: "bg-[#FFD93D]", text: "text-[#8B7500]" }, // Yellow
    { bg: "bg-[#6C5CE7]", text: "text-white" }, // Purple
    { bg: "bg-[#A8E6CF]", text: "text-[#2D5A47]" }, // Mint
    { bg: "bg-[#FF8B94]", text: "text-white" }, // Pink
    { bg: "bg-[#96CEB4]", text: "text-white" }, // Sage
    { bg: "bg-[#FFEEAD]", text: "text-[#918151]" }, // Cream
    { bg: "bg-[#D4A5A5]", text: "text-white" }, // Dusty Rose
    { bg: "bg-[#A29BFE]", text: "text-white" }, // Lavender
    { bg: "bg-[#F9A826]", text: "text-white" }, // Orange
    { bg: "bg-[#00B894]", text: "text-white" }, // Green
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 },
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-brand-pink selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-2xl z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center gap-2">
              <a href="/" className="transition-transform hover:scale-105 active:scale-95 py-2">
                <KidsExpoLogo className="scale-90 md:scale-100 origin-left" />
              </a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <a href="/" className="text-brand-dark hover:text-brand-pink font-extrabold text-sm lg:text-base xl:text-lg transition-colors">Нүүр</a>
              <a href="#about" className="text-brand-dark hover:text-brand-pink font-extrabold text-sm lg:text-base xl:text-lg transition-colors">Тухай</a>
              <a href="#schedule" className="text-brand-dark hover:text-brand-pink font-extrabold text-sm lg:text-base xl:text-lg transition-colors">Хөтөлбөр</a>
              <a href="#participants" className="text-brand-dark hover:text-brand-pink font-extrabold text-sm lg:text-base xl:text-lg transition-colors">Оролцогчид</a>
              <a href="#footer" className="text-brand-dark hover:text-brand-pink font-extrabold text-sm lg:text-base xl:text-lg transition-colors">Холбоо барих</a>
            </div>

            {/* Desktop Button / Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold transition-all hover:shadow-lg hover:shadow-brand-blue/30 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  Бүртгүүлэх
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-brand-dark hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar (Floating Dropdown) */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-[55] md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-[80px] left-4 right-4 bg-white z-[60] shadow-2xl md:hidden p-5 flex flex-col rounded-[24px]"
              >
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="font-bold text-lg text-brand-dark">MENU</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-brand-dark" />
                  </button>
                </div>

                <div className="flex flex-col bg-gray-50/50 rounded-2xl p-2 gap-1 mb-6 border border-gray-100">
                  <a href="/" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:text-brand-dark hover:shadow-sm transition-all focus:bg-white">Нүүр</a>
                  <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:text-brand-dark hover:shadow-sm transition-all focus:bg-white">Тухай</a>
                  <a href="#schedule" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:text-brand-dark hover:shadow-sm transition-all focus:bg-white">Хөтөлбөр</a>
                  <a href="#participants" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:text-brand-dark hover:shadow-sm transition-all focus:bg-white">Оролцогчид</a>
                  <a href="#footer" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:text-brand-dark hover:shadow-sm transition-all focus:bg-white">Холбоо барих</a>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-brand-blue/30 active:scale-95 transition-all"
                  >
                    Бүртгүүлэх
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[80vh] flex items-center bg-[#FAFAFA]">
        {/* Background Decorative Shapes */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-yellow rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-pink rounded-full blur-[150px]" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-brand-blue rounded-full blur-[100px]" />
        </div>

        {/* Floating Characters */}
        <motion.img
          src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-01-1.png?w=1959&ssl=1"
          alt="Heart Character"
          className="absolute top-24 left-[2%] w-16 md:top-40 md:left-[5%] md:w-32 lg:w-40 h-auto z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <motion.img
          src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-02-1.png?w=1979&ssl=1"
          alt="Cloud Character"
          className="absolute top-24 right-[5%] w-20 md:top-32 md:right-[12%] md:w-36 lg:w-48 h-auto z-10"
          animate={{ y: [0, -15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.img
          src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-03-1.png?w=2003&ssl=1"
          alt="Star Character"
          className="absolute bottom-10 left-[2%] w-16 md:bottom-4 md:left-[2%] md:w-32 lg:w-44 h-auto z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.img
          src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-04-1.png?w=1923&ssl=1"
          alt="Green Ball Character"
          className="absolute bottom-20 right-[2%] w-14 md:bottom-12 md:right-[2%] md:w-28 lg:w-36 h-auto z-10"
          animate={{ y: [0, -15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-brand-yellow text-brand-dark font-black text-sm tracking-widest uppercase mb-6 shadow-md transform -rotate-2">
              Нярай • Хүүхэд • Өсвөр үе
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-black leading-none tracking-tighter mb-6 text-brand-dark drop-shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            KIDS EXPO{" "}
            <span className="text-brand-pink underline decoration-brand-yellow decoration-8 underline-offset-[12px]">
              2026
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Хүүхэд, залуучууд болон тэдний гэр бүлд зориулсан нэгдсэн арга
            хэмжээ. Суралцах, тоглох, бүтээх боломжийг нэг дор!
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 bg-brand-yellow px-6 py-4 rounded-2xl shadow-md border border-brand-yellow/20 font-bold text-brand-dark">
              <CalendarDays className="text-brand-dark w-6 h-6" />
              2026.05.29 - 06.01
            </div>
            <div className="flex items-center justify-center gap-2 bg-brand-green px-6 py-4 rounded-2xl shadow-md border border-brand-green/20 font-bold text-white text-center md:text-left">
              <MapPin className="text-white w-6 h-6 shrink-0" />
              <span>Төв цэнгэлдэх хүрээлэн, Сурын талбай, Шагайн асар</span>
            </div>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-wrap justify-center gap-4 text-xl md:text-2xl font-black text-brand-dark/30 uppercase tracking-widest">
              <span className="text-brand-pink">Play</span> •
              <span className="text-brand-yellow">Create</span> •
              <span className="text-brand-green">Discover Fun</span> •
              <span className="text-brand-blue">Together</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Stats Section */}
      <section id="about" className="py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 relative group max-w-5xl mx-auto"
            ref={videoContainerRef}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-yellow via-brand-pink to-brand-green rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-video w-full bg-brand-dark/50 rounded-[2.8rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10">
              {isVideoInView ? (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4279818708958406&show_text=0&width=560&autoplay=true&mute=1"
                  title="KIDS EXPO 2026 Promo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-dark/80">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full border-4 border-brand-pink border-t-transparent animate-spin mb-4" />
                    <p className="text-white/60 font-medium">Video Loading...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center"
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Арга хэмжээний <br />
                <span className="text-brand-yellow">Давуу Тал</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Төв цэнгэлдэх хүрээлэнгийн Сур, Шагай харвааны талбай нь дэд
                бүтэц болон хүртээмжийн хувьд бусад цэгүүдээс 60%-иар илүү
                өгөөжтэй бөгөөд орон нутгийн болон олон улсын байгууллагуудын
                хамтын ажиллагааны орчинг бүрдүүлнэ.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center mb-4">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-1">50k-70k</h3>
                  <p className="text-white/70 font-medium">
                    Зорилтот хэрэглэгч нэг дор төвлөрнө
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-1">3-5x</h3>
                  <p className="text-white/70 font-medium">
                    Хөдөлгөөний нягтрал нэмэгдэнэ
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-brand-blue to-brand-pink rounded-[3rem] p-8 transform rotate-3 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
                {/* Decorative dots */}
                <div
                  className="absolute opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, white 2px, transparent 2px)",
                    backgroundSize: "24px 24px",
                    inset: 0,
                  }}
                />

                <h3 className="text-4xl font-black mb-4 relative z-10">
                  Борлуулалтаа өсгөх хамгийн таатай боломж
                </h3>
                <p className="text-xl font-medium text-white/90 relative z-10">
                  Бүтэн өдрийн турш саатах "Family Park" орчинд
                  хэрэглэгчидтэйгээ хамгийн ойроос харилцаарай.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Zones Section (Bento Grid) */}
      <section id="zones" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">
              Экспогийн <span className="text-brand-pink">Талбай</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Зочдод илүү тухтай, сонирхолтой байлгах үүднээс талбайг дараах
              үндсэн хэсгүүдэд хуваан төлөвлөлөө.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {[
              {
                title: "Main Stage",
                subtitle: "Төв тайз",
                desc: "Тэмцээн уралдаан, 'Best Exhibitor Awards', урлагийн тоглолт.",
                icon: Star,
                color: "bg-brand-pink",
                image: "https://www.eventmarketer.com/wp-content/uploads/2019/07/walmart-2019_associates-celebration_2.jpg",
                span: "col-span-1 md:col-span-2 lg:col-span-2",
              },
              {
                title: "Expo Booth",
                subtitle: "Үзэсгэлэнгийн асар",
                desc: "Бүхий л бараа бүтээгдэхүүнийг борлуулах, сурталчлах асрууд.",
                icon: Store,
                color: "bg-brand-blue",
                image: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1280,h_854/w_79,x_14,y_14,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/bji523wnpkb1xvpglsp7/11thChildrensBookFairandSuperParentsKidsExpo.jpg",
                span: "col-span-1",
              },
              {
                title: "Workshop",
                subtitle: "Experience Zone",
                desc: "Зурах, нүүр будах, шоо эвлүүлэх, уламжлалт тоглоом тоглох туршилтын талбай.",
                icon: Palette,
                color: "bg-brand-yellow",
                image: "https://assets.partywizz.com/blog/20240621103051/arts-and-crafts-kids-workshop-ideas-for-entertainers-and-parents.png",
                textColor: "text-white",
                span: "col-span-1",
              },
              {
                title: "Kids Play",
                subtitle: "Зугаа цэнгэл",
                desc: "Хийлдэг тоглоом, үлгэрийн баатрууд болон хөдөлгөөнт тоглоомууд.",
                icon: Gamepad2,
                color: "bg-brand-green",
                image: "https://images.squarespace-cdn.com/content/602d1a7212b33a4973f1ba6a/f069c300-1554-4d05-a77b-dc01e0ca95a7/Kids-Zone-1.jpg?content-type=image%2Fjpeg",
                span: "col-span-1",
              },
              {
                title: "Food Zone",
                subtitle: "Зоогийн хэсэг",
                desc: "Хоол, кофе, зайрмаг, хөөсөн чихэр зэрэг хүнсний худалдаа.",
                icon: Pizza,
                color: "bg-orange-400",
                image: "https://www.fooddocs.com/hs-fs/hubfs/temperature%20danger%20zone%20for%20food.jpg?quality=low&width=1000&name=temperature%20danger%20zone%20for%20food.jpg",
                span: "col-span-1 md:col-span-2 lg:col-span-1",
              },
              {
                title: "Family Chill",
                subtitle: "Амралтын хэсэг",
                desc: "Зөөлөн буйдан, сүүдрэвч, гар утас цэнэглэх хэсэг бүхий тухтай орчин.",
                icon: Coffee,
                color: "bg-purple-500",
                image: "https://www.ticketfairy.com/blog/wp-content/uploads/2025/11/chill-zones-and-quiet-spaces-creating-restful-oases-at-festivals_featured_20251127_004747_1_2k.jpg",
                span: "col-span-1 md:col-span-2 lg:col-span-3",
              },
            ].map((zone, i) => (
              <motion.div
                key={i}
                className={`${zone.span} rounded-[2.5rem] p-8 sm:p-10 text-white transform hover:scale-[1.02] transition-all duration-500 shadow-xl overflow-hidden relative group h-[300px] md:h-[350px]`}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  whileInView: { opacity: 1, scale: 1 },
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${zone.image})` }}
                />
                
                {/* Gradient Overlays */}
                <div className={`absolute inset-0 ${zone.color} opacity-40 transition-opacity duration-500 group-hover:opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    <zone.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mt-auto">
                    <h3
                      className={`text-3xl font-black mb-1 ${zone.textColor || "text-white"}`}
                    >
                      {zone.title}
                    </h3>
                    <div
                      className={`font-bold text-lg mb-4 opacity-90 ${zone.textColor || "text-white"}`}
                    >
                      {zone.subtitle}
                    </div>
                    <p
                      className={`font-medium text-lg leading-snug opacity-90 ${zone.textColor || "text-white"} line-clamp-2`}
                    >
                      {zone.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Exhibitors & Categories Section */}
      <section id="exhibitors" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">
              Хамтран ажиллах <span className="text-brand-blue">Салбарууд</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Хүүхдийн болон гэр бүлд зориулсан бүхий л төрлийн үйлчилгээ
              эрхлэгч та бүхнийг урьж байна.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              className="bg-gray-50 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100"
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
            >
              <h3 className="text-2xl font-black text-brand-dark mb-6">
                Үзэсгэлэнгийн чиглэлүүд:
              </h3>
              <ul className="space-y-4">
                {[
                  "Хүүхдийн эрүүл хоол хүнс, амттан",
                  "Хувцас, аксессуар",
                  "Хүүхдийн тоглоом, танин мэдэхүйн бүтээгдэхүүн",
                  "Хүүхдийн гэр ахуйн бараа, тавилга",
                  "Хүүхдийн аяллын хэрэгсэл",
                  "Сургалтын төвүүд, дугуйлангууд",
                  "Гэр бүлийн санхүү, хадгаламж",
                  "Хүүхдийн даатгал, эрсдэлээс хамгаалах",
                  "Дижитал технологийн шийдэл",
                  "Гэр бүлийн амралт, чөлөөт цаг",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 font-semibold text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <CircleCheck className="text-brand-green w-6 h-6 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
            >
              <h3 className="text-2xl font-black text-brand-dark mb-2 px-2">
                Тусгай боломжууд:
              </h3>

              {[
                {
                  title: "Food Truck & Mobile Catering",
                  desc: "Өөрсдийн тоноглогдсон автомашинтайгаа ирж, түргэн хоол, амттан, кофе, ундаагаар үйлчлэх.",
                  icon: Truck,
                  color: "bg-orange-100 text-orange-600",
                },
                {
                  title: "Тоглоом түрээс ба Энтертайнмент",
                  desc: "Хийлдэг тоглоом, цахилгаан машин, VR төхөөрөмж зэрэг бүх төрлийн хөдөлгөөнт тоглоом.",
                  icon: Ticket,
                  color: "bg-brand-pink/20 text-brand-pink",
                },
                {
                  title: "Pop-up үйлчилгээ",
                  desc: "Арга хэмжээний талбайд түр хугацаагаар байрлан Photo booth, Face painting гэх мэт үйлчилгээ үзүүлэх.",
                  icon: Camera,
                  color: "bg-brand-blue/20 text-brand-blue",
                },
              ].map((special, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-5 items-start hover:shadow-md transition-shadow"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                  }}
                >
                  <div className={`p-4 rounded-2xl shrink-0 ${special.color}`}>
                    <special.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-brand-dark mb-2">
                      {special.title}
                    </h4>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {special.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners & Sponsors Section */}
      <section id="partners" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">
              Хамтран ажиллагч{" "}
              <span className="text-brand-pink">Байгууллагууд</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Арга хэмжээг дэмжин ажиллаж буй байгууллагууд
            </p>
          </motion.div>

          {/* Organizers */}
          <div className="space-y-16">
            <div className="space-y-8">
              <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-[0.2em]">
                Ерөнхий зохион байгуулагч
              </h3>
              <div className="flex justify-center">
                <motion.div 
                  className="bg-white px-10 py-8 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/640063600_26282930277986842_2933560464071824266_n-1.png?w=1809&ssl=1" alt="UB EXPO ICC" className="h-32 md:h-48 object-contain" />
                  <span className="font-bold text-xs text-gray-500 leading-snug mt-6 uppercase tracking-wider text-center">
                    UB EXPO ICC
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-[0.2em]">
                Хамтран зохион байгуулагч
              </h3>
              <div className="flex flex-wrap justify-center gap-6 items-stretch">
                <motion.a
                  href="https://www.facebook.com/Moc.gov.mn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-8 py-8 rounded-3xl border border-gray-100 text-center max-w-sm flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow flex-1 min-w-[280px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/%D0%9C%D0%BE%D0%BD%D0%B3%D0%BE%D0%BB-%D0%A3%D0%BB%D1%81%D1%8B%D0%BD-%D0%97%D0%B0%D1%81%D0%B3%D0%B8%D0%B9%D0%BD-%D0%93%D0%B0%D0%B7%D0%B0%D1%80-1.jpg?w=1180&ssl=1" alt="Соёл, спорт, аялал жуулчлал, залуучуудын яам" className="h-32 md:h-48 object-contain" />
                  <span className="font-bold text-xs text-gray-500 leading-snug mt-6 uppercase tracking-wider text-center">
                    Соёл, спорт, аялал жуулчлал, залуучуудын яам
                  </span>
                </motion.a>

                <motion.a
                  href="https://www.facebook.com/mongolchamber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-8 py-8 rounded-3xl border border-gray-100 text-center max-w-sm flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow flex-1 min-w-[280px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/%D0%9C%D2%AE%D0%A5%D0%90%D2%AE%D0%A2.png?w=847&ssl=1" alt="Монголын Үндэсний Худалдаа Аж Үйлдвэрийн Танхим" className="h-24 md:h-32 object-contain" />
                  <span className="font-bold text-xs text-gray-500 leading-snug mt-6 uppercase tracking-wider text-center">
                    Монголын Үндэсний Худалдаа Аж Үйлдвэрийн Танхим
                  </span>
                </motion.a>

                <motion.a
                  href="https://www.facebook.com/ubculture"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-8 py-8 rounded-3xl border border-gray-100 text-center max-w-sm flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow flex-1 min-w-[280px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/%D0%A3%D0%91%D0%A1%D2%AF%D0%BB%D0%B4_%D2%AE%D0%BD%D0%B4%D1%81%D1%8D%D0%BD-%D1%85%D1%83%D0%B2%D0%B8%D0%BB%D0%B1%D0%B0%D1%80_RGB.png?w=1182&ssl=1" alt="Нийслэлийн Соёл, урлагийн газар" className="h-32 md:h-48 object-contain" />
                  <span className="font-bold text-xs text-gray-500 leading-snug mt-6 uppercase tracking-wider text-center">
                    Нийслэлийн Соёл, Урлагийн Газар
                  </span>
                </motion.a>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-[0.2em]">
                Ерөнхий ивээн тэтгэгч
              </h3>
              <div className="flex flex-wrap justify-center gap-8">
                <motion.a
                  href="https://www.facebook.com/ondo.mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-10 rounded-[2.5rem] shadow-xl border-4 border-brand-yellow/30 flex flex-col items-center justify-center w-full md:w-[320px] aspect-square md:aspect-auto md:h-64"
                  whileHover={{ scale: 1.05 }}
                >
                  <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Untitled-1.png?w=1262&ssl=1" alt="ONDO Brand" className="h-24 md:h-28 object-contain" />
                  <span className="text-sm font-black text-gray-400 mt-6 tracking-widest uppercase">
                    ONDO Brand
                  </span>
                </motion.a>
                <motion.a
                  href="https://www.facebook.com/Cressennllc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-10 rounded-[2.5rem] shadow-xl border-4 border-brand-blue/30 flex flex-col items-center justify-center w-full md:w-[320px] aspect-square md:aspect-auto md:h-64"
                  whileHover={{ scale: 1.05 }}
                >
                  <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/hewtee-logo.png?w=4000&ssl=1" alt="Cressenn" className="h-24 md:h-28 object-contain" />
                  <span className="text-sm font-black text-gray-400 mt-6 tracking-widest uppercase">
                    Cressenn
                  </span>
                </motion.a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 pt-8">
              <div className="space-y-8">
                <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Ивээн тэтгэгч
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  <a
                    href="https://www.facebook.com/NaranKids"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col items-center justify-center min-w-[200px] hover:shadow-xl transition-shadow w-56 aspect-[3/2]"
                  >
                    <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Naran-kids-1.png?w=1473&ssl=1" alt="Naran Kids" className="w-full h-full object-contain" />
                    <span className="text-xs font-black text-gray-400 mt-4 tracking-widest uppercase text-center">NARAN KIDS</span>
                  </a>
                  <a
                    href="https://www.facebook.com/Ovskidsitalia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col items-center justify-center min-w-[200px] hover:shadow-xl transition-shadow w-56 aspect-[3/2]"
                  >
                    <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/ovs-logo-huh-1.png?w=1552&ssl=1" alt="OVS Kids" className="w-full h-full object-contain" />
                    <span className="text-xs font-black text-gray-400 mt-4 tracking-widest uppercase text-center">OVS KIDS</span>
                  </a>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Дэмжигч
                </h3>
                <div className="flex justify-center">
                  <a
                    href="https://www.facebook.com/PocketSafeitgeltsel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col items-center justify-center min-w-[200px] hover:shadow-xl transition-shadow w-56 aspect-[3/2]"
                  >
                    <img loading="lazy" src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/PocketSafe-%D1%83%D1%80%D1%82-%D3%A9%D0%BD%D0%B3%D3%A9%D1%82-%D0%BB%D0%BE%D0%B3%D0%BE-1.png?w=2786&ssl=1" alt="Pocket App" className="w-full h-full object-contain" />
                    <span className="text-xs font-black text-gray-400 mt-4 tracking-widest uppercase text-center">POCKET</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-brand-dark tracking-tight">
              Хөтөлбөр
            </h2>
            <div className="w-24 h-2 bg-brand-green mx-auto rounded-full mb-10" />
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
              {scheduleData.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-base lg:text-lg transition-all duration-300 border-b-4 ${
                    activeDay === idx 
                      ? 'bg-brand-dark text-white border-brand-dark scale-105 shadow-xl' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <div className="opacity-60 text-xs md:text-sm mb-1">{day.date}</div>
                  <div>{day.day}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Content */}
          <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-6 md:p-8 lg:p-12 shadow-xl border border-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 md:space-y-4"
              >
                {scheduleData[activeDay].events.map((event, idx) => {
                  const colors = ['bg-[#FF6B6B]', 'bg-[#FFD93D]', 'bg-[#4ECDC4]', 'bg-[#96CEB4]', 'bg-[#6C5CE7]', 'bg-[#FF8B94]'];
                  const bulletColor = colors[idx % colors.length];
                  
                  return (
                    <div key={idx} className="flex gap-4 md:gap-6 items-start group">
                      <div className="flex flex-col items-center pt-2">
                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${bulletColor} shadow-sm group-hover:scale-150 transition-transform duration-300`} />
                        {idx !== scheduleData[activeDay].events.length - 1 && (
                          <div className={`w-px h-full min-h-[2.5rem] mt-2 bg-gray-100 group-hover:bg-gray-200 transition-colors`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4 md:pb-6">
                        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs md:text-sm font-bold tracking-wider mb-2">
                          {event.time}
                        </div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-dark leading-snug">
                          {event.description}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section id="participants" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-brand-dark tracking-tight">
              Оролцогч <span className="text-brand-pink">Байгууллагууд</span>
            </h2>
            <div className="w-24 h-2 bg-brand-yellow mx-auto rounded-full" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-6">
            {shuffledParticipants.map((name, index) => {
              const color = balloonColors[index % balloonColors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 300, scale: 0.5 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ 
                    duration: 1.5, type: "spring", bounce: 0.4, 
                    delay: Math.random() * 0.4 + (index % 5) * 0.1 
                  }}
                  className="flex-shrink-0 m-2 mt-4"
                >
                  {/* Container for infinite bobbing */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -20,
                      rotate: [-2, 2, -2],
                      transition: { duration: 0.3 }
                    }}
                    className={`font-bold text-center text-[10px] sm:text-xs md:text-sm cursor-default transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] relative flex items-center justify-center p-2 sm:p-4 shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1),_inset_5px_5px_15px_rgba(255,255,255,0.4),_0_10px_20px_rgba(0,0,0,0.1)] ${color.bg} ${color.text}`}
                    style={{ 
                      width: "clamp(100px, 15vw, 150px)", 
                      aspectRatio: "1 / 1.15",
                      borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%" 
                    }}
                  >
                    {/* Subtle balloon shine effect */}
                    <div className="absolute top-2 sm:top-3 left-3 sm:left-4 w-[15%] h-[10%] bg-white/60 rounded-full blur-[2px] transform -rotate-[40deg]"></div>
                    
                    {/* Text Content */}
                    <span 
                      className="break-words inline-block relative z-10 w-full px-2 max-h-full overflow-hidden leading-tight text-shadow-sm" 
                      style={color.text.includes('white') ? { textShadow: '1px 1px 2px rgba(0,0,0,0.2)' } : { textShadow: '1px 1px 2px rgba(255,255,255,0.4)' }}
                    >
                      {name}
                    </span>

                    {/* Balloon Knot */}
                    <div className={`absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-4 h-3 sm:w-5 sm:h-4 ${color.bg} rounded-full`} style={{ borderBottom: "2px solid rgba(0,0,0,0.15)" }}></div>
                    {/* Balloon String */}
                    <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-14 sm:h-16 bg-gray-300 opacity-60 z-[-1] origin-top transform rotate-1"></div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-yellow relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-pink opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

        {/* Character Peeks */}
        <motion.img
          loading="lazy"
          src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-03-1.png?w=2003&ssl=1"
          alt="Star Peek"
          className="absolute -bottom-10 left-[5%] w-32 md:w-48 h-auto z-10 opacity-90 transform -rotate-12"
          whileInView={{ y: [20, 0, 20] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <motion.img
          loading="lazy"
          src="https://i0.wp.com/kidsexpo.mn/wp-content/uploads/2026/03/Character-04-1.png?w=1923&ssl=1"
          alt="Green Ball Peek"
          className="absolute -top-10 right-[5%] w-32 md:w-40 h-auto z-10 opacity-90 transform rotate-12"
          whileInView={{ y: [-20, 0, -20] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-20">
          <h2 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 leading-tight">
            Одоо л байршлаа <br /> баталгаажуулах цаг!
          </h2>
          <p className="text-xl md:text-2xl font-bold text-brand-dark/80 mb-10 max-w-2xl mx-auto">
            Хүүхдийн боловсрол, хөгжил, бүтээлч байдал болон гэр бүлийн сайн
            сайхны төлөөх санал санаачилгыг дэмжинэ.
          </p>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 bg-brand-dark text-white px-10 py-5 rounded-full font-black text-xl hover:bg-brand-pink transition-colors shadow-2xl hover:shadow-brand-pink/50 active:scale-95 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Үзэсгэлэнд бүртгүүлэх
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-brand-dark pt-32 pb-10 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Split Left Side */}
            <div>
              <div className="flex items-center gap-2 mb-8 pt-2">
                <KidsExpoLogo className="scale-100 origin-left drop-shadow-xl" />
              </div>
              <p className="text-white/60 font-medium max-w-md text-lg leading-relaxed mb-10">
                Play • Create • Discover Fun • Together. Хүүхдийн инээд хөөрөөр
                дүүрэн өдрүүдийг хамтдаа бүтээцгээе.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-white text-xl mb-6">
                    Холбоо барих
                  </h4>
                  <ul className="space-y-4 text-white/70 font-medium">
                    <li className="flex items-start justify-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5 text-brand-yellow" />
                      </div>
                      <span className="flex-1 leading-relaxed">Төв цэнгэлдэх хүрээлэн, Сурын талбай, Шагайн асар</span>
                    </li>
                    <li className="flex items-center justify-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-5 h-5 text-brand-green" />
                      </div>
                      <span>2026.05.29 - 06.01</span>
                    </li>
                    <li className="flex items-center justify-start gap-3">
                      <a
                        href="tel:91919442"
                        className="flex items-center gap-3 hover:text-brand-pink transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-brand-blue" />
                        </div>
                        91919442, 88596771
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-white text-xl mb-6 opacity-0 hidden sm:block">
                    Мэдээлэл
                  </h4>
                  <ul className="space-y-4 text-white/70 font-medium">
                    <li>
                      <a
                        href="mailto:info@ubexpo.mn"
                        className="flex items-center gap-3 hover:text-brand-pink transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-brand-pink" />
                        </div>
                        info@ubexpo.mn
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.facebook.com/kidsexpomn"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 hover:text-brand-pink transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Facebook className="w-5 h-5 text-[#1877F2]" />
                        </div>
                        Kids Expo Facebook
                      </a>
                    </li>
                    <li className="pt-2">
                      <a
                        href="https://www.facebook.com/events/963560256069073"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-white text-brand-dark px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-yellow-400/20"
                      >
                        <Star className="w-5 h-5 fill-current" />
                        Event Join
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Map Half */}
            <div className="w-full h-80 lg:h-full lg:min-h-[400px] rounded-3xl overflow-hidden shadow-2xl relative bg-white/5 border border-white/10">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.908895790595!2d106.9114753767128!3d47.900466267638215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693b600b863e5%3A0x982f03035cba9b68!2sArchery%20Field!5e1!3m2!1sen!2smn!4v1779241659573!5m2!1sen!2smn" 
                className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-duration-500 transition-all ease-in-out" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 font-medium">
            <p>&copy; 2026 KIDS EXPO. Зохиогчийн эрх хуулиар хамгаалагдсан.</p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsAdminView(true)}
                className="p-2 text-white/5 hover:text-white/20 transition-colors rounded-lg"
                title="Admin"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 0.5, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] bg-brand-pink text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-blue transition-all focus:outline-none group"
            whileHover={{ opacity: 1, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-7 h-7 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="relative p-6 sm:p-10 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white/80 backdrop-blur-sm"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>

                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-dark mb-1 sm:mb-2">Хамтдаа хөгжицгөөе!</h2>
                  <p className="text-sm sm:text-base text-gray-500 font-medium">KIDS EXPO 2026-д бүртгүүлэх</p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 flex flex-col items-center text-center"
                  >
                    <div className="relative mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-12 h-12 text-brand-green" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-brand-green/10 rounded-full"
                      />
                    </div>
                    <h3 className="text-3xl font-black text-brand-dark mb-4">Бүртгэл амжилттай!</h3>
                    <div className="space-y-2">
                      <p className="text-gray-500 font-bold text-lg">Таны хүсэлтийг хүлээн авлаа.</p>
                      <p className="text-gray-400 font-medium">Бид удахгүй тантай холбогдох болно.</p>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      onClick={() => setIsModalOpen(false)}
                      className="mt-10 text-brand-blue font-bold hover:underline"
                    >
                      Хаах
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-brand-dark uppercase tracking-wider px-1">Таны нэр</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-brand-blue focus:ring-0 transition-colors font-medium outline-none"
                        placeholder="Нэрээ оруулна уу"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-brand-dark uppercase tracking-wider px-1">И-мэйл</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-brand-blue focus:ring-0 transition-colors font-medium outline-none"
                          placeholder="Email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-brand-dark uppercase tracking-wider px-1">Утас</label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-brand-blue focus:ring-0 transition-colors font-medium outline-none"
                          placeholder="Утасны дугаар"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-brand-dark uppercase tracking-wider px-1">Бүртгэлийн төрөл</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: "visitor" })}
                          className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all border-2 ${
                            formData.type === "visitor"
                              ? "bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/30"
                              : "bg-gray-50 border-gray-100 text-gray-500 hover:border-brand-blue/30"
                          }`}
                        >
                          Үзэгч
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: "exhibitor" })}
                          className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all border-2 ${
                            formData.type === "exhibitor"
                              ? "bg-brand-pink border-brand-pink text-white shadow-lg shadow-brand-pink/30"
                              : "bg-gray-50 border-gray-100 text-gray-500 hover:border-brand-pink/30"
                          }`}
                        >
                          Оролцогч
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-brand-dark uppercase tracking-wider px-1">Мессеж (Сонголттой)</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-brand-blue focus:ring-0 transition-colors font-medium outline-none resize-none"
                        placeholder="Таны асуулт эсвэл санал..."
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-dark hover:bg-black text-white py-5 rounded-2xl font-black text-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Илгээж байна...
                        </>
                      ) : (
                        "Бүртгүүлэх"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

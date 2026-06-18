import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const DEMO_CREDENTIALS = { id: "VME2026", password: "demo123" };

const LEADERBOARD = [
  { rank: 1, name: "Aringar School of Commerce", kg: 85, points: 850, district: "Chennai", change: 0 },
  { rank: 2, name: "Vidya Mandir Estancia", kg: 78, points: 780, district: "Chennai", change: 1 },
  { rank: 3, name: "Shree Niketan", kg: 72, points: 720, district: "Coimbatore", change: -1 },
  { rank: 4, name: "DAV School", kg: 65, points: 650, district: "Madurai", change: 2 },
  { rank: 5, name: "SBOA School", kg: 58, points: 580, district: "Salem", change: 0 },
  { rank: 6, name: "Sri Venkateswara Vidyalaya", kg: 52, points: 520, district: "Trichy", change: -1 },
  { rank: 7, name: "PSG Public School", kg: 47, points: 470, district: "Coimbatore", change: 3 },
  { rank: 8, name: "GRT Mahalakshmi Vidyalaya", kg: 41, points: 410, district: "Chennai", change: 0 },
];

const PRODUCTS = [
  { id: 1, name: "ReLoop Eco Hoodie", price: 1499, desc: "Made using 100% recycled plastic bottles", impact: "12 bottles saved", category: "Hoodies", emoji: "🧥", bottles: 12 },
  { id: 2, name: "ReLoop Eco T-Shirt", price: 799, desc: "Comfortable, breathable, and sustainable", impact: "8 bottles saved", category: "T-Shirts", emoji: "👕", bottles: 8 },
  { id: 3, name: "ReLoop Tote Bag", price: 399, desc: "Reusable eco-friendly carry bag", impact: "5 bottles saved", category: "Bags", emoji: "👜", bottles: 5 },
  { id: 4, name: "ReLoop Sustainable Shoes", price: 2499, desc: "Designed entirely from recycled materials", impact: "20 bottles saved", category: "Shoes", emoji: "👟", bottles: 20 },
];

const REWARDS = [
  { id: 1, name: "Eco Certificate", points: 100, icon: "📜", desc: "Digital sustainability certificate" },
  { id: 2, name: "Badge Pack", points: 200, icon: "🏅", desc: "Exclusive ReLoop digital badge set" },
  { id: 3, name: "ReLoop Tote Bag", points: 400, icon: "👜", desc: "Physical tote bag delivered to school" },
  { id: 4, name: "Sports Jersey Discount", points: 600, icon: "⚽", desc: "15% off on sports jerseys" },
  { id: 5, name: "Uniform Discount", points: 750, icon: "🎓", desc: "20% off on sustainable uniforms" },
];

const CERTIFICATES = [
  { title: "Tamil Nadu Rank #2", subtitle: "Regional Excellence", icon: "🥈", color: "from-gray-300 to-gray-500" },
  { title: "1000+ Bottles Recycled", subtitle: "Recycling Milestone", icon: "♻️", color: "from-green-400 to-emerald-600" },
  { title: "Sustainability Champion", subtitle: "Academic Year 2025–26", icon: "🏆", color: "from-yellow-400 to-amber-500" },
  { title: "Top Contributor 2026", subtitle: "ReLoop Network Award", icon: "⭐", color: "from-blue-400 to-indigo-600" },
];

// ─── ICONS ────────────────────────────────────────────────────────────────
const icons = {
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  trophy: "M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z",
  store: "M20 4H4v2l16 .01V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z",
  cert: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
  user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  up: "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z",
  down: "M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  cart: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45A1 1 0 005 16h12v-2H7.42l.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.45 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
  download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
  camera: "M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z",
  logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  leaf: "M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2-5 0-7 2-7 2 3-1 7-1 10 1z",
};

const Icon = ({ name, size = 20, cls = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d={icons[name] || ""} />
  </svg>
);

// ─── TOAST ─────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-bold flex items-center gap-2 max-w-[280px] text-center ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {type === "success" ? "✅" : "⚠️"} {message}
    </div>
  );
};

// ─── BAR CHART ─────────────────────────────────────────────────────────────
const BarChart = ({ data, labels }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-500 font-bold">{v}</span>
          <div className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-emerald-400" style={{ height: `${(v / max) * 80}px` }} />
          <span className="text-[9px] text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── BOTTOM NAV ────────────────────────────────────────────────────────────
const BottomNav = ({ page, setPage }) => {
  const tabs = [
    { id: "dashboard", icon: "home", label: "Home" },
    { id: "releague", icon: "trophy", label: "ReLeague" },
    { id: "restore", icon: "store", label: "ReStore" },
    { id: "certificates", icon: "cert", label: "Awards" },
    { id: "profile", icon: "user", label: "Profile" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex shadow-lg z-40">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setPage(t.id)} className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${page === t.id ? "text-green-500" : "text-gray-400"}`}>
          <Icon name={t.icon} size={22} />
          <span className="text-[10px] font-semibold">{t.label}</span>
          {page === t.id && <div className="w-1 h-1 rounded-full bg-green-500" />}
        </button>
      ))}
    </nav>
  );
};

// ─── SPLASH ────────────────────────────────────────────────────────────────
const Splash = ({ onStart }) => {
  const [c1, sc1] = useState(0);
  const [c2, sc2] = useState(0);
  const [c3, sc3] = useState(0);

  useEffect(() => {
    const anim = (set, target, dur) => {
      let s = null;
      const step = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        set(+(p * target).toFixed(1));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    setTimeout(() => {
      anim(sc1, 240, 1200);
      anim(sc2, 18, 1200);
      anim(sc3, 3.2, 1400);
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 flex flex-col items-center justify-center px-6 text-white">
      <div className="text-center mb-14">
        <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-7 shadow-2xl">
          <span className="text-5xl">♻️</span>
        </div>
        <h1 className="text-6xl font-black tracking-tight mb-2">ReLoop</h1>
        <p className="text-green-100 text-xl font-medium">Turning Waste Into Worth</p>
        <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mt-5" />
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-14">
        {[
          { val: `${Math.floor(c1)}+`, label: "Schools" },
          { val: `${Math.floor(c2)}T`, label: "Plastic Saved" },
          { val: `${c3.toFixed(1)}M`, label: "RePoints" },
        ].map((s, i) => (
          <div key={i} className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
            <div className="text-2xl font-black">{s.val}</div>
            <div className="text-[11px] text-green-100 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <button onClick={onStart} className="w-full max-w-xs bg-white text-green-600 font-bold text-lg py-4 rounded-2xl shadow-xl active:scale-95 transition-transform">
        Get Started →
      </button>
      <p className="text-green-200 text-xs mt-6">India's First Inter-School Recycling Network</p>
    </div>
  );
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setErr("");
    setTimeout(() => {
      if (id === DEMO_CREDENTIALS.id && pw === DEMO_CREDENTIALS.password) onLogin();
      else { setErr("Invalid credentials. Try VME2026 / demo123"); setLoading(false); }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-br from-green-600 to-emerald-500 h-52 flex items-end pb-8 px-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">♻️</span>
            <span className="text-white font-black text-3xl">ReLoop</span>
          </div>
          <p className="text-green-100 text-sm">Sign in to your school account</p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 pb-8">
        <div className="bg-white rounded-3xl p-6 shadow-xl -mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Welcome Back</h2>
          {err && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-4">⚠️ {err}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Institution ID</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 text-gray-800 font-medium focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" value={id} onChange={e => { setId(e.target.value); setErr(""); }} placeholder="e.g. VME2026" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 text-gray-800 font-medium focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} placeholder="••••••••" />
            </div>
            <button onClick={handle} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <div className="mt-5 bg-green-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-700 mb-1">🎯 Demo Credentials</p>
            <p className="text-xs text-green-600">ID: <strong>VME2026</strong> · Password: <strong>demo123</strong></p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">Access via QR code · Pilot Mode · Coming soon on Play Store & App Store</p>
      </div>
    </div>
  );
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
const Dashboard = ({ st, setPage }) => (
  <div className="pb-20">
    <div className="bg-gradient-to-br from-green-600 to-emerald-500 px-5 pt-10 pb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <span className="text-green-100 text-sm font-medium">Welcome back 👋</span>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">TN #{st.rank}</span>
        </div>
        <h1 className="text-white font-black text-2xl">{st.school}</h1>
        <p className="text-green-100 text-sm">{st.state}</p>
      </div>
    </div>

    <div className="px-5 -mt-8 space-y-4">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🧴", val: `${st.plastic}kg`, label: "Plastic Collected", bg: "bg-green-50" },
            { icon: "⭐", val: st.repoints, label: "RePoints", bg: "bg-amber-50" },
            { icon: "♻️", val: st.bottles.toLocaleString(), label: "Bottles Recycled", bg: "bg-blue-50" },
            { icon: "🌿", val: `${st.co2}kg`, label: "CO₂ Saved", bg: "bg-emerald-50" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-3`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black text-gray-800 text-lg">{s.val}</div>
              <div className="text-[11px] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Collection Trend</h3>
          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">Jan–Jun 2026</span>
        </div>
        <BarChart data={st.monthly} labels={["Jan","Feb","Mar","Apr","May","Jun"]} />
        <div className="mt-2 text-xs text-gray-400 text-center">Monthly plastic collected (kg)</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { page: "releague", emoji: "🏆", title: "View ReLeague", sub: "Rankings", color: "from-amber-400 to-orange-500" },
          { page: "collection", emoji: "➕", title: "Add Collection", sub: "Log plastic", color: "from-green-500 to-emerald-600" },
          { page: "restore", emoji: "🛍️", title: "Open ReStore", sub: "Eco products", color: "from-blue-500 to-indigo-600" },
          { page: "certificates", emoji: "🎓", title: "Certificates", sub: `${st.certs} earned`, color: "from-purple-500 to-pink-600" },
        ].map((b, i) => (
          <button key={i} onClick={() => setPage(b.page)} className={`bg-gradient-to-br ${b.color} text-white rounded-2xl p-4 text-left active:scale-95 transition-transform`}>
            <div className="text-2xl mb-2">{b.emoji}</div>
            <div className="font-bold text-sm">{b.title}</div>
            <div className="text-xs opacity-80">{b.sub}</div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-xs mb-1">Your RePoints Balance</div>
          <div className="text-white font-black text-2xl">{st.repoints} <span className="text-green-400 text-sm font-semibold">pts</span></div>
        </div>
        <button onClick={() => setPage("rewards")} className="bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform">
          Redeem →
        </button>
      </div>
    </div>
  </div>
);

// ─── RELEAGUE ──────────────────────────────────────────────────────────────
const ReLeague = ({ school }) => {
  const [search, setSearch] = useState("");
  const [dist, setDist] = useState("All");
  const districts = ["All", "Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"];
  const filtered = LEADERBOARD.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (dist === "All" || s.district === dist)
  );
  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : null;

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-5 pt-10 pb-8">
        <h1 className="text-white font-black text-2xl mb-1">ReLeague</h1>
        <p className="text-amber-100 text-sm">Tamil Nadu School Rankings</p>
      </div>

      <div className="px-5 pt-4 space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={18} /></div>
          <input className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-400" placeholder="Search school..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {districts.map(d => (
            <button key={d} onClick={() => setDist(d)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${dist === d ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"}`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-3 space-y-3 pb-4">
        {filtered.map(s => (
          <div key={s.rank} className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${s.name === school ? "border-green-400 bg-green-50" : "border-transparent"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-lg font-black text-gray-700 flex-shrink-0">
                {medal(s.rank) || `#${s.rank}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-800 text-sm truncate">{s.name}</span>
                  {s.name === school && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">You</span>}
                </div>
                <span className="text-xs text-gray-400">{s.district}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-black text-green-600 text-sm">{s.points} pts</div>
                <div className="text-xs text-gray-400">{s.kg} kg</div>
              </div>
              <div className="ml-1 flex-shrink-0 w-8 text-center">
                {s.change > 0 ? <span className="text-green-500 text-xs flex items-center justify-center"><Icon name="up" size={14} />{s.change}</span>
                  : s.change < 0 ? <span className="text-red-400 text-xs flex items-center justify-center"><Icon name="down" size={14} />{Math.abs(s.change)}</span>
                  : <span className="text-gray-300 text-xs">—</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COLLECTION ────────────────────────────────────────────────────────────
const Collection = ({ onBack, onSubmit }) => {
  const [wt, setWt] = useState("");
  const [col, setCol] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const ref = useRef();

  const pts = wt ? Math.round(parseFloat(wt) * 10) : 0;

  const submit = () => {
    if (!wt || !col) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); onSubmit(parseFloat(wt)); }, 1200);
  };

  if (done) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center pb-20">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-5xl">✅</div>
      <h2 className="text-2xl font-black text-gray-800 mb-2">Collection Added!</h2>
      <p className="text-gray-500 mb-6">You earned <span className="text-green-600 font-black text-xl">{pts} RePoints</span></p>
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl mb-8 space-y-3 text-left">
        <div className="flex justify-between text-sm"><span className="text-gray-500">Weight</span><span className="font-bold text-gray-800">{wt} kg</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Collector</span><span className="font-bold text-gray-800">{col}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">RePoints Earned</span><span className="font-bold text-green-600">+{pts}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Bottles (est.)</span><span className="font-bold text-blue-600">{Math.round(parseFloat(wt) * 20)}</span></div>
      </div>
      <button onClick={onBack} className="w-full max-w-xs bg-green-500 text-white font-bold py-4 rounded-2xl">Back to Dashboard</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-green-600 to-emerald-500 px-5 pt-10 pb-8 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"><Icon name="back" size={20} /></button>
        <div>
          <h1 className="text-white font-black text-xl">Add Collection</h1>
          <p className="text-green-100 text-xs">1 kg = 10 RePoints</p>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight Collected (kg)</label>
            <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 text-gray-800 font-medium focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-xl" value={wt} onChange={e => setWt(e.target.value)} placeholder="0.0" />
          </div>
          {wt && parseFloat(wt) > 0 && (
            <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-green-700 text-sm font-semibold">RePoints to earn</span>
              <span className="text-green-600 font-black text-xl">+{pts}</span>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Collector Name</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 text-gray-800 font-medium focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100" value={col} onChange={e => setCol(e.target.value)} placeholder="Enter your name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Photo</label>
            <input type="file" accept="image/*" ref={ref} onChange={e => { if (e.target.files[0]) setPhoto(URL.createObjectURL(e.target.files[0])); }} className="hidden" />
            <button onClick={() => ref.current.click()} className={`w-full mt-1 border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 transition-colors ${photo ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
              {photo ? <img src={photo} alt="" className="w-24 h-24 object-cover rounded-lg" /> : <>
                <Icon name="camera" size={28} cls="text-gray-400" />
                <span className="text-sm text-gray-400">Tap to upload photo</span>
              </>}
            </button>
          </div>
        </div>

        <button onClick={submit} disabled={!wt || !col || loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Submitting..." : "Submit Collection"}
        </button>
      </div>
    </div>
  );
};

// ─── RESTORE ───────────────────────────────────────────────────────────────
const ReStore = ({ cart, setCart, setPage, setProduct }) => {
  const [cat, setCat] = useState("All");
  const cats = ["All", "T-Shirts", "Hoodies", "Bags", "Shoes"];

  const filtered = cat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  const totalItems = cart.reduce((a, c) => a + c.qty, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === product.id);
      if (ex) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-5 pt-10 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-2xl mb-1">ReStore</h1>
            <p className="text-blue-100 text-sm">Sustainable Products</p>
          </div>
          <button onClick={() => setPage("cart")} className="relative w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <Icon name="cart" size={22} />
            {totalItems > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center">{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Uniform Banner */}
      <div className="mx-5 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <span className="text-4xl">🎒</span>
          <div>
            <div className="text-xs font-semibold text-green-100 uppercase tracking-wide mb-1">Featured</div>
            <h3 className="font-black text-lg leading-tight">Sustainable School Uniforms</h3>
            <p className="text-green-100 text-xs mt-1 mb-3">Made from recycled materials · Custom school branding</p>
            <button onClick={() => setPage("uniform")} className="bg-white text-green-600 font-bold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform">
              Book a Consultant →
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pt-4 flex gap-2 overflow-x-auto pb-2">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${cat === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{c}</button>
        ))}
      </div>

      {/* Products */}
      <div className="px-5 pt-3 space-y-3 pb-4">
        {filtered.map(p => {
          const inCart = cart.find(c => c.id === p.id);
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center text-7xl cursor-pointer" onClick={() => { setProduct(p); setPage("product"); }}>
                {p.emoji}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                    <span className="inline-block mt-2 text-[11px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">♻️ {p.impact}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-gray-800 text-lg">₹{p.price}</div>
                  </div>
                </div>
                <button onClick={() => addToCart(p)} className={`w-full mt-3 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${inCart ? "bg-green-500 text-white" : "bg-gray-900 text-white"}`}>
                  {inCart ? `✓ In Cart (${inCart.qty})` : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}

        <button onClick={() => setPage("retrace")} className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform">
          <span className="text-3xl">🔍</span>
          <div className="text-left">
            <div className="font-bold">ReTrace Product Journey</div>
            <div className="text-xs text-green-100">See how products are made</div>
          </div>
          <Icon name="back" size={18} cls="rotate-180 ml-auto" />
        </button>

        <button onClick={() => setPage("rewards")} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform">
          <span className="text-3xl">⭐</span>
          <div className="text-left">
            <div className="font-bold">Redeem RePoints</div>
            <div className="text-xs text-amber-100">Exchange points for rewards</div>
          </div>
          <Icon name="back" size={18} cls="rotate-180 ml-auto" />
        </button>
      </div>
    </div>
  );
};

// ─── PRODUCT DETAIL ────────────────────────────────────────────────────────
const ProductDetail = ({ product, onBack, cart, setCart, showToast }) => {
  const inCart = cart.find(c => c.id === product.id);
  const addToCart = () => {
    setCart(prev => {
      const ex = prev.find(c => c.id === product.id);
      if (ex) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart!`, "success");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center text-9xl relative">
        <button onClick={onBack} className="absolute top-10 left-4 w-9 h-9 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center shadow-sm"><Icon name="back" size={20} cls="text-gray-700" /></button>
        {product.emoji}
      </div>
      <div className="px-5 pt-5 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h1 className="font-black text-xl text-gray-800">{product.name}</h1>
            <span className="font-black text-2xl text-gray-800">₹{product.price}</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">{product.desc}</p>
          <div className="flex gap-2">
            <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1.5 rounded-full">♻️ {product.impact}</span>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-full">🍶 {product.bottles} bottles</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Sustainability Impact</h3>
          <div className="space-y-2">
            {["Made from 100% recycled PET bottles", "Reduces plastic landfill waste", "Carbon-neutral manufacturing process", "Supports ReLoop school network"].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><Icon name="check" size={12} cls="text-green-600" /></div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <button onClick={addToCart} className={`w-full py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all ${inCart ? "bg-green-500 text-white" : "bg-gray-900 text-white"}`}>
          {inCart ? `✓ In Cart (${inCart.qty}) — Add More` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

// ─── CART ──────────────────────────────────────────────────────────────────
const Cart = ({ cart, setCart, onBack, showToast }) => {
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const remove = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const checkout = () => {
    setCart([]);
    showToast("Order placed successfully! 🎉", "success");
    onBack();
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center pb-20">
      <div className="text-7xl mb-4">🛒</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-6">Add some eco-friendly products!</p>
      <button onClick={onBack} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-2xl">Browse ReStore</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-5 pt-10 pb-8 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"><Icon name="back" size={20} /></button>
        <h1 className="text-white font-black text-xl">Your Cart</h1>
      </div>

      <div className="px-5 pt-5 space-y-3">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <span className="text-4xl">{item.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-gray-800 text-sm">{item.name}</div>
              <div className="text-green-600 font-black">₹{item.price} × {item.qty}</div>
            </div>
            <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-lg">×</button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-5 border-t border-gray-100 shadow-xl">
        <div className="flex justify-between text-lg font-black text-gray-800 mb-4">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <button onClick={checkout} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform">
          Place Order →
        </button>
      </div>
    </div>
  );
};

// ─── UNIFORM PAGE ──────────────────────────────────────────────────────────
const Uniform = ({ onBack, showToast }) => {
  const [form, setForm] = useState({ school: "", contact: "", phone: "", students: "", date: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.school || !form.contact || !form.phone) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1000);
  };

  if (done) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center pb-20">
      <div className="text-7xl mb-5">🎉</div>
      <h2 className="text-2xl font-black text-gray-800 mb-2">Thank You!</h2>
      <p className="text-gray-500 mb-6">A ReLoop Sustainability Consultant will contact you soon.</p>
      <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl mb-8">
        <div className="text-xs text-gray-400 mb-1">Reference ID</div>
        <div className="font-black text-green-600 text-xl">RL-2026-001</div>
        <div className="text-xs text-gray-400 mt-3">School: {form.school}</div>
        <div className="text-xs text-gray-400">Contact: {form.contact}</div>
      </div>
      <button onClick={onBack} className="w-full max-w-xs bg-green-500 text-white font-bold py-4 rounded-2xl">Back to ReStore</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 px-5 pt-10 pb-8 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"><Icon name="back" size={20} /></button>
        <div>
          <h1 className="text-white font-black text-xl">Sustainable Uniforms</h1>
          <p className="text-green-100 text-xs">Book a professional consultation</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
          <h3 className="font-bold text-green-800 mb-2">🌱 Why Sustainable Uniforms?</h3>
          <div className="space-y-1.5">
            {["Made from 100% recycled plastic bottles","Durable and comfortable for daily wear","Custom school branding available","Environmentally responsible choice","Every uniform reduces plastic waste"].map((b, i) => (
              <div key={i} className="text-xs text-green-700 flex items-center gap-1.5"><span className="text-green-500">✓</span>{b}</div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Consultation Request</h3>
          {[
            { key: "school", label: "School Name", placeholder: "Enter school name" },
            { key: "contact", label: "Contact Person", placeholder: "Enter name" },
            { key: "phone", label: "Phone Number", placeholder: "+91 XXXXXXXXXX" },
            { key: "students", label: "Number of Students", placeholder: "e.g. 500" },
            { key: "date", label: "Preferred Meeting Date", placeholder: "", type: "date" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
              <input type={f.type || "text"} className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 text-gray-800 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100" value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
            </div>
          ))}
          <button onClick={submit} disabled={loading || !form.school || !form.contact || !form.phone} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── REWARDS ───────────────────────────────────────────────────────────────
const Rewards = ({ points, onRedeem, history, onBack }) => {
  const [confirm, setConfirm] = useState(null);

  const redeem = (reward) => {
    if (points < reward.points) return;
    onRedeem(reward);
    setConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {confirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center px-5 pb-8">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <div className="text-5xl mb-3">{confirm.icon}</div>
            <h3 className="font-black text-xl text-gray-800 mb-1">{confirm.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{confirm.points} RePoints will be deducted</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">Cancel</button>
              <button onClick={() => redeem(confirm)} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl">Redeem</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-5 pt-10 pb-8 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"><Icon name="back" size={20} /></button>
        <div>
          <h1 className="text-white font-black text-xl">Redeem RePoints</h1>
          <p className="text-amber-100 text-sm">Balance: <strong>{points} pts</strong></p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">
        {REWARDS.map(r => {
          const canAfford = points >= r.points;
          return (
            <div key={r.id} className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${canAfford ? "border-transparent" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl w-12 text-center">{r.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.desc}</div>
                  <div className="font-black text-amber-600 text-sm mt-1">{r.points} pts</div>
                </div>
                <button onClick={() => canAfford ? setConfirm(r) : null} className={`px-4 py-2 rounded-xl font-bold text-sm ${canAfford ? "bg-amber-500 text-white active:scale-95 transition-transform" : "bg-gray-100 text-gray-400"}`}>
                  {canAfford ? "Redeem" : "Need more"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {history.length > 0 && (
        <div className="px-5 pt-6">
          <h3 className="font-bold text-gray-800 mb-3">Redemption History</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                <span className="text-2xl">{h.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{h.name}</div>
                  <div className="text-xs text-gray-400">{h.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-500 font-bold text-sm">-{h.points}</div>
                  <div className="text-xs text-green-600">Redeemed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── RETRACE ───────────────────────────────────────────────────────────────
const ReTrace = ({ onBack }) => {
  const steps = [
    { icon: "🏫", label: "Collected at school", detail: "Vidya Mandir Estancia, Chennai", date: "15 May 2026" },
    { icon: "📦", label: "Sorted & weighed", detail: "12 PET bottles · 0.24 kg", date: "16 May 2026" },
    { icon: "🏭", label: "Processed at factory", detail: "ReLoop Recycling Hub, Coimbatore", date: "20 May 2026" },
    { icon: "🧵", label: "Spun into fiber", detail: "rPET yarn production", date: "25 May 2026" },
    { icon: "👕", label: "Manufactured", detail: "ReLoop Eco T-Shirt produced", date: "1 Jun 2026" },
    { icon: "🚚", label: "Ready for delivery", detail: "Ships within 3–5 days", date: "5 Jun 2026" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-teal-600 to-green-600 px-5 pt-10 pb-8 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"><Icon name="back" size={20} /></button>
        <div>
          <h1 className="text-white font-black text-xl">ReTrace</h1>
          <p className="text-teal-100 text-xs">Product Journey Tracker</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-5xl text-center mb-4">👕</div>
          <h2 className="font-black text-xl text-gray-800 text-center mb-4">ReLoop Eco T-Shirt</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Recycled Bottles", val: "12" },
              { label: "Contributing School", val: "Vidya Mandir" },
              { label: "State", val: "Tamil Nadu" },
              { label: "CO₂ Saved", val: "2.4 kg" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                <div className="font-bold text-gray-800 text-sm">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Product Journey</h3>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
                  {i < steps.length - 1 && <div className="w-0.5 h-8 bg-green-200 flex-shrink-0" />}
                </div>
                <div className="pt-2 pb-6">
                  <div className="font-bold text-gray-800 text-sm">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.detail}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white text-center">
          <div className="text-3xl mb-2">🌍</div>
          <h3 className="font-black text-lg mb-1">Thank You For Supporting</h3>
          <p className="text-green-100 text-sm">Sustainable Fashion</p>
        </div>
      </div>
    </div>
  );
};

// ─── CERTIFICATES ──────────────────────────────────────────────────────────
const Certificates = () => (
  <div className="pb-20">
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 px-5 pt-10 pb-8">
      <h1 className="text-white font-black text-2xl mb-1">Certificates</h1>
      <p className="text-purple-100 text-sm">Your achievements & awards</p>
    </div>

    <div className="px-5 pt-5 space-y-4">
      {CERTIFICATES.map((c, i) => (
        <div key={i} className={`bg-gradient-to-br ${c.color} rounded-2xl p-5 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">ReLoop Certificate</div>
              <div className="font-black text-2xl mb-1">{c.title}</div>
              <div className="text-white/80 text-sm">{c.subtitle}</div>
              <div className="text-xs text-white/60 mt-1">Vidya Mandir Estancia · Tamil Nadu</div>
            </div>
            <span className="text-5xl">{c.icon}</span>
          </div>
          <button className="mt-4 bg-white/20 backdrop-blur border border-white/30 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 active:scale-95 transition-transform">
            <Icon name="download" size={16} /> Download
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ─── PROFILE ───────────────────────────────────────────────────────────────
const Profile = ({ st, onLogout }) => {
  const stats = [
    { label: "Total RePoints", val: st.repoints, icon: "⭐" },
    { label: "Collections", val: st.collections, icon: "♻️" },
    { label: "Certificates", val: st.certs, icon: "🎓" },
    { label: "Tamil Nadu Rank", val: `#${st.rank}`, icon: "🏆" },
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-5 pt-10 pb-16">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl">🏫</div>
          <div>
            <h1 className="text-white font-black text-xl">{st.school}</h1>
            <p className="text-gray-400 text-sm">{st.state}</p>
            <span className="inline-block mt-1 text-xs bg-green-500/20 text-green-400 font-semibold px-2 py-0.5 rounded-full">Active Member</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-3 mb-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-gray-800 text-lg">{s.val}</div>
              <div className="text-[11px] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3 mb-4">
          <h3 className="font-bold text-gray-800">Account Details</h3>
          {[
            { label: "Institution ID", val: "VME2026" },
            { label: "Member Since", val: st.since },
            { label: "State", val: st.state },
            { label: "Network", val: "ReLoop Pilot" },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{r.label}</span>
              <span className="text-sm font-semibold text-gray-800">{r.val}</span>
            </div>
          ))}
        </div>

        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-500 border-2 border-red-100 bg-red-50 font-bold py-4 rounded-2xl active:scale-95 transition-transform">
          <Icon name="logout" size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash"); // splash | login | app
  const [page, setPage] = useState("dashboard");
  const [subPage, setSubPage] = useState(null); // collection|uniform|rewards|retrace|product|cart
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const [st, setSt] = useState(() => {
    try {
      const saved = localStorage.getItem("reloop_state");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      school: "Vidya Mandir Estancia",
      state: "Tamil Nadu",
      rank: 2,
      plastic: 78,
      repoints: 780,
      bottles: 1560,
      co2: 120,
      collections: 12,
      since: "January 2026",
      certs: 4,
      monthly: [8, 10, 12, 14, 16, 18],
      cart: [],
      history: [],
    };
  });

  useEffect(() => { localStorage.setItem("reloop_state", JSON.stringify(st)); }, [st]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCollection = (kg) => {
    const pts = Math.round(kg * 10);
    setSt(s => ({
      ...s,
      plastic: +(s.plastic + kg).toFixed(1),
      repoints: s.repoints + pts,
      bottles: s.bottles + Math.round(kg * 20),
      co2: +(s.co2 + kg * 2.5).toFixed(1),
      collections: s.collections + 1,
      monthly: [...s.monthly.slice(0, -1), s.monthly[s.monthly.length - 1] + kg],
    }));
    showToast(`+${pts} RePoints earned!`);
  };

  const handleRedeem = (reward) => {
    setSt(s => ({
      ...s,
      repoints: s.repoints - reward.points,
      history: [{ ...reward, date: new Date().toLocaleDateString("en-IN") }, ...s.history],
    }));
    showToast(`${reward.name} redeemed!`);
  };

  const setCart = (fn) => setSt(s => ({ ...s, cart: typeof fn === "function" ? fn(s.cart) : fn }));

  const nav = (p) => { setPage(p); setSubPage(null); };

  // Sub-page routing
  if (screen === "splash") return <Splash onStart={() => setScreen("login")} />;
  if (screen === "login") return <Login onLogin={() => setScreen("app")} />;

  // App shell
  const renderSubPage = () => {
    if (subPage === "collection") return <Collection onBack={() => setSubPage(null)} onSubmit={handleCollection} />;
    if (subPage === "uniform") return <Uniform onBack={() => setSubPage(null)} showToast={showToast} />;
    if (subPage === "rewards") return <Rewards points={st.repoints} onRedeem={handleRedeem} history={st.history} onBack={() => setSubPage(null)} />;
    if (subPage === "retrace") return <ReTrace onBack={() => setSubPage(null)} />;
    if (subPage === "cart") return <Cart cart={st.cart} setCart={setCart} onBack={() => setSubPage(null)} showToast={showToast} />;
    if (subPage === "product" && product) return <ProductDetail product={product} onBack={() => setSubPage(null)} cart={st.cart} setCart={setCart} showToast={showToast} />;
    return null;
  };

  const goTo = (p) => {
    if (["collection","uniform","rewards","retrace","cart","product"].includes(p)) setSubPage(p);
    else { setPage(p); setSubPage(null); }
  };

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard st={st} setPage={goTo} />;
    if (page === "releague") return <ReLeague school={st.school} />;
    if (page === "restore") return <ReStore cart={st.cart} setCart={setCart} setPage={goTo} setProduct={setProduct} />;
    if (page === "certificates") return <Certificates />;
    if (page === "profile") return <Profile st={st} onLogout={() => { setScreen("login"); setPage("dashboard"); }} />;
    return null;
  };

  const sub = renderSubPage();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {sub || renderPage()}
      {!sub && <BottomNav page={page} setPage={nav} />}
    </div>
  );
}

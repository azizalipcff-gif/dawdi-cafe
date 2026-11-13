import { ArrowUpRight, Gamepad2, Instagram, ShieldCheck, ShoppingBag, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

const services = [
  { icon: Users, title: "Followers & Growth", ar: "المتابعون والنمو", desc: "Build your social presence with straightforward packages.", arDesc: "طوّر حضورك على منصات التواصل بباقات واضحة." },
  { icon: TrendingUp, title: "Likes & Engagement", ar: "الإعجابات والتفاعل", desc: "Engagement packages for creators and businesses.", arDesc: "باقات الإعجابات والتفاعل لصناع المحتوى وأصحاب المشاريع." },
  { icon: Gamepad2, title: "Gaming Top Up", ar: "شحن الألعاب", desc: "Game credits and top-ups, including Free Fire.", arDesc: "شحن الألعاب والأرصدة، بما فيها Free Fire." },
  { icon: Zap, title: "Digital Services", ar: "الخدمات الرقمية", desc: "Helpful digital services gathered in one store.", arDesc: "خدمات رقمية مفيدة مجموعين فمتجر واحد." },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const ar = lang === "ar";
  const copy = {
    eyebrow: ar ? "شريكك الرقمي" : "YOUR DIGITAL PARTNER",
    intro: ar ? "متجر MOMIA STOR للخدمات الرقمية، نمو مواقع التواصل وشحن الألعاب. اختار الخدمة وشوف تفاصيلها قبل الطلب." : "MOMIA STOR is your digital store for social media growth, gaming top-ups and useful online services. Explore a service and review its details before ordering.",
    explore: ar ? "اكتشف الخدمات" : "Explore services",
    process: ar ? "كيفاش كنخدمو" : "How it works",
    what: ar ? "شنو كنقدمو" : "WHAT WE OFFER",
    heading: ar ? "خدمات رقمية فبلاصة وحدة" : "Digital services in one place",
    sub: ar ? "اختار القسم اللي محتاج، وغادي تلقى تفاصيل الخدمات والباقات المتاحة." : "Choose the category you need and explore available services and packages.",
    contact: ar ? "خليك قريب من الجديد" : "Stay connected",
    contactText: ar ? "قريباً غادي نزيدو الخدمات والباقات الجديدة. رجع لينا باش تكتاشف آخر المستجدات." : "New services and packages will be added as the store grows. Check back for updates.",
  };
  return <div dir={ar ? "rtl" : "ltr"} className="momia-store min-h-screen overflow-hidden">
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_20%,rgba(22,139,255,.26),transparent_45%),radial-gradient(ellipse_at_12%_85%,rgba(0,214,201,.13),transparent_42%)]"/>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#168BFF]/35 bg-[#168BFF]/10 px-4 py-2 text-xs font-bold tracking-wide text-blue-300"><Sparkles size={15}/>{copy.eyebrow}</span>
          <h1 className="mt-7 text-6xl font-black leading-[1.02] tracking-tight text-white sm:text-7xl">MOMIA <span className="block bg-gradient-to-r from-[#168BFF] to-[#00D6C9] bg-clip-text text-transparent">STOR</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{copy.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="#services" className="inline-flex items-center gap-2 rounded-xl bg-[#168BFF] px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-500">{copy.explore}<ArrowUpRight size={18}/></a><a href="#how" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">{copy.process}</a></div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400"><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#00D6C9]"/>{ar?"تفاصيل واضحة قبل الطلب":"Clear details before ordering"}</span><span className="flex items-center gap-2"><ShoppingBag size={17} className="text-[#00D6C9]"/>{ar?"خدمات متنوعة":"Multiple service categories"}</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#101f35]/90 p-5 shadow-2xl shadow-black/50 sm:p-7">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#168BFF] to-[#00D6C9] text-[#071321]"><ShoppingBag size={25}/></div><div><p className="font-black tracking-wider text-white">MOMIA STOR</p><p className="text-xs text-slate-400">Your Digital Partner</p></div></div>
          <div className="grid grid-cols-2 gap-3 py-5"><div className="rounded-2xl border border-white/10 bg-[#0B1424] p-5"><Instagram className="mb-5 text-[#168BFF]" size={27}/><p className="font-bold text-white">Social Growth</p><p className="mt-1 text-xs text-slate-400">Followers · Likes</p></div><div className="rounded-2xl border border-white/10 bg-[#0B1424] p-5"><Gamepad2 className="mb-5 text-[#00D6C9]" size={27}/><p className="font-bold text-white">Game Top Up</p><p className="mt-1 text-xs text-slate-400">Free Fire · More</p></div></div>
          <div className="rounded-2xl border border-[#168BFF]/25 bg-gradient-to-r from-[#168BFF]/15 to-[#00D6C9]/10 p-5"><p className="font-bold text-white">{ar?"كل خدماتك الرقمية فمكان واحد":"Your digital services, all in one place"}</p><p className="mt-1 text-xs text-slate-400">{ar?"تصفح الأقسام واختار اللي مناسب ليك":"Browse categories and choose what suits you."}</p></div>
          <p className="pt-5 text-center text-[10px] font-semibold tracking-[.3em] text-slate-500">YOUR DIGITAL PARTNER</p>
        </div>
      </div>
    </section>
    <section id="services" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <p className="text-xs font-bold tracking-[.25em] text-[#00D6C9]">{copy.what}</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{copy.heading}</h2><p className="mt-3 max-w-xl text-slate-400">{copy.sub}</p>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{services.map((item,i)=><article key={item.title} className="group min-w-0 rounded-2xl border border-white/10 bg-[#101f35]/70 p-4 transition hover:-translate-y-1 hover:border-[#168BFF]/60 sm:p-6"><div className="mb-5 flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#168BFF]/20 to-[#00D6C9]/15 text-[#00D6C9] sm:h-12 sm:w-12"><item.icon size={23}/></div><span className="text-[10px] text-slate-500 sm:text-xs">0{i+1}</span></div><h3 className="break-words text-sm font-bold text-white sm:text-lg">{ar?item.ar:item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-400 sm:min-h-12 sm:text-sm sm:leading-6">{ar?item.arDesc:item.desc}</p><a href="#how" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#00D6C9] sm:gap-2 sm:text-sm">{ar?"اكتشف المزيد":"Explore more"}<ArrowUpRight size={15}/></a></article>)}</div>
    </section>
    <section id="how" className="border-y border-white/10 bg-[#0e1b2e]"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><h2 className="text-center text-3xl font-black text-white">{copy.process}</h2><div className="mt-9 grid gap-4 md:grid-cols-3">{[["01","Choose a service","Browse categories and compare available packages."],["02","Review the details","Check requirements, quantity and delivery information."],["03","Place your order","Confirm the service details before submitting an order."]].map((step,i)=><div key={step[0]} className="rounded-2xl border border-white/10 bg-[#0B1424] p-6"><span className="text-4xl font-black text-[#168BFF]/70">{step[0]}</span><h3 className="mt-4 font-bold text-white">{ar?["اختار الخدمة","راجع التفاصيل","أكد الطلب"][i]:step[1]}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{ar?["تصفح الأقسام وقارن الباقات المتاحة.","شوف الشروط والكمية ومعلومات التسليم.","أكد تفاصيل الخدمة قبل إرسال الطلب."][i]:step[2]}</p></div>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="rounded-3xl border border-[#168BFF]/25 bg-gradient-to-r from-[#168BFF]/15 to-[#00D6C9]/10 p-8 sm:p-10"><p className="text-xs font-bold tracking-[.2em] text-[#00D6C9]">{ar?"MOMIA STOR":"MOMIA STOR"}</p><h2 className="mt-3 text-2xl font-black text-white">{copy.contact}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{copy.contactText}</p></div></section>
    <footer className="border-t border-white/10 bg-[#070e19]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p className="font-black tracking-widest text-white">MOMIA <span className="text-[#168BFF]">STOR</span></p><p>© {new Date().getFullYear()} MOMIA STOR. {ar?"جميع الحقوق محفوظة.":"All rights reserved."}</p></div></footer>
  </div>;
}

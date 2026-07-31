import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.jobs": "Find Jobs",
  "nav.hire": "Hire Workers",
  "nav.finance": "Financial Aid",
  "nav.training": "Skill Training",
  "nav.support": "Customer Care",
  "nav.admin": "Admin",
  "nav.worker": "Worker Portal",
  "nav.employer": "Employer Portal",
  "nav.login": "Login / Register",
  "nav.language": "Language",
  "hero.title": "Find Local Jobs Near You",
  "hero.sub":
    "SkillBridge connects workers and employers within a 4–8 km radius — daily wage, weekend shifts, part-time and contract work, matched by GPS and skill badges.",
  "cta.find": "Find Jobs",
  "cta.hire": "Hire Workers",
  "tag.1": "Hire Local, Grow Local",
  "tag.2": "From learning to earning",
  "tag.3": "Empowering growth, bridging futures",
};

const dicts: Record<LangCode, Dict> = {
  en,
  hi: {
    "nav.home": "होम",
    "nav.jobs": "नौकरी खोजें",
    "nav.hire": "श्रमिक नियुक्त करें",
    "nav.finance": "वित्तीय सहायता",
    "nav.training": "कौशल प्रशिक्षण",
    "nav.support": "ग्राहक सेवा",
    "nav.admin": "प्रशासन",
    "nav.worker": "श्रमिक पोर्टल",
    "nav.employer": "नियोक्ता पोर्टल",
    "nav.login": "लॉगिन / रजिस्टर",
    "nav.language": "भाषा",
    "hero.title": "अपने पास स्थानीय नौकरियाँ पाएँ",
    "hero.sub":
      "स्किलब्रिज 4–8 किमी के दायरे में श्रमिकों और नियोक्ताओं को जोड़ता है — दैनिक मजदूरी, सप्ताहांत शिफ्ट, अंशकालिक और अनुबंध कार्य, जीपीएस और कौशल बैज से मिलान।",
    "cta.find": "नौकरी खोजें",
    "cta.hire": "श्रमिक नियुक्त करें",
    "tag.1": "स्थानीय को काम दें, स्थानीय को बढ़ाएँ",
    "tag.2": "सीखने से कमाई तक",
    "tag.3": "विकास को सशक्त करना, भविष्य को जोड़ना",
  },
  bn: {
    "nav.home": "হোম",
    "nav.jobs": "চাকরি খুঁজুন",
    "nav.hire": "কর্মী নিয়োগ",
    "nav.finance": "আর্থিক সহায়তা",
    "nav.training": "দক্ষতা প্রশিক্ষণ",
    "nav.support": "গ্রাহক সেবা",
    "nav.admin": "অ্যাডমিন",
    "nav.worker": "কর্মী পোর্টাল",
    "nav.employer": "নিয়োগকর্তা পোর্টাল",
    "nav.login": "লগইন / নিবন্ধন",
    "nav.language": "ভাষা",
    "hero.title": "আপনার কাছেই স্থানীয় কাজ খুঁজুন",
    "hero.sub":
      "স্কিলব্রিজ ৪–৮ কিমি ব্যাসার্ধে কর্মী ও নিয়োগকর্তাদের যুক্ত করে — দৈনিক মজুরি, সপ্তাহান্তের শিফট, খণ্ডকালীন ও চুক্তিভিত্তিক কাজ, জিপিএস ও দক্ষতা ব্যাজ দিয়ে মিলিয়ে।",
    "cta.find": "চাকরি খুঁজুন",
    "cta.hire": "কর্মী নিয়োগ",
    "tag.1": "স্থানীয়ে নিয়োগ, স্থানীয়ে উন্নতি",
    "tag.2": "শেখা থেকে উপার্জন",
    "tag.3": "প্রবৃদ্ধিতে শক্তি, ভবিষ্যতে সেতু",
  },
  te: {
    "nav.home": "హోమ్",
    "nav.jobs": "ఉద్యోగాలు",
    "nav.hire": "కార్మికుల నియామకం",
    "nav.finance": "ఆర్థిక సహాయం",
    "nav.training": "నైపుణ్య శిక్షణ",
    "nav.support": "కస్టమర్ కేర్",
    "nav.admin": "అడ్మిన్",
    "nav.worker": "కార్మిక పోర్టల్",
    "nav.employer": "యజమాని పోర్టల్",
    "nav.login": "లాగిన్ / నమోదు",
    "nav.language": "భాష",
    "hero.title": "మీ దగ్గరలోని ఉద్యోగాలు కనుగొనండి",
    "hero.sub":
      "స్కిల్‌బ్రిడ్జ్ 4–8 కి.మీ. పరిధిలో కార్మికులను, యజమానులను కలుపుతుంది — రోజువారీ కూలీ, వారాంతపు షిఫ్టులు, పార్ట్‌టైమ్ మరియు కాంట్రాక్ట్ పనులు, GPS మరియు నైపుణ్య బ్యాడ్జ్‌లతో సరిపోల్చి.",
    "cta.find": "ఉద్యోగాలు వెతకండి",
    "cta.hire": "కార్మికుల నియామకం",
    "tag.1": "స్థానికంగా నియమించండి, స్థానికంగా ఎదగండి",
    "tag.2": "నేర్చుకోవడం నుండి సంపాదన వరకు",
    "tag.3": "వృద్ధికి బలం, భవిష్యత్తుకు వారధి",
  },
  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.jobs": "नोकऱ्या शोधा",
    "nav.hire": "कामगार नेमा",
    "nav.finance": "आर्थिक मदत",
    "nav.training": "कौशल्य प्रशिक्षण",
    "nav.support": "ग्राहक सेवा",
    "nav.admin": "प्रशासन",
    "nav.worker": "कामगार पोर्टल",
    "nav.employer": "नियोक्ता पोर्टल",
    "nav.login": "लॉगिन / नोंदणी",
    "nav.language": "भाषा",
    "hero.title": "जवळपासच्या स्थानिक नोकऱ्या शोधा",
    "hero.sub":
      "स्किलब्रिज ४–८ किमी परिघात कामगार आणि नियोक्त्यांना जोडते — रोजंदारी, वीकेंड शिफ्ट, अर्धवेळ आणि कंत्राटी काम, जीपीएस व कौशल्य बॅजद्वारे जुळवणी.",
    "cta.find": "नोकऱ्या शोधा",
    "cta.hire": "कामगार नेमा",
    "tag.1": "स्थानिक नेमा, स्थानिक वाढवा",
    "tag.2": "शिकण्यापासून कमाईपर्यंत",
    "tag.3": "वाढीला बळ, भविष्याला जोड",
  },
  ta: {
    "nav.home": "முகப்பு",
    "nav.jobs": "வேலை தேடு",
    "nav.hire": "பணியாளர் நியமனம்",
    "nav.finance": "நிதி உதவி",
    "nav.training": "திறன் பயிற்சி",
    "nav.support": "வாடிக்கையாளர் சேவை",
    "nav.admin": "நிர்வாகம்",
    "nav.worker": "பணியாளர் போர்டல்",
    "nav.employer": "முதலாளி போர்டல்",
    "nav.login": "உள்நுழைவு / பதிவு",
    "nav.language": "மொழி",
    "hero.title": "அருகிலுள்ள உள்ளூர் வேலைகளைக் கண்டறியுங்கள்",
    "hero.sub":
      "ஸ்கில்பிரிட்ஜ் 4–8 கி.மீ. சுற்றளவில் பணியாளர்களையும் முதலாளிகளையும் இணைக்கிறது — தினக்கூலி, வார இறுதி ஷிப்ட், பகுதிநேர மற்றும் ஒப்பந்த வேலைகள், GPS மற்றும் திறன் பேட்ஜ் மூலம் பொருத்தம்.",
    "cta.find": "வேலை தேடு",
    "cta.hire": "பணியாளர் நியமனம்",
    "tag.1": "உள்ளூரில் பணியமர்த்து, உள்ளூரில் வளர்",
    "tag.2": "கற்றலில் இருந்து சம்பாதிப்பு வரை",
    "tag.3": "வளர்ச்சிக்கு வலு, எதிர்காலத்திற்கு பாலம்",
  },
  kn: {
    "nav.home": "ಮುಖಪುಟ",
    "nav.jobs": "ಉದ್ಯೋಗ ಹುಡುಕಿ",
    "nav.hire": "ಕಾರ್ಮಿಕರ ನೇಮಕ",
    "nav.finance": "ಆರ್ಥಿಕ ನೆರವು",
    "nav.training": "ಕೌಶಲ ತರಬೇತಿ",
    "nav.support": "ಗ್ರಾಹಕ ಸೇವೆ",
    "nav.admin": "ಆಡಳಿತ",
    "nav.worker": "ಕಾರ್ಮಿಕ ಪೋರ್ಟಲ್",
    "nav.employer": "ಉದ್ಯೋಗದಾತ ಪೋರ್ಟಲ್",
    "nav.login": "ಲಾಗಿನ್ / ನೋಂದಣಿ",
    "nav.language": "ಭಾಷೆ",
    "hero.title": "ನಿಮ್ಮ ಸಮೀಪದ ಸ್ಥಳೀಯ ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ",
    "hero.sub":
      "ಸ್ಕಿಲ್‌ಬ್ರಿಡ್ಜ್ 4–8 ಕಿ.ಮೀ. ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಕಾರ್ಮಿಕರು ಮತ್ತು ಉದ್ಯೋಗದಾತರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ — ದಿನಗೂಲಿ, ವಾರಾಂತ್ಯದ ಶಿಫ್ಟ್, ಅರೆಕಾಲಿಕ ಮತ್ತು ಗುತ್ತಿಗೆ ಕೆಲಸ, GPS ಮತ್ತು ಕೌಶಲ ಬ್ಯಾಡ್ಜ್‌ಗಳಿಂದ ಹೊಂದಾಣಿಕೆ.",
    "cta.find": "ಉದ್ಯೋಗ ಹುಡುಕಿ",
    "cta.hire": "ಕಾರ್ಮಿಕರ ನೇಮಕ",
    "tag.1": "ಸ್ಥಳೀಯರನ್ನು ನೇಮಿಸಿ, ಸ್ಥಳೀಯವಾಗಿ ಬೆಳೆಯಿರಿ",
    "tag.2": "ಕಲಿಕೆಯಿಂದ ಗಳಿಕೆಯವರೆಗೆ",
    "tag.3": "ಬೆಳವಣಿಗೆಗೆ ಬಲ, ಭವಿಷ್ಯಕ್ಕೆ ಸೇತುವೆ",
  },
  gu: {
    "nav.home": "હોમ",
    "nav.jobs": "નોકરી શોધો",
    "nav.hire": "કામદાર રાખો",
    "nav.finance": "આર્થિક સહાય",
    "nav.training": "કૌશલ્ય તાલીમ",
    "nav.support": "ગ્રાહક સેવા",
    "nav.admin": "એડમિન",
    "nav.worker": "કામદાર પોર્ટલ",
    "nav.employer": "નિયોક્તા પોર્ટલ",
    "nav.login": "લોગિન / નોંધણી",
    "nav.language": "ભાષા",
    "hero.title": "તમારી નજીકની સ્થાનિક નોકરીઓ શોધો",
    "hero.sub":
      "સ્કિલબ્રિજ 4–8 કિમીની ત્રિજ્યામાં કામદારો અને નિયોક્તાઓને જોડે છે — રોજમદારી, વીકએન્ડ શિફ્ટ, પાર્ટટાઇમ અને કરાર કામ, GPS અને કૌશલ્ય બેજથી મેળ.",
    "cta.find": "નોકરી શોધો",
    "cta.hire": "કામદાર રાખો",
    "tag.1": "સ્થાનિકને રાખો, સ્થાનિક વિકસાવો",
    "tag.2": "શીખવાથી કમાણી સુધી",
    "tag.3": "વિકાસને બળ, ભવિષ્યને સેતુ",
  },
  pa: {
    "nav.home": "ਹੋਮ",
    "nav.jobs": "ਨੌਕਰੀਆਂ ਲੱਭੋ",
    "nav.hire": "ਕਾਮੇ ਭਰਤੀ ਕਰੋ",
    "nav.finance": "ਵਿੱਤੀ ਸਹਾਇਤਾ",
    "nav.training": "ਹੁਨਰ ਸਿਖਲਾਈ",
    "nav.support": "ਗਾਹਕ ਸੇਵਾ",
    "nav.admin": "ਪ੍ਰਸ਼ਾਸਨ",
    "nav.worker": "ਕਾਮਾ ਪੋਰਟਲ",
    "nav.employer": "ਮਾਲਕ ਪੋਰਟਲ",
    "nav.login": "ਲੌਗਇਨ / ਰਜਿਸਟਰ",
    "nav.language": "ਭਾਸ਼ਾ",
    "hero.title": "ਆਪਣੇ ਨੇੜੇ ਸਥਾਨਕ ਨੌਕਰੀਆਂ ਲੱਭੋ",
    "hero.sub":
      "ਸਕਿੱਲਬ੍ਰਿਜ 4–8 ਕਿ.ਮੀ. ਦੇ ਘੇਰੇ ਵਿੱਚ ਕਾਮਿਆਂ ਤੇ ਮਾਲਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ — ਦਿਹਾੜੀ, ਵੀਕਐਂਡ ਸ਼ਿਫਟ, ਪਾਰਟ-ਟਾਈਮ ਤੇ ਠੇਕਾ ਕੰਮ, GPS ਤੇ ਹੁਨਰ ਬੈਜ ਨਾਲ ਮੇਲ।",
    "cta.find": "ਨੌਕਰੀਆਂ ਲੱਭੋ",
    "cta.hire": "ਕਾਮੇ ਭਰਤੀ ਕਰੋ",
    "tag.1": "ਸਥਾਨਕ ਭਰਤੀ ਕਰੋ, ਸਥਾਨਕ ਵਧੋ",
    "tag.2": "ਸਿੱਖਣ ਤੋਂ ਕਮਾਈ ਤੱਕ",
    "tag.3": "ਵਿਕਾਸ ਨੂੰ ਤਾਕਤ, ਭਵਿੱਖ ਨੂੰ ਪੁਲ",
  },
  ml: {
    "nav.home": "ഹോം",
    "nav.jobs": "ജോലി കണ്ടെത്തുക",
    "nav.hire": "തൊഴിലാളികളെ നിയമിക്കുക",
    "nav.finance": "സാമ്പത്തിക സഹായം",
    "nav.training": "നൈപുണ്യ പരിശീലനം",
    "nav.support": "ഉപഭോക്തൃ സേവനം",
    "nav.admin": "അഡ്മിൻ",
    "nav.worker": "തൊഴിലാളി പോർട്ടൽ",
    "nav.employer": "തൊഴിലുടമ പോർട്ടൽ",
    "nav.login": "ലോഗിൻ / രജിസ്റ്റർ",
    "nav.language": "ഭാഷ",
    "hero.title": "അടുത്തുള്ള പ്രാദേശിക ജോലികൾ കണ്ടെത്തൂ",
    "hero.sub":
      "സ്കിൽബ്രിഡ്ജ് 4–8 കി.മീ. പരിധിയിൽ തൊഴിലാളികളെയും തൊഴിലുടമകളെയും ബന്ധിപ്പിക്കുന്നു — ദിവസക്കൂലി, വാരാന്ത്യ ഷിഫ്റ്റ്, പാർട്ട് ടൈം, കരാർ ജോലികൾ, GPS ഉം നൈപുണ്യ ബാഡ്ജുകളും ഉപയോഗിച്ച്.",
    "cta.find": "ജോലി കണ്ടെത്തുക",
    "cta.hire": "തൊഴിലാളികളെ നിയമിക്കുക",
    "tag.1": "പ്രാദേശികമായി നിയമിക്കൂ, പ്രാദേശികമായി വളരൂ",
    "tag.2": "പഠനത്തിൽ നിന്ന് സമ്പാദ്യത്തിലേക്ക്",
    "tag.3": "വളർച്ചയ്ക്ക് ശക്തി, ഭാവിക്ക് പാലം",
  },
};

type Ctx = { lang: LangCode; setLang: (l: LangCode) => void; t: (k: string) => string };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => en[k] ?? k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("skillbridge-lang") as LangCode | null;
    if (saved && dicts[saved]) setLangState(saved);
  }, []);

  function setLang(l: LangCode) {
    setLangState(l);
    try {
      localStorage.setItem("skillbridge-lang", l);
    } catch {
      /* ignore */
    }
  }

  const t = (k: string) => dicts[lang]?.[k] ?? en[k] ?? k;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useTaglines() {
  const { t } = useLang();
  return [t("tag.1"), t("tag.2"), t("tag.3")];
}

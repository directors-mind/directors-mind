import React, { useState, useEffect, useRef } from 'react';
import { Copy, RefreshCw, Terminal, ChevronDown, X, Sparkles, Settings, Zap, Brain, Sun, Moon, Dice5, Image as ImageIcon, Check } from 'lucide-react';

// --- v3.7.3 Fixed: Added missing 'visualTags' label ---
const UI_LABELS = {
  en: {
    appTitle: "Director's Mind",
    version: "v3.7.3",
    inspireMe: "Inspire Me",
    sections: { narrative: "NARRATIVE & SUBJECT", world: "WORLD & ATMOSPHERE", style: "STYLE & MOOD", color: "COLOR GRADING", tech: "CINEMATOGRAPHY SPECS" },
    tabs: { filter: "FILTER", rosco: "ROSCO", picker: "PICKER" },
    selectHex: "Select HEX",
    promptTerminal: "PROMPT TERMINAL",
    copy: "Copy",
    copyPrompt: "Copy Prompt",
    ready: "Ready to Generate",
    tagPlaceholder: "Mood, Feeling, Prop...",
    select: "Select...",
    custom: "Custom",
    apiKey: "Google API Key (Optional)",
    save: "Save",
    processing: "Processing...",
    generate: "Generate Concept",
    visualTags: "Visual Tags", // 👈 Fixed here
    labels: { mediaType: "Media Type", genre: "Genre / Style", environment: "Environment", setDetail: "Set Detail", weather: "Weather / Atmosphere", shotType: "Shot Type", frameSize: "Frame Size", composition: "Composition", lightingStyle: "Lighting Style", lightSource: "Light Source", timeOfDay: "Time of Day", format: "Shooting Format", camera: "Camera System", lens: "Lens Characteristics", aperture: "T-Stop / DoF", aspectRatio: "Aspect Ratio", gender: "Gender", age: "Age", ethnicity: "Ethnicity" }
  },
  cn: {
    appTitle: "导演思维",
    version: "v3.7.3",
    inspireMe: "随机灵感",
    sections: { narrative: "叙事基础", world: "时空环境", style: "风格与影调", color: "色彩风格", tech: "摄影技术参数" },
    tabs: { filter: "滤镜", rosco: "Rosco 色纸", picker: "拾色器" },
    selectHex: "选择颜色 (HEX)",
    promptTerminal: "提示词终端",
    copy: "复制",
    copyPrompt: "复制提示词",
    ready: "准备生成",
    tagPlaceholder: "输入情绪, 道具, 感觉...",
    select: "请选择...",
    custom: "自定义",
    apiKey: "Google API Key (可选)",
    save: "保存配置",
    processing: "生成中...",
    generate: "生成概念图",
    visualTags: "画面标签", // 👈 Fixed here
    labels: { mediaType: "媒体类型", genre: "流派 / 风格", environment: "环境类型", setDetail: "场景细节", weather: "天气 / 氛围", shotType: "运镜类型", frameSize: "景别", composition: "构图", lightingStyle: "光影质感", lightSource: "光源类型", timeOfDay: "时间", format: "拍摄介质", camera: "摄影机系统", lens: "镜头参数", aperture: "T值 / 景深", aspectRatio: "画幅比例", gender: "性别", age: "年龄段", ethnicity: "种族" }
  }
};

const ETHNICITY_MAP = { "Asian": "亚裔", "Black / African Descent": "非裔 / 黑人", "Black": "黑人", "White": "白人", "Latinx": "拉丁裔", "Middle Eastern": "中东裔", "Indigenous": "原住民", "Mixed-race": "混血", "South-East Asian": "东南亚裔", "South Asian": "南亚裔" };
const GENERAL_MAP = {
  "Warm": "暖调", "Cool": "冷调", "Mixed": "混合色温", "Saturated": "高饱和", "Desaturated": "低饱和", "High Key": "高调", "Low Key": "低调", "Black & White": "黑白", "Teal & Orange": "青橙色调", "Red": "红色系", "Orange": "橙色系", "Yellow": "黄色系", "Green": "绿色系", "Cyan": "青色系", "Blue": "蓝色系", "Purple": "紫色系", "Magenta": "洋红系", "Pink": "粉色系", "White": "白色系", "Black": "黑色系", "Sepia": "怀旧褐色",
  "R02 - Bastard Amber": "R02 - 琥珀色", "R08 - Pale Gold": "R08 - 浅金色", "R12 - Straw": "R12 - 麦黄色", "R27 - Medium Red": "R27 - 中红色", "R34 - Flesh Pink": "R34 - 肤粉色", "R44 - Middle Rose": "R44 - 玫瑰红", "R60 - No Color Blue": "R60 - 无色蓝", "R80 - Primary Blue": "R80 - 原蓝色", "R83 - Medium Blue": "R83 - 中蓝色", "R89 - Moss Green": "R89 - 苔藓绿", "R90 - Dark Yellow Green": "R90 - 暗黄绿", "CTB - Full Blue": "CTB - 全蓝温", "CTO - Full Orange": "CTO - 全橙温", "R3202 - Full Blue": "R3202 - 全蓝", "R3204 - Half Blue": "R3204 - 半蓝", "R382 - Congo Blue": "R382 - 刚果蓝", "R321 - Golden Amber": "R321 - 金琥珀", "R3208 - Quarter Blue": "R3208 - 四分之一蓝",
  "Cinematic": "电影感", "High Detail": "高细节", "Masterpiece": "杰作", "Trending on ArtStation": "ArtStation热榜", "Cinematic Lighting": "电影级布光",
  "Movie": "电影", "TV Episode": "电视剧集", "Music Video": "音乐录影带", "Commercial": "商业广告", "Documentary": "纪录片",
  "Interior": "室内", "Exterior": "室外", "Studio / Set": "摄影棚", "Green Screen": "绿幕", "On Location": "实地外景", "Underwater": "水下", "Space": "太空",
  "Action": "动作", "Adventure": "冒险", "Animation": "动画", "Biopic": "传记", "Comedy": "喜剧", "Crime": "犯罪", "Drama": "剧情", "Fantasy": "奇幻", "History": "历史", "Horror": "恐怖", "Mystery": "悬疑", "Romance": "爱情", "Sci-Fi": "科幻", "Thriller": "惊悚", "War": "战争", "Western": "西部", "Cyberpunk": "赛博朋克", "Automotive": "汽车广告", "Fashion / Apparel": "时尚服饰", "Beauty & Cosmetics": "美妆", "Food / Tabletop": "美食/静物", "Performance (Band/Artist)": "乐队表演", "Narrative (Story)": "叙事类", "Biographical": "人物传记", "True Crime": "真实犯罪", "Nature / Wildlife": "自然生态", "Noir": "黑色电影", "Luxury": "奢侈品", "Tech": "科技产品", "Abstract": "抽象艺术", "Lifestyle": "生活方式", "Corporate": "企业宣传", "PSA": "公益广告", "VFX Heavy": "重特效",
  "Sunny": "晴朗", "Overcast": "阴天", "Rainy": "雨天", "Stormy": "暴风雨", "Foggy": "雾天", "Hazy": "朦胧/雾霾", "Snowy": "雪天", "Windy": "大风", "Clear Skies": "万里无云", "Drizzle": "毛毛雨", "Thunderstorm": "雷暴", "Sandstorm": "沙尘暴",
  "Apartment": "公寓", "Bedroom": "卧室", "Living Room": "客厅", "Kitchen": "厨房", "Bathroom": "浴室", "Office": "办公室", "Bar / Pub / Club": "酒吧/俱乐部", "Restaurant / Diner": "餐厅/快餐店", "Hospital": "医院", "Classroom / School": "教室/学校", "Car / Vehicle": "车内/交通工具", "Street / Alley": "街道/巷子", "Forest / Woods": "森林/树林", "Beach / Ocean": "海滩/海洋", "Mountain": "山脉", "Rooftop": "屋顶/天台", "Warehouse": "仓库/废墟", "Spaceship / Sci-Fi": "太空飞船/科幻", "Void / Abstract": "虚空/抽象背景", "Subway / Train": "地铁/火车", "Church": "教堂", "Street": "街道", "Forest": "森林", "Spaceship": "太空飞船", "Void": "虚空",
  "Establishing shot": "交代镜头", "Clean single": "单人镜头", "Over the shoulder": "过肩镜头", "Low angle": "低角度/仰拍", "High angle": "高角度/俯拍", "Aerial / Drone": "航拍", "Dutch angle": "德式倾斜", "Insert": "特写插入", "POV": "主观视角", "Two Shot": "双人镜头", "Tracking Shot": "跟拍", "Handheld": "手持摄影", "Aerial": "航拍",
  "Extreme Close Up": "极特写", "Close Up": "特写", "Medium Close Up": "中特写", "Medium Shot": "中景", "Cowboy Shot": "七分身/牛仔景", "Full Shot": "全景", "Wide Shot": "远景", "Extreme Wide": "大远景",
  "Center Framed": "居中构图", "Rule of Thirds": "三分法", "Symmetrical": "对称", "Negative Space": "留白", "Looking at Camera": "直视镜头", "Right heavy": "右侧重", "Left heavy": "左侧重", "Balanced": "平衡", "Leading Lines": "引导线", "Frame within a Frame": "框中框",
  "Soft light": "柔光", "Hard light": "硬光", "High contrast": "高反差", "Low contrast": "低反差", "Silhouette": "剪影", "Rim Light": "轮廓光", "Backlight": "逆光", "Chiaroscuro": "明暗对照法", "Volumetric": "体积光", "Rembrandt": "伦勃朗光",
  "Natural Daylight": "自然光", "Moonlight": "月光", "Tungsten": "钨丝灯(暖)", "Neon": "霓虹灯", "Fire/Candle": "火光/烛光", "Practical": "道具光", "Mixed": "混合光源", "Studio Strobe": "摄影棚闪光", "Motivated light": "动机光", "Artificial light": "人造光", "Practical light": "道具光",
  "Dawn": "黎明", "Sunrise": "日出", "Day": "白天", "Golden Hour": "黄金时刻", "Blue Hour": "蓝调时刻", "Dusk": "黄昏", "Night": "夜晚", "Midnight": "午夜", "High Noon": "正午",
  "Film - 35mm": "35mm 胶片", "Film - 16mm": "16mm 胶片", "Film - IMAX": "IMAX 胶片", "Digital": "数字摄影", "Animation": "动画", "Stop Motion": "定格动画", "Film - Super 8mm": "超8mm 胶片", "Film - 65mm / 70mm": "65/70mm 胶片", "Digital - Large Format": "数字大画幅", "Tape": "磁带",
  "Ultra Wide (<18mm)": "超广角", "Wide (24-35mm)": "广角", "Standard (50mm)": "标准", "Telephoto (>85mm)": "长焦", "Macro": "微距", "Anamorphic": "变形宽银幕", "Vintage": "复古镜头", "Zoom": "变焦", "Fisheye": "鱼眼", "Wide (24mm)": "广角 (24mm)", "Standard (50mm)": "标准 (50mm)", "Telephoto (85mm)": "长焦 (85mm)", "Film Camera": "胶片摄影机",
  "T1.3 - Dreamy Bokeh": "T1.3 - 梦幻虚化", "T1.8 - Shallow Depth": "T1.8 - 浅景深", "T2.8 - Cinematic Standard": "T2.8 - 电影标准", "T5.6 - Medium Depth": "T5.6 - 中等景深", "T8 - Deep Focus": "T8 - 大景深", "T16 - Everything Sharp": "T16 - 全景清晰",
  "Male": "男性", "Female": "女性", "Baby": "婴儿", "Toddler": "幼童", "Child": "儿童", "Teenager": "青少年", "Young Adult": "年轻人", "Mid-adult": "壮年", "Middle age": "中年", "Senior": "老年", "Elderly": "高龄", "Teen": "青少年", "Adult": "成年人"
};

const getOptionLabel = (val, lang, context = null) => {
  if (lang === 'en') return val;
  if (context === 'ethnicity') return ETHNICITY_MAP[val] || val;
  if (val.startsWith('Arri') || val.startsWith('Sony') || (val.startsWith('Red ') && val.length > 4) || val.startsWith('Blackmagic') || val.startsWith('Panavision') || val.startsWith('GoPro')) return val;
  return GENERAL_MAP[val] || val;
};

const GENRE_MAPPING = { "Movie": "Movie/TV", "TV Episode": "Movie/TV", "Music Video": "Music Video", "Commercial": "Commercial", "Documentary": "Documentary" };
const ROSCO_HEX_MAP = { "R02 - Bastard Amber": "#F2C18D", "R08 - Pale Gold": "#E6C76E", "R12 - Straw": "#F2D675", "R27 - Medium Red": "#D9382E", "R34 - Flesh Pink": "#E09F9D", "R44 - Middle Rose": "#D66D8E", "R60 - No Color Blue": "#9BB6D1", "R80 - Primary Blue": "#004D99", "R83 - Medium Blue": "#2B5797", "R89 - Moss Green": "#3A6935", "R90 - Dark Yellow Green": "#587537", "CTB - Full Blue": "#87CEEB", "CTO - Full Orange": "#FFA500", "R3202 - Full Blue": "#0088CC", "R3204 - Half Blue": "#66AADD", "R382 - Congo Blue": "#220066", "R321 - Golden Amber": "#FFCC00", "R3208 - Quarter Blue": "#CCEEFF" };

const DATA_OPTIONS = {
  mediaType: ["Movie", "TV Episode", "Music Video", "Commercial", "Documentary"],
  format: ["Film - 35mm", "Film - 16mm", "Film - Super 8mm", "Film - 65mm / 70mm", "Film - IMAX", "Tape", "Digital", "Digital - Large Format", "Animation", "Stop Motion"],
  genre: {
    "Movie/TV": ["Action", "Adventure", "Animation", "Biopic", "Comedy", "Crime", "Drama", "Family", "Fantasy", "Film Noir", "History", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western", "Neo-Noir", "Cyberpunk"],
    "Commercial": ["Automotive", "Beauty & Cosmetics", "Beverage", "Fashion / Apparel", "Fast Food", "Financial Services", "Fitness / Sport", "Food / Tabletop", "Fragrance", "Gaming", "Health / Pharma", "Home Goods", "Jewelry / Luxury", "Lifestyle", "Technology", "Travel / Tourism", "Airline", "Corporate", "PSA / Awareness", "Testimonial", "VFX Heavy"],
    "Music Video": ["Performance (Band/Artist)", "Narrative (Story)", "Conceptual", "Abstract", "Dance / Choreography", "Hip Hop / Rap", "Pop", "R&B / Soul", "Rock / Alternative", "Indie", "Electronic / EDM", "K-Pop", "Latin / Reggaeton", "Metal", "Country", "Lo-Fi", "Drill", "Trap"],
    "Documentary": ["Biographical", "True Crime", "Nature / Wildlife", "Science / Tech", "Historical", "Social Issue", "Sports Doc", "Music / Arts", "Travel / Expedition", "Observational", "Archival"]
  },
  colorFilters: ["Warm", "Cool", "Mixed", "Saturated", "Desaturated", "High Key", "Low Key", "Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Magenta", "Pink", "White", "Sepia", "Black & White", "Teal & Orange"],
  roscoColors: Object.keys(ROSCO_HEX_MAP),
  weather: ["Sunny", "Overcast", "Rainy", "Stormy", "Foggy", "Hazy", "Snowy", "Windy", "Clear Skies", "Drizzle", "Thunderstorm", "Sandstorm"],
  shotType: ["Clean single", "Over the shoulder", "Establishing shot", "Low angle", "High angle", "Aerial / Drone", "Dutch angle", "Insert", "POV", "Two Shot", "Tracking Shot", "Handheld"],
  frameSize: ["Extreme Close Up", "Close Up", "Medium Close Up", "Medium Shot", "Cowboy Shot", "Full Shot", "Wide Shot", "Extreme Wide"],
  composition: ["Center Framed", "Rule of Thirds", "Symmetrical", "Negative Space", "Looking at Camera", "Right heavy", "Left heavy", "Balanced", "Leading Lines", "Frame within a Frame"],
  lighting: ["Soft light", "Hard light", "High contrast", "Low contrast", "Silhouette", "Rim Light", "Backlight", "Chiaroscuro", "Volumetric", "Rembrandt"],
  lightingType: ["Natural Daylight", "Sunny", "Overcast", "Moonlight", "Tungsten", "Neon", "Fire/Candle", "Practical", "Mixed", "Studio Strobe"],
  camera: ["Arri Alexa Mini", "Arri Alexa LF", "Sony Venice 2", "Red V-Raptor", "Blackmagic 12K", "Panavision Millennium", "GoPro / Action", "Vintage Camcorder", "Film Camera"],
  lensSize: ["Ultra Wide (<18mm)", "Wide (24-35mm)", "Standard (50mm)", "Telephoto (>85mm)", "Macro", "Anamorphic", "Vintage", "Zoom", "Fisheye"],
  aperture: ["T1.3 - Dreamy Bokeh", "T1.8 - Shallow Depth", "T2.8 - Cinematic Standard", "T5.6 - Medium Depth", "T8 - Deep Focus", "T16 - Everything Sharp"],
  aspectRatio: ["1.33:1 (4:3)", "1.78:1 (16:9)", "1.85:1", "2.00:1 (Univisium)", "2.35:1 (Scope)", "2.39:1", "2.76:1 (Ultra Panavision)", "9:16 (Vertical)"],
  timeOfDay: ["Dawn", "Sunrise", "Day", "Golden Hour", "Blue Hour", "Dusk", "Night", "Midnight"],
  location: ["Interior", "Exterior", "Studio / Set", "Green Screen", "On Location", "Underwater", "Space"],
  set: ["Apartment", "Bedroom", "Living Room", "Kitchen", "Bathroom", "Office", "Bar / Pub / Club", "Restaurant / Diner", "Hospital", "Classroom / School", "Car / Vehicle", "Street / Alley", "Forest / Woods", "Beach / Ocean", "Mountain", "Rooftop", "Warehouse", "Spaceship / Sci-Fi", "Void / Abstract", "Subway / Train", "Church"],
  character: {
    gender: ["Male", "Female"],
    age: ["Baby", "Toddler", "Child", "Teenager", "Young Adult", "Mid-adult", "Middle age", "Senior", "Elderly"],
    ethnicity: ["Asian", "Black / African Descent", "Latinx", "Middle Eastern", "White", "Indigenous", "Mixed-race", "South-East Asian", "South Asian"]
  }
};

const CustomSelect = ({ label, value, options, onChange, disabled, theme, lang, context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => { const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const t = UI_LABELS[lang] || UI_LABELS.en;
  return (
    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef}>
      <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</label>
      <div className="relative">
        <button onClick={() => !disabled && setIsOpen(!isOpen)} className={`w-full text-left text-[13px] font-medium rounded-lg px-3 py-2.5 border outline-none transition-all shadow-sm flex justify-between items-center truncate ${theme === 'dark' ? 'bg-[#1c1c1e] text-neutral-200 border-white/10 hover:bg-white/10' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'}`}>
          <span className="truncate block pr-4">{value ? getOptionLabel(value, lang, context) : t.select}</span>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'}`} />
        </button>
        {isOpen && <div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar p-1 ${theme === 'dark' ? 'bg-[#1c1c1e] border-white/10' : 'bg-white border-gray-200'}`}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-3 py-2 rounded-md cursor-pointer text-[13px] transition-colors ${value === opt ? 'bg-blue-500 text-white' : theme === 'dark' ? 'text-neutral-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
              {getOptionLabel(opt, lang, context)}
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

const CreatableSelect = ({ label, value, options, onChange, placeholder, theme, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => { const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const t = UI_LABELS[lang] || UI_LABELS.en;
  const filtered = options.filter(o => o.toLowerCase().includes(value.toLowerCase()));
  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</label>
      <div className="relative">
        <div className={`flex items-center w-full rounded-lg border transition-all shadow-sm ${theme === 'dark' ? 'bg-[#1c1c1e] border-white/10 focus-within:border-blue-500/50' : 'bg-white border-gray-200 focus-within:border-blue-500'}`}>
          <input value={value} onChange={e => {onChange(e.target.value); setIsOpen(true);}} onFocus={() => setIsOpen(true)} placeholder={placeholder} className={`w-full bg-transparent text-[13px] font-medium px-3 py-2.5 outline-none ${theme === 'dark' ? 'text-neutral-200' : 'text-gray-900'}`} />
          <button onClick={() => setIsOpen(!isOpen)} className={`px-3 py-2.5 transition-colors border-l ${theme === 'dark' ? 'text-neutral-500 hover:text-white border-white/5' : 'text-gray-400 hover:text-gray-900 border-gray-200'}`}><ChevronDown className="w-4 h-4" /></button>
        </div>
        {isOpen && <div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar p-1 ${theme === 'dark' ? 'bg-[#1c1c1e] border-white/10' : 'bg-white border-gray-200'}`}>
          {filtered.length > 0 ? filtered.map(opt => <div key={opt} onClick={() => {onChange(opt); setIsOpen(false);}} className={`px-3 py-2 rounded-md cursor-pointer text-[13px] transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>{getOptionLabel(opt, lang)}</div>) : <div className={`px-3 py-2 text-[12px] italic ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'}`}>{t.custom}: "{value}"</div>}
        </div>}
      </div>
    </div>
  );
};

const MultiSelectGroup = ({ label, selectedValues, options, onChange, disabled, theme, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => { const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const t = UI_LABELS[lang] || UI_LABELS.en;
  const toggle = (opt) => { const curr = Array.isArray(selectedValues) ? selectedValues : []; onChange(curr.includes(opt) ? curr.filter(i => i !== opt) : [...curr, opt]); };
  return (
    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef}>
      <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</label>
      <div className="relative">
        <button onClick={() => !disabled && setIsOpen(!isOpen)} className={`w-full text-left text-[13px] font-medium rounded-lg px-3 py-2.5 border outline-none transition-all shadow-sm flex justify-between items-center truncate ${theme === 'dark' ? 'bg-[#1c1c1e] text-neutral-200 border-white/10 hover:bg-white/10' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'}`}>
          <span className="truncate block pr-4">{Array.isArray(selectedValues) && selectedValues.length ? selectedValues.map(v => getOptionLabel(v, lang)).join(", ") : t.select}</span>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'}`} />
        </button>
        {isOpen && <div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar p-1 ${theme === 'dark' ? 'bg-[#1c1c1e] border-white/10' : 'bg-white border-gray-200'}`}>
          {options.map(opt => {
            const isSel = Array.isArray(selectedValues) && selectedValues.includes(opt);
            return <div key={opt} onClick={() => toggle(opt)} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors text-[13px] ${isSel ? 'bg-blue-500/10 text-blue-500' : theme === 'dark' ? 'text-neutral-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-100'}`}><div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${isSel ? 'bg-blue-500 border-blue-500' : theme === 'dark' ? 'border-neutral-600' : 'border-gray-300'}`}>{isSel && <Check size={10} className="text-white" />}</div>{getOptionLabel(opt, lang)}</div>;
          })}
        </div>}
      </div>
    </div>
  );
};

const TagInput = ({ tags, setTags, theme, label, placeholder, lang }) => {
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 flex items-center gap-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}><Sparkles size={10} className="text-blue-500" /> {label}</label>
      <div className={`min-h-[46px] rounded-lg border flex flex-wrap items-center p-2 gap-2 shadow-inner transition-colors ${theme === 'dark' ? 'bg-[#1c1c1e] border-white/10 focus-within:border-blue-500/50' : 'bg-white border-gray-200 focus-within:border-blue-500'}`}>
        {tags.map((tag, i) => <span key={i} className={`text-[11px] px-2 py-1 rounded-md flex items-center gap-1 border font-medium ${theme === 'dark' ? 'bg-blue-500/20 text-blue-100 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{getOptionLabel(tag, lang)} <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))}><X size={10} /></button></span>)}
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {if(e.key==='Enter'&&input.trim()){setTags([...tags,input.trim()]);setInput("")}else if(e.key==='Backspace'&&!input){setTags(tags.slice(0,-1))}}} placeholder={tags.length ? "" : placeholder} className={`bg-transparent text-[13px] outline-none flex-grow min-w-[80px] ${theme === 'dark' ? 'text-neutral-200' : 'text-gray-900'}`} />
      </div>
    </div>
  );
};

const ColorPanel = ({ selection, setSelection, theme, label, lang }) => {
  const [tab, setTab] = useState("filter");
  const t = UI_LABELS[lang] || UI_LABELS.en;
  const toggle = (val) => { const curr = Array.isArray(selection) ? selection : []; setSelection(curr.includes(val) ? curr.filter(i => i !== val) : [...curr, val]); };
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pl-1">
        <label className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</label>
        <div className={`flex gap-1 p-0.5 rounded-md ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
          {["filter", "rosco", "picker"].map(k => <button key={k} onClick={() => setTab(k)} className={`text-[9px] px-2 py-0.5 uppercase font-bold rounded-sm transition-all ${tab === k ? 'bg-blue-600 text-white shadow-sm' : theme === 'dark' ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-500 hover:text-gray-900'}`}>{t.tabs[k]}</button>)}
        </div>
      </div>
      <div className={`border rounded-lg p-3 h-[180px] flex flex-col ${theme === 'dark' ? 'bg-[#1c1c1e] border-white/10' : 'bg-white border-gray-200'}`}>
        {tab === "filter" && <div className="flex flex-wrap gap-1.5 overflow-y-auto custom-scrollbar content-start h-full pr-1">
          {DATA_OPTIONS.colorFilters.map(c => {
            const isSel = Array.isArray(selection) && selection.includes(c);
            return <button key={c} onClick={() => toggle(c)} className={`text-[10px] px-2 py-1 rounded border transition-all ${isSel ? theme === 'dark' ? 'bg-white text-black border-white font-bold' : 'bg-gray-900 text-white border-gray-900 font-bold' : theme === 'dark' ? 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30' : 'bg-transparent text-gray-600 border-gray-200 hover:border-gray-400'}`}>{getOptionLabel(c, lang)}</button>;
          })}
        </div>}
        {tab === "rosco" && <div className="h-full overflow-y-scroll custom-scrollbar pr-1"><div className="flex flex-col gap-1">
          {DATA_OPTIONS.roscoColors.map(c => {
            const isSel = Array.isArray(selection) && selection.includes(c);
            return <button key={c} onClick={() => toggle(c)} className={`text-left text-[11px] px-2 py-1.5 rounded truncate transition-colors w-full flex-shrink-0 flex items-center gap-2 ${isSel ? 'bg-blue-500/10 text-blue-600 border border-blue-500/30' : theme === 'dark' ? 'text-neutral-400 hover:bg-white/5 border border-transparent' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}><div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm border border-black/10" style={{backgroundColor: ROSCO_HEX_MAP[c]}}></div><span className="truncate">{getOptionLabel(c, lang)}</span></button>;
          })}
        </div></div>}
        {tab === "picker" && <div className="flex flex-col gap-3 items-center justify-center h-full py-2"><input type="color" value={(Array.isArray(selection) && selection[0]?.startsWith('#')) ? selection[0] : "#3b82f6"} onChange={(e) => setSelection([e.target.value])} className="w-full h-10 rounded cursor-pointer bg-transparent" /><span className={`text-xs font-mono ${theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'}`}>{(Array.isArray(selection) && selection[0]?.startsWith('#')) ? selection[0] : t.selectHex}</span></div>}
      </div>
    </div>
  );
};

export default function DirectorsMind() {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("cn");
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selections, setSelections] = useState({ mediaType: "Movie", format: "", genre: [], location: "", set: "", weather: "", shotType: "", frameSize: "", composition: "", lighting: "", lightingType: "", camera: "", lensSize: "", aspectRatio: "2.39:1 (Scope)", timeOfDay: "", aperture: "", gender: "", age: "", ethnicity: "", color: [] });
  const [tags, setTags] = useState(["Cinematic", "High Detail"]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const t = UI_LABELS[lang] || UI_LABELS.en;
  const updateSelection = (k, v) => setSelections(p => ({...p, [k]: v, ...(k==='mediaType'?{genre:[]}:{})}));
  const randomize = () => {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setSelections({ mediaType: "Movie", format: r(DATA_OPTIONS.format), genre: [r(DATA_OPTIONS.genre["Movie/TV"])], location: r(DATA_OPTIONS.location), set: r(DATA_OPTIONS.set), weather: r(DATA_OPTIONS.weather), shotType: r(DATA_OPTIONS.shotType), frameSize: r(DATA_OPTIONS.frameSize), composition: r(DATA_OPTIONS.composition), lighting: r(DATA_OPTIONS.lighting), lightingType: r(DATA_OPTIONS.lightingType), camera: r(DATA_OPTIONS.camera), lensSize: r(DATA_OPTIONS.lensSize), aperture: r(DATA_OPTIONS.aperture), aspectRatio: r(DATA_OPTIONS.aspectRatio), timeOfDay: r(DATA_OPTIONS.timeOfDay), gender: r(DATA_OPTIONS.character.gender), age: r(DATA_OPTIONS.character.age), ethnicity: r(DATA_OPTIONS.character.ethnicity), color: [r(DATA_OPTIONS.colorFilters), r(DATA_OPTIONS.colorFilters)] });
    setTags(["Cinematic", "Masterpiece"]);
  };

  useEffect(() => {
    const subject = [selections.age, selections.ethnicity, selections.gender].filter(Boolean).join(" ") || "subject";
    const apVal = selections.aperture ? selections.aperture.split(' - ')[0] : "";
    const parts = [selections.shotType, `of a ${subject}`, selections.frameSize, selections.mediaType, Array.isArray(selections.genre)?selections.genre.join(", "):"", tags.join(", "), selections.location ? `in ${selections.location}` : "", selections.set, selections.weather, selections.timeOfDay, selections.lighting, selections.color.join(", ")].filter(Boolean);
    const tech = [selections.format, selections.camera, selections.lensSize, apVal, selections.aspectRatio, "8k"].filter(Boolean).join(", ");
    setPrompt(`/imagine prompt: ${parts.join(", ")}. --ar ${selections.aspectRatio?.split(':')[0] || "16:9"} --params ${tech}`);
  }, [selections, tags]);

  const handleAction = () => {
    if (apiKey) { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setGeneratedImage(`https://placehold.co/1920x800/111/FFF?text=Director's+Cut&font=playfair-display`); }, 2000); } 
    else { navigator.clipboard.writeText(prompt); alert("Prompt copied!"); }
  };

  const bgMain = theme === 'dark' ? 'bg-[#050505]' : 'bg-[#f0f0f2]';
  const sidebarBg = theme === 'dark' ? 'bg-[#09090b] border-r border-white/5' : 'bg-[#ffffff] border-r border-black/5';
  const textMain = theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800';

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans antialiased selection:bg-blue-500/30 ${bgMain} ${textMain}`}>
      <header className={`h-12 shrink-0 px-4 flex justify-between items-center z-50 border-b backdrop-blur-md ${theme === 'dark' ? 'border-white/5 bg-black/80' : 'border-black/5 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-2"><div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div><div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div><div className="w-3 h-3 rounded-full bg-[#28C840]"></div></div>
          <div className="h-4 w-px bg-white/10 mx-1"></div>
          <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}><Brain size={14} strokeWidth={2}/></div><span className="text-xs font-bold tracking-wide">{t.appTitle} <span className="opacity-40 font-normal">PRO</span></span></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded transition ${showSettings ? 'text-blue-500 bg-blue-500/10' : 'opacity-50 hover:opacity-100'}`}><Settings size={14}/></button>
          <div className="h-3 w-px bg-current opacity-10"></div>
          <button onClick={() => setLang(lang === 'en' ? 'cn' : 'en')} className="text-[10px] font-bold opacity-50 hover:opacity-100 transition">{lang === 'en' ? '中' : 'EN'}</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="opacity-50 hover:opacity-100 transition">{theme === 'dark' ? <Sun size={14}/> : <Moon size={14}/>}</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`w-[400px] shrink-0 flex flex-col overflow-y-auto custom-scrollbar ${sidebarBg}`}>
          {showSettings && <div className={`p-4 border-b ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-gray-50 border-black/5'}`}><label className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2 block">{t.apiKey}</label><div className="flex gap-2"><input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Paste Key..." className={`flex-1 text-xs px-2 py-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}/><button onClick={() => setShowSettings(false)} className="text-[10px] px-2 bg-blue-600 text-white rounded">{t.save}</button></div></div>}
          
          <div className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center"><h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.narrative}</h3><button onClick={randomize} className="text-[9px] opacity-50 hover:opacity-100 flex items-center gap-1 hover:text-blue-500 transition"><Dice5 size={10}/> {t.inspireMe}</button></div>
            <CustomSelect label={t.labels.mediaType} value={selections.mediaType} options={DATA_OPTIONS.mediaType} onChange={v => updateSelection('mediaType', v)} theme={theme} lang={lang} />
            <div className="grid grid-cols-3 gap-2">
              <CustomSelect label={t.labels.gender} value={selections.gender} options={DATA_OPTIONS.character.gender} onChange={v => updateSelection('gender', v)} theme={theme} lang={lang} />
              <CustomSelect label={t.labels.age} value={selections.age} options={DATA_OPTIONS.character.age} onChange={v => updateSelection('age', v)} theme={theme} lang={lang} />
              <CustomSelect label={t.labels.ethnicity} value={selections.ethnicity} options={DATA_OPTIONS.character.ethnicity} onChange={v => updateSelection('ethnicity', v)} theme={theme} lang={lang} context="ethnicity" />
            </div>
          </div>
          <div className={`h-px ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}></div>

          <div className="p-5 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.world}</h3>
            <div className="grid grid-cols-2 gap-3"><CustomSelect label={t.labels.environment} value={selections.location} options={DATA_OPTIONS.location} onChange={v => updateSelection('location', v)} theme={theme} lang={lang} /><CustomSelect label={t.labels.timeOfDay} value={selections.timeOfDay} options={DATA_OPTIONS.timeOfDay} onChange={v => updateSelection('timeOfDay', v)} theme={theme} lang={lang} /></div>
            <div className="grid grid-cols-2 gap-3"><CreatableSelect label={t.labels.setDetail} value={selections.set} options={DATA_OPTIONS.set} onChange={v => updateSelection('set', v)} placeholder={t.tagPlaceholder} theme={theme} lang={lang} /><CustomSelect label={t.labels.weather} value={selections.weather} options={DATA_OPTIONS.weather} onChange={v => updateSelection('weather', v)} theme={theme} lang={lang} /></div>
          </div>
          <div className={`h-px ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}></div>

          <div className="p-5 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.style}</h3>
            <MultiSelectGroup label={t.labels.genre} selectedValues={selections.genre} options={DATA_OPTIONS.genre[GENRE_MAPPING[selections.mediaType]] || []} onChange={v => updateSelection('genre', v)} disabled={!DATA_OPTIONS.genre[GENRE_MAPPING[selections.mediaType]]} theme={theme} lang={lang} />
            <TagInput tags={tags} setTags={setTags} theme={theme} label={t.visualTags} placeholder={t.tagPlaceholder} lang={lang} />
          </div>
          <div className={`h-px ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}></div>

          <div className="p-5 flex flex-col gap-4"><ColorPanel selection={selections.color} setSelection={v => updateSelection('color', v)} theme={theme} label={t.sections.color} lang={lang} /></div>
          <div className={`h-px ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}></div>

          <div className="p-5 flex flex-col gap-4 pb-20">
            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.tech}</h3>
            <div className="grid grid-cols-2 gap-3"><CustomSelect label={t.labels.shotType} value={selections.shotType} options={DATA_OPTIONS.shotType} onChange={v => updateSelection('shotType', v)} theme={theme} lang={lang} /><CustomSelect label={t.labels.frameSize} value={selections.frameSize} options={DATA_OPTIONS.frameSize} onChange={v => updateSelection('frameSize', v)} theme={theme} lang={lang} /><div className="col-span-2"><CustomSelect label={t.labels.composition} value={selections.composition} options={DATA_OPTIONS.composition} onChange={v => updateSelection('composition', v)} theme={theme} lang={lang} /></div></div>
            <div className="grid grid-cols-2 gap-3 pt-2"><CustomSelect label={t.labels.lightingStyle} value={selections.lighting} options={DATA_OPTIONS.lighting} onChange={v => updateSelection('lighting', v)} theme={theme} lang={lang} /><CustomSelect label={t.labels.lightSource} value={selections.lightingType} options={DATA_OPTIONS.lightingType} onChange={v => updateSelection('lightingType', v)} theme={theme} lang={lang} /></div>
            <div className="grid grid-cols-2 gap-3 pt-2"><CustomSelect label={t.labels.format} value={selections.format} options={DATA_OPTIONS.format} onChange={v => updateSelection('format', v)} theme={theme} lang={lang} /><CustomSelect label={t.labels.camera} value={selections.camera} options={DATA_OPTIONS.camera} onChange={v => updateSelection('camera', v)} theme={theme} lang={lang} /><CustomSelect label={t.labels.lens} value={selections.lensSize} options={DATA_OPTIONS.lensSize} onChange={v => updateSelection('lensSize', v)} theme={theme} lang={lang} /><CustomSelect label={t.labels.aperture} value={selections.aperture} options={DATA_OPTIONS.aperture} onChange={v => updateSelection('aperture', v)} theme={theme} lang={lang} /><div className="col-span-2"><CustomSelect label={t.labels.aspectRatio} value={selections.aspectRatio} options={DATA_OPTIONS.aspectRatio} onChange={v => updateSelection('aspectRatio', v)} theme={theme} lang={lang} /></div></div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative bg-checkered">
          <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-br from-[#050505] to-[#1a1a1a]' : 'bg-[#f0f0f2]'}`}></div>
          <div className="flex-1 flex items-center justify-center p-10 z-10 overflow-hidden relative group">
             {generatedImage ? <div className="relative shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-500"><img src={generatedImage} alt="Concept" className="max-w-full max-h-[80vh] object-contain shadow-2xl" /><div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none"></div></div> : <div className={`flex flex-col items-center gap-4 opacity-20 ${theme === 'dark' ? 'text-white' : 'text-black'}`}><div className="w-24 h-24 rounded-2xl border-2 border-dashed border-current flex items-center justify-center"><ImageIcon size={48} strokeWidth={1} /></div><p className="text-sm font-medium tracking-widest uppercase">{t.ready}</p></div>}
          </div>
          <div className="shrink-0 p-6 z-20 flex justify-center">
            <div className={`w-full max-w-4xl rounded-xl border backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all ${theme === 'dark' ? 'bg-[#111]/80 border-white/10' : 'bg-white/80 border-black/10'}`}>
              <div className={`px-4 py-3 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-black/5 bg-gray-50/50'}`}><div className="flex items-center gap-2"><Terminal size={12} className="text-blue-500" /><span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{t.promptTerminal}</span></div><button onClick={() => navigator.clipboard.writeText(prompt)} className="opacity-50 hover:opacity-100 transition"><Copy size={12}/></button></div>
              <div className="p-4 font-mono text-xs leading-relaxed opacity-80 max-h-[80px] overflow-y-auto custom-scrollbar">{prompt || <span className="opacity-30">Prompt will appear here...</span>}</div>
              <button onClick={handleAction} disabled={isGenerating} className={`h-12 w-full flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all ${isGenerating ? 'bg-neutral-500 cursor-not-allowed text-white' : apiKey ? 'bg-blue-600 hover:bg-blue-500 text-white' : theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>{isGenerating ? <><RefreshCw size={16} className="animate-spin"/> {t.processing}</> : apiKey ? <><Zap size={16} className="text-yellow-300 fill-current"/> {t.generate}</> : <><Copy size={16}/> {t.copyPrompt}</>}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
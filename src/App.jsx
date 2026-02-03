import React, { useState, useEffect, useRef } from 'react';

import { Copy, RefreshCw, Terminal, ChevronDown, X, Sparkles, Settings, Zap, Brain, Image as ImageIcon, Check } from 'lucide-react';



// =============================================================================

// 1. 核心映射逻辑

// =============================================================================



const UI_LABELS = {

  appTitle: "导演思维",

  version: "v4.1.0-Logic-Pro",

  sections: { 

    narrative: "1. 叙事与角色系统", storyboard: "2. 分镜与构图系统", 

    world: "3. 物理环境系统", style: "4. 影调与色彩系统", tech: "5. 摄影设备系统" 

  },

  tabs: { filter: "滤镜", rosco: "色纸", picker: "拾色器" },

  selectHex: "点击选择颜色",

  noHex: "默认(无颜色设定)",

  promptTerminal: "提示词终端",

  copyPrompt: "复制提示词",

  ready: "准备生成",

  tagPlaceholder: "输入关键词...",

  select: "请选择...",

  custom: "自定义",

  labels: { 

    mediaType: "媒体类型", genre: "流派风格", gender: "性别", age: "年龄段", ethnicity: "种族",

    subject: "主体名称", backDetail: "背面特征", facingObject: "正面对向之物",

    cameraAngle: "拍摄角度(机位)", frameSize: "景别控制", composition: "构图方式", shotType: "运镜动作",

    environment: "环境类型", setDetail: "场景细节", weather: "天气氛围", timeOfDay: "时间段",

    lightingStyle: "光影质感", lightSource: "光源类型", visualTags: "画面标签",

    camera: "摄影机系统", format: "拍摄介质", lens: "镜头参数", aperture: "光圈/景深", aspectRatio: "画幅比例"

  }

};



const ETHNICITY_MAP = { "Asian": "亚裔", "Black / African Descent": "非裔 / 黑人", "Black": "黑人", "White": "白人", "Latinx": "拉丁裔", "Middle Eastern": "中东裔", "Indigenous": "原住民", "Mixed-race": "混血", "South-East Asian": "东南亚裔", "South Asian": "南亚裔" };

const GENERAL_MAP = { "Warm": "暖调", "Cool": "冷调", "Mixed": "混合色温", "Saturated": "高饱和", "Desaturated": "低饱和", "High Key": "高调", "Low Key": "低调", "Black & White": "黑白", "Teal & Orange": "青橙色调", "Red": "红色系", "Orange": "橙色系", "Yellow": "黄色系", "Green": "绿色系", "Cyan": "青色系", "Blue": "蓝色系", "Purple": "紫色系", "Magenta": "洋红系", "Pink": "粉色系", "White": "白色系", "Black": "黑色系", "Sepia": "怀旧褐色", "R02 - Bastard Amber": "R02 - 琥珀色", "R08 - Pale Gold": "R08 - 浅金色", "R12 - Straw": "R12 - 麦黄色", "R27 - Medium Red": "R27 - 中红色", "R34 - Flesh Pink": "R34 - 肤粉色", "R44 - Middle Rose": "R44 - 玫瑰红", "R60 - No Color Blue": "R60 - 无色蓝", "R80 - Primary Blue": "R80 - 原蓝色", "R83 - Medium Blue": "R83 - 中蓝色", "R89 - Moss Green": "R89 - 苔藓绿", "R90 - Dark Yellow Green": "R90 - 暗黄绿", "CTB - Full Blue": "CTB - 全蓝温", "CTO - Full Orange": "CTO - 全橙温", "R3202 - Full Blue": "R3202 - 全蓝", "R3204 - Half Blue": "R3204 - 半蓝", "R382 - Congo Blue": "R382 - 刚果蓝", "R321 - Golden Amber": "R321 - 金琥珀", "R3208 - Quarter Blue": "R3208 - 四分之一蓝", "Cinematic": "电影感", "High Detail": "高细节", "Masterpiece": "杰作", "Movie": "电影", "TV Episode": "电视剧集", "Music Video": "音乐录影带", "Commercial": "商业广告", "Documentary": "纪录片", "Interior": "室内", "Exterior": "室外", "Studio / Set": "摄影棚", "Green Screen": "绿幕", "On Location": "实地外景", "Underwater": "水下", "Space": "太空", "Apartment": "公寓", "Bedroom": "卧室", "Living Room": "客厅", "Kitchen": "厨房", "Bathroom": "浴室", "Office": "办公室", "Bar / Pub / Club": "酒吧/俱乐部", "Restaurant / Diner": "餐厅/快餐店", "Hospital": "医院", "Classroom / School": "教室/学校", "Car / Vehicle": "车内/交通工具", "Street / Alley": "街道/巷子", "Forest / Woods": "森林/树林", "Beach / Ocean": "海滩/海洋", "Mountain": "山脉", "Rooftop": "屋顶/天台", "Warehouse": "仓库/废墟", "Spaceship / Sci-Fi": "太空飞船/科幻", "Void / Abstract": "虚空/抽象背景", "Subway / Train": "地铁/火车", "Church": "教堂", "Temple": "寺庙", "Action": "动作", "Adventure": "冒险", "Animation": "动画", "Biopic": "传记", "Comedy": "喜剧", "Crime": "犯罪", "Drama": "剧情", "Family": "家庭", "Fantasy": "奇幻", "Film Noir": "黑色电影", "History": "历史", "Horror": "恐怖", "Musical": "音乐歌舞", "Mystery": "悬疑", "Romance": "爱情", "Sci-Fi": "科幻", "Sport": "体育/运动", "Thriller": "惊悚", "War": "战争", "Western": "西部", "Neo-Noir": "新黑色电影", "Cyberpunk": "赛博朋克", "Automotive": "汽车广告", "Beauty & Cosmetics": "美妆/护肤", "Beverage": "饮料/酒水", "Fashion / Apparel": "时尚服饰", "Fast Food": "快餐/餐饮", "Financial Services": "金融服务", "Fitness / Sport": "健身/运动", "Food / Tabletop": "美食/静物", "Fragrance": "香水", "Gaming": "游戏/电竞", "Health / Pharma": "医疗/制药", "Home Goods": "家居/家电", "Jewelry / Luxury": "珠宝/奢侈品", "Lifestyle": "生活方式", "Technology": "科技产品", "Travel / Tourism": "旅游/出行", "Airline": "航空", "Corporate": "企业形象", "PSA / Awareness": "公益/宣传", "Testimonial": "证言/采访", "VFX Heavy": "重特效", "Performance (Band/Artist)": "乐队表演", "Narrative (Story)": "叙事类", "Conceptual": "概念类", "Abstract": "抽象/艺术", "Dance / Choreography": "舞蹈/编舞", "Hip Hop / Rap": "嘻哈/说唱", "Pop": "流行", "R&B / Soul": "R&B/灵魂乐", "Rock / Alternative": "摇滚/另类", "Indie": "独立音乐", "Electronic / EDM": "电子/EDM", "K-Pop": "K-Pop", "Latin / Reggaeton": "拉丁/雷鬼顿", "Metal": "金属乐", "Country": "乡村音乐", "Lo-Fi": "低保真 (Lo-Fi)", "Drill": "Drill", "Trap": "Trap", "Biographical": "人物传记", "True Crime": "真实犯罪", "Nature / Wildlife": "自然生态", "Science / Tech": "科技/科学", "Historical": "历史题材", "Social Issue": "社会议题", "Sports Doc": "体育纪录", "Music / Arts": "音乐/艺术", "Travel / Expedition": "旅行/探险", "Observational": "观察类", "Archival": "档案/回顾", "Sunny": "晴朗", "Overcast": "阴天", "Rainy": "雨天", "Stormy": "暴风雨", "Foggy": "雾天", "Hazy": "朦胧/雾霾", "Snowy": "雪天", "Windy": "大风", "Clear Skies": "万里无云", "Drizzle": "毛毛雨", "Thunderstorm": "雷暴", "Sandstorm": "沙尘暴", "Static Shot": "固定镜头", "Panning": "摇镜头", "Tilt": "俯仰镜头", "Dolly In": "推镜头", "Dolly Out": "拉镜头", "Tracking Shot": "跟拍", "Crab Shot": "横移", "Arc Shot": "弧形环绕", "Handheld": "手持摄影", "Steadicam": "斯坦尼康", "Gimbal Flow": "稳定器跟随", "Shakey Cam": "剧烈晃动", "Whiplash": "极速甩镜", "Eye Level (Neutral)": "平视 (中性)", "Low Angle (Heroic)": "仰拍 (英雄视角)", "High Angle (Vulnerability)": "俯拍 (弱势视角)", "Overhead / God's Eye": "上帝视角 / 顶拍", "Worm's Eye View": "虫视 / 极低角度", "Dutch Angle / Canted": "德式倾斜 / 不安感", "Over the Shoulder": "过肩镜头", "POV (Point of View)": "主观视角 (POV)", "Ground Level": "地面视角", "Knee Level": "膝盖视角", "Bird's Eye View": "鸟瞰", "Drone / Aerial": "无人机 / 航拍", "Selfie Angle": "自拍视角", "Extreme Close Up": "极特写", "Close Up": "特写", "Medium Close Up": "中特写", "Medium Shot": "中景", "Cowboy Shot": "七分身/牛仔景", "Full Shot": "全景", "Wide Shot": "远景", "Extreme Wide": "大远景", "Center Framed": "居中构图", "Rule of Thirds": "三分法", "Symmetrical": "对称", "Negative Space": "留白", "Looking at Camera": "直视镜头", "Right heavy": "右侧重", "Left heavy": "左侧重", "Balanced": "平衡", "Leading Lines": "引导线", "Frame within a Frame": "框中框", "Soft light": "柔光", "Hard light": "硬光", "High contrast": "高反差", "Low contrast": "低反差", "Silhouette": "剪影", "Rim Light": "轮廓光", "Backlight": "逆光", "Chiaroscuro": "明暗对照法", "Volumetric": "体积光", "Rembrandt": "伦勃朗光", "Natural Daylight": "自然光", "Moonlight": "月光", "Tungsten": "钨丝灯(暖)", "Neon": "霓虹灯", "Fire/Candle": "火光/烛光", "Practical": "道具光", "Mixed": "混合光源", "Studio Strobe": "摄影棚闪光", "Motivated light": "动机光", "Artificial light": "人造光", "Practical light": "道具光", "Dawn": "黎明", "Sunrise": "日出", "Day": "白天", "Golden Hour": "黄金时刻", "Blue Hour": "蓝调时刻", "Dusk": "黄昏", "Night": "夜晚", "Midnight": "午夜", "High Noon": "正午", "Film - 35mm": "35mm 胶片", "Film - 16mm": "16mm 胶片", "Film - IMAX": "IMAX 胶片", "Digital": "数字摄影", "Animation": "动画", "Stop Motion": "定格动画", "Film - Super 8mm": "超8mm 胶片", "Film - 65mm / 70mm": "65/70mm 胶片", "Digital - Large Format": "数字大画幅", "Tape": "磁带", "Ultra Wide (<18mm)": "超广角", "Wide (24-35mm)": "广角", "Standard (50mm)": "标准", "Telephoto (>85mm)": "长焦", "Macro Lens": "微距", "Anamorphic": "变形宽银幕", "Vintage Lens": "复古镜头", "Zoom": "变焦", "Fisheye Lens": "鱼眼", "T1.3": "T1.3", "T1.8": "T1.8", "T2.8": "T2.8", "T4.0": "T4.0", "T5.6": "T5.6", "T8.0": "T8.0", "T11": "T11", "T16": "T16" };



const GENRE_MAPPING = { "Movie": "Movie/TV", "TV Episode": "Movie/TV", "Music Video": "Music Video", "Commercial": "Commercial", "Documentary": "Documentary" };

const ROSCO_HEX_MAP = { "R02 - Bastard Amber": "#F2C18D", "R08 - Pale Gold": "#E6C76E", "R12 - Straw": "#F2D675", "R27 - Medium Red": "#D9382E", "R34 - Flesh Pink": "#E09F9D", "R44 - Middle Rose": "#D66D8E", "R60 - No Color Blue": "#9BB6D1", "R80 - Primary Blue": "#004D99", "R83 - Medium Blue": "#2B5797", "R89 - Moss Green": "#3A6935", "R90 - Dark Yellow Green": "#587537", "CTB - Full Blue": "#87CEEB", "CTO - Full Orange": "#FFA500", "R3202 - Full Blue": "#0088CC", "R3204 - Half Blue": "#66AADD", "R382 - Congo Blue": "#220066", "R321 - Golden Amber": "#FFCC00", "R3208 - Quarter Blue": "#CCEEFF" };



// 摄影机联动介质映射

const CAMERA_FORMAT_MAP = {

  "Arri Alexa Mini": ["Digital", "Digital - Large Format"],

  "Arri Alexa LF": ["Digital", "Digital - Large Format"],

  "Sony Venice 2": ["Digital", "Digital - Large Format"],

  "Red V-Raptor": ["Digital", "Digital - Large Format"],

  "Blackmagic 12K": ["Digital"],

  "Panavision Millennium": ["Film - 35mm", "Film - 65mm / 70mm", "Film - IMAX"],

  "GoPro / Action": ["Digital", "Tape"],

  "Vintage Camcorder": ["Tape"],

  "Film Camera": ["Film - 35mm", "Film - 16mm", "Film - Super 8mm", "Film - IMAX"]

};



// 景别联动镜头映射 (修复的关键)

const LENS_BY_FRAME_MAP = {

  "Extreme Close Up": ["Telephoto (>85mm)", "Macro Lens"],

  "Close Up": ["Standard (50mm)", "Telephoto (>85mm)", "Anamorphic", "Macro Lens"],

  "default": ["Ultra Wide (<18mm)", "Wide (24-35mm)", "Standard (50mm)", "Telephoto (>85mm)", "Anamorphic", "Vintage Lens", "Zoom", "Fisheye Lens"]

};



const DATA_OPTIONS = {

  mediaType: ["Movie", "TV Episode", "Music Video", "Commercial", "Documentary"],

  camera: Object.keys(CAMERA_FORMAT_MAP),

  genre: {

    "Movie/TV": ["Action", "Adventure", "Animation", "Biopic", "Comedy", "Crime", "Drama", "Family", "Fantasy", "Film Noir", "History", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western", "Neo-Noir", "Cyberpunk"],

    "Commercial": ["Automotive", "Beauty & Cosmetics", "Beverage", "Fashion / Apparel", "Fast Food", "Financial Services", "Fitness / Sport", "Food / Tabletop", "Fragrance", "Gaming", "Health / Pharma", "Home Goods", "Jewelry / Luxury", "Lifestyle", "Technology", "Travel / Tourism", "Airline", "Corporate", "PSA / Awareness", "Testimonial", "VFX Heavy"],

    "Music Video": ["Performance (Band/Artist)", "Narrative (Story)", "Conceptual", "Abstract", "Dance / Choreography", "Hip Hop / Rap", "Pop", "R&B / Soul", "Rock / Alternative", "Indie", "Electronic / EDM", "K-Pop", "Latin / Reggaeton", "Metal", "Country", "Lo-Fi", "Drill", "Trap"],

    "Documentary": ["Biographical", "True Crime", "Nature / Wildlife", "Science / Tech", "Historical", "Social Issue", "Sports Doc", "Music / Arts", "Travel / Expedition", "Observational", "Archival"]

  },

  colorFilters: ["Warm", "Cool", "Mixed", "Saturated", "Desaturated", "High Key", "Low Key", "Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Magenta", "Pink", "White", "Sepia", "Black & White", "Teal & Orange"],

  roscoColors: Object.keys(ROSCO_HEX_MAP),

  weather: ["Sunny", "Overcast", "Rainy", "Stormy", "Foggy", "Hazy", "Snowy", "Windy", "Clear Skies", "Drizzle", "Thunderstorm", "Sandstorm"],

  shotType: ["Static Shot", "Panning", "Tilt", "Dolly In", "Dolly Out", "Tracking Shot", "Crab Shot", "Arc Shot", "Handheld", "Steadicam", "Gimbal Flow", "Shakey Cam", "Whiplash"],

  cameraAngle: ["Eye Level (Neutral)", "Low Angle (Heroic)", "High Angle (Vulnerability)", "Overhead / God's Eye", "Worm's Eye View", "Dutch Angle / Canted", "Over the Shoulder", "POV (Point of View)", "Ground Level", "Knee Level", "Bird's Eye View", "Drone / Aerial", "Selfie Angle"],

  frameSize: ["Extreme Close Up", "Close Up", "Medium Close Up", "Medium Shot", "Cowboy Shot", "Full Shot", "Wide Shot", "Extreme Wide"],

  composition: ["Center Framed", "Rule of Thirds", "Symmetrical", "Negative Space", "Looking at Camera", "Right heavy", "Left heavy", "Balanced", "Leading Lines", "Frame within a Frame"],

  lighting: ["Soft light", "Hard light", "High contrast", "Low contrast", "Silhouette", "Rim Light", "Backlight", "Chiaroscuro", "Volumetric", "Rembrandt"],

  lightingType: ["Natural Daylight", "Moonlight", "Tungsten", "Neon", "Fire/Candle", "Practical light", "Mixed", "Studio Strobe"],

  aperture: ["T1.3", "T1.8", "T2.8", "T4.0", "T5.6", "T8.0", "T11", "T16"],

  aspectRatio: ["1.33:1 (4:3)", "1.78:1 (16:9)", "1.85:1", "2.00:1 (Univisium)", "2.35:1 (Scope)", "2.39:1", "2.76:1 (Ultra Panavision)", "9:16 (Vertical)"],

  timeOfDay: ["Dawn", "Sunrise", "Day", "Golden Hour", "Blue Hour", "Dusk", "Night", "Midnight"],

  location: ["Interior", "Exterior", "Studio / Set", "Green Screen", "On Location", "Underwater", "Space"],

  set: ["Apartment", "Bedroom", "Living Room", "Kitchen", "Bathroom", "Office", "Bar / Pub / Club", "Restaurant / Diner", "Hospital", "Classroom / School", "Car / Vehicle", "Street / Alley", "Forest / Woods", "Beach / Ocean", "Mountain", "Rooftop", "Warehouse", "Spaceship / Sci-Fi", "Void / Abstract", "Subway / Train", "Church", "Temple"],

  character: {

    gender: ["Male", "Female"],

    age: ["Baby", "Toddler", "Child", "Teenager", "Young Adult", "Mid-adult", "Middle age", "Senior", "Elderly"],

    ethnicity: ["Asian", "Black / African Descent", "Latinx", "Middle Eastern", "White", "Indigenous", "Mixed-race", "South-East Asian", "South Asian"]

  }

};



const getOptionLabel = (val, context = null) => {

  if (!val) return "";

  if (context === 'ethnicity') return ETHNICITY_MAP[val] || val;

  if (val.startsWith('Arri') || val.startsWith('Sony') || (val.startsWith('Red ') && val.length > 4) || val.startsWith('Blackmagic') || val.startsWith('Panavision') || val.startsWith('GoPro')) return val;

  return GENERAL_MAP[val] || val;

};



// --- 通用 UI 组件 ---



const CustomSelect = ({ label, value, options, onChange, disabled, context }) => {

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => { const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  const t = UI_LABELS;

  return (

    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-30 pointer-events-none' : ''}`} ref={containerRef}>

      <label className="text-[10px] font-bold uppercase tracking-widest pl-1 text-neutral-400">{label}</label>

      <div className="relative">

        <button onClick={() => !disabled && setIsOpen(!isOpen)} className="w-full text-left text-[13px] font-medium rounded-lg px-3 py-2.5 border outline-none transition-all shadow-sm flex justify-between items-center truncate bg-[#1c1c1e] text-neutral-200 border-white/10 hover:bg-white/10">

          <span className="truncate block pr-4">{value ? getOptionLabel(value, context) : t.select}</span>

          <ChevronDown className="w-4 h-4 flex-shrink-0 text-neutral-500" />

        </button>

        {isOpen && <div className="absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar p-1 bg-[#1c1c1e] border-white/10">

          {options.map(opt => (

            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-3 py-2 rounded-md cursor-pointer text-[13px] transition-colors ${value === opt ? 'bg-blue-500 text-white' : 'text-neutral-300 hover:bg-white/10'}`}>

              {getOptionLabel(opt, context)}

            </div>

          ))}

        </div>}

      </div>

    </div>

  );

};



const MultiSelectGroup = ({ label, selectedValues, options, onChange, disabled }) => {

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => { const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  const t = UI_LABELS;

  const toggle = (opt) => { const curr = Array.isArray(selectedValues) ? selectedValues : []; onChange(curr.includes(opt) ? curr.filter(i => i !== opt) : [...curr, opt]); };

  return (

    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-30 pointer-events-none' : ''}`} ref={containerRef}>

      <label className="text-[10px] font-bold uppercase tracking-widest pl-1 text-neutral-400">{label}</label>

      <div className="relative">

        <button onClick={() => !disabled && setIsOpen(!isOpen)} className="w-full text-left text-[13px] font-medium rounded-lg px-3 py-2.5 border outline-none transition-all shadow-sm flex justify-between items-center truncate bg-[#1c1c1e] text-neutral-200 border-white/10 hover:bg-white/10">

          <span className="truncate block pr-4">{Array.isArray(selectedValues) && selectedValues.length ? selectedValues.map(v => getOptionLabel(v)).join(", ") : t.select}</span>

          <ChevronDown className="w-4 h-4 flex-shrink-0 text-neutral-500" />

        </button>

        {isOpen && <div className="absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar p-1 bg-[#1c1c1e] border-white/10">

          {options.map(opt => {

            const isSel = Array.isArray(selectedValues) && selectedValues.includes(opt);

            return <div key={opt} onClick={() => toggle(opt)} className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors text-[13px] ${isSel ? 'bg-blue-500/10 text-blue-500' : 'text-neutral-300 hover:bg-white/5'}`}><div className={"w-3.5 h-3.5 rounded border flex items-center justify-center " + (isSel ? "bg-blue-500 border-blue-500" : "border-neutral-600")}>

              {isSel && <Check size={10} className="text-white" />}

            </div>{getOptionLabel(opt)}</div>;

          })}

        </div>}

      </div>

    </div>

  );

};



const ColorPanel = ({ selection, setSelection, label }) => {

  const [tab, setTab] = useState("filter");

  const t = UI_LABELS;

  const toggle = (val) => { 

    const curr = Array.isArray(selection) ? selection : []; 

    if (curr.includes(val)) { setSelection(curr.filter(i => i !== val)); } 

    else { setSelection([...curr, val]); }

  };

  const handleHexChange = (newHex) => {

    const curr = Array.isArray(selection) ? selection : [];

    const filtersOnly = curr.filter(c => !c.startsWith('#'));

    setSelection([...filtersOnly, newHex]);

  };

  const currentHex = (Array.isArray(selection) && selection.find(c => c.startsWith('#'))) || "";



  return (

    <div className="flex flex-col gap-3">

      <div className="flex items-center justify-between pl-1">

        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{label}</label>

        <div className="flex gap-1 p-0.5 rounded-md bg-white/5">

          {["filter", "rosco", "picker"].map(k => <button key={k} onClick={() => setTab(k)} className={`text-[9px] px-2 py-0.5 uppercase font-bold rounded-sm transition-all ${tab === k ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}>{t.tabs[k]}</button>)}

        </div>

      </div>

      <div className="border rounded-lg p-3 h-[180px] flex flex-col bg-[#1c1c1e] border-white/10">

        {tab === "filter" && <div className="flex flex-wrap gap-1.5 overflow-y-auto custom-scrollbar content-start h-full pr-1">

          {DATA_OPTIONS.colorFilters.map(c => {

            const isSel = Array.isArray(selection) && selection.includes(c);

            return <button key={c} onClick={() => toggle(c)} className={`text-[10px] px-2 py-1 rounded border transition-all ${isSel ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'}`}>{getOptionLabel(c)}</button>;

          })}

        </div>}

        {tab === "rosco" && <div className="h-full overflow-y-scroll custom-scrollbar pr-1"><div className="flex flex-col gap-1">

          {DATA_OPTIONS.roscoColors.map(c => {

            const isSel = Array.isArray(selection) && selection.includes(c);

            return <button key={c} onClick={() => toggle(c)} className={`text-left text-[11px] px-2 py-1.5 rounded truncate transition-colors w-full flex-shrink-0 flex items-center gap-2 ${isSel ? 'bg-blue-500/10 text-blue-600 border border-blue-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm border border-black/10" style={{backgroundColor: ROSCO_HEX_MAP[c]}}></div><span className="truncate">{getOptionLabel(c)}</span></button>;

          })}

        </div></div>}

        {tab === "picker" && <div className="flex flex-col gap-3 items-center justify-center h-full py-2">

            <div className="relative w-full h-10 overflow-hidden rounded border border-white/10">

               <input type="color" value={currentHex || "#ffffff"} onChange={(e) => handleHexChange(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />

               <div className="w-full h-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: currentHex || 'transparent', color: currentHex ? '#000' : '#888' }}>{currentHex ? currentHex : t.selectHex}</div>

            </div>

            <span className="text-[10px] font-mono text-neutral-500">{currentHex ? `已选择: ${currentHex}` : t.noHex}</span>

            {currentHex && <button onClick={() => setSelection(selection.filter(c => !c.startsWith('#')))} className="text-[9px] text-red-400 hover:underline">清除颜色</button>}

        </div>}

      </div>

    </div>

  );

};

const Toast = ({ show, leaving, message }) => {
  if (!show && !leaving) return null;

  return (
    <div
      className={
        "fixed bottom-6 right-6 z-[200] " +
        (leaving ? "toast-out" : "toast-in")
      }
    >
      <div className="bg-white text-black px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium">
        <Check size={14} className="text-emerald-500" />
        {message}
      </div>
    </div>
  );
};


const PromptTerminal = ({ t, prompt, promptMode, setPromptMode, onCopy }) => {
  return (
    <div className="w-full max-w-4xl rounded-xl border border-white/10 bg-[#111]/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
            {t.promptTerminal}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 提示词风格 Tab —— MJ / Nano 颜色统一：选中都是白底黑字 */}
          <div className="flex bg-[#111111] rounded-md p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => setPromptMode("mj")}
              className={
                "px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all " +
                (promptMode === "mj"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-neutral-200")
              }
            >
              Midjourney
            </button>
            <button
              type="button"
              onClick={() => setPromptMode("nano")}
              className={
                "px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all " +
                (promptMode === "nano"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-neutral-200")
              }
            >
              Nano Banana Pro
            </button>
          </div>

          {/* 右侧小复制按钮 */}
          <button
            onClick={onCopy}
            className="opacity-50 hover:opacity-100 transition"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>

      <div className="p-4 font-mono text-xs leading-relaxed opacity-80 h-[80px] overflow-y-auto custom-scrollbar select-all bg-[#0a0a0a]">
        {prompt}
      </div>

      {/* 底部大号白色复制按钮 */}
      <button
        onClick={onCopy}
        className="h-10 w-full flex items-center justify-center gap-2 font-bold text-sm bg-white text-black hover:bg-gray-200 transition-all"
      >
        <Copy size={16} /> {UI_LABELS.copyPrompt}
      </button>
    </div>
  );
};


export default function DirectorsMind() {

  const [selections, setSelections] = useState({ 

    mediaType: "", format: "", genre: [], location: "", set: "", weather: "", shotType: "", cameraAngle: "", frameSize: "", composition: "", lighting: "", lightingType: "", camera: "", lensSize: "", aspectRatio: "", timeOfDay: "", aperture: "", gender: "", age: "", ethnicity: "", color: [] 

  });

  const [narrative, setNarrative] = useState({ subject: "", backDetail: "", facingObject: "" });

  const [tags, setTags] = useState(["Cinematic", "High Detail"]);

  const [prompt, setPrompt] = useState("");

  // 新增：提示词风格 tab（"mj" | "nano"）
  const [promptMode, setPromptMode] = useState("mj");

  // 新增：Toast 控制
  const [toastVisible, setToastVisible] = useState(false);
  const [toastLeaving, setToastLeaving] = useState(false);


  const t = UI_LABELS;

  

  // --- 核心联动更新函数 ---

  const updateSelection = (k, v) => {

    setSelections(p => {

      const next = { ...p, [k]: v };

      

      // 联动 1: 摄影机 -> 介质

      if (k === 'camera') next.format = ""; 

      

      // 联动 2: 媒体类型 -> 流派

      if (k === 'mediaType') next.genre = [];



      // 联动 3: 景别 -> 镜头 (新修复)

      if (k === 'frameSize' && v === "Extreme Close Up") {

          // 如果当前选的不是长焦/微距，自动切换到微距

          if (!LENS_BY_FRAME_MAP["Extreme Close Up"].includes(p.lensSize)) {

            next.lensSize = "Macro Lens";

          }

      }



      return next;

    });

  };


  // 触发复制并展示 Toast
  const triggerCopyToast = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setToastVisible(true);
    setToastLeaving(false);

    // 1.6 秒后开始退出动画
    setTimeout(() => setToastLeaving(true), 1600);
    // 2 秒后彻底隐藏
    setTimeout(() => {
      setToastVisible(false);
      setToastLeaving(false);
    }, 2000);
  };


  useEffect(() => {
    const s = selections;
    
    // 景别 -> 镜头强化
    const isECU = s.frameSize === "Extreme Close Up";
    const lensText = isECU
      ? "100mm Macro Lens, extremely shallow depth, detailed surface"
      : s.lensSize;

    // 是否是背面视角
    const isReverse =
      s.cameraAngle &&
      (s.cameraAngle.includes("Back") ||
        s.cameraAngle.includes("背后") ||
        s.cameraAngle.includes("过肩"));

    const char =
      [s.age, s.ethnicity, s.gender].filter(Boolean).join(" ") ||
      narrative.subject ||
      "subject";

    let bodyLogic = char;
    if (isReverse) {
      bodyLogic = `View from behind of ${char}, ${
        narrative.backDetail || "back profile"
      }, facing ${narrative.facingObject || "scenery"}`;
    }

    const isFilm =
      s.camera && (s.camera.includes("Film") || s.camera.includes("Millennium"));
    const resText = isFilm
      ? "analog grainy texture, film grain"
      : "8k resolution, ultra-detailed digital sensor";

    const parts = [
      s.shotType,
      s.cameraAngle,
      bodyLogic,
      s.frameSize,
      s.mediaType,
      Array.isArray(s.genre) ? s.genre.join(", ") : "",
      tags.join(", "),
      s.location ? `in ${s.location}` : "",
      s.weather,
      s.timeOfDay,
      s.lighting,
      s.lightingType,
      Array.isArray(s.color) ? s.color.join(", ") : ""
    ].filter(Boolean);

    const techArray = [
      s.camera,
      s.format,
      lensText,
      s.aperture,
      s.aspectRatio
    ].filter(Boolean);
    const tech = techArray.join(", ");

    const arParam = s.aspectRatio ? s.aspectRatio.split(":")[0] : "16:9";

    // --- MJ 风格 ---
    const mjPrompt = `/imagine prompt: ${parts.join(
      ", "
    )}. --ar ${arParam} --params ${tech}, ${resText}`;

    // --- Nano Banana 生图风格 ---
    // 不使用 /imagine，不带 --ar，更偏自然语言，强调静态画面
    const nanoParts = parts.concat([
      tech,
      resText,
      "highly detailed still image",
      "cinematic composition",
      "sharp focus",
      "no motion blur",
      "single frame, photographic still"
    ]).filter(Boolean);

    const nanoPrompt = nanoParts.join(", ");

    // 根据当前 tab 设置提示词
    setPrompt(promptMode === "mj" ? mjPrompt : nanoPrompt);
  }, [selections, tags, narrative, promptMode]);



  return (

    <div className="h-screen w-screen flex flex-col overflow-hidden font-sans antialiased bg-[#050505] text-neutral-200">
      <Toast
        show={toastVisible}
        leaving={toastLeaving}
        message="提示词已复制!"
      />

      <header className="h-12 shrink-0 px-4 flex justify-between items-center z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">

        <div className="flex items-center gap-2">

          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white text-black"><Brain size={14} strokeWidth={2}/></div>

          <span className="text-xs font-bold tracking-wide">{t.appTitle} <span className="opacity-40 font-normal">{t.version}</span></span>

        </div>

      </header>

      {/* 移动端：Logo 下方的提示词终端 */}
      <div className="px-4 pt-3 pb-2 md:hidden">
          <PromptTerminal
            t={t}
            prompt={prompt}
            promptMode={promptMode}
            setPromptMode={setPromptMode}
            onCopy={triggerCopyToast}
          />
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        <aside className="w-full md:w-[400px] shrink-0 flex flex-col overflow-y-auto custom-scrollbar bg-[#09090b] border-r border-white/5 max-h-[60vh] md:max-h-none">

          

          <div className="p-5 flex flex-col gap-4">

            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.narrative}</h3>

            <div className="grid grid-cols-2 gap-3">

               <CustomSelect label={t.labels.mediaType} value={selections.mediaType} options={DATA_OPTIONS.mediaType} onChange={v => updateSelection('mediaType', v)} />

               <MultiSelectGroup label={t.labels.genre} selectedValues={selections.genre} options={DATA_OPTIONS.genre[GENRE_MAPPING[selections.mediaType || "Movie"]] || []} onChange={v => updateSelection('genre', v)} disabled={!selections.mediaType} />

            </div>

            <div className="grid grid-cols-3 gap-2">

              <CustomSelect label={t.labels.gender} value={selections.gender} options={DATA_OPTIONS.character.gender} onChange={v => updateSelection('gender', v)} />

              <CustomSelect label={t.labels.age} value={selections.age} options={DATA_OPTIONS.character.age} onChange={v => updateSelection('age', v)} />

              <CustomSelect label={t.labels.ethnicity} value={selections.ethnicity} options={DATA_OPTIONS.character.ethnicity} onChange={v => updateSelection('ethnicity', v)} context="ethnicity" />

            </div>

          </div>

          <div className="h-px bg-white/5"></div>



          <div className="p-5 flex flex-col gap-4 bg-blue-500/5">

             <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.storyboard}</h3>

             <input value={narrative.subject} onChange={e => setNarrative({...narrative, subject: e.target.value})} placeholder="主体名称(如: 宇航员)" className="bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-neutral-200 outline-none focus:border-blue-500/50" />

             <div className="grid grid-cols-2 gap-3">

                <div className="flex flex-col gap-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest pl-1 text-neutral-400">{t.labels.facingObject}</label>

                  <input value={narrative.facingObject} onChange={e => setNarrative({...narrative, facingObject: e.target.value})} placeholder="正面对向之物" className="bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-neutral-200 outline-none focus:border-blue-500/50" />

                </div>

                <div className="flex flex-col gap-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest pl-1 text-neutral-400">{t.labels.backDetail}</label>

                  <input value={narrative.backDetail} onChange={e => setNarrative({...narrative, backDetail: e.target.value})} placeholder="背面特征" className="bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-xs text-neutral-200 outline-none focus:border-blue-500/50" />

                </div>

             </div>

             <div className="grid grid-cols-2 gap-3">

               <CustomSelect label={t.labels.cameraAngle} value={selections.cameraAngle} options={DATA_OPTIONS.cameraAngle} onChange={v => updateSelection('cameraAngle', v)} />

               <CustomSelect label={t.labels.frameSize} value={selections.frameSize} options={DATA_OPTIONS.frameSize} onChange={v => updateSelection('frameSize', v)} />

             </div>

             <div className="grid grid-cols-2 gap-3">

               <CustomSelect label={t.labels.composition} value={selections.composition} options={DATA_OPTIONS.composition} onChange={v => updateSelection('composition', v)} />

               <CustomSelect label={t.labels.shotType} value={selections.shotType} options={DATA_OPTIONS.shotType} onChange={v => updateSelection('shotType', v)} />

             </div>

          </div>

          <div className="h-px bg-white/5"></div>



          <div className="p-5 flex flex-col gap-4">

            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.world}</h3>

            <div className="grid grid-cols-2 gap-3">

              <CustomSelect label={t.labels.environment} value={selections.location} options={DATA_OPTIONS.location} onChange={v => updateSelection('location', v)} />

              <CustomSelect label={t.labels.timeOfDay} value={selections.timeOfDay} options={DATA_OPTIONS.timeOfDay} onChange={v => updateSelection('timeOfDay', v)} />

            </div>

            <div className="grid grid-cols-2 gap-3">

              <CustomSelect label={t.labels.setDetail} value={selections.set} options={DATA_OPTIONS.set} onChange={v => updateSelection('set', v)} />

              <CustomSelect label={t.labels.weather} value={selections.weather} options={DATA_OPTIONS.weather} onChange={v => updateSelection('weather', v)} />

            </div>

          </div>

          <div className="h-px bg-white/5"></div>



          <div className="p-5 flex flex-col gap-4">

            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.style}</h3>

            <div className="grid grid-cols-2 gap-3">

              <CustomSelect label={t.labels.lightingStyle} value={selections.lighting} options={DATA_OPTIONS.lighting} onChange={v => updateSelection('lighting', v)} />

              <CustomSelect label={t.labels.lightSource} value={selections.lightingType} options={DATA_OPTIONS.lightingType} onChange={v => updateSelection('lightingType', v)} />

            </div>

            <ColorPanel selection={selections.color} setSelection={v => updateSelection('color', v)} label={t.sections.color} />

          </div>

          <div className="h-px bg-white/5"></div>



          <div className="p-5 flex flex-col gap-4 pb-20">

            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t.sections.tech}</h3>

            <div className="grid grid-cols-2 gap-3">

              <CustomSelect label={t.labels.camera} value={selections.camera} options={DATA_OPTIONS.camera} onChange={v => updateSelection('camera', v)} />

              <CustomSelect 

                label={t.labels.format} 

                value={selections.format} 

                options={CAMERA_FORMAT_MAP[selections.camera] || []} 

                onChange={v => updateSelection('format', v)} 

                disabled={!selections.camera}

              />

              <CustomSelect 

                label={t.labels.lens} 

                value={selections.lensSize} 

                // 实时联动：根据景别显示镜头列表

                options={LENS_BY_FRAME_MAP[selections.frameSize] || LENS_BY_FRAME_MAP.default} 

                onChange={v => updateSelection('lensSize', v)} 

              />

              <CustomSelect label={t.labels.aperture} value={selections.aperture} options={DATA_OPTIONS.aperture} onChange={v => updateSelection('aperture', v)} />

              <div className="col-span-2"><CustomSelect label={t.labels.aspectRatio} value={selections.aspectRatio} options={DATA_OPTIONS.aspectRatio} onChange={v => updateSelection('aspectRatio', v)} /></div>

            </div>

          </div>

        </aside>



        <main className="flex-1 flex flex-col relative min-h-[40vh] md:min-h-0">

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#050505] to-[#1a1a1a]"></div>

          {/* 占位图 - 仅桌面端显示 */}
          <div className="hidden md:flex flex-1 items-center justify-center p-6 z-10 overflow-hidden relative">

             <div className="flex flex-col items-center gap-4 opacity-20 text-white">

                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-current flex items-center justify-center"><ImageIcon size={32} strokeWidth={1} /></div>

                <p className="text-xs font-medium tracking-widest uppercase">{t.ready}</p>

             </div>

          </div>

          {/* 桌面端底部终端 - 移动端隐藏 */}

          <div className="hidden md:flex shrink-0 p-4 md:p-6 z-20 justify-center">

            <div className="w-full max-w-4xl rounded-xl border border-white/10 bg-[#111]/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">

              <div className="px-4 py-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
  <div className="flex items-center gap-2">
    <Terminal size={12} className="text-blue-500" />
    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
      {t.promptTerminal}
    </span>
  </div>

  <div className="flex items-center gap-3">
    {/* 新增：提示词风格切换 Tab */}
    <div className="flex bg-[#111111] rounded-md p-0.5 border border-white/10">
      <button
        type="button"
        onClick={() => setPromptMode("mj")}
        className={
          "px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all " +
          (promptMode === "mj"
            ? "bg-white text-black"
            : "text-neutral-400 hover:text-neutral-200")
        }
      >
        Midjourney
      </button>
      <button
        type="button"
        onClick={() => setPromptMode("nano")}
        className={
          "px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all " +
          (promptMode === "nano"
            ? "bg-white text-black"
            : "text-neutral-400 hover:text-neutral-200")
        }
      >
        Nano Banana Pro
      </button>
    </div>

    {/* 原有复制按钮 */}
    <button
  onClick={triggerCopyToast}
  className="opacity-50 hover:opacity-100 transition"
>
  <Copy size={12} />
</button>
  </div>
</div>

              <div className="p-4 font-mono text-xs leading-relaxed opacity-80 h-[80px] overflow-y-auto custom-scrollbar select-all bg-[#0a0a0a]">{prompt}</div>

              <button
  onClick={triggerCopyToast}
  className="h-10 w-full flex items-center justify-center gap-2 font-semibold text-xs bg-white text-black hover:bg-neutral-200 transition-all"
>
  <Copy size={16} /> {UI_LABELS.copyPrompt}
</button>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

<style>{`
  @keyframes toast-in-anim {
    from { opacity: 0; transform: translateY(12px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes toast-out-anim {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(-8px) scale(0.95); }
  }
  .toast-in { animation: toast-in-anim 0.3s ease-out forwards; }
  .toast-out { animation: toast-out-anim 0.3s ease-in forwards; }
`}</style>

}


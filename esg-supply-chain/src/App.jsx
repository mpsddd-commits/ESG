import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ■ 1. 데이터
//   공급망 구조: 원청사(0) → 1차(1) → 2차(2) → 3차(3)
//   ※ 3차에 A·B·C 3개사 통합 (기존 4차 Codelco → 3차-C로 편입)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const COMPANIES = [
  {
    id:1, tier:0, tierLabel:"원청사", subLabel:"가공",
    company_name:"현대모비스(주)", short:"현대모비스", ceo_name:"이규석",
    business_number:"264-81-00498", corporate_number:"110111-0355965",
    company_establishment:"1977-06-24",
    company_address:"서울특별시 강남구 테헤란로 521 (파르나스타워)",
    tax_name:"삼성세무서", issue_date:"2026-01-02", company_size:"대기업",
    country:"대한민국",
    role:"알루미늄 다이캐스팅 → CNC 가공 → 모듈 조립",
    process:"알루미늄 다이캐스팅(HPDC) → 열처리(T6) → CNC 정밀가공 → 모듈 조립 → 완성차 납품",
    esg:{E:82,S:78,G:90}, risk:"저위험",
    employee_count:46947, revenue:572000, total_assets:665000,
    scope1_2:285000, re_ratio:42, feoc_ratio:3.2, trir:0.38, carbon_footprint:10.68,
    certifications:["ISO 14001","ISO 45001","IATF 16949","SBTi","RBA"], xinjiang:"N",
  },
  {
    id:2, tier:1, tierLabel:"1차 협력사", subLabel:"합금", short:"노벨리스코리아",
    company_name:"(주)노벨리스코리아", ceo_name:"박진수",
    business_number:"128-81-33210", corporate_number:"134511-0023891",
    company_establishment:"1999-03-15",
    company_address:"경기도 시흥시 공단1대로 200 (정왕동)",
    tax_name:"시흥세무서", issue_date:"2026-01-05", company_size:"대기업",
    country:"대한민국",
    role:"Al 잉곳 투입 → 합금 원소(Mn, Cu) 배합 → 연속주조 → 열간압연",
    process:"Al 잉곳 투입 → 합금 원소(Mn·Cu) 배합 → 연속주조 → 열간압연 → 3003-H14/H16",
    esg:{E:74,S:71,G:80}, risk:"저위험",
    employee_count:1850, revenue:84200, total_assets:216000,
    scope1_2:142000, re_ratio:28, feoc_ratio:8.1, trir:0.62, carbon_footprint:11.32,
    certifications:["ISO 14001","REACH","RoHS"], xinjiang:"N",
  },
  {
    id:3, tier:2, tierLabel:"2차 협력사", subLabel:"제련", short:"케이알엠",
    company_name:"(주)케이알엠", ceo_name:"이성훈",
    business_number:"402-81-45123", corporate_number:"211234-0019823",
    company_establishment:"2003-07-20",
    company_address:"인천광역시 남동구 앵고개로 490 (고잔동)",
    tax_name:"남동세무서", issue_date:"2026-01-08", company_size:"중견기업",
    country:"대한민국",
    role:"알루미나 투입 → 홀-에루법 전기분해 → P1020 잉곳 주조 → 품질검사",
    process:"알루미나 투입 → 홀-에루법 전기분해 → P1020 잉곳 주조 → 품질검사",
    esg:{E:62,S:68,G:72}, risk:"중위험",
    employee_count:420, revenue:21800, total_assets:56400,
    scope1_2:98000, re_ratio:18, feoc_ratio:12.5, trir:1.12, carbon_footprint:15.20,
    certifications:["ISO 14001"], xinjiang:"N",
  },
  {
    id:4, tier:3, tierLabel:"3차 협력사-A", subLabel:"채굴·정제", short:"Comilog",
    company_name:"Comilog Gabon S.A.", ceo_name:"Jean-Pierre Mouanda",
    business_number:"GAB-20031200", corporate_number:"N/A",
    company_establishment:"1962-08-10",
    company_address:"Moanda, Haut-Ogooué Province, Gabon",
    tax_name:"가봉 세무국", issue_date:"2026-01-10", company_size:"대기업",
    country:"가봉",
    role:"노천채굴(Open Pit) → 파쇄·분급 → 수세 → Mn 정광 선적",
    process:"노천채굴(Open Pit) → 파쇄·분급 → 수세 → Mn 정광 선적",
    esg:{E:55,S:60,G:65}, risk:"중위험",
    employee_count:5200, revenue:123000, total_assets:387000,
    scope1_2:52000, re_ratio:12, feoc_ratio:0, trir:2.15, carbon_footprint:null,
    certifications:["ISO 14001"], xinjiang:"N",
  },
  {
    id:5, tier:3, tierLabel:"3차 협력사-B", subLabel:"채굴·정제", short:"Windalco",
    company_name:"Windalco Jamaica Ltd.", ceo_name:"Michael Thompson",
    business_number:"JAM-19801045", corporate_number:"N/A",
    company_establishment:"1980-04-22",
    company_address:"Ewarton, Saint Catherine, Jamaica",
    tax_name:"자메이카 세무국", issue_date:"2026-01-10", company_size:"대기업",
    country:"자메이카",
    role:"보크사이트 노천채굴 → 파쇄·세척 → 바이어법 알루미나 정제 → 선적",
    process:"보크사이트 노천채굴 → 파쇄·세척 → 바이어법 알루미나 정제 → 선적",
    esg:{E:58,S:65,G:70}, risk:"중위험",
    employee_count:3800, revenue:89000, total_assets:224000,
    scope1_2:68000, re_ratio:8, feoc_ratio:0, trir:1.85, carbon_footprint:null,
    certifications:[], xinjiang:"N",
  },
  {
    id:6, tier:3, tierLabel:"3차 협력사-C", subLabel:"채굴·정제", short:"Codelco",
    company_name:"Codelco Norte S.A.", ceo_name:"Carlos Mendez",
    business_number:"CHL-19761009", corporate_number:"N/A",
    company_establishment:"1976-04-01",
    company_address:"Calama, Antofagasta Region, Chile",
    tax_name:"칠레 국세청", issue_date:"2026-01-10", company_size:"대기업",
    country:"칠레",
    role:"갱내·노천 병행채굴 → 부유선광 → 황동광 정광 → 전기동 정련",
    process:"갱내·노천 병행채굴 → 부유선광 → 황동광 정광 → 전기동 정련",
    esg:{E:60,S:63,G:68}, risk:"중위험",
    employee_count:18400, revenue:482000, total_assets:1250000,
    scope1_2:112000, re_ratio:22, feoc_ratio:0, trir:1.42, carbon_footprint:null,
    certifications:["ISO 14001","ISO 45001"], xinjiang:"N",
  },
];

const PO_DATA = [
  { po_number:"PO-2025-3003-001", spec:"3003-H14 판재 1.2T×1000×2000mm", qty:45.0, unit_price:3150, total:141750, delivery:"2025-03-28", status:"COMPLETED", esg_grade:"A", carbon:10.82 },
  { po_number:"PO-2025-3003-002", spec:"3003-H16 코일 0.6T×1200mm×C",    qty:60.0, unit_price:3080, total:184800, delivery:"2025-07-15", status:"COMPLETED", esg_grade:"B", carbon:11.15 },
  { po_number:"PO-2025-3003-003", spec:"3003-H14 판재 2.0T×1200×2400mm", qty:38.0, unit_price:3220, total:122360, delivery:"2025-10-20", status:"SHIPPED",    esg_grade:"A", carbon:10.95 },
  { po_number:"PO-2026-3003-001", spec:"3003-H16 박판 0.5T×1000mm×C",    qty:55.0, unit_price:3020, total:166100, delivery:"2026-04-05", status:"CONFIRMED",  esg_grade:"A", carbon:10.68 },
  { po_number:"PO-2026-3003-002", spec:"3003-H14 판재 1.5T×1500×3000mm", qty:42.0, unit_price:3180, total:133560, delivery:"2026-07-30", status:"PENDING",    esg_grade:"B", carbon:11.32 },
];

const ALLOY_SPEC = [
  { element:"Al (알루미늄)", min:97.80, max:98.95, role:"기본 모재",        color:"#60a5fa" },
  { element:"Mn (망간)",    min:1.00,  max:1.50,  role:"성형성·내식성 향상", color:"#34d399" },
  { element:"Cu (구리)",    min:0.05,  max:0.20,  role:"강도 보조",          color:"#f59e0b" },
  { element:"Fe (철)",      min:0.00,  max:0.70,  role:"불순물 허용 상한",   color:"#a78bfa" },
  { element:"Si (실리콘)",  min:0.00,  max:0.60,  role:"불순물 허용 상한",   color:"#fb7185" },
  { element:"Zn (아연)",    min:0.00,  max:0.10,  role:"불순물 허용 상한",   color:"#94a3b8" },
];

const ESG_INDICATORS = {
  "3차 협력사 (채굴)":[
    { no:1,  cat:"인권·노동", name:"아동·강제노동 Zero 확인",      priority:"Critical", regs:["CSDDD","CSRD","UFLPA","FEOC"], value:"확인서 완비",  status:"pass" },
    { no:5,  cat:"인권·노동", name:"산업안전 TRIR",                priority:"High",     regs:["CSDDD","CSRD"],                value:"2.15건/백만h", status:"warn" },
    { no:6,  cat:"인권·노동", name:"신장(위구르) 원산지 여부",     priority:"Critical", regs:["UFLPA","FEOC"],                value:"N",           status:"pass" },
    { no:11, cat:"환경",      name:"Scope 1 GHG 배출량",           priority:"High",     regs:["CSDDD","CSRD","IRA"],          value:"52,000 tCO₂e",status:"warn" },
    { no:18, cat:"거버넌스",  name:"FEOC 해당 국가 원료 비중",      priority:"Critical", regs:["IRA","FEOC"],                  value:"0%",          status:"pass" },
  ],
  "2차 협력사 (제련)":[
    { no:19, cat:"에너지·기후", name:"전력믹스 재생에너지 비율",   priority:"High",     regs:["CSDDD","CSRD","IRA"],          value:"18%",          status:"warn" },
    { no:21, cat:"에너지·기후", name:"Scope 1+2 GHG 배출량",      priority:"High",     regs:["CSDDD","CSRD","IRA"],          value:"98,000 tCO₂e", status:"warn" },
    { no:24, cat:"인권·노동",   name:"강제노동 Zero 선언 및 감사", priority:"Critical", regs:["CSDDD","CSRD","UFLPA","FEOC"], value:"감사 완비",    status:"pass" },
    { no:34, cat:"거버넌스",    name:"FEOC 해당 기업 지분 구조",   priority:"Critical", regs:["IRA","FEOC"],                  value:"12.5%",        status:"fail" },
  ],
  "1차 협력사 (합금)":[
    { no:37, cat:"에너지·기후", name:"Scope 1+2+3 GHG 배출량",    priority:"High",     regs:["CSDDD","CSRD","IRA"],          value:"142,000 tCO₂e",status:"warn" },
    { no:39, cat:"에너지·기후", name:"재생에너지 조달 비율",       priority:"High",     regs:["CSDDD","CSRD","IRA"],          value:"28%",          status:"warn" },
    { no:41, cat:"인권·노동",   name:"강제노동·아동노동 Zero 감사",priority:"Critical", regs:["CSDDD","CSRD","UFLPA","FEOC"], value:"감사 완비",    status:"pass" },
    { no:50, cat:"거버넌스",    name:"FEOC 원료 비중 및 대안 소싱",priority:"Critical", regs:["IRA","FEOC"],                  value:"8.1%/계획有",  status:"warn" },
  ],
  "원청사 (가공)":[
    { no:54, cat:"에너지·기후", name:"Scope 3 GHG (구매물품 포함)",priority:"High",     regs:["CSDDD","CSRD","IRA"],          value:"285,000 tCO₂e",status:"warn" },
    { no:55, cat:"에너지·기후", name:"기후전환계획 이사회 승인",   priority:"Critical", regs:["CSDDD","CSRD"],                value:"2030 Net-Zero", status:"pass" },
    { no:63, cat:"인권·노동",   name:"공급망 강제노동 실사 완료율",priority:"Critical", regs:["CSDDD","CSRD","UFLPA","FEOC"], value:"94%",           status:"warn" },
    { no:66, cat:"공시",        name:"CSRD/ESRS 지속가능성 보고",  priority:"Critical", regs:["CSRD"],                        value:"2025 보고서",  status:"pass" },
  ],
};

const SCOPE3_DATA = [
  { cat:1,  name:"구매물품·서비스",  gross:4.817,  note:"Al₂O₃·EMD·Cu 원자재", color:"#3b82f6" },
  { cat:2,  name:"자본재",           gross:9.936,  note:"합금 제조 설비",        color:"#8b5cf6" },
  { cat:3,  name:"연료·에너지 관련", gross:932.0,  note:"제련 전력 업스트림",    color:"#ef4444" },
  { cat:4,  name:"업스트림 운송",    gross:10.114, note:"해운+육운 합계",         color:"#f59e0b" },
  { cat:9,  name:"다운스트림 운송",  gross:0.580,  note:"완성차 납품",            color:"#10b981" },
  { cat:11, name:"판매제품 사용",    gross:-12.500,note:"경량화 CO₂ 절감 편익",   color:"#06b6d4" },
  { cat:12, name:"판매제품 처리",    gross:-8.750, note:"Al 재활용 편익(95%)",    color:"#84cc16" },
];

const NET_ZERO_DATA = [
  { year:"2020", scope1_2:340, scope3:1180, target:null },
  { year:"2022", scope1_2:318, scope3:1050, target:null },
  { year:"2024", scope1_2:285, scope3:936,  target:null },
  { year:"2026E",scope1_2:260, scope3:820,  target:1100 },
  { year:"2030E",scope1_2:200, scope3:650,  target:800  },
  { year:"2040E",scope1_2:50,  scope3:300,  target:400  },
  { year:"2045E",scope1_2:0,   scope3:0,    target:0    },
];

const INSPECTIONS = [
  { id:1, target:"(주)케이알엠 (2차)", type:"특별현장실사", phase:"IMPROVEMENT", score:58.5, risk:"중위험", scheduled:"2026-03-15", actual:"2026-03-18", findings:"FEOC 원료 12.5% 초과 / 재생에너지 18% 미달", deadline:"2026-09-30" },
  { id:2, target:"Comilog Gabon (3차-A)", type:"정기현장실사", phase:"MONITORING",  score:65.0, risk:"중위험", scheduled:"2026-01-20", actual:"2026-01-23", findings:"TRIR 2.15 초과 / 지역사회 토지권 위험", deadline:"2026-06-30" },
  { id:3, target:"(주)노벨리스코리아 (1차)", type:"정기현장실사", phase:"COMPLETED", score:77.5, risk:"저위험", scheduled:"2025-10-10", actual:"2025-10-12", findings:"FEOC 8.1% 주의 / RE 28% 미달", deadline:"2026-03-31" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ■ 2. 공통 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Badge = ({ text, color }) => {
  const map = {
    red:"bg-red-100 text-red-700 border border-red-200",
    yellow:"bg-yellow-100 text-yellow-700 border border-yellow-200",
    green:"bg-green-100 text-green-700 border border-green-200",
    blue:"bg-blue-100 text-blue-700 border border-blue-200",
    gray:"bg-gray-100 text-gray-600 border border-gray-200",
    indigo:"bg-indigo-100 text-indigo-700 border border-indigo-200",
    orange:"bg-orange-100 text-orange-700 border border-orange-200",
    purple:"bg-purple-100 text-purple-700 border border-purple-200",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${map[color]||map.gray}`}>{text}</span>;
};

const RiskBadge = ({ risk }) => {
  if(risk==="고위험") return <Badge text="고위험" color="red"/>;
  if(risk==="중위험") return <Badge text="중위험" color="yellow"/>;
  return <Badge text="저위험" color="green"/>;
};

const StatusBadge = ({ status }) => {
  const map={COMPLETED:"완료",SHIPPED:"출하중",CONFIRMED:"확정",PENDING:"대기"};
  const c={COMPLETED:"green",SHIPPED:"blue",CONFIRMED:"indigo",PENDING:"yellow"};
  return <Badge text={map[status]||status} color={c[status]||"gray"}/>;
};

const IndicatorStatus = ({ status }) => {
  if(status==="pass") return <span className="text-green-600 font-bold">✔</span>;
  if(status==="fail") return <span className="text-red-600 font-bold">✖</span>;
  return <span className="text-yellow-500 font-bold">⚠</span>;
};

const PhaseChip = ({ v }) => {
  const l={SCHEDULED:"예정",SELF_ASSESS:"자가진단",ON_SITE:"현장방문",IMPROVEMENT:"개선중",MONITORING:"모니터링",COMPLETED:"완료"};
  const c={SCHEDULED:"gray",SELF_ASSESS:"blue",ON_SITE:"indigo",IMPROVEMENT:"yellow",MONITORING:"orange",COMPLETED:"green"};
  return <Badge text={l[v]||v} color={c[v]||"gray"}/>;
};

const KpiCard = ({ icon, label, value, sub, accent="bg-blue-500" }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`${accent} w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shrink-0`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-black text-gray-900 leading-tight">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  </div>
);

const EsgRadar = ({ data, size=160 }) => (
  <ResponsiveContainer width="100%" height={size}>
    <RadarChart data={[{s:"환경(E)",v:data.E},{s:"사회(S)",v:data.S},{s:"지배구조(G)",v:data.G}]}>
      <PolarGrid stroke="#e2e8f0"/>
      <PolarAngleAxis dataKey="s" tick={{fontSize:10,fill:"#64748b"}}/>
      <PolarRadiusAxis angle={90} domain={[0,100]} tick={false} axisLine={false}/>
      <Radar dataKey="v" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2}/>
    </RadarChart>
  </ResponsiveContainer>
);

// 시나리오 공통: 단계별 뷰어
const StepViewer = ({ steps, accentColor="bg-slate-800" }) => {
  const [step, setStep] = useState(0);
  const s = steps[step];
  return (
    <div className="space-y-4">
      {/* 단계 버튼 */}
      <div className="flex gap-1 flex-wrap">
        {steps.map((_,i)=>(
          <button key={i} onClick={()=>setStep(i)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${step===i?`${accentColor} text-white border-transparent`:"bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            {i+1}단계
          </button>
        ))}
      </div>
      {/* 상세 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className={`${s.actorColor} text-white rounded-xl p-3 text-2xl shrink-0`}>{s.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="font-black text-gray-900">{s.actor}</span>
              <span className={`text-[10px] text-white px-2 py-0.5 rounded-full font-bold ${s.statusColor}`}>{s.status}</span>
              <span className="text-xs font-semibold text-indigo-600">{s.direction}</span>
            </div>
            <p className="text-sm font-bold text-gray-800 mb-3">{s.action}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-line leading-relaxed border border-gray-100">{s.detail}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg disabled:opacity-40 hover:bg-gray-200">← 이전</button>
          <button onClick={()=>setStep(Math.min(steps.length-1,step+1))} disabled={step===steps.length-1}
            className={`px-4 py-2 ${accentColor} text-white text-sm rounded-lg disabled:opacity-40`}>다음 →</button>
          <span className="ml-auto text-xs text-gray-400 self-center">{step+1} / {steps.length}</span>
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ■ 3. 공급망 맵 (원청사→1차→2차→3차, 3차에 A·B·C 통합)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SupplyChainMap = () => {
  const [sel, setSel] = useState(null);
  const TIERS = [
    { tier:0, label:"원청사",      sub:"가공",         bg:"bg-slate-800" },
    { tier:1, label:"1차 협력사",  sub:"합금",         bg:"bg-blue-700"  },
    { tier:2, label:"2차 협력사",  sub:"제련",         bg:"bg-violet-700"},
    { tier:3, label:"3차 협력사",  sub:"채굴·정제 (A·B·C)", bg:"bg-emerald-700"},
  ];
  const riskCls = { "저위험":"border-green-400 bg-green-50","중위험":"border-yellow-400 bg-yellow-50","고위험":"border-red-400 bg-red-50" };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">공급망 맵</h1>
        <p className="text-sm text-gray-500 mt-1">
          흐름: <span className="font-semibold text-slate-800">원청사(가공)</span> →{" "}
          <span className="font-semibold text-blue-700">1차(합금)</span> →{" "}
          <span className="font-semibold text-violet-700">2차(제련)</span> →{" "}
          <span className="font-semibold text-emerald-700">3차(채굴·정제 A·B·C)</span>
        </p>
      </div>

      {/* 흐름 헤더 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-2 overflow-x-auto">
        {TIERS.map((t,i)=>(
          <div key={t.tier} className="flex items-center gap-2 shrink-0">
            <div className={`${t.bg} text-white rounded-lg px-4 py-2 text-center`}>
              <p className="text-xs font-black">{t.label}</p>
              <p className="text-[10px] opacity-80">{t.sub}</p>
            </div>
            {i<TIERS.length-1 && <span className="text-2xl text-gray-300 font-bold">→</span>}
          </div>
        ))}
      </div>

      {/* 트리 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 overflow-x-auto">
        <div className="flex gap-4 min-w-[780px] items-start">
          {TIERS.map(t=>{
            const comps = COMPANIES.filter(c=>c.tier===t.tier);
            return (
              <div key={t.tier} className="flex-1">
                <div className={`${t.bg} text-white text-xs font-bold px-3 py-1.5 rounded-full text-center mb-3`}>{t.label}</div>
                {t.tier===3 ? (
                  <div className="border-2 border-emerald-300 rounded-xl p-2 bg-emerald-50 space-y-2">
                    <p className="text-[9px] font-bold text-emerald-700 text-center">▼ A · B · C 통합</p>
                    {comps.map(c=>(
                      <div key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)}
                        className={`cursor-pointer rounded-lg border-2 p-2.5 bg-white transition hover:shadow ${riskCls[c.risk]} ${sel?.id===c.id?"ring-2 ring-indigo-400":""}`}>
                        <p className="text-[10px] font-bold text-gray-800">{c.short} <span className="text-gray-400 font-normal">({c.tierLabel.slice(-1)}사)</span></p>
                        <p className="text-[9px] text-gray-500">{c.country}</p>
                        <div className="flex justify-between mt-1"><RiskBadge risk={c.risk}/><span className="text-[10px] font-bold text-indigo-600">{Math.round((c.esg.E+c.esg.S+c.esg.G)/3)}점</span></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  comps.map(c=>(
                    <div key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition hover:shadow-md ${riskCls[c.risk]} ${sel?.id===c.id?"ring-2 ring-indigo-400":""}`}>
                      <p className="text-xs font-bold text-gray-800">{c.company_name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{c.country}</p>
                      <p className="text-[9px] text-gray-400 mt-1 leading-tight">{c.role.split("→")[0].trim()}···</p>
                      <div className="flex justify-between mt-2"><RiskBadge risk={c.risk}/><span className="text-xs font-bold text-indigo-600">{Math.round((c.esg.E+c.esg.S+c.esg.G)/3)}점</span></div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택 기업 상세 */}
      {sel && (
        <div className="bg-white rounded-xl p-5 shadow-md border border-indigo-100">
          <div className="flex justify-between mb-3">
            <div><h3 className="font-black text-lg text-gray-900">{sel.company_name}</h3><p className="text-sm text-gray-500">{sel.tierLabel} · {sel.country}</p></div>
            <RiskBadge risk={sel.risk}/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {[["임직원",sel.employee_count?.toLocaleString()+"명"],["매출",(sel.revenue?.toLocaleString()||"N/A")+"억"],["FEOC",sel.feoc_ratio+"%"],["재생에너지",sel.re_ratio+"%"]].map(([l,v],i)=>(
              <div key={i} className="bg-gray-50 rounded-lg p-2.5"><p className="text-[10px] text-gray-400">{l}</p><p className="text-sm font-bold text-gray-900">{v}</p></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">대표 공정</p>
              <p className="text-xs text-gray-600 bg-slate-50 rounded p-2">{sel.process}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {sel.certifications.length>0 ? sel.certifications.map((c,i)=><Badge key={i} text={c} color="blue"/>) : <span className="text-xs text-gray-400">미등록</span>}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">ESG 레이더</p>
              <EsgRadar data={sel.esg} size={140}/>
              <div className="flex justify-around text-xs">
                <span>E:<b className="text-emerald-600 ml-1">{sel.esg.E}</b></span>
                <span>S:<b className="text-blue-600 ml-1">{sel.esg.S}</b></span>
                <span>G:<b className="text-purple-600 ml-1">{sel.esg.G}</b></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ■ 4. 시나리오 (3개)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCENARIO1_STEPS = [
  { actor:"원청사 (현대모비스)", actorColor:"bg-slate-800", icon:"🏭", status:"요청 발송", statusColor:"bg-blue-500", direction:"→ 1차 협력사",
    action:"원자재 데이터 작성 요청 생성 및 1차 협력사 발송",
    detail:`현대모비스 ESG 담당자가 '공급망 데이터 관리' 메뉴에서 [원자재 데이터 작성 요청]을 생성합니다.

[요청 정보]
• 요청명: 2026년 1분기 3003 합금 원자재 ESG 데이터
• 요청 항목: Scope 1+2 배출량, 재생에너지 비율, 강제노동 자가진단, 원산지 증명
• 대상: 1차 협력사 (노벨리스코리아) — 하위 차수 캐스케이드 포함
• 제출 기한: 2026-06-15 18:00

[시스템 자동 처리]
→ 1차 협력사에 시스템 알림 자동 발송
→ ALARM 테이블 저장 + 웹소켓 실시간 알림`
  },
  { actor:"1차 협력사 (노벨리스코리아)", actorColor:"bg-blue-700", icon:"🔩", status:"작성중 + 재요청", statusColor:"bg-violet-500", direction:"→ 2차 협력사 재요청",
    action:"자사 데이터 작성 + 2차 협력사에 하위 데이터 재요청",
    detail:`노벨리스코리아 담당자가 알림 수신 후 시스템 접속.

[자사 데이터 작성]
• Scope 1+2: 142,000 tCO₂e 입력
• 재생에너지 비율: 28% 입력
• 강제노동 자가진단: 이상 없음 확인
• 공정: Al 잉곳 투입 → Mn·Cu 배합 → 연속주조 → 열간압연

[2차 협력사(케이알엠) 재요청 발송]
• 요청 항목: 알루미나 원산지 증명, 제련 전력 사용량, FEOC 비중
• 제출 기한: 2026-06-10 18:00`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"⚗️", status:"외부화면 작성 + 재요청", statusColor:"bg-emerald-600", direction:"→ 3차 A·B·C 재요청",
    action:"외부 전용 화면에서 데이터 작성 + 3차 협력사 재요청",
    detail:`케이알엠 담당자가 외부 전용 접속 화면(별도 URL)으로 로그인.

[자사 데이터 작성 — 외부 화면]
• Scope 1+2: 98,000 tCO₂e 입력
• 재생에너지: 18% (개선 계획 첨부)
• FEOC 원료 비중: 12.5% ← ⚠️ 주의 플래그 자동 표시
• 공정: 알루미나 투입 → 홀-에루법 전기분해 → P1020 잉곳 주조

[3차 협력사 재요청]
• 3차-A (Comilog): Mn 원산지 증명, 채굴 현장 환경 데이터
• 3차-B (Windalco): 알루미나 원산지, 바이어법 공정 배출량
• 3차-C (Codelco): Cu 원산지 증명, 채굴 안전지수(TRIR)
• 제출 기한: 2026-06-07 18:00`
  },
  { actor:"3차 협력사 A·B·C (외부 화면)", actorColor:"bg-emerald-700", icon:"⛏️", status:"데이터 작성 완료", statusColor:"bg-green-600", direction:"← 2차 협력사에 승인 요청",
    action:"3사 각각 외부 화면에서 데이터 작성 → 2차에 승인 요청",
    detail:`[Comilog Gabon (3차-A) — Mn 원료]
• 원산지: 가봉 Moanda 광산 / 공정: 노천채굴 → 파쇄·분급 → 수세 → Mn 정광 선적
• Scope 1: 52,000 tCO₂e / TRIR: 2.15 ⚠️ 기준 초과 경고
• 강제노동: 없음 ✅ / FEOC: 비해당 ✅

[Windalco Jamaica (3차-B) — Al 원료]
• 원산지: 자메이카 / 공정: 보크사이트 채굴 → 파쇄·세척 → 바이어법 알루미나 정제 → 선적
• Scope 1: 68,000 tCO₂e / 강제노동: 없음 ✅

[Codelco Norte (3차-C) — Cu 원료]
• 원산지: 칠레 아타카마 / 공정: 갱내·노천 병행채굴 → 부유선광 → 황동광 정광 → 전기동 정련
• FEOC: 비해당 ✅ / TRIR: 1.42

→ 3사 모두 2차 협력사에 승인 요청 발송`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"🔍", status:"반려 + 부분 승인", statusColor:"bg-red-500", direction:"→ 3차-A 반려 발송",
    action:"3차 데이터 검토 → Comilog 반려 / Windalco·Codelco 승인",
    detail:`케이알엠 담당자가 3차 A·B·C 데이터 검토.

[검토 결과]
• 3차-A Comilog: TRIR 2.15 — CSDDD Art.8 기준 초과 + 개선계획 미첨부
  → ❌ 반려: "산업안전 개선계획서 및 2026 목표 TRIR 제출 요청"
  → 재제출 기한: 2026-06-09

• 3차-B Windalco: 원산지 증명 완비, 데이터 정상
  → ✅ 승인

• 3차-C Codelco: 원산지 증명 완비, FEOC 비해당 확인
  → ✅ 승인`
  },
  { actor:"3차 협력사-A (Comilog Gabon)", actorColor:"bg-emerald-700", icon:"📋", status:"재제출 → 승인", statusColor:"bg-green-600", direction:"← 2차 협력사 재승인 요청",
    action:"반려 사유 보완 후 재제출 → 2차 최종 승인",
    detail:`Comilog 담당자가 반려 알림 수신 → 외부 화면 재접속.

[보완 내용]
• TRIR 2.15 → 2026 목표: 1.80 이하
• 산업안전 개선계획서:
  - PPE 전면 교체: 2026.08 완료 예정
  - 안전교육 월 4회 강화
  - 안전감독관 2명 추가 채용
• 현지 인증기관 서명 첨부

[2차 협력사에 재승인 요청]
→ 케이알엠 검토 후 최종 승인 완료`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"⚗️", status:"1차에 승인 요청", statusColor:"bg-amber-500", direction:"← 1차 협력사에 승인 요청",
    action:"3차 전체 승인 완료 → 통합 데이터로 1차에 승인 요청",
    detail:`3차 A·B·C 모두 승인 완료 후 자사 데이터와 통합.

[통합 현황]
• 3차-A Comilog: Mn 원산지 ✅ / 안전계획 ✅
• 3차-B Windalco: 알루미나 원산지 ✅
• 3차-C Codelco: Cu 원산지 ✅ FEOC 비해당 ✅
• 자사 FEOC 12.5% → 대안 소싱 계획 첨부

[1차 협력사(노벨리스코리아)에 승인 요청 발송]`
  },
  { actor:"1차 협력사 (노벨리스코리아)", actorColor:"bg-blue-700", icon:"🔩", status:"원청사에 승인 요청", statusColor:"bg-amber-500", direction:"← 원청사에 최종 승인 요청",
    action:"2차 데이터 검토 → 원청사에 최종 승인 요청",
    detail:`노벨리스코리아가 2차 케이알엠 데이터 검토.

[검토 결과]
• FEOC 12.5% — 대안 소싱 계획 확인 후 조건부 승인
• 전체 데이터 정합성 검토 완료
• 자사 데이터 (Scope: 142,000 tCO₂e, RE: 28%) 통합

[원청사(현대모비스)에 최종 승인 요청 발송]`
  },
  { actor:"원청사 (현대모비스)", actorColor:"bg-slate-800", icon:"✅", status:"✅ 최종 승인 완료", statusColor:"bg-green-600", direction:"완료",
    action:"전체 공급망 데이터 최종 검토 → 승인 완료",
    detail:`현대모비스 ESG 담당자가 전체 공급망 데이터 최종 검토.

[최종 검토 항목]
• 1차 노벨리스: Scope 1+2 142,000 tCO₂e ✅
• 2차 케이알엠: FEOC 12.5% ⚠️ (개선계획 수령)
• 3차-A Comilog: Mn 원산지 ✅ / 안전계획 ✅
• 3차-B Windalco: Al 원산지 ✅
• 3차-C Codelco: Cu 원산지 ✅ FEOC 비해당 ✅

[최종 승인 완료]
→ CSRD/CSDDD 보고서 생성
→ 케이알엠 FEOC 개선 이행 모니터링 등록`
  },
];

const SCENARIO2_STEPS = [
  { actor:"원청사 (현대모비스)", actorColor:"bg-red-700", icon:"⚡", status:"긴급 요청 발송", statusColor:"bg-red-600", direction:"⚡ 전 공급망 캐스케이드",
    action:"[긴급] IRA FEOC 원산지 추적 데이터 요청 생성",
    detail:`현대모비스 ESG 담당자가 IRA 45X 세액공제 심사 일정(D-7) 확인 후 긴급 요청 생성.

[긴급 요청 정보]
• 요청번호: REQ-2026-0001
• 요청 유형: EMERGENCY / 우선순위: CRITICAL
• 제목: [긴급] IRA FEOC 원산지 추적 데이터 요청
• 내용: IRA 45X 세액공제 심사 대응 — FEOC 해당 국가 원료 비중 및 원산지 증명 요청
• 최하위 차수: 3차 (A·B·C사 포함) / 캐스케이드: 자동
• 제출 기한: 2026-05-20 18:00 (D-7)

[시스템 자동 처리]
→ 1차 협력사 즉시 알림 발송
→ 실시간 웹소켓 알림 + ALARM 테이블 저장`
  },
  { actor:"1차 협력사 (노벨리스코리아)", actorColor:"bg-blue-700", icon:"🔩", status:"부분 제출 + 재요청", statusColor:"bg-amber-500", direction:"→ 2차 재요청",
    action:"긴급 알림 수신 → 자사 FEOC 데이터 즉시 작성 + 2차 재요청",
    detail:`노벨리스코리아 담당자가 긴급 알림 수신 후 즉시 접속.

[자사 FEOC 데이터 작성]
• Al 잉곳(P1020) 원산지: 대한민국 (케이알엠, 인천)
• Mn 원료 조달처: 가봉 (Comilog) — FEOC 비해당 ✅
• Cu 원료 조달처: 칠레 (Codelco) — FEOC 비해당 ✅
• 합금 공정 내 FEOC 해당 원료: 없음 (0%)
• 원산지 증명서 업로드 완료

[2차 협력사(케이알엠)에 즉시 재요청]
• FEOC 데이터 긴급 제출 요청
• 제출 기한: 2026-05-17 (D-3)`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"⚗️", status:"외부화면 FEOC 작성", statusColor:"bg-violet-500", direction:"→ 3차 A·B·C 재요청",
    action:"외부 전용 화면 접속 → FEOC 비중 데이터 작성 + 3차 재요청",
    detail:`케이알엠 담당자가 외부 전용 화면(별도 URL) 긴급 접속.

[FEOC 데이터 작성]
• 알루미나 조달처: 자메이카 (Windalco) — FEOC 비해당 ✅
• FEOC 해당 국가 원료 비중:
  - 중국산 부원료: 12.5% ← ⚠️ IRA 위험 플래그 자동 표시
• 대안 소싱 계획서 첨부 (호주·브라질 대체 6개월 내)
• 제련 전력: 한국전력 (FEOC 비해당) ✅

[3차 협력사에 즉시 재요청]
• 3차-A Comilog / 3차-B Windalco / 3차-C Codelco
• 제출 기한: 2026-05-16 (D-4)`
  },
  { actor:"3차 협력사 A·B·C (외부 화면)", actorColor:"bg-emerald-700", icon:"⛏️", status:"원산지 증명 제출", statusColor:"bg-green-600", direction:"← 2차 협력사에 승인 요청",
    action:"외부 화면에서 원산지 증명 일괄 제출 → 2차에 승인 요청",
    detail:`[Comilog Gabon (3차-A) — Mn 원료]
• 원산지: 가봉 Moanda 광산 (FEOC 비해당 ✅)
• 지분 구조: 프랑스 Eramet (FEOC 비해당 ✅)
• RMAP 인증서 + 원산지 증명서 첨부

[Windalco Jamaica (3차-B) — Al 원료]
• 원산지: 자메이카 (FEOC 비해당 ✅)
• RMAP 인증 완비 ✅

[Codelco Norte (3차-C) — Cu 원료]
• 원산지: 칠레 (FEOC 비해당 ✅)
• 칠레 = IRA FEOC 비해당 국가 ✅
• LME 등록 원산지 증명 첨부

→ 3사 모두 2차 협력사에 승인 요청 발송`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"⚗️", status:"1차에 승인 요청", statusColor:"bg-amber-500", direction:"← 1차에 승인 요청",
    action:"3차 데이터 검토 완료 → 통합 후 1차에 승인 요청",
    detail:`3차 A·B·C 원산지 데이터 검토 완료.

[검토 결과]
• Comilog (A): FEOC 비해당 ✅ / RMAP ✅ → 승인
• Windalco (B): FEOC 비해당 ✅ → 승인
• Codelco (C): FEOC 비해당 ✅ → 승인

[자사 FEOC 최종 확정]
• FEOC 원료 비중: 12.5% (중국산 부원료)
• 대안 소싱 계획서 첨부

[1차 협력사에 승인 요청 발송]`
  },
  { actor:"1차 협력사 (노벨리스코리아)", actorColor:"bg-blue-700", icon:"🔩", status:"원청사에 승인 요청", statusColor:"bg-amber-500", direction:"← 원청사에 최종 승인 요청",
    action:"2차 FEOC 검토 → 전체 공급망 FEOC 집계 → 원청사 승인 요청",
    detail:`노벨리스코리아가 2차 케이알엠 FEOC 데이터 검토.

[전체 공급망 FEOC 집계]
• 노벨리스코리아: 0% ✅
• 케이알엠: 12.5% ⚠️ (개선 계획 첨부)
• 3차 A·B·C: 0% ✅

[원청사에 최종 승인 요청]
→ 전체 FEOC 현황 요약 리포트 첨부 가능`
  },
  { actor:"원청사 (현대모비스)", actorColor:"bg-red-700", icon:"📋", status:"✅ 보고서 승인 완료", statusColor:"bg-green-600", direction:"완료 — IRS 제출 준비",
    action:"IRA FEOC 보고서 최종 작성 및 승인 완료",
    detail:`현대모비스 ESG 담당자가 최종 FEOC 데이터 검토 및 보고서 작성.

[IRA FEOC 보고서 핵심 내용]

■ 공급망 FEOC 현황
• 1차 노벨리스: FEOC 0% ✅
• 2차 케이알엠: FEOC 12.5% ⚠️ → 개선 계획 수령
• 3차-A Comilog: FEOC 0% ✅ (RMAP 인증)
• 3차-B Windalco: FEOC 0% ✅
• 3차-C Codelco: FEOC 0% ✅

■ IRA 45X 세액공제 위험 판단
• 2차 케이알엠 12.5% — 25% 미만으로 현재 세액공제 유지 가능
• 2027년 요건 강화 대비 개선 필요

■ 조치 계획
• 케이알엠 대안 소싱 6개월 이행 모니터링
• 분기별 FEOC 비중 업데이트 의무화

[보고서 최종 승인 → 미국 IRS 제출용 PDF 생성 가능]`
  },
];

const SCENARIO3_STEPS = [
  { actor:"3차 협력사-A (Comilog Gabon)", actorColor:"bg-emerald-700", icon:"📋", status:"자가진단 완료", statusColor:"bg-emerald-600", direction:"← 2차 협력사에 승인 요청",
    action:"ESG 자가진단 실시 — 외부 전용 화면",
    detail:`현대모비스 시스템에서 연간 ESG 자가진단 요청 수신 후 외부 전용 화면 접속.

■ E (환경)
• Scope 1 GHG: 52,000 tCO₂e / 재생에너지: 12%
• 유해물질: 수은 미사용 ✅ / 광산 복구 계획 첨부
• 공정: 노천채굴(Open Pit) → 파쇄·분급 → 수세 → Mn 정광 선적

■ S (사회·인권)
• 강제노동·아동노동: 없음 ✅
• TRIR: 2.15 ⚠️ 기준 초과 자동 경고
• 지역사회 토지권 분쟁: 협의중 1건 기재

■ G (거버넌스)
• 반부패 정책: 시행중 ✅ / FEOC: 해당 없음 ✅

[자가진단 완료 → 2차 협력사에 승인 요청 발송]`
  },
  { actor:"3차 협력사-B (Windalco Jamaica)", actorColor:"bg-emerald-700", icon:"📋", status:"자가진단 완료", statusColor:"bg-emerald-600", direction:"← 2차 협력사에 승인 요청",
    action:"ESG 자가진단 실시 — 외부 전용 화면",
    detail:`Windalco 담당자가 외부 전용 화면 접속 후 자가진단 실시.

■ E (환경)
• Scope 1 GHG: 68,000 tCO₂e / 재생에너지: 8%
• 적니(Red Mud) 관리: 전용 저류지 운영 ✅
• 공정: 보크사이트 노천채굴 → 파쇄·세척 → 바이어법 알루미나 정제 → 선적

■ S (사회·인권)
• 강제노동·아동노동: 없음 ✅
• TRIR: 1.85 ⚠️ / 지역사회 일자리: 현지인 92%

■ G (거버넌스)
• FEOC: 해당 없음 ✅ / 부패방지 교육: 연 2회

[자가진단 완료 → 2차 협력사에 승인 요청 발송]`
  },
  { actor:"3차 협력사-C (Codelco Norte)", actorColor:"bg-emerald-700", icon:"📋", status:"자가진단 완료", statusColor:"bg-emerald-600", direction:"← 2차 협력사에 승인 요청",
    action:"ESG 자가진단 실시 — 외부 전용 화면",
    detail:`Codelco 담당자가 외부 전용 화면 접속 후 자가진단 실시.

■ E (환경)
• Scope 1 GHG: 112,000 tCO₂e / 재생에너지: 22%
• 용수 절약: 해수 담수화 플랜트 운영 ✅
• 공정: 갱내·노천 병행채굴 → 부유선광 → 황동광 정광 → 전기동 정련

■ S (사회·인권)
• 강제노동·아동노동: 없음 ✅
• TRIR: 1.42 / ILO 169호 준수: 원주민 협의 완료 ✅

■ G (거버넌스)
• FEOC: 칠레 국영기업 (비해당) ✅
• ESG 위원회: 이사회 내 설치 ✅

[자가진단 완료 → 2차 협력사에 승인 요청 발송]`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"🔍", status:"반려 + 부분 승인", statusColor:"bg-orange-500", direction:"→ 3차-A 반려 발송",
    action:"3차 A·B·C 자가진단 결과 검토 → 반려·승인 처리",
    detail:`케이알엠 담당자가 3차 3개사 자가진단 결과 검토.

[검토 결과]

• 3차-A Comilog: TRIR 2.15 — 개선계획 미첨부
  → ❌ 반려: "산업안전 개선계획서 및 2026 목표 TRIR 제출 요청"
  → Comilog 반려 알림 발송 / 재제출 기한: D+3

• 3차-B Windalco: TRIR 1.85 주의 — 개선 노력 인정
  → ✅ 조건부 승인 (개선 권고 메모 첨부)

• 3차-C Codelco: 전 항목 이상 없음
  → ✅ 승인 완료`
  },
  { actor:"3차 협력사-A (Comilog Gabon)", actorColor:"bg-emerald-700", icon:"📋", status:"재제출 → 승인", statusColor:"bg-green-600", direction:"← 2차 재승인 요청",
    action:"반려 사유 보완 후 재제출 → 2차 최종 승인",
    detail:`Comilog 담당자가 반려 알림 수신 → 외부 화면 재접속.

[보완 내용]
• TRIR 2.15 → 2026 목표: 1.80 이하
• 산업안전 개선계획서:
  - PPE 전면 교체: 2026.08
  - 안전교육 월 4회 강화
  - 안전감독관 2명 추가 채용
• 현지 안전감독 인증기관 서명 첨부
• 지역사회 토지권 협의 현황 추가 기재

[2차에 재승인 요청 → 케이알엠 검토 후 최종 승인 완료]`
  },
  { actor:"2차 협력사 (케이알엠)", actorColor:"bg-violet-700", icon:"⚗️", status:"자가진단 + 1차 승인 요청", statusColor:"bg-amber-500", direction:"← 1차에 승인 요청",
    action:"자사 자가진단 실시 → 3차 통합 데이터로 1차에 승인 요청",
    detail:`케이알엠이 자사 자가진단 실시 후 3차 데이터와 통합.

■ E (환경)
• Scope 1+2: 98,000 tCO₂e / 재생에너지: 18% ⚠️
• FEOC 원료 비중: 12.5% ⚠️ → 대안 소싱 계획 첨부
• 공정: 알루미나 투입 → 홀-에루법 전기분해 → P1020 잉곳 주조

■ S (사회·인권)
• 강제노동·아동노동: 없음 ✅ / TRIR: 1.12 (기준 내) ✅

■ G (거버넌스)
• FEOC 해당: 12.5% — 개선 중

[3차 통합 + 자사 자가진단 → 1차 협력사에 승인 요청 발송]`
  },
  { actor:"1차 협력사 (노벨리스코리아)", actorColor:"bg-blue-700", icon:"🔩", status:"자가진단 + 원청사 승인 요청", statusColor:"bg-amber-500", direction:"← 원청사에 최종 승인 요청",
    action:"2차 검토 + 자사 자가진단 → 원청사에 최종 승인 요청",
    detail:`노벨리스코리아가 2차 케이알엠 자가진단 검토 + 자사 자가진단 실시.

[2차 검토]
• FEOC 12.5% — 대안 소싱 계획 확인 후 조건부 승인
• 재생에너지 18% — 개선 계획 확인 후 조건부 승인

[자사 자가진단]
• Scope 1+2: 142,000 tCO₂e / 재생에너지: 28%
• TRIR: 0.62 ✅ / 강제노동: 없음 ✅
• FEOC: 8.1% ⚠️ (대안 소싱 계획 수립 중)
• 공정: Al 잉곳 투입 → Mn·Cu 배합 → 연속주조 → 열간압연

[공급망 평균 ESG: 69.3점]
→ 원청사에 최종 승인 요청 발송`
  },
  { actor:"원청사 (현대모비스)", actorColor:"bg-slate-800", icon:"✅", status:"✅ 최종 승인 + CSRD 연동", statusColor:"bg-green-600", direction:"완료",
    action:"전 공급망 자가진단 최종 검토 → 승인 및 CSRD 보고서 연동",
    detail:`현대모비스 ESG 담당자가 전 공급망 자가진단 결과 최종 검토.

[최종 검토 결과]
• 3차-A Comilog: ESG 60점 / TRIR 개선계획 ✅
• 3차-B Windalco: ESG 64.3점 / 조건부 ✅
• 3차-C Codelco: ESG 63.7점 ✅
• 2차 케이알엠: ESG 67.3점 / FEOC 개선 모니터링 등록
• 1차 노벨리스코리아: ESG 75점 ✅

[승인 결과]
• 전체 자가진단 ✅ 승인 완료
• FEOC 개선 이행 분기별 점검 등록
• TRIR 개선 이행 반기별 점검 등록

[시스템 자동 연동]
→ CSRD ESRS S2 공급망 보고서 초안 생성
→ CSDDD 이행 체크리스트 업데이트
→ 미이행 시 다음 분기 재자가진단 자동 요청`
  },
];

const ScenarioPage = () => {
  const [tab, setTab] = useState(0);
  const TABS = [
    { label:"시나리오 1", sub:"원자재 데이터 작성 요청", bg:"bg-blue-700", steps:SCENARIO1_STEPS, accent:"bg-blue-700" },
    { label:"시나리오 2", sub:"긴급 IRA FEOC 요청",     bg:"bg-red-700",  steps:SCENARIO2_STEPS, accent:"bg-red-700"  },
    { label:"시나리오 3", sub:"자가진단 역순 승인",      bg:"bg-emerald-700", steps:SCENARIO3_STEPS, accent:"bg-emerald-700" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ESG 공급망 시스템 시나리오</h1>
        <p className="text-sm text-gray-500 mt-1">프로세스: 요청·반려 (원청사→1차→2차→3차) / 승인 (3차→2차→1차→원청사)</p>
      </div>

      {/* 프로세스 원칙 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-700 mb-3">📌 공통 프로세스 원칙</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs mb-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="font-bold text-blue-800 mb-1">→ 작성 요청 · 반려 방향</p>
            <p className="text-blue-700">원청사(가공) → 1차(합금) → 2차(제련) → 3차(채굴·정제 A·B·C)</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="font-bold text-green-800 mb-1">← 승인 요청 방향</p>
            <p className="text-green-700">3차(A·B·C) → 2차(제련) → 1차(합금) → 원청사(가공)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
          {[
            ["원청사 (현대모비스)","데이터 관리·요청 생성·1차 반려 가능","슬레이트"],
            ["1차 협력사 (노벨리스)","요청수신·작성·2차재요청·원청사 승인요청","파랑"],
            ["2차 협력사 (케이알엠)","외부화면 작성·3차재요청·반려·1차 승인요청","보라"],
            ["3차 협력사 (A·B·C)","외부화면 작성·2차 승인요청 / Comilog·Windalco·Codelco","초록"],
          ].map(([t,d],i)=>(
            <div key={i} className="bg-gray-50 rounded p-2 border border-gray-100">
              <p className="font-bold text-gray-700">{t}</p>
              <p className="text-gray-500 mt-0.5 leading-tight">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2">
        {TABS.map((t,i)=>(
          <button key={i} onClick={()=>setTab(i)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border transition ${tab===i?`${t.bg} text-white border-transparent`:"bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            <div>{t.label}</div>
            <div className={`text-[10px] font-normal mt-0.5 ${tab===i?"opacity-80":"text-gray-400"}`}>{t.sub}</div>
          </button>
        ))}
      </div>

      {/* 시나리오 설명 */}
      <div className={`rounded-xl p-3 border text-xs ${tab===0?"bg-blue-50 border-blue-200 text-blue-800":tab===1?"bg-red-50 border-red-200 text-red-800":"bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
        {tab===0 && <><strong>📦 시나리오 1 배경:</strong> 현대모비스가 3003 합금 원자재 ESG 데이터 작성을 1차에 요청 → 1차→2차→3차(A·B·C) 순차 작성 → 3차 Comilog 반려(TRIR 초과) → 보완 재제출 → 역순 승인 → 원청사 최종 승인 완료</>}
        {tab===1 && <><strong>⚡ 시나리오 2 배경:</strong> IRA 45X 세액공제 심사 D-7. 2차 케이알엠 FEOC 12.5% 위험 감지로 긴급 캐스케이드 발동 → 전 공급망 원산지 증명 수집 → FEOC 보고서 작성 → IRS 제출 준비</>}
        {tab===2 && <><strong>📋 시나리오 3 배경:</strong> CSDDD Art.8·15 모니터링 및 CSRD ESRS S2 공시 대응을 위해 연간 자가진단 실시. 3차(A·B·C)부터 시작 → 2차 검토·반려 → 1차 통합 → 원청사 최종 승인 → CSRD 보고서 연동</>}
      </div>

      {/* 총 단계 배지 */}
      <div className="flex items-center gap-2">
        <span className={`text-xs text-white px-3 py-1 rounded-full font-bold ${tab===0?"bg-blue-700":tab===1?"bg-red-700":"bg-emerald-700"}`}>
          총 {TABS[tab].steps.length}단계
        </span>
      </div>

      {/* 단계별 뷰어 */}
      <StepViewer steps={TABS[tab].steps} accentColor={TABS[tab].accent}/>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ■ 5. 나머지 페이지
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const MainDashboard = () => {
  const esgByTier = COMPANIES.map(c=>({name:c.short, E:c.esg.E, S:c.esg.S, G:c.esg.G}));
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">공급망 ESG 메인 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">현대모비스 · 3003 합금 · 원청사→1차→2차→3차(A·B·C) · CSRD/CSDDD/Net-Zero 2045</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon="🏭" label="공급망 등록 기업" value="6개사" sub="원청사+1+2+3차(A·B·C)" accent="bg-slate-700"/>
        <KpiCard icon="⚠️" label="중위험 협력사" value="4개사" sub="FEOC·TRIR 주의" accent="bg-amber-500"/>
        <KpiCard icon="🌿" label="Scope 1+2+3" value="1,221 tCO₂" sub="원청사 기준 2025" accent="bg-emerald-500"/>
        <KpiCard icon="🎯" label="Net-Zero 목표" value="2045년" sub="Green Supply 로드맵" accent="bg-violet-500"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">📊 공급망 단계별 ESG 점수</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={esgByTier} margin={{left:-15}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:9}}/><YAxis domain={[0,100]} tick={{fontSize:10}}/>
              <Tooltip/><Legend/>
              <Bar dataKey="E" name="환경(E)" fill="#34d399" radius={[3,3,0,0]}/>
              <Bar dataKey="S" name="사회(S)" fill="#60a5fa" radius={[3,3,0,0]}/>
              <Bar dataKey="G" name="지배구조(G)" fill="#a78bfa" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">🎯 Net-Zero 2045 로드맵</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={NET_ZERO_DATA}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="year" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Legend/>
              <Area type="monotone" dataKey="scope1_2" name="Scope 1+2" stroke="#4f46e5" fill="url(#g1)" strokeWidth={2}/>
              <Area type="monotone" dataKey="scope3" name="Scope 3" stroke="#34d399" fill="url(#g2)" strokeWidth={2}/>
              <Line type="monotone" dataKey="target" name="목표" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">🤖 AI Agent 리스크 알림</h3>
        <div className="space-y-2">
          {[
            {co:"(주)케이알엠 (2차)", msg:"FEOC 원료 12.5% — IRA 세액공제 위험. 대안 소싱 계획 제출 요청.", level:"fail"},
            {co:"(주)케이알엠 (2차)", msg:"재생에너지 18% — IRA 청정에너지 요건 미달. 개선 계획 권고.", level:"warn"},
            {co:"Comilog Gabon (3차-A)", msg:"TRIR 2.15 초과 — CSDDD Art.8 기준 초과. 현장 감사 예약 권장.", level:"warn"},
            {co:"현대모비스 (원청사)", msg:"공급망 강제노동 실사 완료율 94% — 6% 보완 요청.", level:"warn"},
          ].map((a,i)=>(
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${a.level==="fail"?"border-red-500 bg-red-50":"border-yellow-400 bg-yellow-50"}`}>
              <span>{a.level==="fail"?"🔴":"🟡"}</span>
              <div><p className="text-sm font-bold text-gray-800">{a.co}</p><p className="text-xs text-gray-600">{a.msg}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompanyProfile = () => {
  const [sel, setSel] = useState(COMPANIES[0]);
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-gray-900">협력사 기업 정보</h1></div>
      <div className="flex gap-2 flex-wrap">
        {COMPANIES.map(c=><button key={c.id} onClick={()=>setSel(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${sel.id===c.id?"bg-indigo-600 text-white":"bg-white text-gray-700 border-gray-200"}`}>{c.tierLabel} · {c.short}</button>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between mb-4"><div><h2 className="text-xl font-bold">{sel.company_name}</h2><p className="text-sm text-gray-500">{sel.tierLabel} · {sel.country}</p></div><RiskBadge risk={sel.risk}/></div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[["대표자명",sel.ceo_name],["사업자등록번호",sel.business_number],["설립일",sel.company_establishment],["기업 규모",sel.company_size],["소재지",sel.company_address]].map(([l,v],i)=>(
              <div key={i} className={i>=4?"col-span-2":""}><span className="text-gray-400 text-xs">{l}</span><p className="font-medium text-gray-800">{v}</p></div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t"><p className="text-xs font-bold text-gray-700 mb-1">대표 공정도</p><div className="bg-slate-50 rounded-lg p-3 text-sm text-gray-700">{sel.process}</div></div>
          <div className="mt-2 flex flex-wrap gap-1">{sel.certifications.length>0?sel.certifications.map((c,i)=><Badge key={i} text={c} color="blue"/>):<span className="text-xs text-gray-400">미등록</span>}</div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-3">재무 정보</h4>
            {[["임직원",sel.employee_count?.toLocaleString()+"명","👤"],["매출",(sel.revenue?.toLocaleString()||"N/A")+"억","💰"],["자산",(sel.total_assets?.toLocaleString()||"N/A")+"억","🏦"]].map(([l,v,ic],j)=>(
              <div key={j} className="flex justify-between p-2 bg-gray-50 rounded mb-1.5"><span className="text-sm text-gray-600">{ic} {l}</span><span className="font-bold text-sm">{v}</span></div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-2">ESG 레이더</h4>
            <EsgRadar data={sel.esg}/>
            <div className="flex justify-around text-xs"><span>E:<b className="text-emerald-600 ml-1">{sel.esg.E}</b></span><span>S:<b className="text-blue-600 ml-1">{sel.esg.S}</b></span><span>G:<b className="text-purple-600 ml-1">{sel.esg.G}</b></span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const POManagement = () => {
  const sc = ["COMPLETED","SHIPPED","CONFIRMED","PENDING"].map(s=>({name:s,count:PO_DATA.filter(p=>p.status===s).length,total:PO_DATA.filter(p=>p.status===s).reduce((a,b)=>a+b.total,0)}));
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-gray-900">영업용 PO 관리</h1></div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">🧪 3003 합금 원소 구성 (Al-Mn계)</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-slate-50">{["원소","최소(%)","최대(%)","역할"].map(h=><th key={h} className="px-4 py-2 text-xs font-bold text-gray-600 text-left">{h}</th>)}</tr></thead>
          <tbody>{ALLOY_SPEC.map((s,i)=><tr key={i} className="border-t hover:bg-gray-50"><td className="px-4 py-2 font-bold" style={{color:s.color}}>{s.element}</td><td className="px-4 py-2 font-mono">{s.min.toFixed(2)}</td><td className="px-4 py-2 font-mono">{s.max.toFixed(2)}</td><td className="px-4 py-2 text-xs text-gray-500">{s.role}</td></tr>)}</tbody>
        </table></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{sc.map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><StatusBadge status={s.name}/><p className="text-2xl font-bold mt-1">{s.count}건</p><p className="text-xs text-gray-400">${s.total.toLocaleString()}</p></div>)}</div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-slate-50">{["PO 번호","규격","수량(t)","총액(USD)","납기","상태","ESG","탄소"].map(h=><th key={h} className="px-3 py-2 text-xs font-bold text-gray-500 text-left">{h}</th>)}</tr></thead>
          <tbody>{PO_DATA.map((p,i)=><tr key={i} className="border-t hover:bg-gray-50"><td className="px-3 py-3 font-mono text-xs text-indigo-600 font-bold">{p.po_number}</td><td className="px-3 py-3 text-xs">{p.spec}</td><td className="px-3 py-3 font-bold">{p.qty}</td><td className="px-3 py-3">${p.total.toLocaleString()}</td><td className="px-3 py-3 text-xs text-gray-500">{p.delivery}</td><td className="px-3 py-3"><StatusBadge status={p.status}/></td><td className="px-3 py-3"><Badge text={p.esg_grade} color={p.esg_grade==="A"?"green":"yellow"}/></td><td className="px-3 py-3 font-mono text-emerald-700 font-bold">{p.carbon}</td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
};

const Scope3Page = () => {
  const scope3Net = SCOPE3_DATA.reduce((a,b)=>a+b.gross,0);
  const scope3Gross = SCOPE3_DATA.filter(d=>d.gross>0).reduce((a,b)=>a+b.gross,0);
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-gray-900">Scope 3 탄소 계산</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon="1️⃣" label="Scope 1+2" value="285k" sub="tCO₂e" accent="bg-blue-600"/>
        <KpiCard icon="3️⃣" label="Scope 3 Gross" value={scope3Gross.toFixed(0)} sub="tCO₂e" accent="bg-violet-500"/>
        <KpiCard icon="✅" label="Scope 3 Net" value={scope3Net.toFixed(0)} sub="tCO₂e (편익 반영)" accent="bg-emerald-500"/>
        <KpiCard icon="🎯" label="1+2+3 합계(Net)" value={((285000+scope3Net)/1000).toFixed(1)+"k"} sub="tCO₂e" accent="bg-slate-700"/>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="overflow-x-auto"><table className="w-full text-xs">
          <thead><tr className="bg-slate-50">{["Cat","카테고리","배출량(tCO₂e)","비고"].map(h=><th key={h} className="px-3 py-2 text-left font-bold text-gray-500">{h}</th>)}</tr></thead>
          <tbody>
            {SCOPE3_DATA.map((d,i)=><tr key={i} className={`border-t hover:bg-gray-50 ${d.gross<0?"bg-emerald-50":""}`}><td className="px-3 py-2 font-mono text-gray-400">{d.cat}</td><td className="px-3 py-2 font-medium">{d.name}</td><td className={`px-3 py-2 font-black font-mono ${d.gross<0?"text-emerald-600":""}`}>{d.gross>0?"+":""}{d.gross.toFixed(3)}</td><td className="px-3 py-2 text-gray-400">{d.note}</td></tr>)}
            <tr className="border-t-2 border-slate-300 bg-slate-50"><td colSpan={2} className="px-3 py-2 text-right font-black">Net 합계</td><td className={`px-3 py-2 font-black font-mono ${scope3Net<0?"text-emerald-600":""}`}>{scope3Net.toFixed(3)}</td><td className="px-3 py-2 text-xs text-gray-400">Cat11·12 편익 포함</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
};

const ESGAssessment = () => {
  const [tier, setTier] = useState("3차 협력사 (채굴)");
  const indicators = ESG_INDICATORS[tier]||[];
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-gray-900">리스크 실사 지표</h1></div>
      <div className="flex gap-2 flex-wrap">{Object.keys(ESG_INDICATORS).map(t=><button key={t} onClick={()=>setTier(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${tier===t?"bg-slate-800 text-white":"bg-white text-gray-700 border-gray-200"}`}>{t}</button>)}</div>
      <div className="grid grid-cols-3 gap-4">{[["✔ 적합",indicators.filter(i=>i.status==="pass").length,"green"],["⚠ 주의",indicators.filter(i=>i.status==="warn").length,"yellow"],["✖ 부적합",indicators.filter(i=>i.status==="fail").length,"red"]].map(([l,v,c],i)=><div key={i} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${c==="green"?"border-green-400":c==="yellow"?"border-yellow-400":"border-red-400"}`}><p className="text-xs text-gray-500">{l}</p><p className={`text-3xl font-bold ${c==="green"?"text-green-600":c==="yellow"?"text-yellow-600":"text-red-600"}`}>{v}</p></div>)}</div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-slate-50">{["No.","카테고리","지표명","우선순위","규제","실적값","달성"].map(h=><th key={h} className="px-3 py-2 text-xs font-bold text-gray-500 text-left">{h}</th>)}</tr></thead>
          <tbody>{indicators.map((ind,i)=><tr key={i} className={`border-t hover:bg-gray-50 ${ind.status==="fail"?"bg-red-50":ind.status==="warn"?"bg-yellow-50":""}`}>
            <td className="px-3 py-2 font-mono text-xs text-gray-400">{ind.no}</td>
            <td className="px-3 py-2"><Badge text={ind.cat} color={ind.cat.includes("인권")?"blue":ind.cat.includes("환경")?"green":"yellow"}/></td>
            <td className="px-3 py-2 text-xs font-medium">{ind.name}</td>
            <td className="px-3 py-2"><Badge text={ind.priority} color={ind.priority==="Critical"?"red":"yellow"}/></td>
            <td className="px-3 py-2"><div className="flex gap-1 flex-wrap">{ind.regs.map((r,j)=><Badge key={j} text={r} color="indigo"/>)}</div></td>
            <td className="px-3 py-2 font-mono text-xs">{ind.value}</td>
            <td className="px-3 py-2 text-center"><IndicatorStatus status={ind.status}/></td>
          </tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
};

const InspectionPage = () => {
  const [activeId, setActiveId] = useState(null);
  const phaseFlow = ["SCHEDULED","SELF_ASSESS","ON_SITE","IMPROVEMENT","MONITORING","COMPLETED"];
  const phaseLabel = {SCHEDULED:"예정",SELF_ASSESS:"자가진단",ON_SITE:"현장방문",IMPROVEMENT:"개선중",MONITORING:"모니터링",COMPLETED:"완료"};
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-gray-900">현장 실사 관리</h1></div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1 overflow-x-auto">{phaseFlow.map((p,i)=><div key={p} className="flex items-center gap-1 shrink-0"><div className={`px-3 py-2 rounded-lg text-xs font-bold border text-center ${p==="COMPLETED"?"bg-emerald-100 border-emerald-300 text-emerald-700":"bg-slate-100 border-slate-200 text-slate-700"}`}><div className="font-black">{i+1}</div><div>{phaseLabel[p]}</div></div>{i<phaseFlow.length-1&&<span className="text-gray-300 text-lg">→</span>}</div>)}</div>
      </div>
      <div className="space-y-3">{INSPECTIONS.map(ins=><div key={ins.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 flex items-center justify-between cursor-pointer" onClick={()=>setActiveId(activeId===ins.id?null:ins.id)}>
          <div className="flex items-center gap-3"><span className="text-2xl">{ins.risk==="저위험"?"🟢":"🟡"}</span><div><p className="font-bold text-sm">{ins.target}</p><p className="text-xs text-gray-500">{ins.type} · {ins.scheduled}</p></div></div>
          <div className="flex items-center gap-2"><PhaseChip v={ins.phase}/><RiskBadge risk={ins.risk}/><span className="text-xl font-black text-indigo-600">{ins.score}점</span><span className="text-gray-400">{activeId===ins.id?"▲":"▼"}</span></div>
        </div>
        {activeId===ins.id&&<div className="border-t p-4"><p className="text-xs text-gray-600 bg-red-50 rounded p-2 mb-2">{ins.findings}</p><div className="flex gap-2"><button className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg">보고서 작성</button><button className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg">개선 요청</button></div></div>}
      </div>)}</div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ■ 6. 메인 앱
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NAV = [
  { key:"dashboard",  icon:"⊞",  label:"메인 대시보드",  badge:null  },
  { key:"map",        icon:"🌐", label:"공급망 맵",       badge:null  },
  { key:"company",    icon:"🏢", label:"기업 정보",       badge:null  },
  { key:"po",         icon:"📦", label:"PO 관리",         badge:null  },
  { key:"scope3",     icon:"🌿", label:"Scope 3 계산",    badge:"NEW" },
  { key:"assessment", icon:"🔍", label:"리스크 실사",      badge:null  },
  { key:"inspection", icon:"🏗️", label:"현장 실사",       badge:"2건" },
  { key:"scenario",   icon:"📖", label:"시나리오",         badge:"3개" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const pages = {
    dashboard:  <MainDashboard/>,
    map:        <SupplyChainMap/>,
    company:    <CompanyProfile/>,
    po:         <POManagement/>,
    scope3:     <Scope3Page/>,
    assessment: <ESGAssessment/>,
    inspection: <InspectionPage/>,
    scenario:   <ScenarioPage/>,
  };
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-56 bg-slate-950 text-slate-300 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-sm font-black text-white">Alu-ESG<br/><span className="text-emerald-400 font-light text-xs">Platform v2 · 3003</span></h1>
          <p className="text-[9px] text-slate-600 mt-1">현대모비스 · Net-Zero 2045</p>
          <div className="mt-1 text-[9px] text-slate-500 font-semibold">원청사→1차→2차→3차(A·B·C)</div>
          <div className="mt-1 flex flex-wrap gap-1">{["CSRD","CSDDD","IRA","FEOC"].map(r=><span key={r} className="text-[8px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded">{r}</span>)}</div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>setPage(n.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${page===n.key?"bg-emerald-600 text-white":"text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              <span className="flex items-center gap-2"><span>{n.icon}</span><span>{n.label}</span></span>
              {n.badge&&<span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${n.badge==="NEW"?"bg-emerald-400 text-white":"bg-amber-400 text-white"}`}>{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800 text-[8px] text-slate-600"><p>SR 2025 · 인권/환경/D&I 정책</p><p>협력회사 행동강령 Rev.4</p></div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-13 flex items-center justify-between px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">3003-H14/H16</span>
            <span className="text-xs text-gray-400">원청사(가공) → 1차(합금) → 2차(제련) → 3차(채굴·정제 A·B·C)</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 text-gray-400 hover:text-gray-700 text-lg">🔔<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/></button>
            <span className="text-xs text-gray-600 font-semibold">ESG 마스터 관리자</span>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AD</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{pages[page]}</main>
      </div>
    </div>
  );
}

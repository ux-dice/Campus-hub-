"use client";

import { useState, useRef, useEffect } from "react";
import IntroVideo from "./IntroVideo";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

// ══════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════
const COLLEGES = [
  { id:1, name:"VIT College of Engineering", short:"VIT", city:"Vellore, TN", emoji:"🏛", color:"#4f8ef7", grad:"linear-gradient(135deg,#1a1a2e,#16213e)", students:1240, projects:892, events:48 },
  { id:2, name:"MIT World Peace University", short:"MIT-WPU", city:"Pune, MH", emoji:"🎓", color:"#7c3aed", grad:"linear-gradient(135deg,#1e3a5f,#2563eb22)", students:980, projects:654, events:32 },
  { id:3, name:"Chandigarh University", short:"CU", city:"Chandigarh, PB", emoji:"📚", color:"#16a34a", grad:"linear-gradient(135deg,#2d1b69,#7c3aed22)", students:2100, projects:1380, events:72 },
  { id:4, name:"SRM Institute of Science", short:"SRM", city:"Chennai, TN", emoji:"🔬", color:"#dc2626", grad:"linear-gradient(135deg,#14532d,#16a34a22)", students:1560, projects:1020, events:56 },
];

const LEADERS = [
  { rank:1, name:"Kavya Singh",  college:"VIT",     dept:"CSE",   score:9840, color:"#dc2626" },
  { rank:2, name:"Rohan Gupta",  college:"CU",      dept:"AI/ML", score:8920, color:"#7c3aed" },
  { rank:3, name:"Priya Sharma", college:"VIT",     dept:"CSE",   score:8210, color:"#4f8ef7" },
  { rank:4, name:"Arjun Mehta",  college:"SRM",     dept:"ECE",   score:7640, color:"#16a34a" },
  { rank:5, name:"Dev Nair",     college:"MIT-WPU", dept:"IT",    score:7120, color:"#f59e0b" },
  { rank:6, name:"Sneha Patel",  college:"CU",      dept:"CSE",   score:6890, color:"#0891b2" },
];

const POSTS = [
  { id:1, type:"college", college:"VIT", cEmoji:"🏛", author:"VIT Official", role:"Official",
    text:"🏆 Congratulations to Team InnovatX for winning Smart India Hackathon 2024! Our students defeated 1,200+ teams nationwide. Incredible achievement!",
    time:"2h", likes:342, comments:48, saves:89, views:4820, tag:"Achievement", hot:true, color:"#1a1a2e" },
  { id:2, type:"student", author:"Priya Sharma", college:"VIT", dept:"CSE", year:"3rd",
    text:"Just launched AR Campus Navigator — 6 months grinding with ARCore + CoreML. Every building mapped in real-time. Would love your feedback 🗺️",
    time:"4h", likes:127, comments:23, saves:41, views:1203, tag:"Project", color:"#2563eb" },
  { id:3, type:"college", college:"Chandigarh University", cEmoji:"📚", author:"CU Events Cell", role:"Official",
    text:"📢 TechNova 2025 registrations are LIVE! ₹5L prize pool across 12 categories. Biggest student tech fest in North India. Register now!",
    time:"5h", likes:289, comments:67, saves:112, views:3410, tag:"Event", hot:true,
    hasEvent:true, eventDate:"28", eventMonth:"FEB", eventTitle:"TechNova 2025", color:"#2d1b69" },
  { id:4, type:"student", author:"Arjun Mehta", college:"SRM", dept:"ECE", year:"2nd",
    text:"EcoTrack is live — IoT dashboard monitoring energy across 14 campus buildings. Custom ESP32 sensors, 40% wastage reduction so far 💡",
    time:"6h", likes:94, comments:17, saves:28, views:876, tag:"Project", color:"#16a34a" },
  { id:5, type:"student", author:"Kavya Singh", college:"VIT", dept:"CSE", year:"Final",
    text:"Got the Google SWE offer. 4 years. Countless projects. Every rejection. Every late night. It was all worth it. To everyone grinding — your time is coming 🙌",
    time:"10h", likes:2204, comments:387, saves:892, views:24300, tag:"Achievement", hot:true, color:"#dc2626" },
];

const PROJECTS = [
  { id:1, emoji:"🗺️", title:"AR Campus Navigator",    desc:"AR-based real-time indoor navigation using ARCore + CoreML.",          author:"Priya Sharma", college:"VIT",     dept:"CSE",   likes:127, views:1203, tags:["AR","ML","Mobile"],    status:"approved", grad:"linear-gradient(135deg,#667eea,#764ba2)" },
  { id:2, emoji:"⚡",  title:"EcoTrack Dashboard",     desc:"Real-time energy monitoring via custom ESP32 sensors.",               author:"Arjun Mehta",  college:"SRM",     dept:"ECE",   likes:94,  views:876,  tags:["IoT","ESP32"],          status:"approved", grad:"linear-gradient(135deg,#43e97b,#38f9d7)" },
  { id:3, emoji:"🤖",  title:"Mental Health Companion", desc:"Anonymous AI counseling chatbot powered by NLP emotion detection.",  author:"Rohan Gupta",  college:"CU",      dept:"AI/ML", likes:203, views:4820, tags:["AI","NLP"],             status:"approved", grad:"linear-gradient(135deg,#4facfe,#00f2fe)" },
  { id:4, emoji:"💼",  title:"Placement Portal 2.0",   desc:"Redesigned portal with AI resume builder and recruiter dashboard.",   author:"Kavya Singh",  college:"VIT",     dept:"CSE",   likes:312, views:8100, tags:["React","Node"],         status:"approved", grad:"linear-gradient(135deg,#f093fb,#f5576c)" },
  { id:5, emoji:"🍱",  title:"CampusEats",             desc:"Real-time food ordering with ML-powered queue prediction.",           author:"Sneha Patel",  college:"CU",      dept:"CSE",   likes:67,  views:389,  tags:["React","Firebase"],     status:"pending",  grad:"linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id:6, emoji:"📚",  title:"Smart Library System",   desc:"QR-based borrowing with ML-powered book recommendation engine.",      author:"Dev Nair",     college:"MIT-WPU", dept:"IT",    likes:48,  views:271,  tags:["QR","Node","ML"],       status:"approved", grad:"linear-gradient(135deg,#0f2027,#2c5364)" },
];

const EVENTS = [
  { id:1, day:"12", month:"MAR", title:"HackFest 2025",    college:"VIT",     desc:"36-hour hackathon with ₹2L prize pool, free food & accommodation.",       tag:"Hackathon", participants:148, max:200, prize:"₹2L",  color:"#4f8ef7" },
  { id:2, day:"18", month:"MAR", title:"AI in Healthcare", college:"SRM",     desc:"Guest lecture by Dr. Ravi Krishnan, ex-Google Health AI team lead.",       tag:"Lecture",   participants:89,  max:120,              color:"#7c3aed" },
  { id:3, day:"25", month:"MAR", title:"Design Sprint",    college:"MIT-WPU", desc:"Full-day UX intensive with mentors from Flipkart Design Studio.",           tag:"Workshop",  participants:52,  max:60,               color:"#16a34a" },
  { id:4, day:"28", month:"FEB", title:"TechNova 2025",    college:"CU",      desc:"2-day mega fest — 12 categories, robotics & paper presentations.",         tag:"Fest",      participants:320, max:500, prize:"₹5L",  color:"#dc2626" },
];

const REELS = [
  { id:1, emoji:"🎓", title:"Graduation 2024 Highlights",    author:"VIT Official",  views:"12K",  dur:"2:34", grad:"linear-gradient(135deg,#1a1a2e,#4f8ef7)" },
  { id:2, emoji:"🤖", title:"Built an AI chatbot in 48hrs",  author:"Rohan Gupta",   views:"8.4K", dur:"3:12", grad:"linear-gradient(135deg,#4facfe,#00f2fe)" },
  { id:3, emoji:"🏆", title:"Smart India Hackathon Journey", author:"VIT Official",  views:"24K",  dur:"1:48", grad:"linear-gradient(135deg,#f093fb,#f5576c)" },
  { id:4, emoji:"💡", title:"EcoTrack IoT Demo Live",        author:"Arjun Mehta",   views:"3.2K", dur:"4:06", grad:"linear-gradient(135deg,#43e97b,#38f9d7)" },
  { id:5, emoji:"🎨", title:"Campus Art Festival BTS",       author:"MIT-WPU Media", views:"6.7K", dur:"2:58", grad:"linear-gradient(135deg,#667eea,#764ba2)" },
  { id:6, emoji:"🚀", title:"Building a startup at 20",      author:"Kavya Singh",   views:"18K",  dur:"5:22", grad:"linear-gradient(135deg,#f59e0b,#f97316)" },
  { id:7, emoji:"🔬", title:"Materials Science Lab Day",     author:"Dev Nair",      views:"1.9K", dur:"3:44", grad:"linear-gradient(135deg,#0f2027,#2c5364)" },
  { id:8, emoji:"🎵", title:"Cultural Fest Final Night",     author:"CU Events",     views:"31K",  dur:"6:01", grad:"linear-gradient(135deg,#7c3aed,#db2777)" },
];

// Chat data — each conversation has its own messages
const CHAT_CONTACTS = [
  { id:1, name:"Rohan Gupta",  college:"CU",      last:"Hey! Saw your AR project — incredible 🔥",   time:"2m",  unread:2, online:true,  color:"#7c3aed",
    messages:[
      { id:1, text:"Hey! Saw your AR project — incredible 🔥", mine:false, time:"10:32 AM" },
      { id:2, text:"Thank you! 6 months of work paid off 😊", mine:true, time:"10:33 AM", seen:true },
      { id:3, text:"How did you handle the indoor mapping?", mine:false, time:"10:34 AM" },
      { id:4, text:"Used marker-based tracking + sensor fusion. Happy to explain!", mine:true, time:"10:35 AM", seen:true },
      { id:5, text:"Would love to collab sometime 🙌", mine:false, time:"10:36 AM" },
    ]},
  { id:2, name:"Kavya Singh",  college:"VIT",     last:"Thanks for the feedback on my project!",   time:"1h",  unread:0, online:true,  color:"#dc2626",
    messages:[
      { id:1, text:"Hey Kavya! Congrats on the Google offer 🎉", mine:true, time:"9:10 AM", seen:true },
      { id:2, text:"Thanks!! So excited, can't believe it happened", mine:false, time:"9:12 AM" },
      { id:3, text:"You deserved it completely. All those late nights paid off!", mine:true, time:"9:13 AM", seen:true },
      { id:4, text:"Thanks for the feedback on my project!", mine:false, time:"9:15 AM" },
    ]},
  { id:3, name:"Dev Nair",     college:"MIT-WPU", last:"Are you going to HackFest this weekend?",  time:"3h",  unread:1, online:false, color:"#f59e0b",
    messages:[
      { id:1, text:"Yo Dev! Are you going to HackFest this weekend?", mine:false, time:"7:00 AM" },
      { id:2, text:"Thinking about it! Is the team finalized?", mine:true, time:"7:05 AM", seen:true },
    ]},
  { id:4, name:"Sneha Patel",  college:"CU",      last:"The project link was super helpful 🙏",    time:"1d",  unread:0, online:false, color:"#0891b2",
    messages:[
      { id:1, text:"Sneha! Check out this resource for your ML project", mine:true, time:"Yesterday", seen:true },
      { id:2, text:"The project link was super helpful 🙏", mine:false, time:"Yesterday" },
    ]},
];

// ══════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════
const C = {
  bg: "#08080a",
  surface: "rgba(18,18,24,0.8)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(79,142,247,0.35)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.45)",
  textFaint: "rgba(255,255,255,0.2)",
  accent: "#4f8ef7",
  accentPurple: "#7c3aed",
  grad: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
  gradHot: "linear-gradient(135deg,#f97316,#ef4444)",
  glass: "rgba(12,12,20,0.85)",
  online: "#22c55e",
};

// ══════════════════════════════════════════════
// BASE COMPONENTS
// ══════════════════════════════════════════════
const AV_COLORS = ["#4f8ef7","#7c3aed","#dc2626","#16a34a","#f59e0b","#0891b2","#db2777"];

function Av({ name="?", size=40, color, verified=false }) {
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const bg = color || AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
  return (
    <div style={{ position:"relative", flexShrink:0, display:"inline-flex" }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:`linear-gradient(135deg,${bg},${bg}bb)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontWeight:800, fontSize:size*0.32, color:"#fff", flexShrink:0,
        border:"1.5px solid rgba(255,255,255,0.1)",
        boxShadow:`0 2px 10px ${bg}40`,
        letterSpacing:-0.5,
      }}>{initials}</div>
      {verified && (
        <div style={{
          position:"absolute", bottom:-1, right:-1,
          width:Math.max(12,size*0.3), height:Math.max(12,size*0.3),
          borderRadius:"50%", background:C.online,
          border:`2px solid ${C.bg}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:Math.max(7,size*0.14), color:"#fff", fontWeight:800,
        }}>✓</div>
      )}
    </div>
  );
}

function Chip({ children, color="gray", small=false }) {
  const variants = {
    gray:   { bg:"rgba(255,255,255,0.06)", text:"rgba(255,255,255,0.5)",  border:"rgba(255,255,255,0.08)" },
    blue:   { bg:"rgba(79,142,247,0.12)",  text:"#60a5fa",               border:"rgba(79,142,247,0.2)" },
    green:  { bg:"rgba(22,163,74,0.12)",   text:"#4ade80",               border:"rgba(22,163,74,0.2)" },
    amber:  { bg:"rgba(245,158,11,0.12)",  text:"#fbbf24",               border:"rgba(245,158,11,0.2)" },
    red:    { bg:"rgba(220,38,38,0.12)",   text:"#f87171",               border:"rgba(220,38,38,0.2)" },
    purple: { bg:"rgba(124,58,237,0.12)",  text:"#a78bfa",               border:"rgba(124,58,237,0.2)" },
    hot:    { bg:C.gradHot,               text:"#fff",                  border:"transparent" },
  };
  const v = variants[color]||variants.gray;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding: small ? "1px 8px" : "2px 10px",
      borderRadius:100, fontSize: small ? 10 : 11, fontWeight:800,
      background:v.bg, color:v.text, border:`1px solid ${v.border}`,
      whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function Btn({ children, variant="primary", size="md", onClick, style={}, disabled=false }) {
  const sz = { sm:"6px 14px", md:"9px 20px", xs:"4px 10px" };
  const fs = { sm:13, md:14, xs:12 };
  const variants = {
    primary: { background:C.grad, color:"#fff", border:"none", boxShadow:"0 4px 14px rgba(79,142,247,0.3)" },
    outline: { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.8)", border:"1px solid rgba(255,255,255,0.12)" },
    ghost:   { background:"transparent", color:C.textMuted, border:"1px solid transparent" },
    danger:  { background:"rgba(220,38,38,0.12)", color:"#f87171", border:"1px solid rgba(220,38,38,0.2)" },
    success: { background:"rgba(22,163,74,0.12)", color:"#4ade80", border:"1px solid rgba(22,163,74,0.2)" },
    glass:   { background:"rgba(255,255,255,0.08)", color:"#fff", border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(10px)" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
        padding:sz[size]||sz.md, borderRadius:10, fontSize:fs[size]||fs.md,
        fontWeight:700, fontFamily:"inherit", cursor:disabled?"not-allowed":"pointer",
        transition:"all 0.15s", opacity:disabled?0.5:1, whiteSpace:"nowrap",
        ...variants[variant], ...style,
      }}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.opacity="0.85"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}
      onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
      onMouseUp={e=>e.currentTarget.style.transform="translateY(-1px)"}
    >{children}</button>
  );
}

function Glass({ children, style={}, hover=false, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>hover&&setHov(true)}
      onMouseLeave={()=>hover&&setHov(false)}
      style={{
        background:C.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        border:`1px solid ${hov ? C.borderHover : C.border}`,
        borderRadius:16, overflow:"hidden",
        boxShadow: hov ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(79,142,247,0.08)" : "0 4px 24px rgba(0,0,0,0.25)",
        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>{children}</div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label style={{ position:"relative", width:44, height:24, cursor:"pointer", flexShrink:0, display:"inline-block" }}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}
        style={{ opacity:0, width:0, height:0, position:"absolute" }}/>
      <div style={{
        position:"absolute", inset:0, borderRadius:100,
        background:checked ? C.grad : "rgba(255,255,255,0.1)",
        transition:"all 0.25s", boxShadow:checked?"0 0 16px rgba(79,142,247,0.35)":"none",
      }}/>
      <div style={{
        position:"absolute", top:2, left:2, width:20, height:20,
        borderRadius:"50%", background:"#fff",
        boxShadow:"0 2px 6px rgba(0,0,0,0.3)",
        transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform:checked?"translateX(20px)":"translateX(0)",
      }}/>
    </label>
  );
}

function FloatCard({ children, style={} }) {
  return (
    <div style={{
      background:"rgba(12,12,20,0.8)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      border:`1px solid ${C.border}`, borderRadius:16,
      boxShadow:"0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      ...style,
    }}>{children}</div>
  );
}

function Input({ label, placeholder, value, onChange, type="text", multiline=false }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width:"100%", padding:"10px 14px", fontSize:14, color:"#fff", fontFamily:"inherit",
    background:"rgba(255,255,255,0.04)", outline:"none", boxSizing:"border-box",
    border:`1.5px solid ${focused?"rgba(79,142,247,0.5)":C.border}`,
    borderRadius:10, transition:"all 0.2s",
    boxShadow:focused?"0 0 0 3px rgba(79,142,247,0.1)":"none",
  };
  return (
    <div style={{ marginBottom:12 }}>
      {label&&<label style={{ display:"block", fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:6 }}>{label}</label>}
      {multiline
        ? <textarea rows={3} placeholder={placeholder} value={value} onChange={onChange}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            style={{...base,resize:"none",lineHeight:1.6}}/>
        : <input type={type} placeholder={placeholder} value={value} onChange={onChange}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            style={base}/>
      }
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type="success") => {
    const id = Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000);
  };
  return { toasts, show };
}

function Toast({ msg, type="success" }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:10,
      background:"rgba(12,12,20,0.97)", backdropFilter:"blur(20px)",
      border:`1px solid ${type==="error"?"rgba(220,38,38,0.3)":"rgba(79,142,247,0.3)"}`,
      borderRadius:14, padding:"12px 18px", color:"#fff", fontSize:14, fontWeight:600,
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)", animation:"toastIn 0.35s ease both", minWidth:260,
    }}>
      <div style={{
        width:28, height:28, borderRadius:"50%", flexShrink:0,
        background: type==="error"?"linear-gradient(135deg,#dc2626,#ef4444)":C.grad,
        display:"grid", placeItems:"center", fontSize:13,
      }}>{type==="error"?"✕":"✓"}</div>
      {msg}
    </div>
  );
}

// ══════════════════════════════════════════════
// POST CARD
// ══════════════════════════════════════════════
function PostCard({ post, showToast }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <Glass style={{ marginBottom:10, borderRadius:18 }}>
      {post.type==="college" && (
        <div style={{
          display:"flex", alignItems:"center", gap:8, padding:"9px 16px",
          background:"rgba(255,255,255,0.02)", borderBottom:`1px solid ${C.border}`,
        }}>
          <div style={{ width:22, height:22, borderRadius:6, background:post.color||"#4f8ef7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{post.cEmoji}</div>
          <span style={{ fontSize:12.5, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>{post.college}</span>
          <Chip color="blue" small>Official</Chip>
          {post.hot && <Chip color="hot" small>🔥 Trending</Chip>}
        </div>
      )}

      <div style={{ padding:"14px 16px 0", display:"flex", gap:10, alignItems:"flex-start" }}>
        <Av name={post.author} color={post.color} size={42} verified={post.type==="college"}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{post.author}</span>
            {post.type==="student" && post.hot && <Chip color="hot" small>🔥 Hot</Chip>}
            <Chip color="gray" small>{post.tag}</Chip>
          </div>
          <div style={{ fontSize:12, color:C.textFaint, marginTop:2 }}>
            {post.type==="student" ? `${post.college} · ${post.dept} · ${post.year} Year · ${post.time} ago` : `${post.time} ago`}
          </div>
        </div>
      </div>

      <div style={{ padding:"10px 16px", fontSize:14.5, lineHeight:1.7, color:"rgba(255,255,255,0.75)" }}>{post.text}</div>

      {post.hasEvent && (
        <div style={{ margin:"0 16px 12px", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
          <div style={{ background:`linear-gradient(135deg,${post.color||"#7c3aed"},#4f8ef7)`, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:38, color:"#fff", lineHeight:1 }}>{post.eventDate}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:700 }}>{post.eventMonth}</div>
            </div>
            <div style={{ flex:1, padding:"0 20px" }}>
              <div style={{ fontWeight:800, fontSize:17, color:"#fff", marginBottom:3 }}>{post.eventTitle}</div>
              <Chip color="gray">{post.college}</Chip>
            </div>
            <Btn variant="glass" size="sm">Register →</Btn>
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px 8px", fontSize:12, color:C.textFaint, fontWeight:700 }}>👁 {post.views?.toLocaleString()} views</div>

      <div style={{ display:"flex", alignItems:"center", borderTop:`1px solid ${C.border}`, padding:"4px 8px" }}>
        {[
          { icon:"❤️", iconOff:"🤍", label:likes.toLocaleString(), active:liked, activeColor:"#ef4444",
            action:()=>{ setLiked(p=>!p); setLikes(p=>liked?p-1:p+1); if(!liked)showToast("Liked ❤️"); }},
          { icon:"💬", label:post.comments, action:()=>setShowComment(p=>!p) },
          { icon:"🔖", iconOff:"🏷", label:post.saves, active:saved, activeColor:C.accent,
            action:()=>{ setSaved(p=>!p); showToast(saved?"Removed from saved":"Saved 🔖"); }},
        ].map((a,i)=>(
          <button key={i} onClick={a.action} style={{
            display:"flex", alignItems:"center", gap:5, padding:"8px 12px",
            borderRadius:10, fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
            background:"none", fontFamily:"inherit", transition:"all 0.15s",
            color: a.active ? (a.activeColor||C.accent) : C.textMuted,
          }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>
            {a.active ? (a.icon||a.iconOff) : (a.iconOff||a.icon)} {a.label}
          </button>
        ))}
        <button onClick={()=>showToast("Link copied!")} style={{
          display:"flex", alignItems:"center", gap:5, padding:"8px 12px", borderRadius:10,
          fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
          background:"none", color:C.textMuted, marginLeft:"auto", fontFamily:"inherit",
        }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
        onMouseLeave={e=>e.currentTarget.style.background="none"}>
          ↗ Share
        </button>
      </div>

      {showComment && (
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
          <Av name="You" size={30}/>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:100, padding:"8px 14px" }}>
            <input value={comment} onChange={e=>setComment(e.target.value)}
              placeholder="Write a comment..."
              onKeyDown={e=>{ if(e.key==="Enter"&&comment.trim()){ showToast("Comment posted 💬"); setComment(""); setShowComment(false); }}}
              style={{ flex:1, background:"none", border:"none", outline:"none", fontSize:13, color:"#fff", fontFamily:"inherit" }}/>
            {comment && (
              <button onClick={()=>{ showToast("Comment posted 💬"); setComment(""); setShowComment(false); }}
                style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:16 }}>↑</button>
            )}
          </div>
        </div>
      )}
    </Glass>
  );
}

// ══════════════════════════════════════════════
// RIGHT SIDEBAR
// ══════════════════════════════════════════════
function RightSidebar({ setPage, user }) {
  return (
    <aside style={{
      width:280, flexShrink:0, padding:"20px 14px",
      borderLeft:`1px solid ${C.border}`,
      position:"sticky", top:60, height:"calc(100vh - 60px)",
      overflowY:"auto", scrollbarWidth:"none",
    }}>
      <FloatCard style={{ padding:16, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <span style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:13, color:"#fff" }}>🏆 Top Students</span>
          <button onClick={()=>setPage("leaderboard")} style={{ fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer", fontWeight:700 }}>View all</button>
        </div>
        {LEADERS.slice(0,5).map(l=>(
          <div key={l.rank} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
            <span style={{ fontSize:14, width:18 }}>{l.rank<=3?["🥇","🥈","🥉"][l.rank-1]:<span style={{fontSize:11,color:C.textFaint,fontWeight:800}}>{l.rank}</span>}</span>
            <Av name={l.name} size={28} color={l.color}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</div>
              <div style={{ fontSize:10, color:C.textFaint }}>{l.college}</div>
            </div>
            <div style={{ fontSize:11, fontWeight:800, background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{l.score.toLocaleString()}</div>
          </div>
        ))}
      </FloatCard>

      <FloatCard style={{ padding:16, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
          <span style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:13, color:"#fff" }}>🎟 Upcoming Events</span>
        </div>
        {EVENTS.slice(0,3).map(e=>(
          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
            <div style={{ width:36, height:36, borderRadius:9, background:e.color, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 12px ${e.color}40` }}>
              <div style={{ fontSize:13, fontWeight:800, lineHeight:1, color:"#fff" }}>{e.day}</div>
              <div style={{ fontSize:8, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>{e.month}</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.title}</div>
              <div style={{ fontSize:10, color:C.textFaint }}>{e.college}</div>
            </div>
          </div>
        ))}
      </FloatCard>

      {/* Ad */}
      <FloatCard style={{ padding:16, marginBottom:14, position:"relative" }}>
        <div style={{ fontSize:9, color:C.textFaint, fontWeight:700, letterSpacing:"0.5px", marginBottom:10 }}>SPONSORED</div>
        <div style={{ fontSize:22, marginBottom:8 }}>💼</div>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:14, color:"#fff", marginBottom:4 }}>Internship Ready?</div>
        <div style={{ fontSize:12, color:C.textMuted, marginBottom:12, lineHeight:1.5 }}>Top companies recruit directly from CampusHub profiles.</div>
        <Btn variant="glass" size="sm" style={{ width:"100%", justifyContent:"center" }}>Explore →</Btn>
      </FloatCard>

      {!user && (
        <div style={{ borderRadius:14, padding:16, background:C.grad, boxShadow:"0 8px 32px rgba(79,142,247,0.3)" }}>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:15, color:"#fff", marginBottom:6 }}>Join the conversation</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginBottom:14 }}>4,800+ students on CampusHub</div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="outline" size="sm" style={{ flex:1, justifyContent:"center", color:"#fff", borderColor:"rgba(255,255,255,0.3)" }}>Sign In</Btn>
            <Btn size="sm" style={{ flex:1, justifyContent:"center", background:"rgba(255,255,255,0.9)", color:"#4f8ef7" }}>Join Free</Btn>
          </div>
        </div>
      )}
    </aside>
  );
}

// ══════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════
function HomePage({ user, setPage, showToast }) {
  const [tab, setTab] = useState("all");
  const filtered = tab==="all"?POSTS:tab==="colleges"?POSTS.filter(p=>p.type==="college"):POSTS.filter(p=>p.type==="student");

  return (
    <div>
      {!user && (
        <Glass style={{ padding:36, marginBottom:16, borderRadius:22 }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:"rgba(79,142,247,0.07)", filter:"blur(50px)", pointerEvents:"none" }}/>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.2)", borderRadius:100, padding:"5px 14px", marginBottom:16 }}>
            <span style={{ fontSize:12 }}>✨</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.accent }}>India&apos;s #1 Campus Platform</span>
          </div>
          <h1 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:"clamp(28px,4vw,52px)", letterSpacing:-2, lineHeight:1.05, color:"#fff", marginBottom:12 }}>
            Your campus.<br/>
            <span style={{ background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>All in one</span> place.
          </h1>
          <p style={{ color:C.textMuted, fontSize:15, maxWidth:440, lineHeight:1.7, marginBottom:24 }}>Share projects, join events, connect with 4,800+ students across 4 colleges.</p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:28 }}>
            {[["4.8K","Students"],["3.9K","Projects"],["4","Colleges"],["208","Events"]].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, color:"#fff", letterSpacing:-0.5 }}>{v}</div>
                <div style={{ fontSize:11, color:C.textFaint, fontWeight:600 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <Btn onClick={()=>setPage("auth")}>Join Free →</Btn>
            <Btn variant="outline" onClick={()=>setPage("projects")}>Explore Projects</Btn>
          </div>
        </Glass>
      )}

      {user && (
        <div style={{ display:"flex", gap:14, overflowX:"auto", padding:"4px 0 16px", scrollbarWidth:"none" }}>
          {[{name:"VIT Official",college:true},{name:"CU Events",college:true},...LEADERS.slice(0,5).map(l=>({name:l.name,color:l.color}))].map((s,i)=>(
            <div key={i} onClick={()=>showToast(`Viewing ${s.name}'s story`)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", flexShrink:0 }}>
              <div style={{ padding:2.5, borderRadius:"50%", background:s.college?"conic-gradient(#f59e0b,#f97316,#f59e0b)":"conic-gradient(#4f8ef7,#7c3aed,#db2777,#4f8ef7)", transition:"transform 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{ padding:2, borderRadius:"50%", background:C.bg }}>
                  <Av name={s.name} size={42} color={s.color}/>
                </div>
              </div>
              <span style={{ fontSize:10.5, fontWeight:600, color:C.textMuted, maxWidth:52, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {s.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      )}

      {user && (
        <Glass style={{ padding:16, marginBottom:12 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <Av name={user.name||"You"} size={40}/>
            <textarea placeholder="What's happening on campus?" rows={2}
              style={{ flex:1, background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:12, padding:"10px 14px", fontSize:14, color:"#fff", resize:"none", lineHeight:1.6, outline:"none", fontFamily:"inherit", transition:"border-color 0.2s" }}
              onFocus={e=>e.target.style.borderColor="rgba(79,142,247,0.35)"}
              onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {[["📸","Photo"],["🎬","Video"],["🚀","Project"],["📢","Update"]].map(([icon,label])=>(
              <button key={label} style={{
                display:"flex", alignItems:"center", gap:5, padding:"5px 12px",
                borderRadius:8, fontSize:12.5, fontWeight:700, background:"rgba(255,255,255,0.04)",
                color:C.textMuted, border:`1px solid ${C.border}`, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(79,142,247,0.1)"; e.currentTarget.style.color=C.accent; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color=C.textMuted; }}>
                {icon} {label}
              </button>
            ))}
            <Btn size="sm" style={{ marginLeft:"auto" }} onClick={()=>showToast("Post shared 🚀")}>Post</Btn>
          </div>
        </Glass>
      )}

      <div style={{ display:"flex", gap:4, marginBottom:14, padding:4, background:"rgba(255,255,255,0.03)", borderRadius:14, border:`1px solid ${C.border}` }}>
        {[["all","✦ All"],["colleges","🏛 Colleges"],["students","🎓 Students"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            flex:1, padding:"8px 14px", borderRadius:10, fontSize:13, fontWeight:700,
            border:"none", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
            background:tab===k?"rgba(79,142,247,0.15)":"none",
            color:tab===k?C.accent:C.textMuted,
            boxShadow:tab===k?"inset 0 0 0 1px rgba(79,142,247,0.25)":"none",
          }}>{l}</button>
        ))}
      </div>

      {filtered.map((p,i)=>(
        <div key={p.id} style={{ animation:`fadeUp 0.4s ${i*0.06}s ease both`, opacity:0 }}>
          <PostCard post={p} showToast={showToast}/>
        </div>
      ))}

      <Glass style={{ padding:16, marginBottom:10, borderRadius:18 }}>
        <div style={{ fontSize:9, color:C.textFaint, fontWeight:700, letterSpacing:"0.5px", marginBottom:10 }}>SPONSORED</div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#f59e0b,#f97316)", display:"grid", placeItems:"center", fontSize:24, flexShrink:0 }}>🎓</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:3 }}>Crack Your Campus Interviews</div>
            <div style={{ fontSize:12.5, color:C.textMuted, lineHeight:1.5 }}>500+ companies recruit from CampusHub profiles.</div>
          </div>
          <Btn variant="outline" size="sm">Learn More</Btn>
        </div>
      </Glass>

      {!user && (
        <Glass style={{ padding:28, marginTop:8, textAlign:"center", background:"linear-gradient(135deg,rgba(79,142,247,0.08),rgba(124,58,237,0.08))", borderColor:"rgba(79,142,247,0.2)" }}>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:22, color:"#fff", marginBottom:8 }}>Join the conversation</div>
          <p style={{ color:C.textMuted, fontSize:14, marginBottom:20 }}>4,800+ students sharing projects and achievements</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Btn onClick={()=>setPage("auth")}>Join Free →</Btn>
            <Btn variant="outline">Sign In</Btn>
          </div>
        </Glass>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// PROJECTS PAGE
// ══════════════════════════════════════════════
function ProjectsPage({ showToast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = PROJECTS.filter(p=>{
    const m = p.title.toLowerCase().includes(search.toLowerCase())||p.author.toLowerCase().includes(search.toLowerCase());
    const f = filter==="All"||p.dept===filter||p.college===filter;
    return m&&f;
  });
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, color:"#fff", marginBottom:4 }}>Projects</div>
        <div style={{ fontSize:14, color:C.textMuted }}>Discover what students are building</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:100, padding:"9px 16px", marginBottom:14, maxWidth:360 }}>
        <span style={{ opacity:.4 }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects..."
          style={{ background:"none", border:"none", outline:"none", flex:1, fontSize:13.5, color:"#fff", fontFamily:"inherit" }}/>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {["All","CSE","ECE","AI/ML","IT","VIT","CU","SRM"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"5px 14px", borderRadius:100, fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
            background:filter===f?C.grad:"rgba(255,255,255,0.04)",
            color:filter===f?"#fff":C.textMuted,
            border:filter===f?"none":`1px solid ${C.border}`,
            boxShadow:filter===f?"0 4px 14px rgba(79,142,247,0.3)":"none",
          }}>{f}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:14 }}>
        {filtered.map((p,i)=>(
          <Glass key={p.id} hover onClick={()=>showToast(`Opening ${p.title}...`)}
            style={{ borderRadius:16, animation:`fadeUp 0.4s ${i*0.05}s ease both`, opacity:0 }}>
            <div style={{ height:140, background:p.grad, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, position:"relative" }}>
              {p.emoji}
              <div style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,0.55)", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:100, backdropFilter:"blur(4px)" }}>👁 {p.views.toLocaleString()}</div>
              <div style={{ position:"absolute", top:8, right:8 }}><Chip color={p.status==="approved"?"green":"amber"} small>{p.status}</Chip></div>
            </div>
            <div style={{ padding:14 }}>
              <div style={{ display:"flex", gap:5, marginBottom:8, flexWrap:"wrap" }}>
                <Chip color="blue" small>{p.dept}</Chip>
                <Chip color="gray" small>{p.college}</Chip>
              </div>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:14, color:"#fff", marginBottom:4 }}>{p.title}</div>
              <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.5, marginBottom:8, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.desc}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                {p.tags.map(t=><span key={t} style={{ fontSize:10.5, fontWeight:700, padding:"2px 8px", borderRadius:6, background:"rgba(255,255,255,0.04)", color:C.textMuted, border:`1px solid ${C.border}` }}>{t}</span>)}
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Av name={p.author} size={20}/>
                  <span style={{ fontSize:11, color:C.textFaint }}>{p.author.split(" ")[0]}</span>
                </div>
                <span style={{ fontSize:11, color:C.textFaint }}>❤️ {p.likes}</span>
              </div>
            </div>
          </Glass>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// EVENTS PAGE
// ══════════════════════════════════════════════
function EventsPage({ showToast }) {
  const [reg, setReg] = useState({});
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, color:"#fff", marginBottom:4 }}>Events</div>
        <div style={{ fontSize:14, color:C.textMuted }}>Hackathons, workshops & fests</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:20 }}>
        {[["4","Total Events"],["3","This Month"],[Object.values(reg).filter(Boolean).length,"Registered"],[EVENTS.reduce((s,e)=>s+e.participants,0),"Participants"]].map(([v,l])=>(
          <FloatCard key={l} style={{ padding:"16px 18px" }}>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:26, letterSpacing:-1, color:"#fff", marginBottom:4 }}>{v}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{l}</div>
          </FloatCard>
        ))}
      </div>
      {EVENTS.map((e,i)=>(
        <Glass key={e.id} style={{ marginBottom:10, borderRadius:18, animation:`fadeUp 0.4s ${i*0.08}s ease both`, opacity:0 }}>
          <div style={{ background:e.color, padding:"18px 20px", display:"flex", alignItems:"center", gap:16 }}>
            <div>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:42, lineHeight:1, color:"#fff" }}>{e.day}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:700 }}>{e.month}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:7, marginBottom:6, flexWrap:"wrap" }}>
                <Chip color="gray">{e.college}</Chip>
                <Chip color="gray">{e.tag}</Chip>
                {e.prize&&<Chip color="hot">🏆 {e.prize}</Chip>}
              </div>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:18, color:"#fff", letterSpacing:-0.3 }}>{e.title}</div>
            </div>
            <Btn variant={reg[e.id]?"success":"glass"}
              onClick={()=>{ setReg(p=>({...p,[e.id]:!p[e.id]})); showToast(reg[e.id]?"Cancelled":"Registered for "+e.title+" 🎟"); }}>
              {reg[e.id]?"✓ Registered":"Register →"}
            </Btn>
          </div>
          <div style={{ padding:"14px 20px" }}>
            <p style={{ fontSize:13.5, color:C.textMuted, marginBottom:10, lineHeight:1.6 }}>{e.desc}</p>
            <div style={{ display:"flex", gap:16, fontSize:12.5, color:C.textFaint, marginBottom:10, flexWrap:"wrap" }}>
              <span>📍 {e.loc||"Campus"}</span>
              <span>👥 {e.participants}/{e.max}</span>
              {e.prize&&<span>🏆 {e.prize}</span>}
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(e.participants/e.max)*100}%`, background:e.color, borderRadius:100 }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.textFaint, marginTop:6 }}>
              <span>{e.participants} registered</span><span>{e.max-e.participants} spots left</span>
            </div>
          </div>
        </Glass>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
// LEADERBOARD PAGE  
// ══════════════════════════════════════════════
function LeaderboardPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter==="All"?LEADERS:LEADERS.filter(l=>l.college===filter);
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, color:"#fff", marginBottom:4 }}>Elite Board.</div>
        <div style={{ fontSize:14, color:C.textMuted }}>Top students by contributions & impact · Week 12</div>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {["All",...COLLEGES.map(c=>c.short)].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"5px 14px", borderRadius:100, fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
            background:filter===f?C.grad:"rgba(255,255,255,0.04)",
            color:filter===f?"#fff":C.textMuted,
            border:filter===f?"none":`1px solid ${C.border}`,
          }}>{f}</button>
        ))}
      </div>

      {filter==="All" && (
        <Glass style={{ padding:24, marginBottom:16, background:"linear-gradient(135deg,rgba(79,142,247,0.08),rgba(124,58,237,0.08))", borderColor:"rgba(79,142,247,0.15)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr 1fr", gap:10, alignItems:"flex-end" }}>
            {[LEADERS[1],LEADERS[0],LEADERS[2]].map((l,i)=>{
              const rank=i===1?1:i===0?2:3;
              const h=i===1?110:i===0?85:70;
              return (
                <div key={l.rank} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  {i===1&&<div style={{ fontSize:22 }}>👑</div>}
                  <Av name={l.name} size={i===1?62:50} color={l.color} verified={i===1}/>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff", textAlign:"center" }}>{l.name.split(" ")[0]}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{l.college}</div>
                  <div style={{ width:"100%", height:h, borderRadius:"8px 8px 0 0", background:"rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:8 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:C.grad, display:"grid", placeItems:"center", fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:13, color:"#fff" }}>{rank}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Glass>
      )}

      <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:700, fontSize:13, color:"rgba(255,255,255,0.3)", letterSpacing:"0.5px", marginBottom:10, paddingLeft:4 }}>FULL STANDINGS</div>
      {filtered.map((l,i)=>(
        <FloatCard key={l.rank} style={{ display:"flex", alignItems:"center", gap:12, padding:14, marginBottom:8, animation:`fadeUp 0.3s ${i*0.06}s ease both`, opacity:0 }}>
          <div style={{ width:30, height:30, borderRadius:9, background:"rgba(255,255,255,0.05)", display:"grid", placeItems:"center", fontSize:14, fontWeight:800, flexShrink:0 }}>
            {l.rank<=3?["🥇","🥈","🥉"][l.rank-1]:<span style={{color:C.textFaint,fontSize:13}}>{l.rank}</span>}
          </div>
          <Av name={l.name} size={42} color={l.color}/>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#fff" }}>{l.name}</div>
            <div style={{ fontSize:12, color:C.textFaint }}>{l.college} · {l.dept}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:110, height:4, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(l.score/9840)*100}%`, background:`linear-gradient(90deg,${l.color},${l.color}88)`, borderRadius:100 }}/>
            </div>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:14, background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", minWidth:50, textAlign:"right" }}>
              {l.score.toLocaleString()}
            </div>
          </div>
        </FloatCard>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
// REELS PAGE — Stitch-inspired grid
// ══════════════════════════════════════════════
function ReelsPage({ showToast }) {
  const [filter, setFilter] = useState("All");
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, color:"#fff", marginBottom:4 }}>Campus Reels</div>
        <div style={{ fontSize:14, color:C.textMuted }}>The most viral moments from across India&apos;s top campuses</div>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {["All","VIT","CU","SRM","MIT-WPU"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"5px 14px", borderRadius:100, fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
            background:filter===f?C.grad:"rgba(255,255,255,0.04)",
            color:filter===f?"#fff":C.textMuted,
            border:filter===f?"none":`1px solid ${C.border}`,
          }}>{f}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:10 }}>
        {REELS.map((r,i)=>(
          <div key={r.id} onClick={()=>showToast("Playing: "+r.title)}
            style={{ aspectRatio:"9/16", borderRadius:16, overflow:"hidden", position:"relative", cursor:"pointer", background:r.grad, transition:"transform 0.2s, box-shadow 0.2s", animation:`fadeUp 0.4s ${i*0.05}s ease both`, opacity:0 }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.5)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:.12, fontSize:52 }}>{r.emoji}</div>
            <div style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100, backdropFilter:"blur(4px)" }}>{r.dur}</div>
            <div style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100, display:"flex", alignItems:"center", gap:3 }}>👁 {r.views}</div>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.92)", display:"grid", placeItems:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.3)", fontSize:16 }}>▶</div>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 10px 12px", background:"linear-gradient(transparent,rgba(0,0,0,0.9))" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:3 }}>{r.title}</div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:5 }}>
                <Av name={r.author} size={16}/>
                {r.author}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// COLLEGES PAGE — Stitch "Elite Institutions" style
// ══════════════════════════════════════════════
function CollegesPage({ showToast }) {
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:28, letterSpacing:-1, color:"#fff", marginBottom:4 }}>Elite Institutions</div>
        <div style={{ fontSize:14, color:C.textMuted }}>Discover and connect with India&apos;s top campuses</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:100, padding:"9px 16px", marginBottom:16, maxWidth:340 }}>
        <span style={{ opacity:.4 }}>🔍</span>
        <input placeholder="Search by city or name..." style={{ background:"none", border:"none", outline:"none", flex:1, fontSize:13.5, color:"#fff", fontFamily:"inherit" }}/>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {["ALL CAMPUS","TECHNOLOGY","DESIGN","BUSINESS"].map(f=>(
          <button key={f} onClick={()=>{}} style={{
            padding:"5px 14px", borderRadius:100, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            background:f==="ALL CAMPUS"?C.grad:"rgba(255,255,255,0.04)",
            color:f==="ALL CAMPUS"?"#fff":C.textMuted,
            border:f==="ALL CAMPUS"?"none":`1px solid ${C.border}`,
            letterSpacing:"0.5px",
          }}>{f}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
        {COLLEGES.map((c,i)=>(
          <Glass key={c.id} hover onClick={()=>showToast("Opening "+c.name)} style={{ borderRadius:16, animation:`fadeUp 0.4s ${i*0.08}s ease both`, opacity:0 }}>
            <div style={{ height:110, background:c.grad, position:"relative", backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 8px)" }}>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.12, fontSize:72, fontWeight:900, color:"#fff", fontFamily:"'Cabinet Grotesk',sans-serif", letterSpacing:-4 }}>
                {c.short}
              </div>
              <div style={{ position:"absolute", top:10, right:10, width:34, height:34, borderRadius:9, background:"rgba(12,12,20,0.9)", border:`2px solid ${c.color}40`, display:"grid", placeItems:"center", fontSize:18 }}>{c.emoji}</div>
            </div>
            <div style={{ padding:"14px 16px" }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:14, color:"#fff", marginBottom:2 }}>{c.name}</div>
              <div style={{ fontSize:11, color:C.textFaint, marginBottom:12, display:"flex", alignItems:"center", gap:3 }}>📍 {c.city}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                {[[c.students.toLocaleString(),"STUDENTS"],[c.projects,"PROJECTS"],[c.events,"EVENTS"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:14, color:"#fff" }}>{v}</div>
                    <div style={{ fontSize:9, color:C.textFaint, fontWeight:700, letterSpacing:"0.5px" }}>{l}</div>
                  </div>
                ))}
              </div>
              <Btn variant="outline" size="sm" style={{ width:"100%", justifyContent:"center" }}>Explore Campus →</Btn>
            </div>
          </Glass>
        ))}
        {/* Join the Map card */}
        <div style={{ borderRadius:16, border:`1px dashed ${C.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, padding:24, minHeight:200, cursor:"pointer" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(79,142,247,0.4)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.05)", display:"grid", placeItems:"center", fontSize:20 }}>+</div>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:14, color:"#fff", textAlign:"center" }}>Join the Map</div>
          <div style={{ fontSize:12, color:C.textMuted, textAlign:"center", lineHeight:1.5 }}>Is your campus missing? Submit a request.</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════════════
function ProfilePage({ user, showToast }) {
  const [tab, setTab] = useState("projects");
  const [editOpen, setEditOpen] = useState(false);
  const name = user?.name||"Priya Sharma";
  const skills = ["React","Node.js","Python","ML","TailwindCSS","PostgreSQL","ARCore","Figma"];

  return (
    <div>
      <div style={{ position:"relative", height:190, borderRadius:"18px 18px 0 0", overflow:"hidden", background:"linear-gradient(135deg,#1e3a5f,#2d1b69)", backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 10px)" }}>
        <div style={{ position:"absolute", top:14, right:14, display:"flex", gap:8 }}>
          <Btn variant="glass" size="sm" onClick={()=>showToast("Following!")}>Follow</Btn>
          <Btn variant="glass" size="sm" onClick={()=>showToast("Opening chat...")}>Message</Btn>
          <Btn variant="glass" size="sm" onClick={()=>setEditOpen(true)}>✏ Edit</Btn>
        </div>
        <div style={{ position:"absolute", bottom:-36, left:20 }}>
          <Av name={name} size={94} color="#4f8ef7" verified/>
        </div>
      </div>

      <FloatCard style={{ borderRadius:"0 0 18px 18px", padding:"46px 20px 22px", marginBottom:14 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:22, letterSpacing:-0.5, color:"#fff", marginBottom:8 }}>{name}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
          <Chip color="gray">🏛 VIT College</Chip>
          <Chip color="green">✓ Verified</Chip>
          <Chip color="blue">CSE · 3rd Year</Chip>
          <Chip color="amber">🏆 Rank #3</Chip>
        </div>
        <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.7, marginBottom:16 }}>
          Passionate CSE student building the future with code. 4 projects live · Open to internships · Love AR/ML 🚀
        </p>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", padding:"14px 0", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
          {[["4","Projects"],["1.2K","Views"],["156","Likes"],["89","Followers"],["34","Following"],["#3","Rank"],["8.2K","Score"]].map(([v,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff" }}>{v}</div>
              <div style={{ fontSize:11, color:C.textFaint }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"1px", marginBottom:8, textTransform:"uppercase" }}>Skill Arsenal</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {skills.map(s=>(
              <span key={s} style={{ padding:"4px 11px", borderRadius:8, fontSize:12, fontWeight:700, background:"rgba(255,255,255,0.05)", color:C.textMuted, border:`1px solid ${C.border}`, transition:"all 0.15s", cursor:"default" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(79,142,247,0.1)"; e.currentTarget.style.color=C.accent; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color=C.textMuted; }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"1px", marginBottom:8, textTransform:"uppercase" }}>Contribution Activity</div>
          <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
            {Array(52*7).fill(0).map((_,i)=>{
              const lvl = [0,0,1,2,1,0,3,1,2,4,3][i%11];
              const cols = ["rgba(255,255,255,0.04)","rgba(79,142,247,0.2)","rgba(79,142,247,0.4)","rgba(79,142,247,0.65)","rgba(79,142,247,0.9)"];
              return <div key={i} style={{ width:11, height:11, borderRadius:2, background:cols[lvl] }}/>;
            })}
          </div>
        </div>
      </FloatCard>

      <div style={{ display:"flex", gap:4, marginBottom:14, padding:4, background:"rgba(255,255,255,0.03)", borderRadius:14, border:`1px solid ${C.border}` }}>
        {["projects","events","saved","about"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1, padding:"8px 12px", borderRadius:10, fontSize:13, fontWeight:700,
            border:"none", cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize", transition:"all 0.15s",
            background:tab===t?"rgba(79,142,247,0.15)":"none",
            color:tab===t?C.accent:C.textMuted,
          }}>{t}</button>
        ))}
      </div>

      {tab==="about" && (
        <FloatCard style={{ padding:18 }}>
          {[["📧","Email","priya@vit.ac.in"],["🐙","GitHub","github.com/priyasharma"],["💼","LinkedIn","linkedin.com/in/priya"],["🏫","College","VIT College of Engineering"],["📅","Joined","September 2022"]].map(([icon,label,val])=>(
            <div key={label} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <div>
                <div style={{ fontSize:11, color:C.textFaint, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", marginTop:1 }}>{val}</div>
              </div>
            </div>
          ))}
        </FloatCard>
      )}

      {editOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:800, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <FloatCard style={{ width:"100%", maxWidth:480, padding:28, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:18, color:"#fff" }}>Edit Profile</div>
              <button onClick={()=>setEditOpen(false)} style={{ width:32, height:32, borderRadius:"50%", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.06)", color:C.textMuted, cursor:"pointer", fontSize:14, display:"grid", placeItems:"center" }}>✕</button>
            </div>
            <Input label="Display Name" placeholder="Your name" value="" onChange={()=>{}}/>
            <Input label="Bio" placeholder="Tell the campus about yourself..." value="" onChange={()=>{}} multiline/>
            <Input label="GitHub URL" placeholder="github.com/username" value="" onChange={()=>{}}/>
            <Input label="LinkedIn URL" placeholder="linkedin.com/in/username" value="" onChange={()=>{}}/>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
              <Btn variant="outline" onClick={()=>setEditOpen(false)}>Cancel</Btn>
              <Btn onClick={()=>{ setEditOpen(false); showToast("Profile updated ✓"); }}>Save Changes</Btn>
            </div>
          </FloatCard>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// CHAT PAGE — Completely rebuilt, fully working
// ══════════════════════════════════════════════
function ChatPage({ showToast }) {
  const [contacts, setContacts] = useState(CHAT_CONTACTS);
  const [activeId, setActiveId] = useState(1);
  const [inputMsg, setInputMsg] = useState("");
  const [search, setSearch] = useState("");
  const [, setShowMobileList] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeContact = contacts.find(c=>c.id===activeId);

  // Auto scroll to bottom when messages change
  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  },[activeId, activeContact?.messages?.length]);

  // Mark as read when opening chat
  const openChat = (id) => {
    setActiveId(id);
    setContacts(prev=>prev.map(c=>c.id===id?{...c,unread:0}:c));
    setShowMobileList(false);
  };

  const sendMsg = () => {
    const text = inputMsg.trim();
    if(!text) return;
    const newMsg = { id:Date.now(), text, mine:true, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}), seen:false };
    setContacts(prev=>prev.map(c=>c.id===activeId
      ? { ...c, messages:[...c.messages, newMsg], last:text }
      : c
    ));
    setInputMsg("");
    // Auto reply
    setTimeout(()=>{
      const replies = ["Sounds great! 👍","That's awesome!","Let me check and get back to you","Haha yes! 😂","Totally agree 🙌","Can we talk more about this?","Sure, I'll be there!"];
      const reply = { id:Date.now()+1, text:replies[Math.floor(Math.random()*replies.length)], mine:false, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) };
      setContacts(prev=>prev.map(c=>c.id===activeId
        ? { ...c, messages:[...c.messages, reply], last:reply.text }
        : c
      ));
    }, 1000+Math.random()*1000);
  };

  const handleKeyDown = (e) => {
    if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMsg(); }
  };

  const filteredContacts = contacts.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.college.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = contacts.reduce((s,c)=>s+c.unread,0);

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, color:"#fff" }}>Messages</div>
          {totalUnread>0&&<div style={{ fontSize:13, color:C.accent, marginTop:2 }}>{totalUnread} unread message{totalUnread!==1?"s":""}</div>}
        </div>
        <Btn variant="outline" size="sm" onClick={()=>showToast("New conversation started")}>+ New Chat</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", height:"calc(100vh - 160px)", minHeight:500, background:"rgba(12,12,20,0.6)", border:`1px solid ${C.border}`, borderRadius:18, overflow:"hidden" }}>

        {/* ─── CONTACT LIST ─── */}
        <div style={{ borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Search */}
          <div style={{ padding:"12px 12px 8px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:100, padding:"7px 12px" }}>
              <span style={{ opacity:.4, fontSize:13 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts..."
                style={{ background:"none", border:"none", outline:"none", fontSize:13, color:"#fff", fontFamily:"inherit", flex:1 }}/>
              {search&&<button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:C.textFaint, fontSize:12 }}>✕</button>}
            </div>
          </div>

          {/* Contact items */}
          <div style={{ overflowY:"auto", flex:1 }}>
            {filteredContacts.length===0 ? (
              <div style={{ textAlign:"center", padding:"32px 16px", color:C.textFaint, fontSize:13 }}>No contacts found</div>
            ) : filteredContacts.map(c=>(
              <div key={c.id} onClick={()=>openChat(c.id)}
                style={{
                  display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                  cursor:"pointer", transition:"background 0.15s",
                  background:activeId===c.id?"rgba(79,142,247,0.09)":"transparent",
                  borderLeft:`2px solid ${activeId===c.id?C.accent:"transparent"}`,
                  position:"relative",
                }}
                onMouseEnter={e=>{ if(activeId!==c.id) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
                onMouseLeave={e=>{ if(activeId!==c.id) e.currentTarget.style.background="transparent"; }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <Av name={c.name} size={42} color={c.color}/>
                  {c.online&&<div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:C.online, border:`2px solid ${C.bg}` }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                    <div style={{ fontSize:13.5, fontWeight:c.unread>0?800:700, color:"#fff" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:C.textFaint, flexShrink:0, marginLeft:6 }}>{c.time}</div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:6 }}>
                    <div style={{ fontSize:12, color:c.unread>0?"rgba(255,255,255,0.6)":C.textFaint, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{c.last}</div>
                    {c.unread>0&&<div style={{ background:C.grad, color:"#fff", fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:100, flexShrink:0 }}>{c.unread}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── MAIN CHAT AREA ─── */}
        {activeContact ? (
          <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {/* Chat header */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0, background:"rgba(255,255,255,0.02)" }}>
              <div style={{ position:"relative" }}>
                <Av name={activeContact.name} size={40} color={activeContact.color}/>
                {activeContact.online&&<div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:C.online, border:`2px solid ${C.bg}` }}/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14.5, color:"#fff" }}>{activeContact.name}</div>
                <div style={{ fontSize:11.5, color:activeContact.online?C.online:C.textFaint, display:"flex", alignItems:"center", gap:4 }}>
                  {activeContact.online
                    ? <><span style={{ width:6, height:6, borderRadius:"50%", background:C.online, display:"inline-block" }}/> Online · {activeContact.college}</>
                    : `Last seen recently · ${activeContact.college}`}
                </div>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {[["📞","call"],["📹","video"]].map(([icon,action])=>(
                  <button key={action} onClick={()=>showToast(`Starting ${action} with ${activeContact.name}...`)}
                    style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.05)", cursor:"pointer", display:"grid", placeItems:"center", fontSize:15, transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="rgba(79,142,247,0.12)"; e.currentTarget.style.borderColor=C.accent; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor=C.border; }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
              {activeContact.messages.map((m,idx)=>{
                const showAvatar = !m.mine && (idx===0 || activeContact.messages[idx-1]?.mine);
                return (
                  <div key={m.id} style={{ display:"flex", flexDirection:"column", maxWidth:"72%", alignSelf:m.mine?"flex-end":"flex-start", alignItems:m.mine?"flex-end":"flex-start" }}>
                    {showAvatar && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <Av name={activeContact.name} size={20} color={activeContact.color}/>
                        <span style={{ fontSize:11, color:C.textFaint, fontWeight:600 }}>{activeContact.name.split(" ")[0]}</span>
                      </div>
                    )}
                    <div style={{
                      padding:"10px 15px", fontSize:14, lineHeight:1.55, wordBreak:"break-word",
                      borderRadius:m.mine?"18px 18px 5px 18px":"18px 18px 18px 5px",
                      background:m.mine?C.grad:"rgba(255,255,255,0.08)",
                      color:"#fff",
                      boxShadow:m.mine?"0 4px 14px rgba(79,142,247,0.25)":"none",
                    }}>{m.text}</div>
                    <div style={{ fontSize:10.5, color:C.textFaint, marginTop:4, padding:"0 4px", display:"flex", alignItems:"center", gap:4 }}>
                      {m.time}
                      {m.mine&&<span style={{ color:m.seen?"#4f8ef7":"rgba(255,255,255,0.25)" }}>{m.seen?"✓✓":"✓"}</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef}/>
            </div>

            {/* Input bar */}
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, alignItems:"flex-end", flexShrink:0, background:"rgba(255,255,255,0.01)" }}>
              <button onClick={()=>showToast("Attachment coming soon")}
                style={{ width:36, height:36, borderRadius:10, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.04)", cursor:"pointer", display:"grid", placeItems:"center", fontSize:16, flexShrink:0, transition:"all 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
                📎
              </button>
              <button onClick={()=>showToast("Emoji picker coming soon")}
                style={{ width:36, height:36, borderRadius:10, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.04)", cursor:"pointer", display:"grid", placeItems:"center", fontSize:16, flexShrink:0, transition:"all 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
                😊
              </button>
              <textarea ref={textareaRef}
                value={inputMsg} onChange={e=>setInputMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${activeContact.name.split(" ")[0]}...`}
                rows={1}
                style={{
                  flex:1, background:"rgba(255,255,255,0.05)", border:`1.5px solid ${C.border}`,
                  borderRadius:14, padding:"10px 14px", fontSize:14, color:"#fff",
                  resize:"none", lineHeight:1.5, outline:"none", fontFamily:"inherit",
                  maxHeight:120, overflowY:"auto", transition:"border-color 0.2s",
                }}
                onFocus={e=>e.target.style.borderColor="rgba(79,142,247,0.4)"}
                onBlur={e=>e.target.style.borderColor=C.border}/>
              <button onClick={sendMsg} disabled={!inputMsg.trim()}
                style={{
                  width:40, height:40, borderRadius:"50%", border:"none", cursor:inputMsg.trim()?"pointer":"not-allowed",
                  background:inputMsg.trim()?C.grad:"rgba(255,255,255,0.08)",
                  display:"grid", placeItems:"center",
                  boxShadow:inputMsg.trim()?"0 4px 14px rgba(79,142,247,0.35)":"none",
                  flexShrink:0, transition:"all 0.2s", fontSize:16,
                }}>
                ↑
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:C.textFaint }}>
            <div style={{ fontSize:48 }}>💬</div>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:18, color:"#fff" }}>Your Messages</div>
            <div style={{ fontSize:14, textAlign:"center" }}>Select a conversation to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════
function SettingsPage({ showToast }) {
  const [section, setSection] = useState("appearance");
  const [notifs, setNotifs] = useState({ likes:true, comments:true, events:false, follows:true });
  const [privacy, setPrivacy] = useState({ publicProfile:true, showEmail:false, showActivity:true, stealthMode:false, recruiterAccess:true });
  const accents = ["#4f8ef7","#7c3aed","#dc2626","#16a34a","#f59e0b","#0891b2","#db2777","#111110"];
  const navItems = [
    {key:"appearance",icon:"🎨",label:"Appearance"},
    {key:"profile",icon:"👤",label:"Profile"},
    {key:"account",icon:"🔐",label:"Account & Security"},
    {key:"notifs",icon:"🔔",label:"Notifications"},
    {key:"privacy",icon:"🛡",label:"Privacy"},
    {key:"danger",icon:"⚠️",label:"Danger Zone"},
  ];

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:24, letterSpacing:-0.5, color:"#fff", marginBottom:2 }}>Settings</div>
        <div style={{ fontSize:13, color:C.textMuted }}>Manage your elite presence.</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:20 }}>
        <div>
          {navItems.map(item=>(
            <button key={item.key} onClick={()=>setSection(item.key)} style={{
              display:"flex", alignItems:"center", gap:9, padding:"10px 12px", borderRadius:11,
              width:"100%", fontSize:13.5, fontWeight:section===item.key?700:500, fontFamily:"inherit",
              color:section===item.key?"#fff":C.textMuted,
              background:section===item.key?"rgba(79,142,247,0.12)":"transparent",
              border:section===item.key?`1px solid rgba(79,142,247,0.2)`:"1px solid transparent",
              cursor:"pointer", textAlign:"left", transition:"all 0.15s", marginBottom:2,
            }}
            onMouseEnter={e=>{ if(section!==item.key){ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.7)"; }}}
            onMouseLeave={e=>{ if(section!==item.key){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; }}}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        <div>
          {section==="appearance" && (
            <FloatCard style={{ padding:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:18 }}>Appearance</div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"1px", marginBottom:10, textTransform:"uppercase" }}>Accent Color</div>
                <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                  {accents.map(c=>(
                    <div key={c} onClick={()=>showToast("Accent updated")} style={{ width:30, height:30, borderRadius:"50%", background:c, cursor:"pointer", border:"2px solid rgba(255,255,255,0.15)", transition:"transform 0.15s", boxShadow:`0 3px 10px ${c}60` }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.18)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                  ))}
                   <input type="color" onChange={() => showToast("Custom color set")} style={{ width:30, height:30, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.15)", cursor:"pointer", padding:2, background:"rgba(255,255,255,0.1)" }}/>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"1px", marginBottom:10, textTransform:"uppercase" }}>Wallpaper</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {[{n:"None",bg:"rgba(255,255,255,0.04)"},{n:"Aurora",bg:"linear-gradient(135deg,#667eea,#764ba2)"},{n:"Sunset",bg:"linear-gradient(135deg,#f093fb,#f5576c)"},{n:"Ocean",bg:"linear-gradient(135deg,#4facfe,#00f2fe)"},{n:"Forest",bg:"linear-gradient(135deg,#43e97b,#38f9d7)"},{n:"Night",bg:"linear-gradient(135deg,#0f2027,#2c5364)"}].map(w=>(
                    <div key={w.n} onClick={()=>showToast("Wallpaper: "+w.n)} style={{ aspectRatio:"16/9", borderRadius:10, background:w.bg, cursor:"pointer", border:"2px solid rgba(79,142,247,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", transition:"transform 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                      {w.n==="None"&&w.n}
                    </div>
                  ))}
                </div>
              </div>
            </FloatCard>
          )}

          {section==="notifs" && (
            <FloatCard style={{ padding:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:18 }}>Notifications</div>
              {[["likes","❤️","Likes","When someone likes your post"],["comments","💬","Comments","When someone comments"],["events","🎟","Events","Upcoming event reminders"],["follows","👤","Follows","When someone follows you"]].map(([k,icon,l,d])=>(
                <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,0.04)", display:"grid", placeItems:"center", fontSize:16 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{l}</div>
                      <div style={{ fontSize:12, color:C.textFaint, marginTop:1 }}>{d}</div>
                    </div>
                  </div>
                  <Toggle checked={notifs[k]} onChange={v=>{ setNotifs(p=>({...p,[k]:v})); showToast(`${l} ${v?"enabled":"disabled"}`); }}/>
                </div>
              ))}
            </FloatCard>
          )}

          {section==="privacy" && (
            <FloatCard style={{ padding:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:4 }}>Privacy & Visibility</div>
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>Control how your data is shown to the campus community.</div>
              {[["stealthMode","👁","Stealth Mode","Don't show my online status to others"],["recruiterAccess","💼","Recruiter Access","Allow verified recruiters to view my full profile"],["publicProfile","🌐","Public Profile","Anyone can view your profile"]].map(([k,icon,l,d])=>(
                <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,0.04)", display:"grid", placeItems:"center", fontSize:16 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{l}</div>
                      <div style={{ fontSize:12, color:C.textFaint, marginTop:1 }}>{d}</div>
                    </div>
                  </div>
                  <Toggle checked={privacy[k]} onChange={v=>{ setPrivacy(p=>({...p,[k]:v})); showToast("Saved"); }}/>
                </div>
              ))}
              <Btn style={{ marginTop:14 }} onClick={()=>showToast("Changes saved ✓")}>Save Changes</Btn>
            </FloatCard>
          )}

          {section==="profile" && (
            <FloatCard style={{ padding:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:18 }}>Public Profile</div>
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:16 }}>This information will be visible to everyone on the network.</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", display:"block", marginBottom:6, textTransform:"uppercase" }}>DISPLAY NAME</label>
                  <input className="" style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} defaultValue="Priya Sharma"/>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", display:"block", marginBottom:6, textTransform:"uppercase" }}>PROFESSIONAL TITLE</label>
                  <input style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} defaultValue="Full Stack Developer & Student"/>
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", display:"block", marginBottom:6, textTransform:"uppercase" }}>BIO</label>
                <textarea rows={3} style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box", resize:"none", lineHeight:1.6 }} defaultValue="Passionate CSE student building the future with code."/>
              </div>
              <Btn onClick={()=>showToast("Profile saved ✓")}>Save Changes</Btn>
            </FloatCard>
          )}

          {section==="account" && (
            <FloatCard style={{ padding:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:18 }}>Account & Security</div>
              {[["📧","Email","priya@vit.ac.in","Change"],["🔒","Password","••••••••","Update"],["🔑","Google","Connected","Disconnect"]].map(([icon,l,v,a])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,0.04)", display:"grid", placeItems:"center", fontSize:16 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{l}</div>
                      <div style={{ fontSize:12, color:C.textFaint }}>{v}</div>
                    </div>
                  </div>
                  <Btn variant="outline" size="sm" onClick={()=>showToast(`${a}...`)}>{a}</Btn>
                </div>
              ))}
            </FloatCard>
          )}

          {section==="danger" && (
            <FloatCard style={{ padding:22 }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:18 }}>Danger Zone</div>
              <div style={{ background:"rgba(220,38,38,0.06)", border:"1px solid rgba(220,38,38,0.15)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#f87171", marginBottom:3 }}>Deactivate Account</div>
                  <div style={{ fontSize:12, color:C.textFaint }}>Temporarily disable your profile. You can reactivate at any time.</div>
                </div>
                <Btn variant="danger" size="sm" onClick={()=>showToast("Contact support to deactivate")}>Proceed to Deactivate</Btn>
              </div>
            </FloatCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// AUTH PAGE — Stitch-inspired split screen
// ══════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({ name:"", email:"", pass:"", college:"VIT" });
  const upd = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const handleSubmit = () => {
    if(!form.email||!form.pass) return;
    const name = tab==="signup"?(form.name||"New Student"):form.email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
    onLogin({ name, email:form.email, role:"student" });
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"calc(100vh - 60px)", margin:"-20px -24px" }}>
      <div style={{ padding:52, background:"linear-gradient(135deg,#080c14,#1a1060)", position:"relative", overflow:"hidden", display:"flex", alignItems:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 12px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"15%", right:"-8%", width:280, height:280, borderRadius:"50%", background:"rgba(79,142,247,0.07)", filter:"blur(60px)" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:12, color:C.accent, letterSpacing:"2px", textTransform:"uppercase", marginBottom:14 }}>CampusHub · Elite Student Network</div>
          <h1 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:"clamp(28px,3vw,42px)", letterSpacing:-1.5, lineHeight:1.05, color:"#fff", marginBottom:14, textTransform:"uppercase" }}>
            The Future of<br/>Campus Culture.
          </h1>
          <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.7, marginBottom:28, maxWidth:320 }}>The social platform built for Indian college students.</p>
          {[["🚀","Hyper-Local Growth","Connect across departments and foster cross-disciplinary innovation"],["🛡","Verified Network","Exclusive access for students with verified academic credentials"],["⭐","Elite Opportunities","Direct access to recruitment, exclusive events, and hackathons"]].map(([icon,title,desc])=>(
            <div key={title} style={{ display:"flex", gap:12, marginBottom:16, alignItems:"flex-start" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(79,142,247,0.12)", border:"1px solid rgba(79,142,247,0.2)", display:"grid", placeItems:"center", fontSize:16, flexShrink:0 }}>{icon}</div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#fff", marginBottom:2 }}>{title}</div>
                <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:20, marginTop:28 }}>
            {[["450k+","ACTIVE STUDENTS"],["120+","PARTNER COLLEGES"]].map(([v,l])=>(
              <div key={l} style={{ padding:"10px 16px", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:20, color:"#fff" }}>{v}</div>
                <div style={{ fontSize:9, color:C.textFaint, fontWeight:700, letterSpacing:"0.8px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:52, background:"rgba(8,8,12,0.95)" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ display:"flex", gap:0, marginBottom:28, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            {[["signin","SIGN IN"],["signup","JOIN FREE"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{
                padding:"12px 20px", fontSize:12, fontWeight:700, letterSpacing:"1px",
                border:"none", cursor:"pointer", fontFamily:"inherit",
                background:"transparent",
                color:tab===k?"#fff":C.textFaint,
                borderBottom:tab===k?`2px solid ${C.accent}`:"2px solid transparent",
                marginBottom:-1, transition:"all 0.15s",
              }}>{l}</button>
            ))}
          </div>

          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:22, color:"#fff", letterSpacing:-0.5, marginBottom:6 }}>
            {tab==="signin"?"Welcome Back":"Create Your Account"}
          </div>
          <div style={{ fontSize:13, color:C.textMuted, marginBottom:24 }}>
            {tab==="signin"?"Resume your journey in the elite student network.":"Join the future of campus culture."}
          </div>

          <button style={{ width:"100%", padding:12, borderRadius:10, background:"rgba(255,255,255,0.06)", color:"#fff", border:`1px solid ${C.border}`, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
          onClick={handleSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
            <span style={{ fontSize:11, color:C.textFaint, fontWeight:700, letterSpacing:"0.5px" }}>OR USE EMAIL</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
          </div>

          {tab==="signup" && (
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", display:"block", marginBottom:6, textTransform:"uppercase" }}>Full Name</label>
              <input placeholder="Priya Sharma" value={form.name} onChange={upd("name")} style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
            </div>
          )}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", display:"block", marginBottom:6, textTransform:"uppercase" }}>University Email</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.4 }}>@</span>
              <input type="email" placeholder="name@university.edu" value={form.email} onChange={upd("email")} style={{ width:"100%", padding:"10px 14px 10px 32px", background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
            </div>
          </div>
          <div style={{ marginBottom:tab==="signup"?12:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", textTransform:"uppercase" }}>Access Code</label>
              {tab==="signin"&&<button style={{ fontSize:12, color:C.accent, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Forgot Password?</button>}
            </div>
            <input type="password" placeholder="••••••••" value={form.pass} onChange={upd("pass")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          {tab==="signup" && (
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.textFaint, letterSpacing:"0.8px", display:"block", marginBottom:6, textTransform:"uppercase" }}>College</label>
              <select value={form.college} onChange={upd("college")} style={{ width:"100%", padding:"10px 14px", background:"rgba(8,8,12,0.9)", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}>
                {["VIT","MIT-WPU","Chandigarh University","SRM"].map(c=><option key={c} style={{background:"#0c0c14"}}>{c}</option>)}
              </select>
            </div>
          )}
          {tab==="signin"&&(
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <input type="checkbox" id="keepme" style={{ accentColor:C.accent }}/>
              <label htmlFor="keepme" style={{ fontSize:13, color:C.textMuted, cursor:"pointer" }}>Keep me signed in</label>
            </div>
          )}
          <button onClick={handleSubmit} style={{
            width:"100%", padding:12, borderRadius:10, border:"none", cursor:"pointer",
            background:C.grad, color:"#fff", fontSize:14, fontWeight:700,
            fontFamily:"inherit", boxShadow:"0 4px 18px rgba(79,142,247,0.35)", transition:"opacity 0.15s",
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            {tab==="signin"?"Sign In to CampusHub →":"Create Account →"}
          </button>
          <div style={{ fontSize:11, color:C.textFaint, textAlign:"center", marginTop:16, lineHeight:1.5 }}>
            By accessing CampusHub, you agree to our{" "}
            <span style={{ color:C.accent, cursor:"pointer" }}>Privacy Protocol</span> and{" "}
            <span style={{ color:C.accent, cursor:"pointer" }}>Community Bylaws</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerLoginPage({ onLogin }) {
  const [step, setStep] = useState(1);
  const [vals, setVals] = useState({ email:"", pass:"", q1:"", q2:"" });
  const upd = k => e => setVals(p=>({...p,[k]:e.target.value}));
  const next = () => {
    if(step===1&&vals.email&&vals.pass)setStep(2);
    else if(step===2&&vals.q1)setStep(3);
    else if(step===3&&vals.q2)onLogin({ name:"Platform Owner", role:"owner", email:vals.email });
  };
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 60px)", padding:20 }}>
      <FloatCard style={{ width:"100%", maxWidth:400, padding:34 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"rgba(79,142,247,0.12)", border:"1px solid rgba(79,142,247,0.2)", display:"grid", placeItems:"center", margin:"0 auto 14px", fontSize:22 }}>🔐</div>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:18, color:"#fff", marginBottom:2 }}>CampusHub</div>
          <div style={{ fontSize:12, color:C.textFaint, letterSpacing:"1px", textTransform:"uppercase" }}>Owner Access Terminal</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:28 }}>
          {[1,2,3].map(s=>(
            <div key={s} style={{ width:10, height:10, borderRadius:"50%", background:s<=step?C.grad:C.border, transition:"all 0.2s" }}/>
          ))}
        </div>
        {step===1&&<><Input label="Identity Tag" type="email" placeholder="Admin username or email" value={vals.email} onChange={upd("email")}/><Input label="Access Code" type="password" placeholder="••••••••" value={vals.pass} onChange={upd("pass")}/></>}
        {step===2&&<Input label="Security Question 1" placeholder="Name of your first project?" value={vals.q1} onChange={upd("q1")}/>}
        {step===3&&<Input label="Security Question 2" placeholder="City where CampusHub was founded?" value={vals.q2} onChange={upd("q2")}/>}
        <Btn onClick={next} style={{ width:"100%", justifyContent:"center", marginTop:8 }}>
          {step<3?"Verify Identity →":"Access Owner Panel →"}
        </Btn>
        <div style={{ background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:8, padding:"8px 12px", fontSize:11.5, color:"#f87171", marginTop:16, textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          ⚠ RESTRICTED AREA: UNAUTHORIZED ACCESS ATTEMPT LOGGED
        </div>
        <div style={{ textAlign:"center", marginTop:8, fontSize:11, color:C.textFaint }}>Forgot credentials? Contact system architect</div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, fontSize:10, color:C.textFaint }}>
          <span>◆ NODE ALPHA-01 ONLINE</span><span>V2.4.0-PRISM</span>
        </div>
      </FloatCard>
    </div>
  );
}

function Placeholder({ title, icon, subtitle }) {
  return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ width:72, height:72, borderRadius:20, background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.2)", display:"grid", placeItems:"center", margin:"0 auto 18px", fontSize:30 }}>{icon}</div>
      <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:22, color:"#fff", marginBottom:8, letterSpacing:-0.5 }}>{title}</div>
      <div style={{ fontSize:14, color:C.textMuted }}>{subtitle||"Full implementation in production build"}</div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MOBILE BOTTOM NAV
// ══════════════════════════════════════════════
function MobileNav({ page, setPage }) {
  const items = [
    {icon:"🏠",label:"Home",key:"home"},
    {icon:"🔍",label:"Explore",key:"explore"},
    {icon:"🔔",label:"Alerts",key:"notifications"},
    {icon:"👤",label:"Profile",key:"profile"},
  ];
  return (
    <div style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, zIndex:300, background:"rgba(8,8,12,0.97)", backdropFilter:"blur(24px)", borderTop:`1px solid ${C.border}`, height:64, alignItems:"center", justifyContent:"space-around", padding:"0 6px" }} className="mobile-nav-bar">
      {items.slice(0,2).map(item=>(
        <button key={item.key} onClick={()=>setPage(item.key)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontSize:10, fontWeight:700, color:page===item.key?C.accent:"rgba(255,255,255,0.3)", background:"none", border:"none", cursor:"pointer", padding:"6px 14px", borderRadius:10, fontFamily:"inherit" }}>
          <span style={{ fontSize:20 }}>{item.icon}</span>{item.label}
        </button>
      ))}
      <button onClick={()=>setPage("home")} style={{ width:50, height:50, borderRadius:"50%", border:"none", cursor:"pointer", background:C.grad, display:"grid", placeItems:"center", boxShadow:"0 4px 20px rgba(79,142,247,0.5)", transition:"transform 0.15s", fontSize:22, color:"#fff" }}
      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
      >+</button>
      {items.slice(2).map(item=>(
        <button key={item.key} onClick={()=>setPage(item.key)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontSize:10, fontWeight:700, color:page===item.key?C.accent:"rgba(255,255,255,0.3)", background:"none", border:"none", cursor:"pointer", padding:"6px 14px", borderRadius:10, fontFamily:"inherit" }}>
          <span style={{ fontSize:20 }}>{item.icon}</span>{item.label}
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════
export default function CampusHub() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const { toasts, show: showToast } = useToast();

  useEffect(() => {
    // We could check localStorage here to skip intro if already seen
    // const seen = localStorage.getItem("intro_seen");
    // if (seen) setShowIntro(false);
  }, []);

  const FULLWIDTH = ["auth","owner-login"];

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("home");
    showToast("Welcome " + userData.name.split(" ")[0] + "! 👋");
  };

  const renderPage = () => {
    switch(page) {
      case "home":          return <HomePage user={user} setPage={setPage} showToast={showToast}/>;
      case "projects":      return <ProjectsPage showToast={showToast}/>;
      case "events":        return <EventsPage showToast={showToast}/>;
      case "leaderboard":   return <LeaderboardPage/>;
      case "reels":         return <ReelsPage showToast={showToast}/>;
      case "colleges":      return <CollegesPage showToast={showToast}/>;
      case "profile":       return <ProfilePage user={user} showToast={showToast}/>;
      case "settings":      return <SettingsPage showToast={showToast}/>;
      case "chat":          return <ChatPage showToast={showToast}/>;
      case "auth":          return <AuthPage onLogin={handleLogin}/>;
      case "owner-login":   return <OwnerLoginPage onLogin={handleLogin}/>;
      case "explore":       return <Placeholder title="Explore" icon="🔍" subtitle="Discover trending content across all campuses"/>;
      case "notifications": return <Placeholder title="Notifications" icon="🔔" subtitle="Your activity and updates appear here"/>;
      case "saved":         return <Placeholder title="Saved" icon="📌" subtitle="Posts and projects you've saved"/>;
      case "complaints":    return <Placeholder title="Complaints" icon="📢" subtitle="Raise issues — we respond within 48 hours"/>;
      default:              return <HomePage user={user} setPage={setPage} showToast={showToast}/>;
    }
  };


  if (showIntro) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh" }}>
        <IntroVideo onClose={() => setShowIntro(false)} />
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9000, display: "flex", flexDirection: "column", gap: 8 }}>
          {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} />)}
        </div>
      </div>
    );
  }

  if (FULLWIDTH.includes(page)) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Satoshi',sans-serif" }}>
        <TopNav page={page} setPage={setPage} user={user} setUser={() => { setUser(null); setPage("home"); }} />
        <div style={{ paddingTop: 60 }}>{renderPage()}</div>
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9000, display: "flex", flexDirection: "column", gap: 8 }}>
          {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Satoshi',sans-serif" }}>
      <TopNav page={page} setPage={setPage} user={user} setUser={() => { setUser(null); setPage("home"); showToast("Signed out"); }} />
      <div style={{ display: "flex", paddingTop: 60, maxWidth: 1380, margin: "0 auto" }}>
        <div className="ls-hide"><Sidebar page={page} setPage={setPage} user={user} /></div>
        <main className="feed-pad" style={{ flex: 1, padding: "20px 16px", minHeight: "calc(100vh - 60px)", minWidth: 0, maxWidth: 740 }}>
          {renderPage()}
        </main>
        <div className="rs-hide"><RightSidebar setPage={setPage} user={user} /></div>
      </div>
      <MobileNav page={page} setPage={setPage} />
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9000, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} />)}
      </div>
    </div>
  );
}

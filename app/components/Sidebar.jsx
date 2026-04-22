"use client";
const SideItem = ({ item, page, setPage }) => {
  const isActive = page === item.key;
  return (
    <button
      onClick={() => setPage(item.key)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", borderRadius: 10, width: "100%",
        fontSize: 14, fontWeight: isActive ? 700 : 500,
        color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
        background: isActive
          ? "linear-gradient(135deg,rgba(79,142,247,0.15),rgba(124,58,237,0.1))"
          : "transparent",
        border: isActive ? "1px solid rgba(79,142,247,0.2)" : "1px solid transparent",
        cursor: "pointer", textAlign: "left",
        fontFamily: "inherit", transition: "all 0.15s",
        boxShadow: isActive ? "0 2px 8px rgba(79,142,247,0.1)" : "none",
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "rgba(255,255,255,0.75)";
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.45)";
        }
      }}
    >
      <span style={{
        fontSize: 16, width: 22, textAlign: "center",
        filter: isActive ? "none" : "grayscale(0.3)",
      }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          background: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
          color: "#fff", fontSize: 10, fontWeight: 800,
          padding: "2px 7px", borderRadius: 100,
          boxShadow: "0 2px 6px rgba(79,142,247,0.3)",
        }}>{item.badge}</span>
      )}
    </button>
  );
};

export default function Sidebar({ page, setPage, user }) {
  const discover = [
    { icon:"🏠", label:"Home",        key:"home" },
    { icon:"🔍", label:"Explore",     key:"explore" },
    { icon:"🏛",  label:"Colleges",   key:"colleges" },
    { icon:"🏆", label:"Leaderboard", key:"leaderboard" },
    { icon:"🎟", label:"Events",      key:"events" },
    { icon:"▶",  label:"Reels",       key:"reels" },
    { icon:"🚀", label:"Projects",    key:"projects" },
  ];

  const mySpace = [
    { icon:"👤", label:"Profile",       key:"profile",        badge:null },
    { icon:"💬", label:"Messages",      key:"chat",           badge:"3"  },
    { icon:"🔔", label:"Notifications", key:"notifications",  badge:"5"  },
    { icon:"📌", label:"Saved",         key:"saved",          badge:null },
    { icon:"📢", label:"Complaints",    key:"complaints",     badge:null },
    { icon:"⚙",  label:"Settings",     key:"settings",       badge:null },
  ];

  return (
    <aside style={{
      width: 248, flexShrink: 0,
      position: "sticky", top: 60,
      height: "calc(100vh - 60px)",
      overflowY: "auto", padding: "16px 10px",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(8,8,12,0.6)",
      scrollbarWidth: "none",
    }}>

      {/* Discover */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "1.5px",
          color: "rgba(255,255,255,0.2)", padding: "0 12px",
          marginBottom: 6, textTransform: "uppercase",
        }}>Discover</div>
        {discover.map(item => <SideItem key={item.key} item={item} page={page} setPage={setPage} />)}
      </div>

      {/* My Space */}
      {user && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "1.5px",
            color: "rgba(255,255,255,0.2)", padding: "0 12px",
            marginBottom: 6, textTransform: "uppercase",
          }}>My Space</div>
          {mySpace.map(item => <SideItem key={item.key} item={item} page={page} setPage={setPage} />)}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 12px 16px" }} />

      {/* Auth / Owner */}
      {!user ? (
        <div style={{
          margin: "0 4px",
          background: "linear-gradient(135deg,rgba(79,142,247,0.1),rgba(124,58,237,0.1))",
          border: "1px solid rgba(79,142,247,0.2)",
          borderRadius: 12, padding: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Join CampusHub</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
            4,800+ students already
          </div>
          <button onClick={() => setPage("auth")} style={{
            width: "100%", background: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
            border: "none", borderRadius: 8, padding: "8px",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(79,142,247,0.3)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Join Free →</button>
        </div>
      ) : (
        <button onClick={() => setPage("owner-login")} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 10, width: "100%",
          fontSize: 14, fontWeight: 500,
          color: "rgba(255,255,255,0.3)",
          background: "transparent", border: "1px solid transparent",
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>🔐</span>
          Owner Access
        </button>
      )}
    </aside>
  );
}

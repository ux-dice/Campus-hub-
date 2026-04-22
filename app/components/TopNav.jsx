"use client";
import { useState } from "react";

export default function TopNav({ setPage, user, setUser }) {
  const [search, setSearch] = useState("");

  return (
    <>
        
      <nav className="top-nav-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        height: 60, display: "flex", alignItems: "center",
        padding: "0 20px", gap: 12,
        background: "rgba(8,8,10,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>

        {/* Logo */}
        <div onClick={() => setPage("home")} style={{
          display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", userSelect: "none", flexShrink: 0,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
            boxShadow: "0 4px 12px rgba(79,142,247,0.3)",
          }}>●</div>
          <span style={{
            fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800,
            fontSize: 17, color: "#fff", letterSpacing: -0.5,
          }}>CampusHub</span>
        </div>

        {/* Search */}
        <div className="nav-search-wrap" style={{
          flex: 1, maxWidth: 380, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 100, padding: "8px 16px",
        }}>
          <span style={{ fontSize: 13, opacity: 0.4 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students, projects, events..."
            style={{
              background: "none", border: "none", outline: "none",
              flex: 1, fontSize: 13.5, color: "#fff",
              fontFamily: "inherit",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              cursor: "pointer", fontSize: 12, padding: 0,
            }}>✕</button>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
          {/* Live pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 100, padding: "5px 12px",
            fontSize: 12, fontWeight: 700, color: "rgba(34,197,94,0.9)",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 6px #22c55e",
              animation: "livePulse 2s infinite",
            }} />
            891 online
          </div>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 12, color: "#fff",
                cursor: "pointer", border: "2px solid rgba(79,142,247,0.3)",
                boxShadow: "0 2px 8px rgba(79,142,247,0.3)",
              }} onClick={() => setPage("profile")}>
                {user.name.split(" ").map(w => w[0]).join("").substring(0,2).toUpperCase()}
              </div>
              <button className="nav-btn" onClick={() => setUser(null)} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "6px 12px",
                color: "rgba(255,255,255,0.6)", fontSize: 12,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Sign out</button>
            </div>
          ) : (
            <>
              <button className="nav-btn" onClick={() => setPage("auth")} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "7px 14px",
                color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>Sign In</button>
              <button className="nav-btn" onClick={() => setPage("auth")} style={{
                background: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
                border: "none", borderRadius: 8, padding: "7px 14px",
                color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(79,142,247,0.3)",
              }}>Join Free</button>
            </>
          )}
        </div>
      </nav>

    </>
  );
}

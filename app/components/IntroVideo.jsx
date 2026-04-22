"use client";
import { useState, useEffect, useRef } from "react";

export default function IntroVideo({ onClose }) {
  const [canSkip, setCanSkip] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [closing, setClosing] = useState(false);
  const [showMiddleSkip, setShowMiddleSkip] = useState(false);
  const videoRef = useRef(null);
  const fallbackRef = useRef(null);

  // Smooth close with transition
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 800);
  };

  useEffect(() => {
    // Skip button top-right after 3s
    const skipTimer = setTimeout(() => setCanSkip(true), 3000);
    // Middle skip button after 10s
    const middleTimer = setTimeout(() => setShowMiddleSkip(true), 10000);
    // Countdown for top-right
    const countTimer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(countTimer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(middleTimer);
      clearInterval(countTimer);
    };
  }, []);

  // Sync mute with video
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleVideoError = () => {
    setHasVideo(false);
    fallbackRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(fallbackRef.current); handleClose(); return 100; }
        return p + 0.3;
      });
    }, 100);
  };

  useEffect(() => {
    return () => { if (fallbackRef.current) clearInterval(fallbackRef.current); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes introFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes introFadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.04); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.7); }
          70%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(79,142,247,0.6); }
          70%  { box-shadow: 0 0 0 14px rgba(79,142,247,0); }
          100% { box-shadow: 0 0 0 0 rgba(79,142,247,0); }
        }
        @keyframes progressGlow {
          0%,100% { box-shadow: 0 0 6px rgba(79,142,247,0.5); }
          50%     { box-shadow: 0 0 14px rgba(124,58,237,0.8); }
        }
        @keyframes floatOrb {
          0%   { transform: translateY(0px) scale(1); }
          50%  { transform: translateY(-30px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        .intro-wrap {
          animation: introFadeIn 0.6s ease both;
        }
        .intro-wrap.closing {
          animation: introFadeOut 0.8s ease both !important;
          pointer-events: none;
        }
        .intro-top-bar {
          animation: slideDown 0.7s 0.2s ease both;
          opacity: 0;
        }
        .intro-bottom-text {
          animation: slideUp 0.7s 0.5s ease both;
          opacity: 0;
        }
        .intro-middle-skip {
          animation: popIn 0.5s ease both;
        }
        .skip-btn-top:hover {
          background: rgba(255,255,255,0.25) !important;
          transform: scale(1.05);
        }
        .skip-btn-top:active {
          transform: scale(0.97);
        }
        .mute-btn:hover {
          background: rgba(255,255,255,0.2) !important;
          transform: scale(1.05);
        }
        .middle-skip-btn:hover {
          background: rgba(255,255,255,0.95) !important;
          color: #111 !important;
          transform: scale(1.04);
        }
      `}</style>

      <div
        className={`intro-wrap${closing ? " closing" : ""}`}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000",
          overflow: "hidden",
        }}
      >
        {/* ── REAL VIDEO ── */}
        {hasVideo && (
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            muted={muted}
            playsInline
            onEnded={handleClose}
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* ── FALLBACK (no video file) ── */}
        {!hasVideo && (
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, #1e3a5f 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, #2d1b69 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, #14532d 0%, transparent 50%), #050510",
          }}>
            {/* Floating orbs */}
            {[
              { top:"15%", left:"10%", size:280, color:"rgba(79,142,247,0.12)", dur:"7s" },
              { top:"55%", right:"12%", size:200, color:"rgba(124,58,237,0.1)", dur:"9s" },
              { bottom:"15%", left:"35%", size:160, color:"rgba(79,142,247,0.08)", dur:"6s" },
            ].map((o,i) => (
              <div key={i} style={{
                position:"absolute", borderRadius:"50%",
                width:o.size, height:o.size,
                background:o.color, filter:"blur(50px)",
                top:o.top, left:o.left, right:o.right, bottom:o.bottom,
                animation:`floatOrb ${o.dur} ease-in-out infinite`,
              }}/>
            ))}
            {/* Grid */}
            <div style={{
              position:"absolute", inset:0, opacity:0.04,
              backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize:"60px 60px",
            }}/>
            {/* Center content */}
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:80, filter:"drop-shadow(0 0 30px rgba(79,142,247,0.5))" }}>🎓</div>
              <div style={{ fontFamily:"sans-serif", fontWeight:800, fontSize:44, color:"#fff", letterSpacing:-2, textAlign:"center" }}>CampusHub</div>
              <div style={{ fontSize:16, color:"rgba(255,255,255,0.45)", textAlign:"center" }}>Your campus. All in one place.</div>
            </div>
          </div>
        )}

        {/* Cinematic gradient overlays */}
        <div style={{
          position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
          background:"linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.8) 100%)",
        }}/>
        {/* Left/right vignette */}
        <div style={{
          position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
          background:"radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}/>

        {/* ── TOP BAR ── */}
        <div className="intro-top-bar" style={{
          position:"absolute", top:0, left:0, right:0, zIndex:10,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 24px",
        }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:"linear-gradient(135deg,#4f8ef7,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, color:"#fff", fontWeight:800,
              boxShadow:"0 4px 16px rgba(79,142,247,0.4)",
            }}>●</div>
            <span style={{ fontFamily:"sans-serif", fontWeight:800, fontSize:19, color:"#fff", letterSpacing:-0.5, textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>CampusHub</span>
          </div>

          {/* Right controls: Mute + Skip */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Mute/Unmute button */}
            <button
              className="mute-btn"
              onClick={() => setMuted(m => !m)}
              style={{
                background:"rgba(0,0,0,0.45)",
                color:"#fff",
                border:"1px solid rgba(255,255,255,0.2)",
                borderRadius:100,
                padding:"7px 16px",
                fontSize:13, fontWeight:700,
                cursor:"pointer",
                backdropFilter:"blur(12px)",
                display:"flex", alignItems:"center", gap:6,
                transition:"all 0.2s",
              }}
            >
              {muted ? "🔇 Unmute" : "🔊 Mute"}
            </button>

            {/* Skip button */}
            {canSkip ? (
              <button
                className="skip-btn-top"
                onClick={handleClose}
                style={{
                  background:"rgba(255,255,255,0.15)",
                  color:"#fff",
                  border:"1px solid rgba(255,255,255,0.3)",
                  borderRadius:100,
                  padding:"7px 20px",
                  fontSize:13, fontWeight:700,
                  cursor:"pointer",
                  backdropFilter:"blur(12px)",
                  transition:"all 0.2s",
                  animation:"popIn 0.4s ease both",
                }}
              >Skip →</button>
            ) : (
              <div style={{
                background:"rgba(0,0,0,0.35)",
                color:"rgba(255,255,255,0.5)",
                border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:100,
                padding:"7px 20px",
                fontSize:13, fontWeight:700,
                backdropFilter:"blur(12px)",
              }}>
                Skip in {countdown}s
              </div>
            )}
          </div>
        </div>

        {/* ── MIDDLE SKIP (appears after 10s) ── */}
        {showMiddleSkip && (
          <div className="intro-middle-skip" style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            zIndex:10,
            display:"flex", flexDirection:"column", alignItems:"center", gap:14,
          }}>
            <button
              className="middle-skip-btn"
              onClick={handleClose}
              style={{
                background:"rgba(255,255,255,0.12)",
                color:"#fff",
                border:"2px solid rgba(255,255,255,0.5)",
                borderRadius:100,
                padding:"14px 36px",
                fontSize:16, fontWeight:800,
                cursor:"pointer",
                backdropFilter:"blur(20px)",
                letterSpacing:0.5,
                transition:"all 0.2s",
                animation:"pulseRing 2s infinite",
              }}
            >
              Skip Intro →
            </button>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", fontWeight:600 }}>Click to enter CampusHub</div>
          </div>
        )}

        {/* ── BOTTOM TEXT ── */}
        <div className="intro-bottom-text" style={{
          position:"absolute", bottom:50, left:40, right:40, zIndex:10,
          display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        }}>
          <div>
            <div style={{
              fontFamily:"sans-serif", fontWeight:800,
              fontSize:"clamp(18px,3vw,28px)",
              color:"#fff", letterSpacing:-0.5,
              textShadow:"0 2px 12px rgba(0,0,0,0.6)",
              marginBottom:6,
            }}>
              Your campus. All in one place.
            </div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", fontWeight:600 }}>
              4,800+ students · 4 colleges · 3,900+ projects
            </div>
          </div>
          <div style={{ display:"flex", gap:16, flexShrink:0, marginLeft:24 }}>
            {[["4.8K","Students"],["4","Colleges"],["208","Events"]].map(([v,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"sans-serif", fontWeight:800, fontSize:22, color:"#fff", letterSpacing:-0.5 }}>{v}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:3,
          background:"rgba(255,255,255,0.08)", zIndex:10,
        }}>
          <div style={{
            height:"100%",
            width:`${progress}%`,
            background:"linear-gradient(90deg,#4f8ef7,#7c3aed,#db2777)",
            backgroundSize:"200% 100%",
            transition:"width 0.15s linear",
            animation:"progressGlow 2s ease-in-out infinite",
          }}/>
        </div>

      </div>
    </>
  );
}

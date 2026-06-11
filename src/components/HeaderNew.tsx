"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Languages, Menu, X } from "lucide-react";

const translations = {
    TR: { nav: ["Yazılarım", "Projelerim", "Hakkımda"], site: "kişisel site" },
    EN: { nav: ["Writings", "Projects", "About"],     site: "personal site"  },
};

export default function HeaderNew() {
    const [active, setActive]   = useState(0);
    const [lang,   setLang]     = useState("TR");
    const [theme,  setTheme]    = useState("dark");
    const [mobile, setMobile]   = useState(false);
    const [menuOpen, setMenu]   = useState(false);

    const isDark = theme === "dark";
    const t      = translations[lang];

    useEffect(() => {
        const check = () => setMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ── design tokens ── */
    const glass = isDark
        ? "rgba(10, 10, 18, 0.82)"
        : "rgba(255, 255, 255, 0.82)";
    const border = isDark
        ? "1px solid rgba(255,255,255,0.07)"
        : "1px solid rgba(0,0,0,0.08)";
    const shadow = isDark
        ? "0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)"
        : "0 8px 48px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.95)";
    const textPrimary = isDark ? "#ffffff" : "#0a0a12";
    const textMuted   = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)";
    const accent      = "#7C3AED";
    const bg          = isDark ? "#08080f" : "#f2f2f6";

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${bg}; }

        .fh-root { 
          min-height: 100vh;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: ${bg};
          transition: background 0.5s ease;
        }

        .ctrl-btn {
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .ctrl-btn:hover {
          border-color: ${accent} !important;
          color: ${accent} !important;
          background: ${isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.06)"} !important;
        }

        .nav-btn { transition: color 0.2s; }
        .nav-btn:hover { color: ${accent} !important; }

        /* subtle grid bg */
        .fh-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

            <div className="fh-root">
                <motion.div
                    initial={{ y: -72, opacity: 0, scale: 0.97 }}
                    animate={{ y: 0,   opacity: 1, scale: 1    }}
                    transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.08 }}
                    style={{
                        position:  "fixed",
                        top:       14,
                        left:      "50%",
                        x:         "-50%",
                        zIndex:    1000,
                        width:     "calc(100% - 40px)",
                        maxWidth:  920,
                    }}
                >
                    <div
                        style={{
                            background:            glass,
                            backdropFilter:        "blur(28px)",
                            WebkitBackdropFilter:  "blur(28px)",
                            border,
                            borderRadius:          22,
                            padding:               "9px 14px 9px 22px",
                            display:               "flex",
                            alignItems:            "center",
                            justifyContent:        "space-between",
                            gap:                   12,
                            boxShadow:             shadow,
                            transition:            "background 0.4s, box-shadow 0.4s",
                        }}
                    >
                        {/* ── LOGO ── */}
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                fontFamily:   "'League Spartan', system-ui, sans-serif",
                                fontSize:     21,
                                fontWeight:   800,
                                letterSpacing: "-0.2px",
                                color:         textPrimary,
                                cursor:        "pointer",
                                userSelect:    "none",
                                flexShrink:    0,
                                lineHeight:    1,
                            }}
                        >
                            mamii<motion.span
                            animate={{ color: [accent, "#a855f7", accent] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >.</motion.span>
                        </motion.span>

                        {/* ── DESKTOP NAV ── */}
                        {!mobile && (
                            <nav style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }}>
                                {t.nav.map((item, i) => {
                                    const isActive = active === i;
                                    return (
                                        <motion.button
                                            key={item}
                                            className="nav-btn"
                                            onClick={() => setActive(i)}
                                            whileTap={{ scale: 0.96 }}
                                            style={{
                                                position:      "relative",
                                                padding:       "7px 20px",
                                                borderRadius:  13,
                                                border:        "none",
                                                cursor:        "pointer",
                                                fontSize:      14,
                                                fontWeight:    isActive ? 600 : 400,
                                                letterSpacing: "0.01em",
                                                background:    "transparent",
                                                color:         isActive ? accent : textMuted,
                                                fontFamily:    "'DM Sans', system-ui, sans-serif",
                                            }}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    style={{
                                                        position:     "absolute",
                                                        inset:        0,
                                                        borderRadius: 13,
                                                        background:   isDark
                                                            ? "rgba(124,58,237,0.14)"
                                                            : "rgba(124,58,237,0.09)",
                                                        border:       "1px solid rgba(124,58,237,0.22)",
                                                    }}
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                            <span style={{ position: "relative", zIndex: 1 }}>{item}</span>
                                        </motion.button>
                                    );
                                })}
                            </nav>
                        )}

                        {/* ── CONTROLS ── */}
                        <div style={{ display: "flex", gap: 7, alignItems: "center", flexShrink: 0 }}>

                            {/* Language */}
                            <motion.button
                                className="ctrl-btn"
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setLang(l => l === "TR" ? "EN" : "TR")}
                                style={{
                                    height:        34,
                                    padding:       "0 11px",
                                    borderRadius:  10,
                                    border:        `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
                                    background:    "transparent",
                                    cursor:        "pointer",
                                    fontSize:      12,
                                    fontWeight:    600,
                                    letterSpacing: "0.07em",
                                    color:         textMuted,
                                    fontFamily:    "'DM Sans', system-ui, sans-serif",
                                    display:       "flex",
                                    alignItems:    "center",
                                    gap:           5,
                                }}
                            >
                                <Languages size={12} />
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={lang}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        {lang === "TR" ? "EN" : "TR"}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>

                            {/* Theme */}
                            <motion.button
                                className="ctrl-btn"
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setTheme(th => th === "dark" ? "light" : "dark")}
                                style={{
                                    width:        34,
                                    height:       34,
                                    borderRadius: 10,
                                    border:       `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
                                    background:   "transparent",
                                    cursor:       "pointer",
                                    display:      "flex",
                                    alignItems:   "center",
                                    justifyContent: "center",
                                    color:        textMuted,
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={theme}
                                        initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
                                        animate={{ rotate:   0, opacity: 1, scale: 1   }}
                                        exit={{   rotate:  40, opacity: 0, scale: 0.6 }}
                                        transition={{ duration: 0.22, ease: "easeOut" }}
                                    >
                                        {isDark ? <Sun size={14} /> : <Moon size={14} />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>

                            {/* Mobile hamburger */}
                            {mobile && (
                                <motion.button
                                    className="ctrl-btn"
                                    whileTap={{ scale: 0.93 }}
                                    onClick={() => setMenu(o => !o)}
                                    style={{
                                        width:        34,
                                        height:       34,
                                        borderRadius: 10,
                                        border:       `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
                                        background:   "transparent",
                                        cursor:       "pointer",
                                        display:      "flex",
                                        alignItems:   "center",
                                        justifyContent: "center",
                                        color:        textMuted,
                                    }}
                                >
                                    {menuOpen ? <X size={14} /> : <Menu size={14} />}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* ── MOBILE DROPDOWN MENU ── */}
                    <AnimatePresence>
                        {mobile && menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                                animate={{ opacity: 1, y:   8, scale: 1    }}
                                exit={{   opacity: 0, y: -10, scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                                style={{
                                    marginTop:            8,
                                    background:           glass,
                                    backdropFilter:       "blur(28px)",
                                    WebkitBackdropFilter: "blur(28px)",
                                    border,
                                    borderRadius:         18,
                                    overflow:             "hidden",
                                    boxShadow:            shadow,
                                }}
                            >
                                {t.nav.map((item, i) => {
                                    const isActive = active === i;
                                    return (
                                        <motion.button
                                            key={item}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x:   0 }}
                                            transition={{ delay: i * 0.06 }}
                                            onClick={() => { setActive(i); setMenu(false); }}
                                            style={{
                                                width:         "100%",
                                                padding:       "14px 22px",
                                                border:        "none",
                                                background:    isActive
                                                    ? isDark ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.07)"
                                                    : "transparent",
                                                cursor:        "pointer",
                                                fontSize:      15,
                                                fontWeight:    isActive ? 600 : 400,
                                                color:         isActive ? accent : textMuted,
                                                textAlign:     "left",
                                                fontFamily:    "'DM Sans', system-ui, sans-serif",
                                                letterSpacing: "0.01em",
                                                display:       "flex",
                                                alignItems:    "center",
                                                gap:           10,
                                                borderBottom:  i < t.nav.length - 1
                                                    ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
                                                    : "none",
                                            }}
                                        >
                                            {item}
                                            {isActive && (
                                                <span style={{ color: accent, fontSize: 12, lineHeight: 1 }}>✦</span>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── DEMO CONTENT ── */}
                <div style={{
                    position:       "relative",
                    zIndex:         1,
                    minHeight:      "100vh",
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            16,
                    padding:        "100px 24px 40px",
                }}>
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={`${active}-${lang}`}
                            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y:  0, filter: "blur(0px)" }}
                            exit={{   opacity: 0, y: -24, filter: "blur(8px)" }}
                            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                            style={{

                                fontSize:      "clamp(36px, 8vw, 72px)",
                                fontWeight:    400,
                                color:         textPrimary,
                                letterSpacing: "-1.5px",
                                lineHeight:    1.1,
                                textAlign:     "center",
                            }}
                        >
                            {t.nav[active]}
                        </motion.h1>
                    </AnimatePresence>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            color:         textMuted,
                            fontSize:      12,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontFamily:    "'DM Sans', system-ui, sans-serif",
                        }}
                    >
                        mamii. · {t.site}
                    </motion.p>

                    {/* Decorative orb */}
                    <motion.div
                        animate={{
                            scale:  [1, 1.08, 1],
                            opacity: isDark ? [0.18, 0.26, 0.18] : [0.10, 0.16, 0.10],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position:     "absolute",
                            width:        460,
                            height:       460,
                            borderRadius: "50%",
                            background:   `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
                            pointerEvents: "none",
                            zIndex:       -1,
                            filter:       "blur(80px)",
                        }}
                    />
                </div>
            </div>
        </>
    );
}
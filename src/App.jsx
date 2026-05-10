import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://rqtbhubfpiutpqhehkzz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdGJodWJmcGl1dHBxaGVoa3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzA3NTAsImV4cCI6MjA5Mzk0Njc1MH0.XqnPl4-f3NV2LoyQ81SQNoinPtZI09rxfbofkuU5QR4";

async function sbFetch(path, method, body) {
  method = method || "GET";
  const res = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Prefer": method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) throw new Error(await res.text());
  var text = await res.text();
  return text ? JSON.parse(text) : null;
}

var GLITCH_CHARS = "!<>-_\\/[]{}=+*^?#@$%&".split("");

var FOLDERS = [
  { id: "libre",    label: "Libre",          icon: "⚡", color: "#00ff88", desc: "L'IA détecte le type" },
  { id: "web",      label: "Site Web",        icon: "🌐", color: "#00aaff", desc: "Landing, vitrine, blog..." },
  { id: "mobile",   label: "App Mobile",      icon: "📱", color: "#bf5fff", desc: "iOS, Android, Flutter..." },
  { id: "logiciel", label: "Logiciel",        icon: "💻", color: "#00ffcc", desc: "Desktop, SaaS, outil..." },
  { id: "saas",     label: "Outils et SaaS",  icon: "⚙️", color: "#ff6600", desc: "Dashboard, API, plateforme..." },
  { id: "gestion",  label: "Gestion Suivi",   icon: "📊", color: "#ffe600", desc: "CRM, tableau de bord, suivi..." },
  { id: "autre",    label: "Autre",           icon: "🔮", color: "#e879f9", desc: "Autre type de projet..." },
];

var STATUS_CONFIG = {
  "idee":     { label: "IDEE",     color: "#00e5ff" },
  "en_cours": { label: "EN COURS", color: "#ffe600" },
  "termine":  { label: "TERMINE",  color: "#00ff88" },
};
var PRIORITY_CONFIG = {
  haute:   { label: "HAUTE",   color: "#ff4466" },
  moyenne: { label: "MOYENNE", color: "#ffaa00" },
  basse:   { label: "BASSE",   color: "#556655" },
};

function buildPrompt(folderId) {
  var map = {
    libre:    "Detecte toi-meme le type de projet.",
    web:      "Ce projet est un SITE WEB. Technos : HTML/CSS/JS, React, Next.js...",
    mobile:   "Ce projet est une APP MOBILE. Technos : React Native, Flutter...",
    logiciel: "Ce projet est un LOGICIEL DESKTOP. Technos : Electron, Python...",
    saas:     "Ce projet est un OUTIL SAAS. Technos : Node.js, React, API REST...",
    gestion:  "Ce projet est un OUTIL DE GESTION. Fonctionnalites : tableaux, filtres...",
    autre:    "Adapte le type selon la description.",
  };
  return "Tu es un expert en developpement logiciel et digital. " + (map[folderId] || "") + "\nL'utilisateur te donne une idee brute ou modifiee. Genere une fiche projet ET un prompt professionnel pour Claude.\nReponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.\nFormat :{\"titre\":\"max 3 mots\",\"concept\":\"1-2 phrases\",\"fonctionnalites\":[\"f1\",\"f2\",\"f3\",\"f4\"],\"folder\":\"Libre ou Site Web ou App Mobile ou Logiciel ou Outils et SaaS ou Gestion Suivi ou Autre\",\"status\":\"idee\",\"priority\":\"haute ou moyenne ou basse\",\"tags\":[\"t1\",\"t2\",\"t3\"],\"prompt\":\"Prompt complet pret pour Claude.\"}";
}

function GlitchText(props) {
  var text = props.text || "";
  var active = props.active;
  var displayed = useState(text);
  var display = displayed[0];
  var setDisplay = displayed[1];
  useEffect(function() {
    if (!active) { setDisplay(text); return; }
    var iter = 0;
    var iv = setInterval(function() {
      setDisplay(text.split("").map(function(c, i) {
        if (i < iter) return text[i];
        if (c === " ") return " ";
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }).join(""));
      if (iter >= text.length) clearInterval(iv);
      iter += 1.5;
    }, 28);
    return function() { clearInterval(iv); };
  }, [active, text]);
  return <span>{display}</span>;
}

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#020e06"/>
      <rect x="0.5" y="0.5" width="31" height="31" rx="5.5" stroke="#00ff8844"/>
      <circle cx="16" cy="13" r="6" stroke="#00ff88" strokeWidth="1.5" fill="none"/>
      <path d="M13 19h6" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13.5 21.5h5" stroke="#00ff8877" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M14 24h4" stroke="#00ff8844" strokeWidth="1" strokeLinecap="round"/>
      <line x1="16" y1="7" x2="16" y2="5" stroke="#00ff88" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="16" cy="13" r="2" fill="#00ff8822"/>
      <circle cx="16" cy="13" r="1" fill="#00ff8866"/>
    </svg>
  );
}

function Toast(props) {
  var toast = props.toast;
  return (
    <div style={{
      position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
      background: toast.type === "err" ? "#1a0505" : "#030f06",
      border: "1px solid " + (toast.type === "err" ? "#ff446644" : "#00ff8833"),
      color: toast.type === "err" ? "#ff8899" : "#00ff88",
      padding: "11px 22px", borderRadius: "4px",
      fontSize: "12px", letterSpacing: "0.08em", zIndex: 100,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      animation: "fadeUp 0.2s ease", whiteSpace: "nowrap",
    }}>{toast.msg}</div>
  );
}

function BG() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,80,0.01) 3px,rgba(0,255,80,0.01) 4px)" }}/>
  );
}

function Styles() {
  return <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}textarea:focus{border-color:#00ff8833!important}input:focus{outline:none}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:4px;background:#020e06}::-webkit-scrollbar-thumb{background:#00ff8818;border-radius:2px}"}</style>;
}

export default function App() {
  var screenState = useState("home");
  var screen = screenState[0];
  var setScreen = screenState[1];

  var folderState = useState(null);
  var selectedFolder = folderState[0];
  var setSelectedFolder = folderState[1];

  var inputState = useState("");
  var rawInput = inputState[0];
  var setRawInput = inputState[1];

  var ideasState = useState([]);
  var ideas = ideasState[0];
  var setIdeas = ideasState[1];

  var recState = useState(false);
  var isRecording = recState[0];
  var setIsRecording = recState[1];

  var procState = useState(false);
  var isProcessing = procState[0];
  var setIsProcessing = procState[1];

  var activeState = useState(null);
  var activeIdea = activeState[0];
  var setActiveIdea = activeState[1];

  var glitchState = useState(null);
  var glitchId = glitchState[0];
  var setGlitchId = glitchState[1];

  var copiedState = useState(null);
  var copiedId = copiedState[0];
  var setCopiedId = copiedState[1];

  var delState = useState(null);
  var deleteConfirm = delState[0];
  var setDeleteConfirm = delState[1];

  var filterState = useState("toutes");
  var filterFolder = filterState[0];
  var setFilterFolder = filterState[1];

  var searchState = useState("");
  var searchVal = searchState[0];
  var setSearchVal = searchState[1];

  var syncState = useState("idle");
  var syncStatus = syncState[0];
  var setSyncStatus = syncState[1];

  var toastState = useState(null);
  var toast = toastState[0];
  var setToast = toastState[1];

  var timeState = useState("");
  var time = timeState[0];
  var setTime = timeState[1];

  // Mode edition
  var editModeState = useState(false);
  var editMode = editModeState[0];
  var setEditMode = editModeState[1];

  var editTextState = useState("");
  var editText = editTextState[0];
  var setEditText = editTextState[1];

  var editingIdState = useState(null);
  var editingId = editingIdState[0];
  var setEditingId = editingIdState[1];

  var recognitionRef = useRef(null);
  var inputRef = useRef(null);
  var editRef = useRef(null);

  useEffect(function() {
    var t = setInterval(function() { setTime(new Date().toLocaleTimeString("fr-FR")); }, 1000);
    setTime(new Date().toLocaleTimeString("fr-FR"));
    return function() { clearInterval(t); };
  }, []);

  useEffect(function() { loadIdeas(); }, []); // eslint-disable-line

  useEffect(function() {
    if (screen === "input" && inputRef.current) {
      setTimeout(function() { if (inputRef.current) inputRef.current.focus(); }, 100);
    }
    if (editMode && editRef.current) {
      setTimeout(function() { if (editRef.current) editRef.current.focus(); }, 100);
    }
  }, [screen, editMode]);

  function showToast(msg, type) {
    setToast({ msg: msg, type: type || "ok" });
    setTimeout(function() { setToast(null); }, 3000);
  }

  function loadIdeas() {
    setSyncStatus("syncing");
    sbFetch("ideas?select=*&order=ts.desc").then(function(data) {
      setIdeas(data || []);
      setSyncStatus("ok");
    }).catch(function() {
      setSyncStatus("err");
      showToast("Erreur chargement", "err");
    });
  }

  function insertIdea(idea) {
    setSyncStatus("syncing");
    var row = {
      titre: idea.titre, concept: idea.concept,
      fonctionnalites: idea.fonctionnalites, folder: idea.folder,
      folder_color: idea.folderColor, status: idea.status,
      priority: idea.priority, tags: idea.tags,
      prompt: idea.prompt, raw: idea.raw, date: idea.date, ts: idea.ts,
    };
    return sbFetch("ideas", "POST", row).then(function(result) {
      var newIdea = Object.assign({}, idea, { id: result[0].id });
      setIdeas(function(prev) { return [newIdea].concat(prev); });
      setSyncStatus("ok");
      return newIdea;
    }).catch(function() {
      setSyncStatus("err");
      showToast("Erreur sauvegarde", "err");
      return null;
    });
  }

  function updateIdea(id, fields) {
    setSyncStatus("syncing");
    sbFetch("ideas?id=eq." + id, "PATCH", fields).then(function() {
      setIdeas(function(prev) { return prev.map(function(i) { return i.id === id ? Object.assign({}, i, fields) : i; }); });
      setActiveIdea(function(prev) { return prev && prev.id === id ? Object.assign({}, prev, fields) : prev; });
      setSyncStatus("ok");
    }).catch(function() {
      setSyncStatus("err");
      showToast("Erreur mise a jour", "err");
    });
  }

  function deleteIdea(id) {
    setSyncStatus("syncing");
    sbFetch("ideas?id=eq." + id, "DELETE").then(function() {
      setIdeas(function(prev) { return prev.filter(function(i) { return i.id !== id; }); });
      setDeleteConfirm(null);
      setScreen("ideas");
      setSyncStatus("ok");
      showToast("Idee supprimee");
    }).catch(function() {
      setSyncStatus("err");
      showToast("Erreur suppression", "err");
    });
  }

  function startRecording(setter) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast("Vocal non disponible", "err"); return; }
    var r = new SR();
    r.lang = "fr-FR"; r.continuous = false; r.interimResults = false;
    r.onresult = function(e) { setter(function(p) { return p ? p + " " + e.results[0][0].transcript : e.results[0][0].transcript; }); };
    r.onerror = function() { showToast("Erreur micro", "err"); setIsRecording(false); };
    r.onend = function() { setIsRecording(false); };
    recognitionRef.current = r; r.start(); setIsRecording(true);
  }

  function stopRecording() { if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false); }

  function callAI(text, folderId, ideaId) {
    setIsProcessing(true);
    return fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-opus-4-7", max_tokens: 1500,
        system: buildPrompt(folderId || "libre"),
        messages: [{ role: "user", content: text }],
      }),
    }).then(function(res) { return res.json(); }).then(function(data) {
      return JSON.parse(data.content && data.content[0] ? data.content[0].text : "{}");
    });
  }

  function generateIdea() {
    if (!rawInput.trim()) return;
    callAI(rawInput, selectedFolder ? selectedFolder.id : "libre").then(function(parsed) {
      var idea = {
        id: Date.now(), raw: rawInput,
        titre: parsed.titre || "Nouvelle idee",
        concept: parsed.concept || "",
        fonctionnalites: parsed.fonctionnalites || [],
        folder: parsed.folder || (selectedFolder ? selectedFolder.label : "Libre"),
        folderColor: selectedFolder ? selectedFolder.color : "#00ff88",
        status: "idee", priority: parsed.priority || "moyenne",
        tags: parsed.tags || [], prompt: parsed.prompt || "",
        date: new Date().toLocaleDateString("fr-FR"), ts: Date.now(),
      };
      return insertIdea(idea).then(function(saved) {
        setRawInput("");
        setActiveIdea(saved || idea);
        setScreen("idea_detail");
        showToast("Idee generee !");
        setIsProcessing(false);
      });
    }).catch(function() {
      showToast("Erreur IA", "err");
      setIsProcessing(false);
    });
  }

  function regenerateIdea(idea) {
    if (!editText.trim()) return;
    var folderId = (FOLDERS.find(function(f) { return f.label === idea.folder; }) || { id: "libre" }).id;
    callAI(editText, folderId).then(function(parsed) {
      var fields = {
        raw: editText,
        titre: parsed.titre || idea.titre,
        concept: parsed.concept || "",
        fonctionnalites: parsed.fonctionnalites || [],
        status: idea.status,
        priority: parsed.priority || idea.priority,
        tags: parsed.tags || [],
        prompt: parsed.prompt || "",
      };
      updateIdea(idea.id, fields);
      setEditMode(false);
      setEditText("");
      setEditingId(null);
      showToast("Idee regeneree !");
      setIsProcessing(false);
    }).catch(function() {
      showToast("Erreur IA", "err");
      setIsProcessing(false);
    });
  }

  function copyPrompt(idea) {
    navigator.clipboard.writeText(idea.prompt || "").then(function() {
      setCopiedId(idea.id); showToast("Prompt copie !");
      setTimeout(function() { setCopiedId(null); }, 2500);
    });
  }

  var syncDot = { ok: "#00ff88", syncing: "#ffe600", err: "#ff4466", idle: "#334433" }[syncStatus] || "#334433";

  var filteredIdeas = ideas.filter(function(i) {
    return (filterFolder === "toutes" || i.folder === filterFolder) &&
      (!searchVal || (i.titre || "").toLowerCase().includes(searchVal.toLowerCase()) ||
       (i.concept || "").toLowerCase().includes(searchVal.toLowerCase()) ||
       (i.tags || []).some(function(t) { return t.toLowerCase().includes(searchVal.toLowerCase()); }));
  });

  var wrap = { minHeight: "100vh", background: "#04080a", fontFamily: "'Courier New',monospace", color: "#c8ffd4", position: "relative", overflowX: "hidden" };

  function Header(props) {
    return (
      <div style={{ background: "rgba(3,10,5,0.97)", borderBottom: "1px solid #00ff8825", padding: "14px 16px", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {props.back ? (
              <button onClick={props.backAction || function() { setScreen("home"); }} style={{ background: "rgba(0,255,136,0.06)", border: "1px solid #00ff8833", borderRadius: "4px", color: "#00ff88", padding: "7px 12px", cursor: "pointer", fontSize: "12px", letterSpacing: "0.08em" }}>
                {"<"} {props.backLabel || "RETOUR"}
              </button>
            ) : <Logo/>}
            <div>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", letterSpacing: "0.06em", color: "#00ff88", textShadow: "0 0 20px #00ff88, 0 0 40px #00ff8866" }}>
                IDEA_BOX <span style={{ color: "#aaffcc", fontWeight: 400, fontSize: "16px" }}>· MAT</span>
              </h1>
              <div style={{ display: "flex", gap: "12px", marginTop: "3px", fontSize: "11px", letterSpacing: "0.08em" }}>
                <span style={{ color: "#88ccaa", fontWeight: "600" }}>{ideas.length} IDEE{ideas.length !== 1 ? "S" : ""}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: syncDot, display: "inline-block", boxShadow: "0 0 8px " + syncDot, animation: syncStatus === "syncing" ? "pulse 1s infinite" : "none" }}/>
                  <span style={{ color: "#557766" }}>{syncStatus === "ok" ? "SYNC OK" : syncStatus === "syncing" ? "SYNC..." : syncStatus === "err" ? "ERREUR" : "..."}</span>
                </span>
                <span style={{ color: "#334433" }}>{time}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={function() { setScreen("ideas"); }} style={{ background: screen === "ideas" ? "rgba(0,255,136,0.08)" : "transparent", border: "1px solid " + (screen === "ideas" ? "#00ff8844" : "#00ff8818"), borderRadius: "4px", color: screen === "ideas" ? "#00ff88" : "#88bbaa", padding: "7px 10px", cursor: "pointer", fontSize: "11px", letterSpacing: "0.08em" }}>LISTE</button>
            <button onClick={loadIdeas} style={{ background: "transparent", border: "1px solid #00ff8818", borderRadius: "4px", color: "#88bbaa", padding: "7px 10px", cursor: "pointer", fontSize: "13px" }}>⟳</button>
          </div>
        </div>
      </div>
    );
  }

  // HOME
  if (screen === "home") return (
    <div style={wrap}>
      <BG/><Header/>
      <div style={{ padding: "20px 16px", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", margin: "0 0 20px", fontSize: "11px", color: "#88bbaa", letterSpacing: "0.18em" }}>CHOISIS LE TYPE DE PROJET</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {FOLDERS.map(function(f, idx) {
            return (
              <button key={f.id} onClick={function() { setSelectedFolder(f); setScreen("input"); }}
                style={{ background: "rgba(2,14,8,0.9)", border: "1px solid " + f.color + "33", borderTop: "2px solid " + f.color, borderRadius: "6px", padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", animation: "fadeIn 0.3s ease " + (idx * 0.05) + "s both", gridColumn: f.id === "libre" ? "1 / -1" : "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontSize: f.id === "libre" ? "22px" : "20px" }}>{f.icon}</span>
                  <span style={{ fontSize: f.id === "libre" ? "15px" : "13px", fontWeight: "700", color: f.color, textShadow: "0 0 16px " + f.color + ", 0 0 30px " + f.color + "88", letterSpacing: "0.06em" }}>{f.label.toUpperCase()}</span>
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "#99ccaa" }}>{f.desc}</p>
                {f.id === "libre" && <div style={{ marginTop: "8px", fontSize: "10px", color: f.color + "77", letterSpacing: "0.1em" }}>L'IA ANALYSE ET CHOISIT LE TYPE AUTOMATIQUEMENT</div>}
              </button>
            );
          })}
        </div>
        {ideas.length > 0 && (
          <button onClick={function() { setScreen("ideas"); }} style={{ width: "100%", marginTop: "16px", background: "transparent", border: "1px solid #00ff8820", borderRadius: "6px", color: "#88bbaa", padding: "14px", cursor: "pointer", fontSize: "11px", letterSpacing: "0.12em", fontFamily: "inherit" }}>
            VOIR MES {ideas.length} IDEE{ideas.length !== 1 ? "S" : ""} →
          </button>
        )}
      </div>
      {toast && <Toast toast={toast}/>}<Styles/>
    </div>
  );

  // INPUT
  if (screen === "input") {
    var f = selectedFolder;
    return (
      <div style={wrap}>
        <BG/><Header back={true} backLabel="ACCUEIL" backAction={function() { setScreen("home"); }}/>
        <div style={{ padding: "20px 16px", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: f.color + "12", border: "1px solid " + f.color + "44", borderRadius: "6px", padding: "10px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "20px" }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: f.color, textShadow: "0 0 14px " + f.color, letterSpacing: "0.08em" }}>{f.label.toUpperCase()}</div>
              <div style={{ fontSize: "10px", color: f.color + "99", marginTop: "2px" }}>{f.desc}</div>
            </div>
            <button onClick={function() { setScreen("home"); }} style={{ marginLeft: "8px", background: "transparent", border: "none", color: f.color + "55", cursor: "pointer", fontSize: "14px" }}>X</button>
          </div>
          <div style={{ background: "rgba(0,18,10,0.85)", border: "1px solid " + f.color + "22", borderRadius: "6px", padding: "18px", position: "relative" }}>
            <div style={{ fontSize: "10px", color: f.color + "99", letterSpacing: "0.18em", marginBottom: "12px" }}>DECRIS TON IDEE LIBREMENT</div>
            <textarea ref={inputRef} value={rawInput} onChange={function(e) { setRawInput(e.target.value); }}
              placeholder={"Decris ton idee de " + f.label.toLowerCase() + "..."}
              style={{ width: "100%", minHeight: "120px", background: "#020e06", border: "1px solid " + f.color + "18", borderRadius: "4px", color: "#c8ffd4", fontSize: "14px", fontFamily: "inherit", lineHeight: "1.7", padding: "12px 14px", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "14px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={isRecording ? stopRecording : function() { startRecording(setRawInput); }} style={{ background: isRecording ? "#ff446615" : "transparent", border: isRecording ? "1px solid #ff446644" : "1px solid " + f.color + "22", borderRadius: "4px", color: isRecording ? "#ff8899" : f.color + "88", padding: "10px 16px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                🎤 {isRecording ? "STOP" : "VOCAL"}
              </button>
              <button onClick={generateIdea} disabled={!rawInput.trim() || isProcessing} style={{ flex: 1, background: rawInput.trim() && !isProcessing ? f.color + "18" : "transparent", border: "1px solid " + (rawInput.trim() && !isProcessing ? f.color : f.color + "20"), borderRadius: "4px", color: rawInput.trim() && !isProcessing ? f.color : "#88bbaa", padding: "10px", cursor: rawInput.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textShadow: rawInput.trim() && !isProcessing ? "0 0 14px " + f.color : "none", transition: "all 0.2s" }}>
                {isProcessing ? "GENERATION..." : "GENERER — " + f.label.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
        {toast && <Toast toast={toast}/>}<Styles/>
      </div>
    );
  }

  // IDEA DETAIL
  if (screen === "idea_detail" && activeIdea) {
    var idea = ideas.find(function(i) { return i.id === activeIdea.id; }) || activeIdea;
    var fc = idea.folder_color || idea.folderColor || "#00ff88";
    var sc = STATUS_CONFIG[idea.status] || STATUS_CONFIG["idee"];
    var pc = PRIORITY_CONFIG[idea.priority] || PRIORITY_CONFIG.moyenne;
    var foncs = Array.isArray(idea.fonctionnalites) ? idea.fonctionnalites : [];
    var tags = Array.isArray(idea.tags) ? idea.tags : [];
    var isEditing = editMode && editingId === idea.id;

    return (
      <div style={wrap}>
        <BG/><Header back={true} backLabel="LISTE" backAction={function() { setScreen("ideas"); setEditMode(false); setEditText(""); setEditingId(null); }}/>
        <div style={{ padding: "20px 16px", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Titre + badges */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid " + fc + "33", borderLeft: "3px solid " + fc, borderRadius: "6px", padding: "18px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px", fontWeight: "700", color: fc, textShadow: "0 0 20px " + fc + ", 0 0 40px " + fc + "88", letterSpacing: "0.06em" }}>{idea.titre}</span>
              <span style={{ fontSize: "9px", padding: "2px 8px", border: "1px solid " + sc.color + "55", borderRadius: "2px", color: sc.color }}>{sc.label}</span>
              <span style={{ fontSize: "9px", color: pc.color }}>{pc.label}</span>
              <span style={{ fontSize: "9px", padding: "2px 8px", border: "1px solid " + fc + "33", borderRadius: "2px", color: fc + "aa" }}>{(idea.folder || "").toUpperCase()}</span>
            </div>
            <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#99ccaa", lineHeight: "1.6" }}>{idea.concept}</p>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {tags.map(function(tag) { return <span key={tag} style={{ fontSize: "9px", padding: "2px 7px", border: "1px solid #00ff8818", borderRadius: "2px", color: "#88bbaa" }}>#{tag}</span>; })}
            </div>
          </div>

          {/* MODIFIER / COMPLETER */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid " + (isEditing ? fc + "66" : "#00ff8815"), borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isEditing ? "12px" : "0" }}>
              <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em" }}>✏ MODIFIER / COMPLETER</div>
              {!isEditing ? (
                <button onClick={function() {
                  setEditMode(true);
                  setEditingId(idea.id);
                  setEditText(idea.raw || "");
                }} style={{ background: fc + "18", border: "1px solid " + fc + "55", borderRadius: "4px", color: fc, padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textShadow: "0 0 8px " + fc }}>
                  MODIFIER
                </button>
              ) : (
                <button onClick={function() { setEditMode(false); setEditText(""); setEditingId(null); }} style={{ background: "transparent", border: "1px solid #ff446633", borderRadius: "4px", color: "#ff8899", padding: "6px 12px", cursor: "pointer", fontSize: "11px" }}>
                  ANNULER
                </button>
              )}
            </div>
            {isEditing && (
              <div>
                <div style={{ fontSize: "10px", color: fc + "88", letterSpacing: "0.12em", marginBottom: "8px" }}>MODIFIE OU COMPLETE TON IDEE ORIGINALE</div>
                <textarea ref={editRef} value={editText} onChange={function(e) { setEditText(e.target.value); }}
                  style={{ width: "100%", minHeight: "100px", background: "#020e06", border: "1px solid " + fc + "33", borderRadius: "4px", color: "#c8ffd4", fontSize: "13px", fontFamily: "inherit", lineHeight: "1.7", padding: "10px 14px", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "10px" }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={isRecording ? stopRecording : function() { startRecording(setEditText); }} style={{ background: isRecording ? "#ff446615" : "transparent", border: isRecording ? "1px solid #ff446644" : "1px solid " + fc + "22", borderRadius: "4px", color: isRecording ? "#ff8899" : fc + "88", padding: "8px 14px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    🎤 {isRecording ? "STOP" : "VOCAL"}
                  </button>
                  <button onClick={function() { regenerateIdea(idea); }} disabled={!editText.trim() || isProcessing} style={{ flex: 1, background: editText.trim() && !isProcessing ? fc + "18" : "transparent", border: "1px solid " + (editText.trim() && !isProcessing ? fc : fc + "20"), borderRadius: "4px", color: editText.trim() && !isProcessing ? fc : "#88bbaa", padding: "8px", cursor: editText.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textShadow: editText.trim() && !isProcessing ? "0 0 10px " + fc : "none", transition: "all 0.2s" }}>
                    {isProcessing ? "REGENERATION..." : "⚡ REGENERER AVEC L'IA"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fonctionnalites */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00ff8815", borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em", marginBottom: "10px" }}>FONCTIONNALITES</div>
            {foncs.map(function(ft, i) {
              return <div key={i} style={{ display: "flex", gap: "10px", padding: "6px 0", borderBottom: i < foncs.length - 1 ? "1px solid #00ff8810" : "none", fontSize: "13px", color: "#99ccaa" }}>
                <span style={{ color: fc, flexShrink: 0 }}>{">"}</span>{ft}
              </div>;
            })}
          </div>

          {/* Prompt */}
          {idea.prompt && (
            <div style={{ background: "#020d0a", border: "1px solid #00ccff22", borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", color: "#00ccff88", letterSpacing: "0.15em", marginBottom: "10px" }}>PROMPT POUR CLAUDE</div>
              <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#88ccdd", lineHeight: "1.7" }}>{idea.prompt}</p>
              <button onClick={function() { copyPrompt(idea); }} style={{ width: "100%", background: copiedId === idea.id ? "#00ff8815" : "#00ccff0d", border: "1px solid " + (copiedId === idea.id ? "#00ff8844" : "#00ccff33"), borderRadius: "4px", color: copiedId === idea.id ? "#00ff88" : "#00ccff", padding: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", transition: "all 0.2s", marginBottom: "8px" }}>
                {copiedId === idea.id ? "COPIE ! COLLE DANS CLAUDE" : "COPIER LE PROMPT"}
              </button>
              <button onClick={function() {
                var guidedPrompt = idea.prompt + "\n\n---\n\nIMPORTANT : Guide-moi etape par etape dans la creation de ce projet. Commence par me poser 3-5 questions pour affiner le besoin, puis propose une architecture et attend ma validation, puis developpe module par module en attendant ma confirmation a chaque etape.";
                navigator.clipboard.writeText(guidedPrompt).then(function() {
                  showToast("Mode guide copie — colle dans Claude !");
                });
              }} style={{ width: "100%", background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.4)", borderRadius: "4px", color: "#ffaa44", padding: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textShadow: "0 0 10px #ffaa4466", transition: "all 0.2s" }}>
                Naviguer MODE GUIDE — CREATION ETAPE PAR ETAPE
              </button>
            </div>
          )}

          {/* Statut */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00ff8815", borderRadius: "6px", padding: "14px", marginBottom: "12px" }}>
            <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em", marginBottom: "10px" }}>CHANGER LE STATUT</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {Object.keys(STATUS_CONFIG).map(function(k) {
                var v = STATUS_CONFIG[k];
                return <button key={k} onClick={function() { updateIdea(idea.id, { status: k }); }} style={{ flex: 1, background: idea.status === k ? v.color + "18" : "transparent", border: "1px solid " + (idea.status === k ? v.color + "77" : "#00ff8818"), borderRadius: "4px", color: idea.status === k ? v.color : "#88bbaa", padding: "8px", cursor: "pointer", fontSize: "10px", letterSpacing: "0.08em", transition: "all 0.15s" }}>{v.label}</button>;
              })}
            </div>
          </div>

          {/* Deplacer */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00ff8815", borderRadius: "6px", padding: "14px", marginBottom: "12px" }}>
            <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em", marginBottom: "10px" }}>DEPLACER DANS</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {FOLDERS.filter(function(fl) { return fl.label !== idea.folder && fl.id !== "libre"; }).map(function(fl) {
                return <button key={fl.id} onClick={function() { updateIdea(idea.id, { folder: fl.label, folder_color: fl.color }); }} style={{ background: "transparent", border: "1px solid " + fl.color + "33", borderRadius: "3px", color: fl.color + "99", padding: "5px 10px", cursor: "pointer", fontSize: "10px", transition: "all 0.15s" }}>{fl.icon} {fl.label}</button>;
              })}
            </div>
          </div>

          {/* Idee originale */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00ff8810", borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em", marginBottom: "6px" }}>IDEE ORIGINALE</div>
            <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#99ccaa", fontStyle: "italic", lineHeight: "1.6" }}>{idea.raw}</p>
            <div style={{ fontSize: "9px", color: "#557755", textAlign: "right" }}>CREE LE {idea.date}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={function() { setScreen("home"); setEditMode(false); }} style={{ flex: 1, background: "rgba(0,255,136,0.06)", border: "1px solid #00ff8833", borderRadius: "4px", color: "#00ff88", padding: "12px", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textShadow: "0 0 10px #00ff88" }}>+ NOUVELLE IDEE</button>
            {deleteConfirm === idea.id ? (
              <span style={{ display: "flex", gap: "6px" }}>
                <button onClick={function() { deleteIdea(idea.id); }} style={{ background: "#ff446618", border: "1px solid #ff446644", borderRadius: "4px", color: "#ff7788", padding: "12px 16px", cursor: "pointer", fontSize: "11px" }}>CONFIRMER</button>
                <button onClick={function() { setDeleteConfirm(null); }} style={{ background: "transparent", border: "1px solid #00ff8818", borderRadius: "4px", color: "#88bbaa", padding: "12px", cursor: "pointer", fontSize: "11px" }}>X</button>
              </span>
            ) : (
              <button onClick={function() { setDeleteConfirm(idea.id); }} style={{ background: "transparent", border: "1px solid #ff446655", borderRadius: "4px", color: "#ff7788", padding: "12px 14px", cursor: "pointer", fontSize: "14px" }}>🗑</button>
            )}
          </div>
        </div>
        {toast && <Toast toast={toast}/>}<Styles/>
      </div>
    );
  }

  // IDEAS LIST
  return (
    <div style={wrap}>
      <BG/><Header back={true} backLabel="ACCUEIL" backAction={function() { setScreen("home"); }}/>
      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ background: "#020e06", border: "1px solid #00ff8820", borderRadius: "4px", padding: "10px 14px", display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "#88bbaa" }}>⌕</span>
          <input value={searchVal} onChange={function(e) { setSearchVal(e.target.value); }} placeholder="Rechercher une idee..." style={{ background: "transparent", border: "none", outline: "none", color: "#aaccbb", fontSize: "13px", fontFamily: "inherit", width: "100%" }}/>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button onClick={function() { setFilterFolder("toutes"); }} style={{ background: filterFolder === "toutes" ? "rgba(0,255,136,0.08)" : "transparent", border: "1px solid " + (filterFolder === "toutes" ? "#00ff8844" : "#00ff8815"), borderRadius: "3px", color: filterFolder === "toutes" ? "#00ff88" : "#88bbaa", padding: "5px 11px", cursor: "pointer", fontSize: "10px", letterSpacing: "0.08em" }}>TOUTES ({ideas.length})</button>
          {FOLDERS.filter(function(fl) { return fl.id !== "libre" && ideas.some(function(i) { return i.folder === fl.label; }); }).map(function(fl) {
            return <button key={fl.id} onClick={function() { setFilterFolder(fl.label); }} style={{ background: filterFolder === fl.label ? fl.color + "18" : "transparent", border: "1px solid " + (filterFolder === fl.label ? fl.color + "55" : "#00ff8815"), borderRadius: "3px", color: filterFolder === fl.label ? fl.color : "#88bbaa", padding: "5px 11px", cursor: "pointer", fontSize: "10px", letterSpacing: "0.06em" }}>
              {fl.icon} {fl.label} ({ideas.filter(function(i) { return i.folder === fl.label; }).length})
            </button>;
          })}
        </div>

        {filteredIdeas.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.3 }}>💭</div>
            <p style={{ fontSize: "11px", color: "#88bbaa", letterSpacing: "0.12em" }}>{ideas.length === 0 ? "AUCUNE IDEE" : "AUCUNE IDEE ICI"}</p>
            <button onClick={function() { setScreen("home"); }} style={{ marginTop: "16px", background: "rgba(0,255,136,0.06)", border: "1px solid #00ff8833", borderRadius: "4px", color: "#00ff88", padding: "10px 20px", cursor: "pointer", fontSize: "11px", fontFamily: "inherit" }}>+ NOUVELLE IDEE</button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredIdeas.map(function(idea, idx) {
            var fc2 = idea.folder_color || idea.folderColor || "#00ff88";
            var sc2 = STATUS_CONFIG[idea.status] || STATUS_CONFIG["idee"];
            var pc2 = PRIORITY_CONFIG[idea.priority] || PRIORITY_CONFIG.moyenne;
            var tags2 = Array.isArray(idea.tags) ? idea.tags : [];
            return (
              <div key={idea.id}
                onMouseEnter={function() { setGlitchId(idea.id); }}
                onMouseLeave={function() { setGlitchId(null); }}
                onClick={function() { setActiveIdea(idea); setScreen("idea_detail"); setEditMode(false); }}
                style={{ background: "rgba(2,14,8,0.9)", border: "1px solid " + fc2 + "22", borderLeft: "3px solid " + fc2, borderRadius: "5px", padding: "13px 15px", cursor: "pointer", transition: "all 0.2s", animation: "fadeIn 0.3s ease " + (idx * 0.05) + "s both" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "5px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: fc2, letterSpacing: "0.05em", textShadow: "0 0 18px " + fc2 + ", 0 0 35px " + fc2 + "88" }}>
                        <GlitchText text={idea.titre || ""} active={glitchId === idea.id}/>
                      </span>
                      <span style={{ fontSize: "9px", padding: "2px 6px", border: "1px solid " + sc2.color + "44", borderRadius: "2px", color: sc2.color }}>{sc2.label}</span>
                      <span style={{ fontSize: "9px", color: pc2.color }}>{pc2.label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#99ccaa", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{idea.concept}</p>
                    {tags2.length > 0 && (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "6px" }}>
                        {tags2.map(function(tag) { return <span key={tag} style={{ fontSize: "9px", padding: "1px 6px", border: "1px solid #00ff8815", borderRadius: "2px", color: "#88bbaa" }}>#{tag}</span>; })}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
                    <span style={{ fontSize: "9px", padding: "2px 7px", border: "1px solid " + fc2 + "33", borderRadius: "2px", color: fc2 + "99" }}>{(idea.folder || "").toUpperCase()}</span>
                    <span style={{ color: "#88bbaa", fontSize: "11px" }}>{">"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {ideas.length > 0 && (
          <button onClick={function() { setScreen("home"); }} style={{ width: "100%", marginTop: "16px", background: "rgba(0,255,136,0.05)", border: "1px solid #00ff8822", borderRadius: "6px", color: "#88bbaa", padding: "14px", cursor: "pointer", fontSize: "11px", letterSpacing: "0.12em", fontFamily: "inherit" }}>+ NOUVELLE IDEE</button>
        )}
      </div>
      {toast && <Toast toast={toast}/>}<Styles/>
    </div>
  );
}

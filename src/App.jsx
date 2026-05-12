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
  return "Tu es un expert en developpement logiciel et digital. " + (map[folderId] || "") + "\nL'utilisateur te donne une idee brute ou modifiee. Genere une fiche projet ET un prompt professionnel pour Claude.\n\nREGLES ABSOLUES :\n1. Reponds UNIQUEMENT avec du JSON brut valide\n2. ZERO texte avant ou apres le JSON\n3. ZERO markdown, ZERO backticks, ZERO commentaire\n4. Le JSON doit commencer par { et finir par }\n5. Toutes les chaines doivent etre sur une seule ligne (pas de retour a la ligne dans les valeurs)\n\nFormat EXACT a respecter :\n{\"titre\":\"Titre court du projet\",\"concept\":\"Description claire en 1-2 phrases.\",\"fonctionnalites\":[\"Fonctionnalite 1\",\"Fonctionnalite 2\",\"Fonctionnalite 3\",\"Fonctionnalite 4\",\"Fonctionnalite 5\"],\"folder\":\"Libre ou Site Web ou App Mobile ou Logiciel ou Outils et SaaS ou Gestion Suivi ou Autre\",\"status\":\"idee\",\"priority\":\"haute ou moyenne ou basse\",\"tags\":[\"tag1\",\"tag2\",\"tag3\"],\"prompt\":\"Prompt professionnel complet pret a coller dans Claude.\"}";
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

function PinScreen({ onUnlock }) {
  var pinInputState = useState("");
  var pinInput = pinInputState[0];
  var setPinInput = pinInputState[1];
  var pinErrorState = useState(false);
  var pinError = pinErrorState[0];
  var setPinError = pinErrorState[1];

  function handleDigit(n) {
    if (pinInput.length >= 4) return;
    var next = pinInput + n;
    setPinInput(next);
    setPinError(false);
    if (next.length === 4) {
      if (next === "1102") { sessionStorage.setItem("ideabox_auth", "ok"); onUnlock(); }
      else { setPinError(true); setTimeout(function() { setPinInput(""); setPinError(false); }, 800); }
    }
  }

  useEffect(function() {
    function handleKey(e) {
      if (e.key >= "0" && e.key <= "9") { handleDigit(e.key); }
      else if (e.key === "Backspace") { setPinInput(function(p) { return p.slice(0,-1); }); setPinError(false); }
      else if (e.key === "Escape") { setPinInput(""); setPinError(false); }
    }
    window.addEventListener("keydown", handleKey);
    return function() { window.removeEventListener("keydown", handleKey); };
  }); // eslint-disable-line

  return (
    <div style={{ minHeight: "100vh", background: "#020e06", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New', monospace" }}>
      <div style={{ textAlign: "center", padding: "40px 32px", background: "rgba(2,14,8,0.95)", border: "1px solid #00ff8822", borderRadius: "12px", width: "280px" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#00ff88", letterSpacing: "0.15em", textShadow: "0 0 20px #00ff88", marginBottom: "4px" }}>IDEA_BOX</div>
        <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.2em", marginBottom: "28px" }}>CODE D'ACCES</div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
          {[0,1,2,3].map(function(i) {
            return <div key={i} style={{ width: "44px", height: "52px", background: pinInput.length > i ? "rgba(0,255,136,0.15)" : "rgba(0,255,136,0.04)", border: "1px solid " + (pinError ? "#ff4466" : pinInput.length > i ? "#00ff88" : "#00ff8833"), borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: "#00ff88", transition: "all 0.2s" }}>{pinInput.length > i ? "●" : ""}</div>;
          })}
        </div>
        {pinError && <div style={{ fontSize: "10px", color: "#ff4466", letterSpacing: "0.1em", marginBottom: "14px" }}>CODE INCORRECT</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "8px" }}>
          {["1","2","3","4","5","6","7","8","9"].map(function(n) {
            return <button key={n} onClick={function() { handleDigit(n); }} style={{ background: "rgba(0,255,136,0.06)", border: "1px solid #00ff8822", borderRadius: "6px", color: "#c8ffd4", fontSize: "18px", fontWeight: "700", padding: "14px", cursor: "pointer", fontFamily: "inherit" }}>{n}</button>;
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          <button onClick={function() { setPinInput(""); setPinError(false); }} style={{ background: "transparent", border: "1px solid #ff446622", borderRadius: "6px", color: "#ff8899", fontSize: "12px", padding: "14px", cursor: "pointer", fontFamily: "inherit" }}>C</button>
          <button onClick={function() { handleDigit("0"); }} style={{ background: "rgba(0,255,136,0.06)", border: "1px solid #00ff8822", borderRadius: "6px", color: "#c8ffd4", fontSize: "18px", fontWeight: "700", padding: "14px", cursor: "pointer", fontFamily: "inherit" }}>0</button>
          <button onClick={function() { setPinInput(function(p) { return p.slice(0,-1); }); setPinError(false); }} style={{ background: "transparent", border: "1px solid #00ff8815", borderRadius: "6px", color: "#88bbaa", fontSize: "16px", padding: "14px", cursor: "pointer", fontFamily: "inherit" }}>⌫</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  var unlockedState = useState(sessionStorage.getItem("ideabox_auth") === "ok");
  var unlocked = unlockedState[0];
  var setUnlocked = unlockedState[1];

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

  var filesState = useState({});
  var ideaFiles = filesState[0];
  var setIdeaFiles = filesState[1];

  var uploadingState = useState(false);
  var isUploading = uploadingState[0];
  var setIsUploading = uploadingState[1];

  var pendingFilesState = useState([]);
  var pendingFiles = pendingFilesState[0];
  var setPendingFiles = pendingFilesState[1];

  var extractingState = useState(false);
  var isExtractingFiles = extractingState[0];
  var setIsExtractingFiles = extractingState[1];

  var previewState = useState(null);
  var previewHtml = previewState[0];
  var setPreviewHtml = previewState[1];

  var genPreviewState = useState(false);
  var isGeneratingPreview = genPreviewState[0];
  var setIsGeneratingPreview = genPreviewState[1];

  var previewVersionsState = useState([]);
  var previewVersions = previewVersionsState[0];
  var setPreviewVersions = previewVersionsState[1];

  var activeVersionState = useState(null);
  var activeVersion = activeVersionState[0];
  var setActiveVersion = activeVersionState[1];

  var showGalleryState = useState(false);
  var showGallery = showGalleryState[0];
  var setShowGallery = showGalleryState[1];

  // Gestionnaire documentaire
  var docsState = useState([]);
  var uploadedDocs = docsState[0];
  var setUploadedDocs = docsState[1];

  var docResultState = useState(null);
  var docResult = docResultState[0];
  var setDocResult = docResultState[1];

  var docModeState = useState("resumer");
  var docMode = docModeState[0];
  var setDocMode = docModeState[1];

  var isAnalyzingState = useState(false);
  var isAnalyzing = isAnalyzingState[0];
  var setIsAnalyzing = isAnalyzingState[1];

  var docFileInputRef = useRef(null);

  var docExpandedState = useState(false);
  var docExpanded = docExpandedState[0];
  var setDocExpanded = docExpandedState[1];

  var showDownloadMenuState = useState(false);
  var showDownloadMenu = showDownloadMenuState[0];
  var setShowDownloadMenu = showDownloadMenuState[1];

  var savedDocsState = useState([]);
  var savedDocs = savedDocsState[0];
  var setSavedDocs = savedDocsState[1];

  var docTabState = useState("analyser"); // "analyser" | "sauvegardes"
  var docTab = docTabState[0];
  var setDocTab = docTabState[1];

  var ideaExpandedState = useState(null); // null | "fonctions" | "prompt"
  var ideaExpanded = ideaExpandedState[0];
  var setIdeaExpanded = ideaExpandedState[1];

  var showIdeaDownloadState = useState(false);
  var showIdeaDownload = showIdeaDownloadState[0];
  var setShowIdeaDownload = showIdeaDownloadState[1];

  var modelState = useState("claude-opus-4-7");
  var selectedModel = modelState[0];
  var setSelectedModel = modelState[1];

  var editExpandedState = useState(false);
  var editExpanded = editExpandedState[0];
  var setEditExpanded = editExpandedState[1];

  var recognitionRef = useRef(null);
  var inputRef = useRef(null);
  var editRef = useRef(null);
  var fileInputRef = useRef(null);
  var pendingFileInputRef = useRef(null);

  useEffect(function() {
    var t = setInterval(function() { setTime(new Date().toLocaleTimeString("fr-FR")); }, 1000);
    setTime(new Date().toLocaleTimeString("fr-FR"));
    return function() { clearInterval(t); };
  }, []);

  useEffect(function() { loadIdeas(); }, []); // eslint-disable-line

  useEffect(function() {
    if (screen === "idea_detail" && activeIdea) {
      loadFiles(String(activeIdea.id));
      loadPreviewVersions(activeIdea.id);
      setPreviewVersions([]);
      setPreviewHtml(null);
      setActiveVersion(null);
    }
  }, [screen, activeIdea]); // eslint-disable-line

  useEffect(function() {
    if (screen === "docs") loadSavedDocs();
  }, [screen]); // eslint-disable-line

  useEffect(function() {
    if (screen === "docs") loadSavedDocs();
  }, [screen]); // eslint-disable-line

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
    // Limiter le texte à 8000 caractères pour éviter les erreurs de contexte
    var truncated = text.length > 8000 ? text.slice(0, 8000) + "\n\n[Texte tronqué pour l'analyse]" : text;
    return fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel, max_tokens: 4000,
        system: buildPrompt(folderId || "libre"),
        messages: [{ role: "user", content: truncated }],
      }),
    }).then(function(res) { return res.json(); }).then(function(data) {
      var raw = data.content && data.content[0] ? data.content[0].text : "{}";
      // Nettoyer le JSON si Claude a ajouté des backticks
      var clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      // Extraire le JSON s'il est entouré de texte
      var match = clean.match(/\{[\s\S]*\}/);
      return JSON.parse(match ? match[0] : clean);
    });
  }

  function extractFilesContent(files) {
    if (!files || files.length === 0) return Promise.resolve("");
    setIsExtractingFiles(true);
    return Promise.all(files.map(function(f) {
      return readFileAsText(f).then(function(text) {
        return "\n\n--- FICHIER : " + f.name + " ---\n" + (text || "[contenu vide]");
      });
    })).then(function(contents) {
      setIsExtractingFiles(false);
      return contents.join("\n");
    }).catch(function() {
      setIsExtractingFiles(false);
      return "";
    });
  }

  function generateIdeaWithFiles() {
    if (!rawInput.trim()) return;
    if (pendingFiles.length === 0) { generateIdea(); return; }
    setIsProcessing(true);
    showToast("Lecture des fichiers...");
    extractFilesContent(pendingFiles).then(function(filesContent) {
      var enrichedText = rawInput + (filesContent ? "\n\n=== FICHIERS JOINTS ===\n" + filesContent : "");
      callAI(enrichedText, selectedFolder ? selectedFolder.id : "libre").then(function(parsed) {
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
          var finalIdea = saved || idea;
          uploadFiles(finalIdea.id, pendingFiles);
          setPendingFiles([]);
          setRawInput("");
          setActiveIdea(finalIdea);
          setScreen("idea_detail");
          showToast("Idee generee avec " + pendingFiles.length + " fichier(s) !");
          setIsProcessing(false);
        });
      }).catch(function() { showToast("Erreur IA", "err"); setIsProcessing(false); });
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
        var finalIdea = saved || idea;
        // Uploader les fichiers en attente
        if (pendingFiles.length > 0) {
          uploadFiles(finalIdea.id, pendingFiles);
          setPendingFiles([]);
        }
        setRawInput("");
        setActiveIdea(finalIdea);
        setScreen("idea_detail");
        showToast(pendingFiles.length > 0 ? "Idee generee + " + pendingFiles.length + " fichier(s) !" : "Idee generee !");
        setIsProcessing(false);
      });
    }).catch(function() {
      showToast("Erreur IA", "err");
      setIsProcessing(false);
    });
  }

  function saveRawIdea() {
    if (!rawInput.trim()) return;
    var folder = selectedFolder || FOLDERS[0];
    var idea = {
      id: Date.now(),
      raw: rawInput,
      titre: rawInput.length > 30 ? rawInput.substring(0, 30) + "..." : rawInput,
      concept: "",
      fonctionnalites: [],
      folder: folder.label,
      folderColor: folder.color,
      status: "idee",
      priority: "moyenne",
      tags: [],
      prompt: "",
      date: new Date().toLocaleDateString("fr-FR"),
      ts: Date.now(),
    };
    insertIdea(idea).then(function(saved) {
      var finalIdea = saved || idea;
      if (pendingFiles.length > 0) {
        uploadFiles(finalIdea.id, pendingFiles);
        setPendingFiles([]);
      }
      setRawInput("");
      setActiveIdea(finalIdea);
      setScreen("idea_detail");
      showToast("Idee sauvegardee — enrichis-la quand tu veux !");
    }).catch(function() {
      showToast("Erreur sauvegarde", "err");
    });
  }

  function regenerateIdeaWithFiles(idea) {
    if (!editText.trim()) return;
    var files = ideaFiles[String(idea.id)] || [];
    if (files.length === 0) { regenerateIdea(idea); return; }
    setIsProcessing(true);
    showToast("Lecture des fichiers joints...");
    // Télécharger et lire les fichiers depuis Supabase
    Promise.all(files.map(function(f) {
      var url = getFileUrl(idea.id, f.name);
      return fetch(url).then(function(r) { return r.text(); }).then(function(text) {
        return "\n\n--- FICHIER : " + f.name.replace(/^\d+_/, "") + " ---\n" + text.slice(0, 3000);
      }).catch(function() { return ""; });
    })).then(function(contents) {
      var filesContent = contents.filter(Boolean).join("\n");
      var enrichedText = editText + (filesContent ? "\n\n=== FICHIERS JOINTS ===\n" + filesContent : "");
      var folderId = selectedFolder ? selectedFolder.id : (idea.folder || "libre").toLowerCase().replace(/\s/g, "-");
      callAI(enrichedText, folderId).then(function(parsed) {
        var fields = {
          raw: editText,
          titre: parsed.titre || idea.titre,
          concept: parsed.concept || idea.concept,
          fonctionnalites: parsed.fonctionnalites && parsed.fonctionnalites.length > 0 ? parsed.fonctionnalites : idea.fonctionnalites,
          folder: parsed.folder || idea.folder,
          priority: parsed.priority || idea.priority,
          tags: parsed.tags && parsed.tags.length > 0 ? parsed.tags : idea.tags,
          prompt: parsed.prompt || idea.prompt,
        };
        updateIdea(idea.id, fields);
        setEditMode(false); setEditText(""); setEditingId(null);
        showToast("Regenere avec " + files.length + " fichier(s) !");
        setIsProcessing(false);
      }).catch(function() { showToast("Erreur IA", "err"); setIsProcessing(false); });
    });
  }

  function regenerateIdea(idea) {
    if (!editText.trim()) return;
    var folderId = (FOLDERS.find(function(f) { return f.label === idea.folder; }) || { id: "libre" }).id;
    callAI(editText, folderId).then(function(parsed) {
      var fields = {
        raw: editText,
        titre: parsed.titre || idea.titre,
        concept: parsed.concept || idea.concept,
        fonctionnalites: parsed.fonctionnalites && parsed.fonctionnalites.length > 0 ? parsed.fonctionnalites : idea.fonctionnalites,
        status: idea.status,
        priority: parsed.priority || idea.priority,
        tags: parsed.tags && parsed.tags.length > 0 ? parsed.tags : idea.tags,
        prompt: parsed.prompt || idea.prompt,
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

  function downloadIdea(idea, format) {
    var content = "# " + idea.titre + "\n\n" +
      "**Type :** " + idea.folder + " | **Statut :** " + idea.status + " | **Date :** " + idea.date + "\n\n" +
      "## Concept\n" + (idea.concept || "") + "\n\n" +
      "## Fonctionnalités\n" + (idea.fonctionnalites || []).map(function(f) { return "- " + f; }).join("\n") + "\n\n" +
      "## Prompt pour Claude\n" + (idea.prompt || "") + "\n\n" +
      "## Idée originale\n" + (idea.raw || "");
    var baseName = idea.titre.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    if (format === "md") {
      var blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = url; a.download = baseName + ".md"; a.click(); URL.revokeObjectURL(url);
    } else if (format === "txt") {
      var plain = content.replace(/#{1,3} /g, "").replace(/\*\*/g, "");
      var blob2 = new Blob([plain], { type: "text/plain;charset=utf-8" });
      var url2 = URL.createObjectURL(blob2); var a2 = document.createElement("a"); a2.href = url2; a2.download = baseName + ".txt"; a2.click(); URL.revokeObjectURL(url2);
    } else if (format === "html") {
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#222;line-height:1.7}h1{color:#006644}h2{color:#1a5276;border-bottom:1px solid #eee;padding-bottom:6px}ul{padding-left:20px}</style></head><body>" +
        "<h1>" + idea.titre + "</h1><p><strong>Type :</strong> " + idea.folder + " &nbsp;|&nbsp; <strong>Statut :</strong> " + idea.status + " &nbsp;|&nbsp; <strong>Date :</strong> " + idea.date + "</p>" +
        "<h2>Concept</h2><p>" + (idea.concept || "") + "</p>" +
        "<h2>Fonctionnalités</h2><ul>" + (idea.fonctionnalites || []).map(function(f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
        "<h2>Prompt pour Claude</h2><pre style='background:#f5f5f5;padding:16px;border-radius:6px;white-space:pre-wrap'>" + (idea.prompt || "") + "</pre>" +
        "<h2>Idée originale</h2><p><em>" + (idea.raw || "") + "</em></p>" +
        "</body></html>";
      var blob3 = new Blob([html], { type: "text/html;charset=utf-8" });
      var url3 = URL.createObjectURL(blob3); var a3 = document.createElement("a"); a3.href = url3; a3.download = baseName + ".html"; a3.click(); URL.revokeObjectURL(url3);
    }
    setShowIdeaDownload(false);
    showToast("Fiche telechargee !");
  }

  function downloadPreview(idea, html) {
    var baseName = idea.titre.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = url; a.download = baseName + "_apercu.html"; a.click(); URL.revokeObjectURL(url);
    showToast("Apercu telecharge !");
  }

  function loadPreviewVersions(ideaId) {
    sbFetch("preview_versions?idea_id=eq." + ideaId + "&select=*&order=ts.desc").then(function(data) {
      if (Array.isArray(data)) {
        setPreviewVersions(data);
        if (data.length > 0) { setActiveVersion(data[0].id); setPreviewHtml(data[0].html); }
      }
    }).catch(function() {});
  }

  function savePreviewVersion(ideaId, html, versionsCount, starred) {
    var version = {
      id: Date.now(),
      idea_id: ideaId,
      html: html,
      label: "Version " + (versionsCount + 1),
      starred: starred || false,
      date: new Date().toLocaleTimeString("fr-FR"),
      ts: Date.now(),
    };
    sbFetch("preview_versions", "POST", version).then(function() {
      setPreviewVersions(function(prev) { return [version].concat(prev).slice(0, 10); });
      setActiveVersion(version.id);
    }).catch(function() {});
    return version;
  }

  function deletePreviewVersion(versionId, ideaId) {
    sbFetch("preview_versions?id=eq." + versionId, "DELETE").then(function() {
      setPreviewVersions(function(prev) {
        var updated = prev.filter(function(x) { return x.id !== versionId; });
        if (updated.length > 0) { setPreviewHtml(updated[0].html); setActiveVersion(updated[0].id); }
        else { setPreviewHtml(null); }
        return updated;
      });
    }).catch(function() {});
  }

  function starPreviewVersion(version) {
    var newStarred = !version.starred;
    var newLabel = newStarred ? "⭐ Favorite" : "Version " + (previewVersions.indexOf(version) + 1);
    sbFetch("preview_versions?id=eq." + version.id, "PATCH", { starred: newStarred, label: newLabel }).then(function() {
      setPreviewVersions(function(prev) { return prev.map(function(x) { return x.id === version.id ? Object.assign({}, x, { starred: newStarred, label: newLabel }) : x; }); });
    }).catch(function() {});
  }

  function generatePreview(idea) {
    setIsGeneratingPreview(true);
    setPreviewHtml("loading");
    var systemPrompt = "Tu es un expert UI/UX senior specialise dans les maquettes d'applications. Tu dois generer un mockup HTML/CSS COMPLET, RICHE et VISUELLEMENT IMPRESSIONNANT.\n\nREGLES ABSOLUES :\n- Reponds UNIQUEMENT avec du code HTML brut, commencant EXACTEMENT par <!DOCTYPE html>\n- ZERO texte avant ou apres le HTML, ZERO markdown, ZERO backtick\n- Tout le CSS doit etre dans une balise <style> dans le <head>\n- Le body doit avoir width:375px, min-height:700px, overflow-x:hidden, margin:0\n\nEXIGENCES VISUELLES OBLIGATOIRES :\n- Interface sombre et moderne (background #0f0f1a ou similaire)\n- Au moins 3 sections distinctes avec du contenu\n- Vraies fausses donnees : noms, chiffres, dates, montants realistes\n- Navigation (tabs ou sidebar ou header avec menu)\n- Au moins 2 cartes ou elements de liste avec donnees\n- Couleurs d'accent vives (violet, bleu, vert, orange selon le type d'app)\n- Icones en emoji ou caracteres unicode\n- Boutons stylises, badges de statut colores\n- Graphique simple en CSS ou SVG si pertinent\n- Avatar ou photo placeholder en CSS\n- REMPLIS TOUT L'ECRAN, pas de vide\n\nSTYLE : moderne, professionnel, dense en information, comme une vraie app en production.";
    var userMsg = "Genere le mockup HTML complet de cette application :\n\nNOM : " + idea.titre + "\nDESCRIPTION : " + idea.concept + "\nFONCTIONNALITES : " + (idea.fonctionnalites || []).join(" | ") + "\nTYPE : " + idea.folder + "\n\nMontre l'ecran PRINCIPAL le plus representatif avec de vraies fausses donnees. Remplis tout l'espace disponible avec du contenu realiste.";
    fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-opus-4-7", max_tokens: 4000, system: systemPrompt, messages: [{ role: "user", content: userMsg }] }),
    }).then(function(r) { return r.json(); }).then(function(data) {
      var html = data.content && data.content[0] ? data.content[0].text : "";
      html = html.replace(/```html/gi, "").replace(/```/g, "").trim();
      setPreviewHtml(html);
      setIsGeneratingPreview(false);
      savePreviewVersion(idea.id, html, previewVersions.length, false);
    }).catch(function() {
      showToast("Erreur generation apercu", "err");
      setIsGeneratingPreview(false);
      setPreviewHtml(null);
    });
  }

  function readFileAsText(file) {
    var needsExtract = file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".doc");

    if (needsExtract) {
      return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var base64 = e.target.result.split(",")[1];
          fetch("/api/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, base64: base64, mimetype: file.type }),
          }).then(function(r) { return r.json(); }).then(function(data) {
            if (data.error) { resolve("[Erreur extraction: " + data.error + "]"); return; }
            var text = data.text || "";
            if (data.truncated) text += "\n\n[Document tronqué à 15 000 caractères]";
            resolve(text);
          }).catch(function() { resolve("[Erreur serveur lors de l'extraction]"); });
        };
        reader.onerror = function() { resolve("[Erreur lecture: " + file.name + "]"); };
        reader.readAsDataURL(file);
      });
    }

    return new Promise(function(resolve) {
      var reader = new FileReader();
      reader.onload = function(e) { resolve(e.target.result); };
      reader.onerror = function() { resolve("[Erreur lecture: " + file.name + "]"); };
      reader.readAsText(file, "UTF-8");
    });
  }

  function analyzeDocuments() {
    if (uploadedDocs.length === 0) return;
    setIsAnalyzing(true);
    setDocResult(null);

    Promise.all(uploadedDocs.map(function(d) { return readFileAsText(d.file); })).then(function(contents) {
      var systemPrompts = {
        resumer: "Tu es un assistant expert en analyse documentaire. Reponds en francais avec du Markdown structure (titres ##, listes -, gras **). Sois precis, concis et utile.",
        analyser: "Tu es un expert en analyse documentaire multi-sources. Reponds en francais avec du Markdown structure. Identifie les themes communs, repetitions, contradictions et points cles de chaque document.",
        restructurer: "Tu es un expert en redaction et organisation documentaire. Reponds en francais avec du Markdown. Reorganise et fusionne les contenus en un document propre, sans repetitions, bien structure avec des sections claires.",
      };
      var userPrompts = {
        resumer: "Voici le document a resumer :\n\n--- " + uploadedDocs[0].name + " ---\n" + contents[0] + "\n\nFais un resume structure avec : points cles, idees principales, conclusions importantes.",
        analyser: contents.map(function(c, i) { return "--- DOCUMENT " + (i+1) + " : " + uploadedDocs[i].name + " ---\n" + c; }).join("\n\n") + "\n\nAnalyse ces " + contents.length + " documents : themes communs, repetitions, idees uniques a chaque doc, contradictions, et synthese globale.",
        restructurer: contents.map(function(c, i) { return "--- DOCUMENT " + (i+1) + " : " + uploadedDocs[i].name + " ---\n" + c; }).join("\n\n") + "\n\nRestructure et fusionne ces documents en un seul document propre et coherent. Elimine les repetitions, organise par themes, garde les meilleures formulations.",
      };

      fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-opus-4-7", max_tokens: 4000, system: systemPrompts[docMode], messages: [{ role: "user", content: userPrompts[docMode] }] }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        var text = data.content && data.content[0] ? data.content[0].text : "Aucun resultat.";
        setDocResult(text);
        setIsAnalyzing(false);
      }).catch(function() {
        showToast("Erreur analyse", "err");
        setIsAnalyzing(false);
      });
    });
  }

  function downloadDocResult(format) {
    if (!docResult) return;
    var modeLabels = { resumer: "Resume", analyser: "Analyse", restructurer: "Document_restructure" };
    var baseName = modeLabels[docMode] + "_" + new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
    if (format === "md") {
      var blob = new Blob([docResult], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a"); a.href = url; a.download = baseName + ".md"; a.click();
      URL.revokeObjectURL(url);
      showToast("Markdown telecharge !");
    } else if (format === "txt") {
      var plain = docResult.replace(/#{1,3} /g, "").replace(/\*\*/g, "");
      var blob2 = new Blob([plain], { type: "text/plain;charset=utf-8" });
      var url2 = URL.createObjectURL(blob2);
      var a2 = document.createElement("a"); a2.href = url2; a2.download = baseName + ".txt"; a2.click();
      URL.revokeObjectURL(url2);
      showToast("TXT telecharge !");
    } else if (format === "html") {
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#222;line-height:1.7}h1,h2,h3{color:#1a5276}strong{color:#1a5276}</style></head><body>" + renderMarkdown(docResult).replace(/style='[^']*'/g, "") + "</body></html>";
      var blob3 = new Blob([html], { type: "text/html;charset=utf-8" });
      var url3 = URL.createObjectURL(blob3);
      var a3 = document.createElement("a"); a3.href = url3; a3.download = baseName + ".html"; a3.click();
      URL.revokeObjectURL(url3);
      showToast("HTML telecharge !");
    }
    setShowDownloadMenu(false);
  }

  function saveDocResult() {
    if (!docResult) return;
    var modeLabels = { resumer: "Résumé", analyser: "Analyse", restructurer: "Document restructuré" };
    var doc = {
      id: Date.now(),
      titre: modeLabels[docMode] + " — " + new Date().toLocaleDateString("fr-FR"),
      mode: docMode,
      contenu: docResult,
      date: new Date().toLocaleDateString("fr-FR"),
      ts: Date.now(),
    };
    sbFetch("saved_docs", "POST", doc).then(function() {
      showToast("Document sauvegardé !");
      loadSavedDocs();
    }).catch(function() { showToast("Erreur sauvegarde", "err"); });
  }

  function loadSavedDocs() {
    sbFetch("saved_docs?select=*&order=ts.desc").then(function(data) {
      if (Array.isArray(data)) setSavedDocs(data);
    }).catch(function() {});
  }

  function deleteSavedDoc(id) {
    sbFetch("saved_docs?id=eq." + id, "DELETE").then(function() {
      setSavedDocs(function(prev) { return prev.filter(function(d) { return d.id !== id; }); });
      showToast("Document supprimé");
    }).catch(function() { showToast("Erreur suppression", "err"); });
  }

  function renderMarkdown(text) {
    return text
      .replace(/^### (.+)$/gm, "<h3 style='color:#00aaff;font-size:13px;margin:14px 0 6px;letter-spacing:0.08em'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 style='color:#00ccff;font-size:15px;margin:16px 0 8px;letter-spacing:0.06em;border-bottom:1px solid #00aaff22;padding-bottom:6px'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 style='color:#00e5ff;font-size:17px;margin:18px 0 10px;letter-spacing:0.05em'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong style='color:#c8ffd4'>$1</strong>")
      .replace(/^- (.+)$/gm, "<div style='display:flex;gap:8px;margin:3px 0'><span style='color:#00aaff;flex-shrink:0'>›</span><span>$1</span></div>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");
  }

  function loadFiles(ideaId) {
    var id = String(ideaId);
    fetch(SUPABASE_URL + "/storage/v1/object/list/idea-files", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ prefix: id + "/", limit: 100, sortBy: { column: "created_at", order: "desc" } }),
    }).then(function(r) { return r.json(); }).then(function(data) {
      console.log("loadFiles response:", JSON.stringify(data));
      if (Array.isArray(data)) {
        // Filtrer les dossiers (name vide ou se terminant par /)
        var files = data.filter(function(f) { return f.name && f.name !== "" && !f.name.endsWith("/"); });
        setIdeaFiles(function(prev) { return Object.assign({}, prev, { [id]: files }); });
        console.log("files set:", files.length, files.map(function(f){return f.name;}));
      } else {
        console.log("loadFiles: data n'est pas un array:", typeof data, data);
      }
    }).catch(function(err) { console.log("loadFiles error:", err); });
  }

  function uploadFile(ideaId, file) {
    setIsUploading(true);
    var path = ideaId + "/" + Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    return fetch(SUPABASE_URL + "/storage/v1/object/idea-files/" + path, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": file.type || "application/octet-stream" },
      body: file,
    }).then(function(r) { return r.json(); }).then(function() {
      return true;
    }).catch(function() {
      return false;
    });
  }

  function uploadFiles(ideaId, files) {
    setIsUploading(true);
    var promises = files.map(function(f) { return uploadFile(ideaId, f); });
    Promise.all(promises).then(function() {
      setIsUploading(false);
      showToast(files.length > 1 ? files.length + " fichiers ajoutes !" : "Fichier ajoute !");
      // Petit délai pour que Supabase indexe les fichiers
      setTimeout(function() { loadFiles(ideaId); }, 800);
    }).catch(function() {
      setIsUploading(false);
      showToast("Erreur upload", "err");
      setTimeout(function() { loadFiles(ideaId); }, 800);
    });
  }

  function deleteFile(ideaId, fileName) {
    fetch(SUPABASE_URL + "/storage/v1/object/idea-files/" + ideaId + "/" + fileName, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY },
    }).then(function() {
      showToast("Fichier supprime");
      loadFiles(ideaId);
    }).catch(function() { showToast("Erreur suppression", "err"); });
  }

  function getFileUrl(ideaId, fileName) {
    return SUPABASE_URL + "/storage/v1/object/public/idea-files/" + ideaId + "/" + fileName;
  }

  function getFileIcon(name) {
    var ext = (name || "").split(".").pop().toLowerCase();
    if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return "🖼";
    if (["pdf"].includes(ext)) return "📄";
    if (["mp4","mov","avi","mkv"].includes(ext)) return "🎬";
    if (["mp3","wav","ogg"].includes(ext)) return "🎵";
    if (["zip","rar","7z"].includes(ext)) return "📦";
    if (["doc","docx","txt","md"].includes(ext)) return "📝";
    if (["xls","xlsx","csv"].includes(ext)) return "📊";
    return "📎";
  }

  function isImage(name) {
    var ext = (name || "").split(".").pop().toLowerCase();
    return ["jpg","jpeg","png","gif","webp","svg"].includes(ext);
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
            <button onClick={function() { setScreen("docs"); }} style={{ background: screen === "docs" ? "rgba(0,180,255,0.08)" : "transparent", border: "1px solid " + (screen === "docs" ? "#00aaff44" : "#00ff8818"), borderRadius: "4px", color: screen === "docs" ? "#00aaff" : "#88bbaa", padding: "7px 10px", cursor: "pointer", fontSize: "11px", letterSpacing: "0.08em" }}>📄 DOCS</button>
            <button onClick={function() { setScreen("ideas"); }} style={{ background: screen === "ideas" ? "rgba(0,255,136,0.08)" : "transparent", border: "1px solid " + (screen === "ideas" ? "#00ff8844" : "#00ff8818"), borderRadius: "4px", color: screen === "ideas" ? "#00ff88" : "#88bbaa", padding: "7px 10px", cursor: "pointer", fontSize: "11px", letterSpacing: "0.08em" }}>LISTE</button>
            <button onClick={loadIdeas} style={{ background: "transparent", border: "1px solid #00ff8818", borderRadius: "4px", color: "#88bbaa", padding: "7px 10px", cursor: "pointer", fontSize: "13px" }}>⟳</button>
          </div>
        </div>
      </div>
    );
  }

  // DOCS
  if (!unlocked) return <PinScreen onUnlock={function() { setUnlocked(true); }} />;

  if (screen === "docs") return (
    <div style={wrap}>
      <BG/><Header back={true} backLabel="ACCUEIL" backAction={function() { setScreen("home"); }}/>
      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Titre + onglets */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#00aaff", textShadow: "0 0 20px #00aaff, 0 0 40px #00aaff66", letterSpacing: "0.08em", marginBottom: "10px" }}>📄 GESTIONNAIRE DOCS</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={function() { setDocTab("analyser"); }} style={{ flex: 1, background: docTab === "analyser" ? "rgba(0,170,255,0.1)" : "transparent", border: "1px solid " + (docTab === "analyser" ? "#00aaff55" : "#00aaff15"), borderRadius: "5px", color: docTab === "analyser" ? "#00aaff" : "#88bbaa", padding: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em" }}>⚡ ANALYSER</button>
            <button onClick={function() { setDocTab("sauvegardes"); loadSavedDocs(); }} style={{ flex: 1, background: docTab === "sauvegardes" ? "rgba(0,170,255,0.1)" : "transparent", border: "1px solid " + (docTab === "sauvegardes" ? "#00aaff55" : "#00aaff15"), borderRadius: "5px", color: docTab === "sauvegardes" ? "#00aaff" : "#88bbaa", padding: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em" }}>💾 SAUVEGARDES {savedDocs.length > 0 ? "(" + savedDocs.length + ")" : ""}</button>
          </div>
        </div>

        {docTab === "analyser" && (
        <div>
        {/* Modes */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          {[
            { id: "resumer", label: "📋 RÉSUMER", desc: "1 doc", color: "#00aaff" },
            { id: "analyser", label: "🔍 ANALYSER", desc: "multi-docs", color: "#bf5fff" },
            { id: "restructurer", label: "✨ RESTRUCTURER", desc: "fusionner", color: "#00ffcc" },
          ].map(function(m) {
            return (
              <button key={m.id} onClick={function() { setDocMode(m.id); setDocResult(null); }} style={{ flex: 1, background: docMode === m.id ? m.color + "15" : "transparent", border: "1px solid " + (docMode === m.id ? m.color + "66" : "#00ff8815"), borderRadius: "6px", padding: "10px 6px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: docMode === m.id ? m.color : "#88bbaa", letterSpacing: "0.06em" }}>{m.label}</div>
                <div style={{ fontSize: "9px", color: docMode === m.id ? m.color + "99" : "#445544", marginTop: "2px" }}>{m.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Zone upload */}
        <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00aaff22", borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em" }}>
              {docMode === "resumer" ? "DOCUMENT A ANALYSER (1 MAX)" : "DOCUMENTS A ANALYSER (2-5)"}
            </div>
            <button onClick={function() { if (docFileInputRef.current) docFileInputRef.current.click(); }} style={{ background: "rgba(0,170,255,0.1)", border: "1px solid #00aaff44", borderRadius: "3px", color: "#00aaff", padding: "5px 12px", cursor: "pointer", fontSize: "10px", fontWeight: "700", letterSpacing: "0.06em" }}>
              + AJOUTER
            </button>
            <input ref={docFileInputRef} type="file" multiple={docMode !== "resumer"} accept=".txt,.md,.doc,.docx,.pdf,.csv" style={{ display: "none" }} onChange={function(e) {
              var files = Array.from(e.target.files);
              var newDocs = files.map(function(f) { return { name: f.name, size: f.size, file: f, id: Date.now() + Math.random() }; });
              if (docMode === "resumer") { setUploadedDocs(newDocs.slice(0, 1)); }
              else { setUploadedDocs(function(prev) { return prev.concat(newDocs).slice(0, 5); }); }
              e.target.value = "";
            }}/>
          </div>

          {uploadedDocs.length === 0 ? (
            <div onClick={function() { if (docFileInputRef.current) docFileInputRef.current.click(); }} style={{ border: "1px dashed #00aaff22", borderRadius: "4px", padding: "24px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.4 }}>📂</div>
              <div style={{ fontSize: "11px", color: "#445566", letterSpacing: "0.1em" }}>CLIQUE POUR AJOUTER UN DOCUMENT</div>
              <div style={{ fontSize: "9px", color: "#334433", marginTop: "4px" }}>TXT · MD · DOC · PDF · CSV</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {uploadedDocs.map(function(doc) {
                return (
                  <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,170,255,0.04)", border: "1px solid #00aaff15", borderRadius: "4px", padding: "8px 12px" }}>
                    <span style={{ fontSize: "18px" }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "11px", color: "#aaccdd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
                      <div style={{ fontSize: "9px", color: "#445566", marginTop: "1px" }}>{(doc.size / 1024).toFixed(0)} Ko</div>
                    </div>
                    <button onClick={function() { setUploadedDocs(function(prev) { return prev.filter(function(d) { return d.id !== doc.id; }); }); }} style={{ background: "transparent", border: "none", color: "#ff6677", cursor: "pointer", fontSize: "12px" }}>✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton analyser */}
        {uploadedDocs.length > 0 && (
          <button onClick={analyzeDocuments} disabled={isAnalyzing} style={{ width: "100%", background: isAnalyzing ? "transparent" : "rgba(0,170,255,0.1)", border: "1px solid " + (isAnalyzing ? "#00aaff22" : "#00aaff55"), borderRadius: "6px", color: isAnalyzing ? "#88bbaa" : "#00aaff", padding: "13px", cursor: isAnalyzing ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textShadow: isAnalyzing ? "none" : "0 0 14px #00aaff66", marginBottom: "14px", transition: "all 0.2s", fontFamily: "inherit" }}>
            {isAnalyzing ? "ANALYSE EN COURS..." : (docMode === "resumer" ? "📋 RÉSUMER CE DOCUMENT" : docMode === "analyser" ? "🔍 ANALYSER LES DOCUMENTS" : "✨ RESTRUCTURER ET FUSIONNER")}
          </button>
        )}

        {/* Résultat */}
        {isAnalyzing && (
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00aaff22", borderRadius: "6px", padding: "32px", textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px", animation: "pulse 1.2s infinite" }}>🤖</div>
            <div style={{ fontSize: "12px", color: "#00aaff", letterSpacing: "0.15em", animation: "pulse 1.2s infinite" }}>CLAUDE ANALYSE...</div>
            <div style={{ fontSize: "10px", color: "#445566", marginTop: "6px" }}>Cela peut prendre quelques secondes</div>
          </div>
        )}

        {docResult && !isAnalyzing && (
          <div style={{ background: "rgba(2,14,8,0.95)", border: "1px solid #00aaff22", borderRadius: "6px", padding: "18px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", color: "#00aaff88", letterSpacing: "0.15em" }}>
                {docMode === "resumer" ? "📋 RESUME" : docMode === "analyser" ? "🔍 ANALYSE" : "✨ DOCUMENT RESTRUCTURE"}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button onClick={function() { setDocExpanded(true); }} style={{ background: "transparent", border: "1px solid #00aaff33", borderRadius: "3px", color: "#00aaff88", padding: "4px 10px", cursor: "pointer", fontSize: "10px" }}>⛶ AGRANDIR</button>
                <button onClick={function() { navigator.clipboard.writeText(docResult); showToast("Copie !"); }} style={{ background: "transparent", border: "1px solid #00aaff33", borderRadius: "3px", color: "#00aaff88", padding: "4px 10px", cursor: "pointer", fontSize: "10px" }}>COPIER</button>
                <button onClick={saveDocResult} style={{ background: "rgba(0,255,136,0.08)", border: "1px solid #00ff8844", borderRadius: "3px", color: "#00ff88", padding: "4px 10px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}>💾 SAUV.</button>
                <div style={{ position: "relative" }}>
                  <button onClick={function() { setShowDownloadMenu(function(v) { return !v; }); }} style={{ background: "rgba(0,170,255,0.1)", border: "1px solid #00aaff55", borderRadius: "3px", color: "#00aaff", padding: "4px 10px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}>⬇ FORMAT ▾</button>
                  {showDownloadMenu && (
                    <div style={{ position: "absolute", right: 0, top: "110%", background: "#020e06", border: "1px solid #00aaff33", borderRadius: "4px", zIndex: 50, minWidth: "120px", overflow: "hidden" }}>
                      {[{f:"md", label:"📝 Markdown"}, {f:"txt", label:"📄 Texte .txt"}, {f:"html", label:"🌐 HTML"}].map(function(item) {
                        return <button key={item.f} onClick={function() { downloadDocResult(item.f); }} style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #00aaff11", color: "#aaccdd", padding: "9px 14px", cursor: "pointer", fontSize: "11px", textAlign: "left", fontFamily: "inherit" }}>{item.label}</button>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#99ccaa", lineHeight: "1.8", maxHeight: "400px", overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(docResult) }}/>
          </div>
        )}

        </div>
        )} {/* fin docTab analyser */}

        {docTab === "sauvegardes" && (
          <div>
            {savedDocs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#334433", fontSize: "12px", letterSpacing: "0.12em" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>💾</div>
                AUCUN DOCUMENT SAUVEGARDE
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {savedDocs.map(function(doc) {
                  return (
                    <div key={doc.id} style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00aaff15", borderRadius: "6px", padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <div>
                          <div style={{ fontSize: "12px", color: "#aaccdd", fontWeight: "700" }}>{doc.titre}</div>
                          <div style={{ fontSize: "9px", color: "#445566", marginTop: "2px", letterSpacing: "0.08em" }}>{doc.date} · {doc.mode === "resumer" ? "RÉSUMÉ" : doc.mode === "analyser" ? "ANALYSE" : "RESTRUCTURÉ"}</div>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={function() { setDocResult(doc.contenu); setDocExpanded(true); setDocTab("analyser"); }} style={{ background: "transparent", border: "1px solid #00aaff33", borderRadius: "3px", color: "#00aaff77", padding: "4px 8px", cursor: "pointer", fontSize: "10px" }}>👁 VOIR</button>
                          <button onClick={function() { navigator.clipboard.writeText(doc.contenu); showToast("Copié !"); }} style={{ background: "transparent", border: "1px solid #00aaff22", borderRadius: "3px", color: "#00aaff55", padding: "4px 8px", cursor: "pointer", fontSize: "10px" }}>COPIER</button>
                          <button onClick={function() { deleteSavedDoc(doc.id); }} style={{ background: "transparent", border: "1px solid #ff446633", borderRadius: "3px", color: "#ff6677", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }}>🗑</button>
                        </div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#556655", lineHeight: "1.5", maxHeight: "60px", overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent)" }}>
                        {doc.contenu.replace(/#{1,3} /g, "").replace(/\*\*/g, "").slice(0, 200)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )} {/* fin sauvegardes */}

        {/* Modal plein écran résultat */}
        {docExpanded && docResult && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,8,4,0.98)", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "rgba(3,10,5,0.99)", borderBottom: "1px solid #00aaff33", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: "13px", color: "#00aaff", fontWeight: "700", letterSpacing: "0.1em" }}>
                {docMode === "resumer" ? "📋 RESUME" : docMode === "analyser" ? "🔍 ANALYSE" : "✨ DOCUMENT RESTRUCTURE"}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={function() { navigator.clipboard.writeText(docResult); showToast("Copie !"); }} style={{ background: "transparent", border: "1px solid #00aaff33", borderRadius: "4px", color: "#00aaff88", padding: "6px 12px", cursor: "pointer", fontSize: "10px" }}>COPIER</button>
                <div style={{ position: "relative" }}>
                  <button onClick={function() { setShowDownloadMenu(function(v) { return !v; }); }} style={{ background: "rgba(0,170,255,0.1)", border: "1px solid #00aaff55", borderRadius: "4px", color: "#00aaff", padding: "6px 12px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}>⬇ FORMAT ▾</button>
                  {showDownloadMenu && (
                    <div style={{ position: "absolute", right: 0, top: "110%", background: "#020e06", border: "1px solid #00aaff33", borderRadius: "4px", zIndex: 50, minWidth: "130px", overflow: "hidden" }}>
                      {[{f:"md", label:"📝 Markdown"}, {f:"txt", label:"📄 Texte .txt"}, {f:"html", label:"🌐 HTML"}].map(function(item) {
                        return <button key={item.f} onClick={function() { downloadDocResult(item.f); }} style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #00aaff11", color: "#aaccdd", padding: "9px 14px", cursor: "pointer", fontSize: "11px", textAlign: "left", fontFamily: "inherit" }}>{item.label}</button>;
                      })}
                    </div>
                  )}
                </div>
                <button onClick={function() { setDocExpanded(false); setShowDownloadMenu(false); }} style={{ background: "transparent", border: "1px solid #ff446644", borderRadius: "4px", color: "#ff8899", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>✕ FERMER</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
              <div style={{ fontSize: "14px", color: "#99ccaa", lineHeight: "2" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(docResult) }}/>
            </div>
          </div>
        )}

      </div>
      {toast && <Toast toast={toast}/>}<Styles/>
    </div>
  );

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
              style={{ width: "100%", minHeight: "120px", background: "#020e06", border: "1px solid " + f.color + "18", borderRadius: "4px", color: "#c8ffd4", fontSize: "14px", fontFamily: "inherit", lineHeight: "1.7", padding: "12px 14px", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "10px" }}
            />

            {/* Sélecteur de modèle */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              {[
                { id: "claude-sonnet-4-6", label: "⚡ SONNET", desc: "Rapide", color: "#00aaff" },
                { id: "claude-opus-4-7", label: "🧠 OPUS", desc: "Puissant", color: "#cc88ff" },
              ].map(function(m) {
                var active = selectedModel === m.id;
                return (
                  <button key={m.id} onClick={function() { setSelectedModel(m.id); }} style={{ flex: 1, background: active ? m.color + "15" : "transparent", border: "1px solid " + (active ? m.color + "66" : f.color + "15"), borderRadius: "4px", padding: "6px", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: active ? m.color : "#556655", letterSpacing: "0.06em" }}>{m.label}</div>
                    <div style={{ fontSize: "9px", color: active ? m.color + "99" : "#334433", marginTop: "1px" }}>{m.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Fichiers en attente */}
            <div style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: pendingFiles.length > 0 ? "10px" : "0" }}>
                <button onClick={function() { if (pendingFileInputRef.current) pendingFileInputRef.current.click(); }} style={{ background: pendingFiles.length > 0 ? f.color + "12" : "transparent", border: "1px solid " + (pendingFiles.length > 0 ? f.color + "55" : f.color + "33"), borderRadius: "3px", color: pendingFiles.length > 0 ? f.color : f.color + "88", padding: "5px 12px", cursor: "pointer", fontSize: "10px", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px", position: "relative", transition: "all 0.2s" }}>
                  📎 JOINDRE
                  {pendingFiles.length > 0 && (
                    <span style={{ background: f.color, color: "#020e06", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "900", flexShrink: 0 }}>{pendingFiles.length}</span>
                  )}
                </button>
                <input ref={pendingFileInputRef} type="file" multiple accept="*/*" style={{ display: "none" }} onChange={function(e) { var files = Array.from(e.target.files); setPendingFiles(function(prev) { return prev.concat(files); }); e.target.value = ""; }}/>
              </div>

              {pendingFiles.length > 0 && (
                <div>
                  {/* Miniatures images */}
                  {pendingFiles.some(function(f) { return isImage(f.name); }) && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                      {pendingFiles.filter(function(fi) { return isImage(fi.name); }).map(function(file, idx) {
                        var url = URL.createObjectURL(file);
                        return (
                          <div key={idx} style={{ position: "relative" }}>
                            <img src={url} alt={file.name} style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "4px", border: "1px solid " + f.color + "33" }}/>
                            <button onClick={function() { setPendingFiles(function(prev) { return prev.filter(function(fi) { return fi !== file; }); }); }} style={{ position: "absolute", top: "-4px", right: "-4px", background: "#ff4466", border: "none", borderRadius: "50%", width: "14px", height: "14px", color: "#fff", cursor: "pointer", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Autres fichiers */}
                  {pendingFiles.filter(function(fi) { return !isImage(fi.name); }).length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      {pendingFiles.filter(function(fi) { return !isImage(fi.name); }).map(function(file, idx) {
                        return (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,255,136,0.03)", border: "1px solid #00ff8812", borderRadius: "4px", padding: "5px 10px" }}>
                            <span style={{ fontSize: "14px", flexShrink: 0 }}>{getFileIcon(file.name)}</span>
                            <span style={{ flex: 1, fontSize: "11px", color: "#aaccbb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                            <span style={{ fontSize: "9px", color: "#445544", flexShrink: 0 }}>{(file.size / 1024).toFixed(0)} Ko</span>
                            <button onClick={function() { setPendingFiles(function(prev) { return prev.filter(function(fi) { return fi !== file; }); }); }} style={{ background: "transparent", border: "none", color: "#ff6677", cursor: "pointer", fontSize: "12px", padding: "0 2px", flexShrink: 0 }}>✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={isRecording ? stopRecording : function() { startRecording(setRawInput); }} style={{ background: isRecording ? "#ff446615" : "transparent", border: isRecording ? "1px solid #ff446644" : "1px solid " + f.color + "22", borderRadius: "4px", color: isRecording ? "#ff8899" : f.color + "88", padding: "10px 16px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                🎤 {isRecording ? "STOP" : "VOCAL"}
              </button>
              <button onClick={saveRawIdea} disabled={!rawInput.trim() || isProcessing} style={{ background: rawInput.trim() && !isProcessing ? "rgba(0,255,136,0.06)" : "transparent", border: "1px solid " + (rawInput.trim() && !isProcessing ? "#00ff8844" : "#00ff8815"), borderRadius: "4px", color: rawInput.trim() && !isProcessing ? "#00ff88" : "#445544", padding: "10px 14px", cursor: rawInput.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                💾 SAUV.
              </button>
              <button onClick={pendingFiles.length > 0 ? generateIdeaWithFiles : generateIdea} disabled={!rawInput.trim() || isProcessing || isExtractingFiles} style={{ flex: 1, background: rawInput.trim() && !isProcessing ? f.color + "18" : "transparent", border: "1px solid " + (rawInput.trim() && !isProcessing ? f.color : f.color + "20"), borderRadius: "4px", color: rawInput.trim() && !isProcessing ? f.color : "#88bbaa", padding: "10px", cursor: rawInput.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textShadow: rawInput.trim() && !isProcessing ? "0 0 14px " + f.color : "none", transition: "all 0.2s" }}>
                {isExtractingFiles ? "LECTURE FICHIERS..." : isProcessing ? "GENERATION..." : pendingFiles.length > 0 ? "GENERER + FICHIERS (" + pendingFiles.length + ") — " + f.label.toUpperCase() : "GENERER — " + f.label.toUpperCase()}
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
    var ideaKey = String(idea.id);
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

          {/* MODIFIER / COMPLETER + FICHIERS */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid " + (isEditing ? fc + "66" : "#00ff8815"), borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em" }}>✏ MODIFIER / COMPLETER</div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button onClick={function() { if (fileInputRef.current) fileInputRef.current.click(); }} disabled={isUploading} style={{ background: isUploading ? "transparent" : "rgba(0,255,136,0.08)", border: "1px solid #00ff8833", borderRadius: "3px", color: isUploading ? "#88bbaa" : "#00ff88", padding: "4px 10px", cursor: isUploading ? "not-allowed" : "pointer", fontSize: "10px", fontWeight: "700", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
                  {isUploading ? "UPLOAD..." : "📎 FICHIER"}
                  {!isUploading && (ideaFiles[ideaKey] || []).length > 0 && (
                    <span style={{ background: "#00ff88", color: "#020e06", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "900", flexShrink: 0 }}>{(ideaFiles[ideaKey] || []).length}</span>
                  )}
                </button>
                <button onClick={function() { loadFiles(ideaKey); }} style={{ background: "transparent", border: "1px solid #00ff8820", borderRadius: "3px", color: "#00ff8866", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }} title="Rafraîchir les fichiers">⟳</button>
                <input ref={fileInputRef} type="file" multiple accept="*/*" style={{ display: "none" }} onChange={function(e) { var files = Array.from(e.target.files); uploadFiles(ideaKey, files); e.target.value = ""; }}/>
                {!isEditing ? (
                  <button onClick={function() { setEditMode(true); setEditingId(idea.id); setEditText(idea.raw || ""); }} style={{ background: fc + "18", border: "1px solid " + fc + "55", borderRadius: "4px", color: fc, padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textShadow: "0 0 8px " + fc }}>
                    MODIFIER
                  </button>
                ) : (
                  <button onClick={function() { setEditMode(false); setEditText(""); setEditingId(null); }} style={{ background: "transparent", border: "1px solid #ff446633", borderRadius: "4px", color: "#ff8899", padding: "6px 12px", cursor: "pointer", fontSize: "11px" }}>
                    ANNULER
                  </button>
                )}
              </div>
            </div>

            {/* Liste fichiers joints */}
            {(ideaFiles[ideaKey] || []).length > 0 && (
              <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #00ff8810" }}>
                {/* Miniatures images */}
                {(ideaFiles[ideaKey] || []).some(function(f) { return isImage(f.name || ""); }) && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                    {(ideaFiles[ideaKey] || []).filter(function(f) { return isImage(f.name || ""); }).map(function(file) {
                      var rawName = file.name || "";
                      var displayName = rawName.replace(/^\d+_/, "");
                      var url = getFileUrl(idea.id, rawName);
                      return (
                        <div key={rawName} style={{ position: "relative" }}>
                          <a href={url} target="_blank" rel="noreferrer">
                            <img src={url} alt={displayName} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "4px", border: "1px solid #00ff8833", display: "block" }}/>
                          </a>
                          <button onClick={function() { deleteFile(ideaKey, rawName); }} style={{ position: "absolute", top: "-4px", right: "-4px", background: "#ff4466", border: "none", borderRadius: "50%", width: "14px", height: "14px", color: "#fff", cursor: "pointer", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Autres fichiers */}
                {(ideaFiles[ideaKey] || []).filter(function(f) { return !isImage(f.name || ""); }).length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {(ideaFiles[ideaKey] || []).filter(function(f) { return !isImage(f.name || ""); }).map(function(file) {
                      var rawName = file.name || "";
                      var displayName = rawName.replace(/^\d+_/, "");
                      var url = getFileUrl(idea.id, rawName);
                      return (
                        <div key={rawName} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,255,136,0.03)", border: "1px solid #00ff8812", borderRadius: "4px", padding: "7px 10px" }}>
                          <span style={{ fontSize: "18px", flexShrink: 0 }}>{getFileIcon(rawName)}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <a href={url} target="_blank" rel="noreferrer" style={{ color: "#aaccbb", fontSize: "11px", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</a>
                            <div style={{ fontSize: "9px", color: "#445544", marginTop: "1px" }}>{file.metadata && file.metadata.size ? (file.metadata.size / 1024).toFixed(0) + " Ko" : ""}</div>
                          </div>
                          <button onClick={function() { deleteFile(ideaKey, rawName); }} style={{ background: "transparent", border: "1px solid #ff446633", borderRadius: "3px", color: "#ff6677", padding: "3px 7px", cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>🗑</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {isEditing && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ fontSize: "10px", color: fc + "88", letterSpacing: "0.12em" }}>MODIFIE OU COMPLETE TON IDEE ORIGINALE</div>
                  <button onClick={function() { setEditExpanded(true); }} style={{ background: "transparent", border: "1px solid " + fc + "33", borderRadius: "3px", color: fc + "77", padding: "3px 8px", cursor: "pointer", fontSize: "9px", letterSpacing: "0.06em" }}>⛶ PLEIN ECRAN</button>
                </div>
                <textarea ref={editRef} value={editText} onChange={function(e) { setEditText(e.target.value); }}
                  style={{ width: "100%", minHeight: "100px", background: "#020e06", border: "1px solid " + fc + "33", borderRadius: "4px", color: "#c8ffd4", fontSize: "13px", fontFamily: "inherit", lineHeight: "1.7", padding: "10px 14px", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "10px" }}
                />
                {/* Sélecteur modèle */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  {[
                    { id: "claude-sonnet-4-6", label: "⚡ SONNET", desc: "Rapide", color: "#00aaff" },
                    { id: "claude-opus-4-7", label: "🧠 OPUS", desc: "Puissant", color: "#cc88ff" },
                  ].map(function(m) {
                    var active = selectedModel === m.id;
                    return (
                      <button key={m.id} onClick={function() { setSelectedModel(m.id); }} style={{ flex: 1, background: active ? m.color + "15" : "transparent", border: "1px solid " + (active ? m.color + "55" : fc + "15"), borderRadius: "4px", padding: "5px", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: active ? m.color : "#556655", letterSpacing: "0.06em" }}>{m.label}</div>
                        <div style={{ fontSize: "8px", color: active ? m.color + "99" : "#334433", marginTop: "1px" }}>{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={isRecording ? stopRecording : function() { startRecording(setEditText); }} style={{ background: isRecording ? "#ff446615" : "transparent", border: isRecording ? "1px solid #ff446644" : "1px solid " + fc + "22", borderRadius: "4px", color: isRecording ? "#ff8899" : fc + "88", padding: "8px 14px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    🎤 {isRecording ? "STOP" : "VOCAL"}
                  </button>
                  <button onClick={function() { if (!editText.trim()) return; updateIdea(idea.id, { raw: editText }); setEditMode(false); setEditText(""); setEditingId(null); showToast("Idee sauvegardee !"); }} disabled={!editText.trim()} style={{ background: editText.trim() ? "rgba(0,255,136,0.08)" : "transparent", border: "1px solid " + (editText.trim() ? "#00ff8844" : "#00ff8815"), borderRadius: "4px", color: editText.trim() ? "#00ff88" : "#445544", padding: "8px 12px", cursor: editText.trim() ? "pointer" : "not-allowed", fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                    💾 SAUV.
                  </button>
                  <button onClick={function() { regenerateIdea(idea); }} disabled={!editText.trim() || isProcessing} style={{ flex: 1, background: editText.trim() && !isProcessing ? fc + "18" : "transparent", border: "1px solid " + (editText.trim() && !isProcessing ? fc : fc + "20"), borderRadius: "4px", color: editText.trim() && !isProcessing ? fc : "#88bbaa", padding: "8px", cursor: editText.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textShadow: editText.trim() && !isProcessing ? "0 0 10px " + fc : "none", transition: "all 0.2s" }}>
                    {isProcessing ? "REGENERATION..." : "⚡ REGENERER AVEC L'IA"}
                  </button>
                  {(ideaFiles[String(idea.id)] || []).length > 0 && (
                    <button onClick={function() { regenerateIdeaWithFiles(idea); }} disabled={!editText.trim() || isProcessing} style={{ background: editText.trim() && !isProcessing ? "rgba(0,170,255,0.1)" : "transparent", border: "1px solid " + (editText.trim() && !isProcessing ? "#00aaff55" : "#00aaff15"), borderRadius: "4px", color: editText.trim() && !isProcessing ? "#00aaff" : "#445566", padding: "8px 10px", cursor: editText.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "10px", fontWeight: "700", letterSpacing: "0.04em", whiteSpace: "nowrap", transition: "all 0.2s" }} title={"Regenerer en incluant les " + (ideaFiles[String(idea.id)] || []).length + " fichier(s) joints"}>
                      📄 +FICHIERS
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fonctionnalites */}
          <div style={{ background: "rgba(2,14,8,0.9)", border: "1px solid #00ff8815", borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: "#88bbaa", letterSpacing: "0.15em" }}>FONCTIONNALITES</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={function() { setIdeaExpanded("fonctions"); }} style={{ background: "transparent", border: "1px solid " + fc + "33", borderRadius: "3px", color: fc + "77", padding: "3px 8px", cursor: "pointer", fontSize: "9px" }}>⛶ AGRANDIR</button>
                <div style={{ position: "relative" }}>
                  <button onClick={function() { setShowIdeaDownload(function(v) { return !v; }); }} style={{ background: "transparent", border: "1px solid " + fc + "33", borderRadius: "3px", color: fc + "77", padding: "3px 8px", cursor: "pointer", fontSize: "9px" }}>⬇ FORMAT</button>
                  {showIdeaDownload && (
                    <div style={{ position: "absolute", right: 0, top: "110%", background: "#020e06", border: "1px solid #00ff8822", borderRadius: "4px", zIndex: 50, minWidth: "120px", overflow: "hidden" }}>
                      {[{f:"md",label:"📝 Markdown"},{f:"txt",label:"📄 Texte"},{f:"html",label:"🌐 HTML"}].map(function(item) {
                        return <button key={item.f} onClick={function() { downloadIdea(idea, item.f); }} style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #00ff8811", color: "#aaccaa", padding: "8px 14px", cursor: "pointer", fontSize: "11px", textAlign: "left", fontFamily: "inherit" }}>{item.label}</button>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {foncs.map(function(ft, i) {
              return <div key={i} style={{ display: "flex", gap: "10px", padding: "6px 0", borderBottom: i < foncs.length - 1 ? "1px solid #00ff8810" : "none", fontSize: "13px", color: "#99ccaa" }}>
                <span style={{ color: fc, flexShrink: 0 }}>{">"}</span>{ft}
              </div>;
            })}
          </div>

          {/* Prompt */}
          {idea.prompt && (
            <div style={{ background: "#020d0a", border: "1px solid #00ccff22", borderRadius: "6px", padding: "16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "#00ccff88", letterSpacing: "0.15em" }}>PROMPT POUR CLAUDE</div>
                <button onClick={function() { setIdeaExpanded("prompt"); }} style={{ background: "transparent", border: "1px solid #00ccff33", borderRadius: "3px", color: "#00ccff77", padding: "3px 8px", cursor: "pointer", fontSize: "9px" }}>⛶ AGRANDIR</button>
              </div>
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
              <button onClick={function() { generatePreview(idea); }} disabled={isGeneratingPreview} style={{ width: "100%", marginTop: "8px", background: isGeneratingPreview ? "transparent" : "rgba(180,0,255,0.08)", border: "1px solid " + (isGeneratingPreview ? "#55335588" : "rgba(180,0,255,0.4)"), borderRadius: "4px", color: isGeneratingPreview ? "#88bbaa" : "#cc88ff", padding: "10px", cursor: isGeneratingPreview ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textShadow: isGeneratingPreview ? "none" : "0 0 10px #cc88ff66", transition: "all 0.2s" }}>
                {isGeneratingPreview ? "GENERATION APERCU..." : "🖥 VISUALISER L'INTERFACE"}
              </button>
              {previewVersions.length > 0 && (
                <button onClick={function() { setPreviewHtml(previewVersions[0].html); setActiveVersion(previewVersions[0].id); setShowGallery(true); }} style={{ width: "100%", marginTop: "6px", background: "rgba(180,0,255,0.05)", border: "1px solid #cc88ff22", borderRadius: "4px", color: "#cc88ff88", padding: "8px", cursor: "pointer", fontSize: "11px", letterSpacing: "0.06em" }}>
                  🗂 GALERIE — {previewVersions.length} VERSION{previewVersions.length > 1 ? "S" : ""} SAUVEGARDEE{previewVersions.length > 1 ? "S" : ""}
                </button>
              )}
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

        {/* Modal plein écran écriture */}
        {editExpanded && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,8,4,0.99)", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "rgba(3,10,5,0.99)", borderBottom: "1px solid " + fc + "33", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: "13px", color: fc, fontWeight: "700", letterSpacing: "0.1em", textShadow: "0 0 10px " + fc }}>✏ MODIFIER — {idea.titre}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={function() { if (!editText.trim()) return; updateIdea(idea.id, { raw: editText }); setEditMode(false); setEditText(""); setEditingId(null); setEditExpanded(false); showToast("Idee sauvegardee !"); }} disabled={!editText.trim()} style={{ background: editText.trim() ? "rgba(0,255,136,0.1)" : "transparent", border: "1px solid " + (editText.trim() ? "#00ff8855" : "#00ff8820"), borderRadius: "4px", color: editText.trim() ? "#00ff88" : "#445544", padding: "6px 14px", cursor: editText.trim() ? "pointer" : "not-allowed", fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em" }}>💾 SAUVEGARDER</button>
                <button onClick={function() { regenerateIdea(idea); setEditExpanded(false); }} disabled={!editText.trim() || isProcessing} style={{ background: editText.trim() && !isProcessing ? fc + "18" : "transparent", border: "1px solid " + (editText.trim() && !isProcessing ? fc + "55" : fc + "15"), borderRadius: "4px", color: editText.trim() && !isProcessing ? fc : "#445544", padding: "6px 14px", cursor: editText.trim() && !isProcessing ? "pointer" : "not-allowed", fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em" }}>⚡ REGENERER</button>
                <button onClick={function() { setEditExpanded(false); }} style={{ background: "transparent", border: "1px solid #ff446644", borderRadius: "4px", color: "#ff8899", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>✕ FERMER</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px", maxWidth: "800px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
              <textarea value={editText} onChange={function(e) { setEditText(e.target.value); }} autoFocus
                placeholder="Écris ou complète ton idée ici..."
                style={{ flex: 1, width: "100%", background: "#020e06", border: "1px solid " + fc + "22", borderRadius: "6px", color: "#c8ffd4", fontSize: "15px", fontFamily: "inherit", lineHeight: "1.8", padding: "20px", resize: "none", outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: "10px", color: "#334433", textAlign: "right", marginTop: "6px", letterSpacing: "0.06em" }}>{editText.length} CARACTÈRES</div>
            </div>
          </div>
        )}

        {/* Modal plein écran fiche idée */}
        {ideaExpanded && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,8,4,0.98)", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "rgba(3,10,5,0.99)", borderBottom: "1px solid " + fc + "33", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: "13px", color: fc, fontWeight: "700", letterSpacing: "0.1em" }}>
                {ideaExpanded === "fonctions" ? "FONCTIONNALITES — " + idea.titre : "PROMPT — " + idea.titre}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                {ideaExpanded === "prompt" && (
                  <button onClick={function() { copyPrompt(idea); }} style={{ background: "transparent", border: "1px solid #00ccff33", borderRadius: "4px", color: "#00ccff88", padding: "6px 12px", cursor: "pointer", fontSize: "10px" }}>COPIER</button>
                )}
                <div style={{ position: "relative" }}>
                  <button onClick={function() { setShowIdeaDownload(function(v) { return !v; }); }} style={{ background: "rgba(0,255,136,0.08)", border: "1px solid " + fc + "44", borderRadius: "4px", color: fc, padding: "6px 12px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}>⬇ FORMAT ▾</button>
                  {showIdeaDownload && (
                    <div style={{ position: "absolute", right: 0, top: "110%", background: "#020e06", border: "1px solid #00ff8822", borderRadius: "4px", zIndex: 50, minWidth: "130px", overflow: "hidden" }}>
                      {[{f:"md",label:"📝 Markdown"},{f:"txt",label:"📄 Texte .txt"},{f:"html",label:"🌐 HTML"}].map(function(item) {
                        return <button key={item.f} onClick={function() { downloadIdea(idea, item.f); }} style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #00ff8811", color: "#aaccaa", padding: "9px 14px", cursor: "pointer", fontSize: "11px", textAlign: "left", fontFamily: "inherit" }}>{item.label}</button>;
                      })}
                    </div>
                  )}
                </div>
                <button onClick={function() { setIdeaExpanded(null); setShowIdeaDownload(false); }} style={{ background: "transparent", border: "1px solid #ff446644", borderRadius: "4px", color: "#ff8899", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>✕ FERMER</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
              {ideaExpanded === "fonctions" ? (
                <div>
                  {foncs.map(function(ft, i) {
                    return <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: i < foncs.length - 1 ? "1px solid #00ff8815" : "none", fontSize: "15px", color: "#99ccaa", lineHeight: "1.6" }}>
                      <span style={{ color: fc, flexShrink: 0 }}>{">"}</span>{ft}
                    </div>;
                  })}
                </div>
              ) : (
                <p style={{ fontSize: "15px", color: "#88ccdd", lineHeight: "1.9", whiteSpace: "pre-wrap" }}>{idea.prompt}</p>
              )}
            </div>
          </div>
        )}

        {/* Modal Apercu Visuel */}
        {previewHtml && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,8,4,0.97)", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ background: "rgba(3,10,5,0.99)", borderBottom: "1px solid #cc88ff33", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", color: "#cc88ff", fontWeight: "700", letterSpacing: "0.1em", textShadow: "0 0 14px #cc88ff" }}>🖥 APERCU</span>
                <span style={{ fontSize: "10px", color: "#88bbaa" }}>{idea.titre}</span>
                {previewVersions.length > 0 && <span style={{ fontSize: "9px", background: "#cc88ff22", border: "1px solid #cc88ff44", borderRadius: "10px", color: "#cc88ff", padding: "2px 8px" }}>{previewVersions.length} VERSION{previewVersions.length > 1 ? "S" : ""}</span>}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={function() { generatePreview(idea); }} disabled={isGeneratingPreview} style={{ background: "transparent", border: "1px solid #cc88ff44", borderRadius: "4px", color: "#cc88ff88", padding: "5px 10px", cursor: "pointer", fontSize: "10px" }}>
                  {isGeneratingPreview ? "..." : "⟳ NOUVELLE"}
                </button>
                {previewVersions.length > 1 && (
                  <button onClick={function() { setShowGallery(function(v) { return !v; }); }} style={{ background: showGallery ? "#cc88ff22" : "transparent", border: "1px solid #cc88ff44", borderRadius: "4px", color: "#cc88ff", padding: "5px 10px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}>
                    🗂 GALERIE
                  </button>
                )}
                {previewHtml && previewHtml !== "loading" && (
                  <button onClick={function() { var blob = new Blob([previewHtml], { type: "text/html" }); var url = URL.createObjectURL(blob); window.open(url, "_blank"); }} style={{ background: "rgba(180,0,255,0.08)", border: "1px solid #cc88ff44", borderRadius: "4px", color: "#cc88ff", padding: "5px 10px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}>🔗 OUVRIR</button>
                )}
                {previewHtml && previewHtml !== "loading" && (
                  <button onClick={function() { downloadPreview(idea, previewHtml); }} style={{ background: "transparent", border: "1px solid #cc88ff33", borderRadius: "4px", color: "#cc88ff77", padding: "5px 10px", cursor: "pointer", fontSize: "10px" }}>⬇</button>
                )}
                <button onClick={function() { setPreviewHtml(null); setShowGallery(false); }} style={{ background: "transparent", border: "1px solid #ff446644", borderRadius: "4px", color: "#ff8899", padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}>✕</button>
              </div>
            </div>

            {/* Galerie de versions */}
            {showGallery && previewVersions.length > 1 && (
              <div style={{ background: "rgba(3,10,5,0.98)", borderBottom: "1px solid #cc88ff22", padding: "10px 16px", display: "flex", gap: "10px", overflowX: "auto", flexShrink: 0 }}>
                {previewVersions.map(function(v) {
                  var isActive = activeVersion === v.id;
                  return (
                    <div key={v.id} style={{ flexShrink: 0, cursor: "pointer" }} onClick={function() { setPreviewHtml(v.html); setActiveVersion(v.id); }}>
                      <div style={{ width: "80px", height: "120px", borderRadius: "6px", overflow: "hidden", border: "2px solid " + (isActive ? "#cc88ff" : "#cc88ff22"), boxShadow: isActive ? "0 0 12px #cc88ff55" : "none", transition: "all 0.2s", position: "relative" }}>
                        <iframe srcDoc={v.html} style={{ width: "375px", height: "700px", border: "none", transform: "scale(0.213)", transformOrigin: "top left", pointerEvents: "none" }} sandbox="allow-scripts" title={"v" + v.id}/>
                        {v.starred && <span style={{ position: "absolute", top: "2px", right: "2px", fontSize: "10px" }}>⭐</span>}
                      </div>
                      <div style={{ fontSize: "8px", color: isActive ? "#cc88ff" : "#556655", textAlign: "center", marginTop: "4px", letterSpacing: "0.04em" }}>{v.label}</div>
                      <div style={{ display: "flex", gap: "3px", justifyContent: "center", marginTop: "2px" }}>
                        <button onClick={function(e) { e.stopPropagation(); starPreviewVersion(v); }} style={{ background: "transparent", border: "none", color: v.starred ? "#ffcc00" : "#445544", cursor: "pointer", fontSize: "10px", padding: "0" }}>⭐</button>
                        <button onClick={function(e) { e.stopPropagation(); deletePreviewVersion(v.id, idea.id); }} style={{ background: "transparent", border: "none", color: "#ff4466", cursor: "pointer", fontSize: "10px", padding: "0" }}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Apercu principal */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflow: "hidden" }}>
              {previewHtml === "loading" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "16px", animation: "pulse 1.2s infinite" }}>🖥</div>
                  <div style={{ fontSize: "12px", color: "#cc88ff", letterSpacing: "0.15em", animation: "pulse 1.2s infinite" }}>GENERATION DE L'APERCU...</div>
                  <div style={{ fontSize: "10px", color: "#556655", marginTop: "8px" }}>Claude analyse l'idee et construit l'interface</div>
                </div>
              ) : (
                <div style={{ width: "375px", height: "100%", maxHeight: "720px", borderRadius: "24px", overflow: "hidden", border: "1px solid #cc88ff33", boxShadow: "0 0 60px #cc88ff22, 0 0 120px #cc88ff0a" }}>
                  <div style={{ background: "#1a1a1a", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px", borderBottom: "1px solid #33333388" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f57" }}/>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffbd2e" }}/>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840" }}/>
                    <span style={{ flex: 1, textAlign: "center", fontSize: "10px", color: "#666", letterSpacing: "0.06em" }}>{idea.titre}</span>
                  </div>
                  <iframe srcDoc={previewHtml} style={{ width: "100%", height: "calc(100% - 32px)", border: "none", background: "#fff" }} sandbox="allow-scripts" title="apercu"/>
                </div>
              )}
            </div>
          </div>
        )}

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

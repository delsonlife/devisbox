/**
 * WidgetDevis v2.0 — Moteur de devis universel multi-métiers
 * Design premium · Questions dynamiques · SVG icons
 * Usage: <script src="https://votre-domaine.vercel.app/widget.js?license=XXXX"></script>
 */
(function (window, document) {
  "use strict";

  // ── Config ──────────────────────────────────────────────
  const _script = document.currentScript || (function () {
    const s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();
  const _src     = _script ? _script.src : "";
  const _baseUrl = _src.split("/widget.js")[0];
  const _params  = new URL(_src).searchParams;
  const LICENSE  = _params.get("license");
  const TRIGGER_TEXT = _params.get("text") || "Obtenir mon devis gratuit";

  if (!LICENSE) { console.error("[WidgetDevis] Paramètre license manquant."); return; }

  // ── SVG Icons ───────────────────────────────────────────
  const ICONS = {
    "hard-hat":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a2 2 0 0 1 4 0v5"/><path d="M4 15V9a8 8 0 0 1 16 0v6"/></svg>`,
    "wrench":      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    "brush":       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94C5.79 16.22 5 17 4 18l-1.5 1.5a.5.5 0 0 0 .5.5L5 19.5l1.5-1.5c1-1 1.78-1.79 3.06-3.07l-2.49-2.09z"/></svg>`,
    "layers":      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    "home":        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    "grid":        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    "box":         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    "server":      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
    "triangle":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
    "square":      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`,
    "plus-square": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    "arrow-up":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
    "chevrons-up": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>`,
    "building":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="2" x2="15" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="14" x2="20" y2="14"/></svg>`,
    "sun":         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    "droplet":     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    "trash":       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    "tool":        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    "music":       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    "lock":        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    "maximize":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
    "check":       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    "arrow-right": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    "arrow-left":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    "x":           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    "send":        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  };

  function icon(name, size = 20) {
    const svg = ICONS[name] || ICONS["box"];
    return `<span class="rw-icon" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center">${svg}</span>`;
  }

  // ── State ───────────────────────────────────────────────
  const state = {
    step: 0,
    config: null,
    questions: [],
    answers: {},
    estimate: null,
  };

  // ── Helpers ─────────────────────────────────────────────
  const el  = id  => document.getElementById(id);
  const qsa = sel => Array.from(document.querySelectorAll(sel));
  const fmt = n   => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  // ── API ─────────────────────────────────────────────────
  async function apiGet(path) {
    const r = await fetch(`${_baseUrl}${path}`, { credentials: "omit" });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`);
    return r.json();
  }

  async function apiPost(path, body) {
    const r = await fetch(`${_baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`);
    return r.json();
  }

  // ── CSS inject ──────────────────────────────────────────
  function injectCSS() {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `${_baseUrl}/widget.css`;
    document.head.appendChild(l);
  }

  function applyBranding(b) {
    if (!b) return;
    const r = document.documentElement;
    if (b.primaryColor) {
      r.style.setProperty("--rw-primary", b.primaryColor);
      r.style.setProperty("--rw-primary-dark", darken(b.primaryColor, 18));
      r.style.setProperty("--rw-primary-light", lighten(b.primaryColor, 92));
    }
  }

  function darken(hex, pct) {
    const n = parseInt(hex.replace("#", ""), 16);
    const f = v => Math.max(0, v - Math.round(2.55 * pct));
    return "#" + ((1 << 24) | (f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1);
  }

  function lighten(hex, pct) {
    const n = parseInt(hex.replace("#", ""), 16);
    const f = v => Math.min(255, v + Math.round(2.55 * pct));
    return "#" + ((1 << 24) | (f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1);
  }

  // ── Build DOM ───────────────────────────────────────────
  function buildShell(config) {
    const name = config.company?.name || "Widget Devis";
    const logo = config.branding?.logo
      ? `<img src="${config.branding.logo}" class="rw-logo-img" alt="${name}">`
      : `<span class="rw-company-name">${name}</span>`;

    const total = state.questions.length + 1; // +1 pour l'étape lead

    const html = `
<div id="rw-overlay">
  <div id="rw-widget" role="dialog" aria-modal="true" aria-label="Calculateur de devis">

    <div class="rw-header">
      <div class="rw-logo-wrap">${logo}</div>
      <button class="rw-close-btn" id="rw-close" aria-label="Fermer">${icon("x", 16)}</button>
    </div>

    <div class="rw-progress-wrap">
      <div class="rw-progress-meta">
        <span id="rw-step-label">Étape 1 sur ${total}</span>
        <span id="rw-step-hint" class="rw-step-hint"></span>
      </div>
      <div class="rw-progress-bar"><div class="rw-progress-fill" id="rw-progress" style="width:0%"></div></div>
    </div>

    <div class="rw-body" id="rw-body">
      <div class="rw-loading" id="rw-loading">
        <div class="rw-spinner"></div>
        <p class="rw-loading-text" id="rw-loading-text">Chargement…</p>
      </div>
      <div id="rw-step-area"></div>
    </div>

    <div class="rw-footer" id="rw-footer">
      <div class="rw-nav-btns">
        <button class="rw-btn-back" id="rw-btn-back" style="display:none" aria-label="Retour">${icon("arrow-left", 18)}</button>
        <button class="rw-btn-next" id="rw-btn-next">Continuer ${icon("arrow-right", 16)}</button>
      </div>
    </div>

  </div>
</div>`;

    const wrap = document.createElement("div");
    wrap.id = "rw-root";
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
  }

  // ── Render step ─────────────────────────────────────────
  function renderStep(idx) {
    const area = el("rw-step-area");
    const isLead = idx === state.questions.length;

    // Transition out
    area.classList.add("rw-exit");
    setTimeout(() => {
      area.classList.remove("rw-exit");
      area.innerHTML = isLead ? buildLeadStep() : buildQuestionStep(state.questions[idx], idx);
      area.classList.add("rw-enter");
      setTimeout(() => area.classList.remove("rw-enter"), 300);
      attachStepEvents(idx);
      updateNav(idx);
      updateProgress(idx);
    }, 180);
  }

  function buildQuestionStep(q, idx) {
    const total = state.questions.length + 1;
    const remaining = total - idx - 1;
    const hint = remaining > 1 ? `Plus que ${remaining} étapes` : remaining === 1 ? "Dernière étape avant votre résultat" : "";

    let content = "";

    if (q.type === "cards" || q.type === "multi") {
      const cols = q.columns === 2 ? "rw-2col" : "";
      const isMulti = q.type === "multi";
      const selected = isMulti ? (state.answers[q.id] || []) : state.answers[q.id];

      content = `<div class="rw-cards ${cols}">` +
        q.options.map(opt => {
          const isSelected = isMulti
            ? (selected || []).includes(opt.value)
            : selected === opt.value;
          return `<button class="rw-card ${isMulti ? "rw-multi" : ""} ${isSelected ? "rw-selected" : ""}"
            data-qid="${q.id}" data-value="${opt.value}" data-multi="${isMulti}">
            <span class="rw-card-icon">${icon(opt.icon || "box", 22)}</span>
            <span class="rw-card-label">${opt.label}</span>
            <span class="rw-card-check">${icon("check", 12)}</span>
          </button>`;
        }).join("") +
      `</div>`;
    }

    if (q.type === "slider") {
      const val = state.answers[q.id] || q.default || q.min;
      const pct = ((val - q.min) / (q.max - q.min)) * 100;
      content = `
        <div class="rw-slider-wrap">
          <div class="rw-slider-display">
            <span class="rw-slider-value" id="rw-slider-val">${val}</span>
            <span class="rw-slider-unit"> ${q.unit}</span>
          </div>
          <input type="range" class="rw-slider" id="rw-slider-input"
            min="${q.min}" max="${q.max}" step="${q.step}" value="${val}"
            style="--slider-pct:${pct}%"
            aria-label="${q.label}">
          <div class="rw-slider-hints"><span>${q.min} ${q.unit}</span><span>${q.max} ${q.unit}</span></div>
        </div>`;
    }

    if (q.type === "postal") {
      const val = state.answers[q.id] || "";
      content = `
        <div class="rw-input-wrap">
          <input type="text" id="rw-postal-input" class="rw-input"
            placeholder="${q.placeholder || "75001"}" maxlength="5"
            inputmode="numeric" autocomplete="postal-code" value="${val}">
          <span class="rw-field-error" id="rw-postal-error">Code postal invalide (5 chiffres).</span>
        </div>`;
    }

    return `
      <div class="rw-step-hint-label">${hint}</div>
      <p class="rw-step-title">${q.label}</p>
      <p class="rw-step-subtitle">${q.subtitle || ""}</p>
      ${content}`;
  }

  function buildLeadStep() {
    const r = state.estimate;
    const resultHtml = r ? `
      <div class="rw-result-card">
        <p class="rw-result-eyebrow">Votre estimation</p>
        <p class="rw-result-price">${fmt(r.estimateLow)} – ${fmt(r.estimateHigh)}</p>
        <p class="rw-result-delay">${icon("arrow-right", 14)} Délai estimé : ${r.delayLow} à ${r.delayHigh} jour${r.delayHigh > 1 ? "s" : ""}</p>
      </div>
      ${(r.details?.optionDetails?.length) ? `
        <div class="rw-result-details">
          ${r.details.optionDetails.map(o => `
            <div class="rw-result-row">
              <span class="rw-result-row-label">${o.label}</span>
              <span class="rw-result-row-value">+${fmt(o.price)}</span>
            </div>`).join("")}
        </div>` : ""}
    ` : "";

    return `
      ${resultHtml}
      <div id="rw-lead-form">
        <p class="rw-step-title">Recevoir mon devis détaillé</p>
        <p class="rw-step-subtitle">Gratuit · Sans engagement · Réponse sous 24h</p>
        <div class="rw-input-wrap">
          <label class="rw-label" for="rw-name">Prénom et nom</label>
          <input type="text" id="rw-name" class="rw-input" placeholder="Jean Dupont" autocomplete="name">
          <span class="rw-field-error" id="rw-name-error">Veuillez entrer votre nom.</span>
        </div>
        <div class="rw-input-wrap">
          <label class="rw-label" for="rw-phone">Téléphone</label>
          <input type="tel" id="rw-phone" class="rw-input" placeholder="06 12 34 56 78" autocomplete="tel" inputmode="tel">
          <span class="rw-field-error" id="rw-phone-error">Numéro invalide.</span>
        </div>
        <div class="rw-input-wrap">
          <label class="rw-label" for="rw-email">Email</label>
          <input type="email" id="rw-email" class="rw-input" placeholder="jean@exemple.fr" autocomplete="email">
          <span class="rw-field-error" id="rw-email-error">Email invalide.</span>
        </div>
        <div class="rw-error-msg" id="rw-submit-error"></div>
      </div>
      <div id="rw-success-area" style="display:none">
        <div class="rw-success">
          <div class="rw-success-icon">${icon("check", 36)}</div>
          <p class="rw-success-title">Demande envoyée !</p>
          <p class="rw-success-text">Votre artisan va vous contacter dans les meilleurs délais.</p>
          <button class="rw-btn-ghost" id="rw-restart-btn">Nouvelle estimation</button>
        </div>
      </div>`;
  }

  // ── Events ───────────────────────────────────────────────
  function attachStepEvents(idx) {
    const isLead = idx === state.questions.length;
    if (isLead) return;

    const q = state.questions[idx];

    // Cards
    qsa(".rw-card").forEach(card => {
      card.addEventListener("click", () => {
        const qid   = card.dataset.qid;
        const val   = card.dataset.value;
        const multi = card.dataset.multi === "true";

        if (multi) {
          const arr = state.answers[qid] || [];
          const i = arr.indexOf(val);
          if (i === -1) arr.push(val); else arr.splice(i, 1);
          state.answers[qid] = arr;
          card.classList.toggle("rw-selected");
        } else {
          qsa(`.rw-card[data-qid="${qid}"]`).forEach(c => c.classList.remove("rw-selected"));
          card.classList.add("rw-selected");
          state.answers[qid] = val;
          setTimeout(() => goNext(), 280);
        }
      });
    });

    // Slider
    const slider = el("rw-slider-input");
    if (slider) {
      slider.addEventListener("input", () => {
        const v = parseInt(slider.value);
        state.answers[q.id] = v;
        el("rw-slider-val").textContent = v;
        const pct = ((v - parseInt(slider.min)) / (parseInt(slider.max) - parseInt(slider.min))) * 100;
        slider.style.setProperty("--slider-pct", pct + "%");
      });
    }

    // Postal
    const postal = el("rw-postal-input");
    if (postal) {
      postal.addEventListener("input", () => {
        postal.value = postal.value.replace(/\D/g, "").substring(0, 5);
        state.answers[q.id] = postal.value;
        if (/^\d{5}$/.test(postal.value)) {
          postal.classList.remove("rw-error");
          el("rw-postal-error").classList.remove("rw-visible");
        }
      });
    }
  }

  // ── Navigation ───────────────────────────────────────────
  function canProceed(idx) {
    if (idx >= state.questions.length) return true;
    const q = state.questions[idx];
    if (!q.required) return true;
    const ans = state.answers[q.id];
    if (q.type === "slider") return (ans || q.default || q.min) >= (q.min || 0);
    if (q.type === "postal") return /^\d{5}$/.test(ans || "");
    if (q.type === "multi")  return true;
    return !!ans;
  }

  async function goNext() {
    const idx = state.step;
    if (!canProceed(idx)) return;

    // Postal → calcul
    const q = state.questions[idx];
    if (q?.type === "slider" && !state.answers[q.id]) {
      state.answers[q.id] = q.default || q.min;
    }

    const isLastQuestion = idx === state.questions.length - 1;
    if (isLastQuestion) {
      // Valider postal si c'est la dernière question
      if (q?.type === "postal" && !/^\d{5}$/.test(state.answers[q.id] || "")) {
        el("rw-postal-input")?.classList.add("rw-error");
        el("rw-postal-error")?.classList.add("rw-visible");
        return;
      }
      await runCalculation();
    }

    const isLeadStep = idx === state.questions.length;
    if (isLeadStep) {
      await submitLead();
      return;
    }

    state.step++;
    renderStep(state.step);
  }

  function goBack() {
    if (state.step > 0) { state.step--; renderStep(state.step); }
  }

  // ── Calculation ──────────────────────────────────────────
  async function runCalculation() {
    showLoading(true, "Calcul de votre estimation…");
    state.step++;
    renderStep(state.step);
    try {
      const result = await apiPost("/api/calculate", { license: LICENSE, answers: state.answers });
      state.estimate = result;
      // Re-render lead step avec le résultat
      el("rw-step-area").innerHTML = buildLeadStep();
      attachLeadEvents();
    } catch (err) {
      el("rw-step-area").innerHTML = `<div class="rw-error-banner">Impossible de calculer. Veuillez réessayer.</div>`;
      console.error("[WidgetDevis]", err);
    } finally {
      showLoading(false);
    }
  }

  // ── Lead ─────────────────────────────────────────────────
  function attachLeadEvents() {
    // Déjà attachés via event delegation
  }

  function validateLead() {
    let ok = true;
    const name  = el("rw-name")?.value.trim() || "";
    const phone = el("rw-phone")?.value.trim() || "";
    const email = el("rw-email")?.value.trim() || "";

    const setErr = (inputId, errId, show) => {
      el(inputId)?.classList.toggle("rw-error", show);
      el(errId)?.classList.toggle("rw-visible", show);
    };

    if (name.length < 2)                          { setErr("rw-name", "rw-name-error", true);   ok = false; } else setErr("rw-name", "rw-name-error", false);
    if (!/^[\d\s\+\-\.]{8,20}$/.test(phone))      { setErr("rw-phone","rw-phone-error",true);   ok = false; } else setErr("rw-phone","rw-phone-error",false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setErr("rw-email","rw-email-error",true);   ok = false; } else setErr("rw-email","rw-email-error",false);
    return ok;
  }

  async function submitLead() {
    if (!validateLead()) return;
    const btn = el("rw-btn-next");
    btn.disabled = true;
    btn.innerHTML = `<span>Envoi…</span>`;

    try {
      await apiPost("/api/lead", {
        license: LICENSE,
        lead: {
          name:     el("rw-name").value.trim(),
          phone:    el("rw-phone").value.trim(),
          email:    el("rw-email").value.trim(),
          answers:  state.answers,
          estimate: state.estimate,
        },
      });
      el("rw-lead-form").style.display = "none";
      el("rw-success-area").style.display = "block";
      el("rw-footer").style.display = "none";
    } catch (err) {
      const e = el("rw-submit-error");
      if (e) { e.textContent = "Erreur d'envoi. Réessayez."; e.classList.add("rw-visible"); }
      btn.disabled = false;
      btn.innerHTML = `Envoyer ${icon("send", 16)}`;
    }
  }

  // ── Progress / Nav ───────────────────────────────────────
  function updateProgress(idx) {
    const total = state.questions.length + 1;
    const pct = Math.round((idx / total) * 100);
    el("rw-progress").style.width = pct + "%";
    el("rw-step-label").textContent = `Étape ${idx + 1} sur ${total}`;
  }

  function updateNav(idx) {
    const total = state.questions.length;
    const back  = el("rw-btn-back");
    const next  = el("rw-btn-next");
    back.style.display = idx > 0 ? "flex" : "none";

    const isLead = idx === total;
    if (isLead) {
      next.innerHTML = `Envoyer ma demande ${icon("send", 16)}`;
    } else if (state.questions[idx]?.type === "multi") {
      next.innerHTML = `Continuer ${icon("arrow-right", 16)}`;
    } else if (state.questions[idx]?.type === "slider" || state.questions[idx]?.type === "postal") {
      next.innerHTML = `Continuer ${icon("arrow-right", 16)}`;
    } else {
      next.innerHTML = `Continuer ${icon("arrow-right", 16)}`;
    }
  }

  // ── Loading ──────────────────────────────────────────────
  function showLoading(show, text) {
    const l = el("rw-loading");
    if (!l) return;
    l.style.display = show ? "block" : "none";
    if (text) el("rw-loading-text").textContent = text;
  }

  // ── Open / Close ─────────────────────────────────────────
  function openWidget() {
    el("rw-overlay").classList.add("rw-open");
    document.body.style.overflow = "hidden";
  }

  function closeWidget() {
    el("rw-overlay").classList.remove("rw-open");
    document.body.style.overflow = "";
  }

  function resetWidget() {
    state.step = 0;
    state.answers = {};
    state.estimate = null;
    renderStep(0);
  }

  // ── Trigger button ───────────────────────────────────────
  function buildTrigger() {
    const containers = document.querySelectorAll("[data-rw-trigger]");
    if (containers.length === 0) {
      const btn = document.createElement("button");
      btn.className = "rw-trigger-btn";
      btn.innerHTML = `${icon("arrow-right", 18)} ${TRIGGER_TEXT}`;
      btn.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:99997;";
      btn.addEventListener("click", openWidget);
      document.body.appendChild(btn);
    } else {
      containers.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "rw-trigger-btn";
        btn.innerHTML = `${icon("arrow-right", 18)} ${c.dataset.rwText || TRIGGER_TEXT}`;
        btn.addEventListener("click", openWidget);
        c.appendChild(btn);
      });
    }
  }

  // ── Global events ────────────────────────────────────────
  function attachGlobalEvents() {
    el("rw-close").addEventListener("click", closeWidget);
    el("rw-overlay").addEventListener("click", e => { if (e.target === el("rw-overlay")) closeWidget(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeWidget(); });
    el("rw-btn-next").addEventListener("click", goNext);
    el("rw-btn-back").addEventListener("click", goBack);
    document.addEventListener("click", e => {
      if (e.target?.id === "rw-restart-btn") resetWidget();
    });
  }

  // ── Init ─────────────────────────────────────────────────
  async function init() {
    injectCSS();
    showLoading(true, "Chargement…");

    try {
      const data = await apiGet(`/api/license?license=${LICENSE}`);
      state.config    = data;
      state.questions = data.questions || [];
      applyBranding(data.branding);
      buildShell(data);
      buildTrigger();
      attachGlobalEvents();
      showLoading(false);
      renderStep(0);
    } catch (err) {
      console.error("[WidgetDevis] Erreur init:", err.message);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window, document);

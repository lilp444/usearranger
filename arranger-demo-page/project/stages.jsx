// Stage components for the usearranger demo
// Each stage runs an internal animation. When done, it calls onComplete()
// so the parent can reveal the in-card "Next →" button on that stage.

const Stage = ({ idx, total, label, title, sub, active, done, locked, children }) => {
  return (
    <div className={`stage ${active ? "stage--active" : ""} ${done ? "stage--done" : ""} ${locked ? "stage--locked" : ""}`}>
      <div className="stage__rail" aria-hidden="true">
        <div className="stage__dot">
          {done ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <span className="stage__num">{idx}</span>
          )}
        </div>
        {idx < total && <div className="stage__line"/>}
      </div>
      <div className="stage__body">
        <div className="stage__head">
          <div className="stage__label">Step {idx} of {total} · {label}</div>
          <h3 className="stage__title">{title}</h3>
          <p className="stage__sub">{sub}</p>
        </div>
        <div className="stage__card">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── In-card action footer with progress bar + Next button ──────────────
const NextAction = ({ progress, ready, label, onNext, hint }) => {
  return (
    <div className={`nxt ${ready ? "nxt--ready" : ""}`}>
      <div className="nxt__progress">
        <div className="nxt__progress-fill" style={{width: `${Math.min(100, progress * 100)}%`}}/>
      </div>
      <div className="nxt__row">
        <div className="nxt__hint">{ready ? "Done. Ready for the next step." : hint}</div>
        <button className="nxt__btn" onClick={onNext} disabled={!ready}>
          {label}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  );
};

// ─── STAGE 1: THE CALL ──────────────────────────────────────────────────
const CallStage = ({ active, captions, speed, onNext }) => {
  const TOTAL_SECS = 18; // simulated call duration before "ready"
  const [elapsed, setElapsed] = React.useState(0);
  const [waveSeed, setWaveSeed] = React.useState(0);
  const [captionIdx, setCaptionIdx] = React.useState(0);

  const lines = [
    { who: "Director", text: "Take all the time you need. Whenever you're ready." },
    { who: "Family", text: "Thank you. Mom always loved her garden. The roses especially." },
    { who: "Director", text: "That's lovely. And she was born in Asheville, you said?" },
    { who: "Family", text: "Yes — 1942. She moved here in '64, after she married Dad." },
  ];

  React.useEffect(() => {
    if (!active) { setElapsed(0); setCaptionIdx(0); return; }
    const t = setInterval(() => setElapsed(e => Math.min(TOTAL_SECS, e + 1)), 350 / speed);
    return () => clearInterval(t);
  }, [active, speed]);

  React.useEffect(() => {
    if (!active) return;
    const w = setInterval(() => setWaveSeed(s => s + 1), 120);
    return () => clearInterval(w);
  }, [active]);

  React.useEffect(() => {
    if (!active) return;
    const c = setInterval(() => setCaptionIdx(i => (i + 1) % lines.length), 3000 / speed);
    return () => clearInterval(c);
  }, [active, speed]);

  const ready = elapsed >= TOTAL_SECS;
  const progress = elapsed / TOTAL_SECS;

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const bars = Array.from({ length: 48 }, (_, i) => {
    const seed = (waveSeed + i) * 0.7;
    const h = active && !ready ? 18 + Math.abs(Math.sin(seed) * 32) + Math.abs(Math.sin(seed * 1.7) * 14) : 8;
    return h;
  });

  return (
    <div className="call">
      <div className="call__top">
        <div className="call__people">
          <div className="call__avatar">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <div className="call__who">Arrangement Meeting</div>
            <div className="call__sub">With the Whitfield family · Wednesday, 10:14 AM</div>
          </div>
        </div>
        <div className="call__rec">
          <span className={`call__pulse ${active && !ready ? "call__pulse--on" : ""}`}/>
          <span>{ready ? "Saved" : "Recording"}</span>
          <span className="call__time">{mm}:{ss}</span>
        </div>
      </div>

      <div className="call__wave">
        {bars.map((h, i) => (
          <span key={i} className="call__bar" style={{height: `${h}px`, opacity: active ? 1 : 0.3}}/>
        ))}
      </div>

      {captions && (
        <div className={`call__caption ${active ? "call__caption--on" : ""}`}>
          <div className="call__who-tag">{lines[captionIdx].who}</div>
          <div className="call__text">"{lines[captionIdx].text}"</div>
        </div>
      )}

      <div className="call__foot">
        <div className="call__foot-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          End-to-end encrypted
        </div>
        <div className="call__foot-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Family signed consent
        </div>
      </div>

      <NextAction
        progress={progress}
        ready={ready}
        hint="Listening to the meeting…"
        label="Now turn it into words"
        onNext={onNext}
      />
    </div>
  );
};

// ─── STAGE 2: TRANSCRIPT ────────────────────────────────────────────────
const TranscriptStage = ({ active, speed, onNext }) => {
  const transcript = [
    { who: "Director", text: "Take all the time you need. Whenever you're ready." },
    { who: "Family", text: "Thank you. Mom always loved her garden. The roses especially." },
    { who: "Director", text: "That's lovely. And she was born in Asheville, you said?" },
    { who: "Family", text: "Yes — 1942. She moved here in '64, after she married Dad." },
    { who: "Director", text: "Tell me about him — your father." },
    { who: "Family", text: "Walter. They were married 58 years. He passed in 2020." },
    { who: "Director", text: "And the children? You and your siblings?" },
    { who: "Family", text: "Three of us. Me, my brother James, and our sister Caroline." },
  ];

  const [shown, setShown] = React.useState(0);
  const [highlights, setHighlights] = React.useState(false);

  React.useEffect(() => {
    if (!active) { setShown(0); setHighlights(false); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(i);
      if (i >= transcript.length) {
        clearInterval(t);
        setTimeout(() => setHighlights(true), 500 / speed);
      }
    }, 350 / speed);
    return () => clearInterval(t);
  }, [active, speed]);

  const mark = (text) => {
    if (!highlights) return text;
    const terms = ["Asheville", "1942", "Walter", "58 years", "Three"];
    const re = new RegExp(`(${terms.join("|")})`, "gi");
    const parts = text.split(re);
    return parts.map((p, i) =>
      terms.some(t => p.toLowerCase() === t.toLowerCase())
        ? <mark key={i} className="trx__mark">{p}</mark>
        : <React.Fragment key={i}>{p}</React.Fragment>
    );
  };

  const ready = highlights;
  const progress = ready ? 1 : (shown / transcript.length) * 0.9;

  return (
    <div className="trx">
      <div className="trx__head">
        <div className="trx__title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Transcript · auto-generated
        </div>
        <div className="trx__meta">{shown} of {transcript.length} lines</div>
      </div>

      <div className="trx__body">
        {transcript.slice(0, shown).map((line, i) => (
          <div key={i} className={`trx__line trx__line--${line.who.toLowerCase()}`}>
            <span className="trx__who">{line.who}</span>
            <span className="trx__text">{mark(line.text)}</span>
          </div>
        ))}
        {active && shown < transcript.length && (
          <div className="trx__typing"><span/><span/><span/></div>
        )}
      </div>

      {highlights && (
        <div className="trx__facts">
          <div className="trx__facts-title">Details we noticed:</div>
          <div className="trx__facts-list">
            <div className="trx__fact"><b>Born</b> Asheville, 1942</div>
            <div className="trx__fact"><b>Husband</b> Walter, married 58 years</div>
            <div className="trx__fact"><b>Children</b> Three</div>
            <div className="trx__fact"><b>Loved</b> Her rose garden</div>
          </div>
        </div>
      )}

      <NextAction
        progress={progress}
        ready={ready}
        hint={shown < transcript.length ? "Writing down every word…" : "Finding the important details…"}
        label="Now turn it into words"
        onNext={onNext}
      />
    </div>
  );
};

// ─── STAGE 3: OBITUARY ──────────────────────────────────────────────────
const ObituaryStage = ({ active, speed, tone, onNext }) => {
  const warm = `Margaret Anne Whitfield passed away peacefully on Sunday, April 19, 2026, surrounded by the family she loved so dearly. She was 84.

Margaret was born in Asheville, North Carolina in 1942, and made her home there until her marriage to Walter Whitfield in 1964. The two were inseparable for 58 years, raising three children together — Susan, James, and Caroline — before Walter's passing in 2020.

She was happiest in her garden, where her roses were the envy of the neighborhood. She had a gift for making every visitor feel like family, and a laugh you could hear from the porch.

She is survived by her three children, seven grandchildren, and the countless friends who were lucky to know her.`;

  const minimal = `Margaret Anne Whitfield, 84, of Asheville, died Sunday, April 19, 2026.

Born 1942 in Asheville. Married Walter Whitfield in 1964; they were married 58 years until his death in 2020. Survived by three children — Susan, James, and Caroline — and seven grandchildren.

A devoted gardener, Margaret was known for her roses and her warmth.

Services to be announced.`;

  const text = tone === "minimal" ? minimal : warm;
  const [chars, setChars] = React.useState(0);

  React.useEffect(() => {
    if (!active) { setChars(0); return; }
    const target = text.length;
    let c = 0;
    const t = setInterval(() => {
      c += Math.max(2, Math.floor(target / 200));
      if (c >= target) { c = target; clearInterval(t); }
      setChars(c);
    }, 18 / speed);
    return () => clearInterval(t);
  }, [active, text, speed]);

  const ready = chars >= text.length;
  const progress = chars / text.length;

  return (
    <div className="obit">
      <div className="obit__head">
        <div className="obit__head-l">
          <div className="obit__icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div>
            <div className="obit__name">Margaret Anne Whitfield</div>
            <div className="obit__dates">1942 — 2026</div>
          </div>
        </div>
        <div className="obit__chip">Draft · ready to review</div>
      </div>

      <div className="obit__paper">
        <div className="obit__photo" aria-hidden="true">
          <div className="obit__photo-inner">
            <svg viewBox="0 0 80 80" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><defs><pattern id="oblines" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="rgba(122,138,111,0.18)" strokeWidth="1"/></pattern></defs><rect width="80" height="80" fill="url(#oblines)"/></svg>
            <span className="obit__photo-label">Photo</span>
          </div>
        </div>
        <div className="obit__text">
          {text.slice(0, chars).split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {active && chars < text.length && <span className="obit__cursor"/>}
        </div>
      </div>

      <NextAction
        progress={progress}
        ready={ready}
        hint="Writing a warm first draft…"
        label="Now fill the certificate"
        onNext={onNext}
      />
    </div>
  );
};

// ─── STAGE 4: DEATH CERTIFICATE ─────────────────────────────────────────
const CertificateStage = ({ active, speed, onFinish }) => {
  const fields = [
    { label: "Full legal name", value: "Margaret Anne Whitfield" },
    { label: "Date of birth", value: "March 14, 1942" },
    { label: "Place of birth", value: "Asheville, North Carolina" },
    { label: "Date of death", value: "April 19, 2026" },
    { label: "Marital status", value: "Widowed" },
    { label: "Spouse name", value: "Walter J. Whitfield (deceased 2020)" },
    { label: "Father's name", value: "Robert E. Hollings" },
    { label: "Mother's maiden name", value: "Eleanor Pruitt" },
  ];

  const [filled, setFilled] = React.useState(0);

  React.useEffect(() => {
    if (!active) { setFilled(0); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setFilled(i);
      if (i >= fields.length) clearInterval(t);
    }, 280 / speed);
    return () => clearInterval(t);
  }, [active, speed]);

  const ready = filled >= fields.length;
  const progress = filled / fields.length;

  return (
    <div className="cert">
      <div className="cert__head">
        <div className="cert__head-l">
          <div className="cert__seal">
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="16" cy="16" r="14"/><circle cx="16" cy="16" r="10"/><path d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z" fill="currentColor" stroke="none" opacity="0.3"/></svg>
          </div>
          <div>
            <div className="cert__title">Certificate of Death</div>
            <div className="cert__sub">State of North Carolina · Form DHHS-1909</div>
          </div>
        </div>
        <div className="cert__chip">Draft · {filled} of {fields.length} fields</div>
      </div>

      <div className="cert__paper">
        <div className="cert__grid">
          {fields.map((f, i) => (
            <div key={i} className={`cert__field ${i < filled ? "cert__field--filled" : ""}`}>
              <div className="cert__label">{f.label}</div>
              <div className="cert__value">
                {i < filled ? f.value : <span className="cert__pending"/>}
                {i === filled - 1 && active && <span className="cert__pen"/>}
              </div>
            </div>
          ))}
        </div>

        <div className="cert__sig">
          <div className="cert__sig-line">
            <div className="cert__label">Funeral Director — review &amp; sign</div>
            <div className="cert__sig-box">
              <span className="cert__sig-hint">Tap here when ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cert__note">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        We never submit anything without your review. You stay in charge.
      </div>

      <NextAction
        progress={progress}
        ready={ready}
        hint="Filling in fields from the conversation…"
        label="See the whole flow again"
        onNext={onFinish}
      />
    </div>
  );
};

Object.assign(window, { Stage, NextAction, CallStage, TranscriptStage, ObituaryStage, CertificateStage });

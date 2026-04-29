// usearranger main app
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "sage",
  "speed": 1,
  "tone": "warm",
  "captions": true
} /*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [step, setStep] = useState(0); // 0..3 active stage; 4 = finished
  const stageRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    document.documentElement.dataset.accent = t.accent;
  }, [t.accent]);

  // Auto-scroll the new active stage into view
  const advance = (next) => {
    setStep(next);
    setTimeout(() => {
      const el = stageRefs[next]?.current;
      if (el && el.scrollIntoView) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 80);
  };

  const restart = () => {
    setStep(0);
    setTimeout(() => {
      const demoEl = document.getElementById("demo");
      if (demoEl) {
        const top = demoEl.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 80);
  };

  const stageProps = (idx) => ({
    active: step === idx,
    done: step > idx,
    locked: step < idx
  });

  return (
    <>
      <header className="container nav">
        <div className="brand">
          <div className="brand__mark">A</div>
          Arranger
        </div>
        <nav className="nav__links">
          <a href="#how">How it works</a>
          <a href="#demo">See it in action</a>
          <a href="#contact">Contact</a>
          <button className="btn btn--primary">Book a walkthrough </button>
        </nav>
      </header>

      <section className="container hero">
        <div className="hero__eyebrow">
          <span className="dot" />
          For funeral home directors — built with care
        </div>
        <h1>Paperwork <em>handled.</em><br />So you can be present.</h1>
        <p className="hero__sub">Arranger listens during the arrangement meeting,
then prepares the obituary and death certificate for you.

No typing. No copying. No screens during the conversation.

        </p>
        <div className="hero__cta">
          <button className="btn btn--primary btn--big">Book a walkthrough</button>
          <a href="#demo" className="btn btn--ghost btn--big">See how it works ↓</a>
        </div>
      </section>

      <section className="container" id="demo">
        <div className="demo">
          <div className="demo__head">
            <div className="demo__head-l">
              <h2>Margaret's story, in four steps.</h2>
              <p>Each step happens on its own. When it's ready, press the green button to keep going.</p>
            </div>
            {step > 0 && <button className="demo__restart" onClick={restart}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                Start over
              </button>}
          </div>

          <div className="timeline">
            <div ref={stageRefs[0]}>
              <Stage idx={1} total={4} label="The Conversation"
              title="A microphone listens, gently."
              sub="No laptops. No notes. The director can simply be with the family."
              {...stageProps(0)}>
                <CallStage active={step >= 0} captions={t.captions} speed={t.speed}
                onNext={() => advance(1)} />
              </Stage>
            </div>

            <div ref={stageRefs[1]}>
              <Stage idx={2} total={4} label="The Words"
              title="Every word, written down."
              sub="usearranger turns the conversation into a clear transcript and pulls out the details that matter."
              {...stageProps(1)}>
                <TranscriptStage active={step >= 1} speed={t.speed}
                onNext={() => advance(2)} />
              </Stage>
            </div>

            <div ref={stageRefs[2]}>
              <Stage idx={3} total={4} label="The Story"
              title="A first draft of the obituary."
              sub="Written in a warm, family-friendly voice. You and the family review and adjust."
              {...stageProps(2)}>
                <ObituaryStage active={step >= 2} speed={t.speed} tone={t.tone}
                onNext={() => advance(3)} />
              </Stage>
            </div>

            <div ref={stageRefs[3]}>
              <Stage idx={4} total={4} label="The Forms"
              title="The certificate, mostly filled in."
              sub="State-specific fields are completed from the conversation. You review, sign, and submit."
              {...stageProps(3)}>
                <CertificateStage active={step >= 3} speed={t.speed}
                onFinish={() => advance(4)} />
              </Stage>
            </div>
          </div>

          {step >= 4 &&
          <div className="demo__finish" ref={stageRefs[4]}>
              <p className="demo__finish-quote">
                That's it. From conversation to paperwork — without leaving the room.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn--ghost btn--big" onClick={restart}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  Watch again
                </button>
                <button className="btn btn--primary btn--big">Book a walkthrough</button>
              </div>
            </div>
          }
        </div>
      </section>

      <section className="container how" id="how">
        <div className="how__head">
          <h2>Four steps. That's the whole thing.</h2>
          <p>No new software for the family. No training for your staff. It just works alongside the meeting you already have.</p>
        </div>
        <div className="how__grid">
          <div className="how__card">
            <div className="how__num">i.</div>
            <h4>Press one button</h4>
            <p>At the start of the meeting, tap "Begin." That's it. Then close the laptop.</p>
          </div>
          <div className="how__card">
            <div className="how__num">ii.</div>
            <h4>Have the conversation</h4>
            <p>Talk with the family the way you always have. usearranger listens privately and respectfully.</p>
          </div>
          <div className="how__card">
            <div className="how__num">iii.</div>
            <h4>Review the drafts</h4>
            <p>Within minutes, an obituary draft and a death certificate are ready for you to look over.</p>
          </div>
          <div className="how__card">
            <div className="how__num">iv.</div>
            <h4>Send and sign</h4>
            <p>Share the obituary with the family. Sign the certificate. Move on with your day.</p>
          </div>
        </div>
      </section>

      <footer className="container foot" id="contact">
        <div className="foot__left" style={{ width: "500px" }}>
          "We've spent decades teaching directors to listen.<br />
          usearranger is the first tool that lets them <em style={{ fontStyle: "italic", color: "var(--sage-deep)" }}>actually do it.</em>"
        </div>
        <div className="foot__copy">
          <div>usearranger · 1-800-555-0142</div>
          <div>hello@usearranger.com</div>
          <div style={{ marginTop: 12, color: "var(--muted-2)" }}>© 2026 usearranger, Inc.</div>
        </div>
      </footer>

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakRadio
          label="Color"
          value={t.accent}
          options={[
          { value: "sage", label: "Sage" },
          { value: "slate", label: "Slate" },
          { value: "clay", label: "Clay" }]
          }
          onChange={(v) => setTweak("accent", v)} />
        
        <TweakSection label="Animation" />
        <TweakSlider label="Speed" min={0.5} max={3} step={0.25} value={t.speed} unit="×" onChange={(v) => setTweak("speed", v)} />
        <TweakSection label="Voice & content" />
        <TweakRadio
          label="Obituary tone"
          value={t.tone}
          options={[
          { value: "warm", label: "Warm" },
          { value: "minimal", label: "Minimal" }]
          }
          onChange={(v) => setTweak("tone", v)} />
        
        <TweakToggle label="Show captions on call" value={t.captions} onChange={(v) => setTweak("captions", v)} />
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Eye, EyeOff, ArrowRight, X,
  Brain, Bell, Calendar, BarChart2,
  Zap, CheckCircle, Code2,
  Users, BookOpen, ChevronDown,
} from 'lucide-react';
import Orb from '../components/auth/Orb';
import TextType from '../components/ui/TextType';
import { useAuth } from '../context/AuthContext';
import '../styles/cf-auth.css';

/* ─────────────────────────────────────────────────────── */
const ROTATING_LINES = [
  'Never Miss a Deadline.',
  'Stay Attendance Safe.',
  'Plan Your Semester.',
  'Get AI Study Plans.',
  'Ace Every Exam.',
];

const FEATURES = [
  {
    icon: Brain, color: '#4F7CFF', bg: 'rgba(79,124,255,0.12)',
    title: 'AI Study Planner',
    desc: 'Gemini AI reads your deadline list and generates a day-by-day study schedule tailored to your pace and difficulty.',
    tag: 'AI-powered',
  },
  {
    icon: Bell, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',
    title: 'WhatsApp Reminders',
    desc: 'Get smart deadline and attendance alerts directly in WhatsApp — no app switching, no missed submissions.',
    tag: 'Automation',
  },
  {
    icon: Calendar, color: '#C084FC', bg: 'rgba(192,132,252,0.12)',
    title: 'Google Calendar Sync',
    desc: 'All your deadlines and study blocks are auto-created as Google Calendar events the moment you add them.',
    tag: 'Sync',
  },
  {
    icon: BarChart2, color: '#34d399', bg: 'rgba(52,211,153,0.12)',
    title: 'Attendance Tracker',
    desc: 'Know your exact attendance % per subject. Get warned before you drop below 75% — before it is too late.',
    tag: 'Analytics',
  },
  {
    icon: Zap, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',
    title: 'Smart Automations',
    desc: 'One-click automations handle repetitive tasks in the background — reminders, calendar events, progress reports.',
    tag: 'Productivity',
  },
  {
    icon: CheckCircle, color: '#4F7CFF', bg: 'rgba(79,124,255,0.12)',
    title: 'Deadline Manager',
    desc: 'A beautiful visual board for every assignment, lab, and exam. Sort by urgency, subject, or completion status.',
    tag: 'Organisation',
  },
];

const STATS = [
  { icon: Users,    value: '2,400+',  label: 'Students onboarded' },
  { icon: BookOpen, value: '18,000+', label: 'Deadlines tracked' },
  { icon: Bell,     value: '98%',     label: 'Alert accuracy' },
  { icon: Zap,      value: '< 2s',    label: 'AI response time' },
];

const STACK = ['React 18', 'Gemini AI', 'Framer Motion', 'Node.js', 'WhatsApp API', 'Google Calendar API'];

/* ─────────────────────────────────────────────────────── */

function CFInput({ label, type = 'text', placeholder, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="cf-input-group">
      {label && <label className="cf-input-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          className={`cf-input${isPass ? ' has-icon-right' : ''}`}
          type={isPass ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={error ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
        />
        {isPass && (
          <button type="button" className="cf-input-toggle" onClick={() => setShow(v => !v)}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <div className="cf-error">⚠ {error}</div>}
    </div>
  );
}

function GoogleBtn({ label = 'Continue with Google' }) {
  return (
    <button className="cf-btn-google" type="button">
      <svg width="16" height="16" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
      </svg>
      {label}
    </button>
  );
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    await login(email, password);
    setLoading(false);
    navigate('/app');
  };

  return (
    <motion.form key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit} noValidate>
      <CFInput label="Email" type="email" placeholder="aryan@college.edu"
        value={email} onChange={e => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
      <CFInput label="Password" type="password" placeholder="••••••••"
        value={password} onChange={e => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />
      <div className="cf-row" style={{ marginBottom: 20, marginTop: 4 }}>
        <label className="cf-check-label"><input type="checkbox" className="cf-checkbox" /> Remember me</label>
        <a href="#" className="cf-link">Forgot password?</a>
      </div>
      <button className="cf-btn-primary" type="submit" disabled={loading}>
        {loading ? <><span className="cf-spinner" /> Signing in…</> : <><span>Sign In</span><ArrowRight size={15} /></>}
      </button>
      <div className="cf-divider"><div className="cf-divider-line" /><span>OR</span><div className="cf-divider-line" /></div>
      <GoogleBtn />
      <div className="cf-switch">No account? <button type="button" onClick={onSwitch}>Create one free</button></div>
    </motion.form>
  );
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    await register(form.name, form.email, form.password);
    setLoading(false);
    navigate('/onboarding');
  };

  return (
    <motion.form key="register" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit} noValidate>
      <CFInput label="Full Name" placeholder="Aryan Sharma"
        value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
      <CFInput label="College Email" type="email" placeholder="aryan@iit.ac.in"
        value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
      <CFInput label="Password" type="password" placeholder="Min 8 characters"
        value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
      <div style={{ marginBottom: 20 }}>
        <CFInput label="Confirm Password" type="password" placeholder="Re-enter password"
          value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
      </div>
      <button className="cf-btn-primary" type="submit" disabled={loading}>
        {loading ? <><span className="cf-spinner" /> Creating account…</> : <><span>Create Account</span><ArrowRight size={15} /></>}
      </button>
      <div className="cf-divider"><div className="cf-divider-line" /><span>OR</span><div className="cf-divider-line" /></div>
      <GoogleBtn label="Sign up with Google" />
      <div className="cf-switch">Already a member? <button type="button" onClick={onSwitch}>Sign In</button></div>
    </motion.form>
  );
}

/* ─── Animated section wrapper ─────────────────────────── */
function FadeSection({ children, className, id, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main page ─────────────────────────────────────────── */
export default function AuthPage() {
  const [tab, setTab] = useState(null);
  const cardOpen = tab === 'login' || tab === 'register';
  const close = () => setTab(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="cf-page-root">

      {/* ── Fixed orb background ── */}
      <div className="cf-hero-orb">
        <Orb hue={240} hoverIntensity={0.4} rotateOnHover={true} backgroundColor="transparent" />
      </div>

      {/* ── Sticky Navbar ── */}
      <motion.nav
        className="cf-hero-nav cf-nav-sticky"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <button className="cf-hero-nav-logo cf-nav-logo-btn" onClick={() => scrollTo('hero')}>
          <div className="cf-logo-icon" style={{ width: 32, height: 32 }}>
            <GraduationCap size={17} color="white" />
          </div>
          <span className="cf-logo-text">Campus<em>Flow</em></span>
        </button>

        <div className="cf-hero-nav-links">
          <span className="cf-nav-link" onClick={() => scrollTo('features')}>Features</span>
          <span className="cf-nav-link" onClick={() => scrollTo('about')}>About</span>
        </div>

        <button className="cf-hero-nav-cta" onClick={() => setTab('register')}>
          Sign up
        </button>
      </motion.nav>

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section id="hero" className="cf-hero-section">
        <motion.div
          className="cf-hero-center"
          animate={cardOpen
            ? { opacity: 0.08, scale: 0.97, filter: 'blur(4px)', pointerEvents: 'none' }
            : { opacity: 1,    scale: 1,    filter: 'blur(0px)', pointerEvents: 'auto' }
          }
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <motion.div className="cf-hero-badge"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 280, damping: 22 }}>
            <span className="cf-badge-pill">NEW</span>
            <span>AI Study Planner v2.0</span>
          </motion.div>

          <motion.h1 className="cf-hero-headline"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
            Study Smarter.{' '}
            <span className="cf-hero-animated-line">
              <TextType as="span" text={ROTATING_LINES} typingSpeed={45} deletingSpeed={25}
                pauseDuration={2500} loop showCursor cursorCharacter="|" />
            </span>
          </motion.h1>

          <motion.p className="cf-hero-sub"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.65 }}>
            AI-powered productivity for B.Tech students — intelligent study plans,
            attendance monitoring, WhatsApp reminders &amp; Google Calendar sync.
          </motion.p>

          <motion.div className="cf-hero-cta-row"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6 }}>
            <button className="cf-cta-primary" onClick={() => setTab('register')}>Get started</button>
            <button className="cf-cta-secondary" onClick={() => setTab('login')}>Sign in</button>
          </motion.div>

          {/* Scroll cue */}
          <motion.div className="cf-scroll-cue"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={() => scrollTo('features')}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — FEATURES
      ══════════════════════════════════════════ */}
      <FadeSection id="features" className="cf-content-section">
        {/* Section label */}
        <div className="cf-section-eyebrow">
          <span className="cf-badge-pill">FEATURES</span>
        </div>
        <h2 className="cf-section-title">
          Everything you need to<br />
          <span className="cf-gradient-text">ace your semester</span>
        </h2>
        <p className="cf-section-sub">
          Six powerful tools that work together to keep you ahead — from AI study plans to automated WhatsApp alerts.
        </p>

        <div className="cf-features-section-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="cf-feature-section-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Tag */}
              <div className="cf-fcard-tag" style={{ color: f.color, background: f.bg }}>
                {f.tag}
              </div>
              {/* Icon */}
              <div className="cf-fcard-icon" style={{ background: f.bg, color: f.color }}>
                <f.icon size={22} />
              </div>
              {/* Text */}
              <div className="cf-fcard-title">{f.title}</div>
              <div className="cf-fcard-desc">{f.desc}</div>
              {/* Shine line */}
              <div className="cf-fcard-shine" />
            </motion.div>
          ))}
        </div>
      </FadeSection>

      {/* ══════════════════════════════════════════
          SECTION 3 — ABOUT
      ══════════════════════════════════════════ */}
      <FadeSection id="about" className="cf-content-section">
        <div className="cf-about-section">

          {/* Left: text */}
          <div className="cf-about-text">
            <div className="cf-section-eyebrow" style={{ textAlign: 'left' }}>
              <span className="cf-badge-pill">ABOUT</span>
            </div>
            <h2 className="cf-section-title" style={{ textAlign: 'left', fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Built for the students<br />
              <span className="cf-gradient-text">who refuse to fall behind</span>
            </h2>
            <p className="cf-section-sub" style={{ textAlign: 'left', maxWidth: 460 }}>
              CampusFlow started as a hackathon project born out of frustration — missed deadlines, surprise attendance
              shortfalls, and scattered notes. We built the platform we wished we had in our first year.
            </p>
            <p className="cf-section-sub" style={{ textAlign: 'left', maxWidth: 460, marginTop: -16 }}>
              It combines Gemini AI, WhatsApp automation, and Google Calendar to give every B.Tech student
              a personal academic co-pilot that works 24×7.
            </p>

            {/* Stack pills */}
            <div style={{ marginTop: 28 }}>
              <div className="cf-dropdown-title" style={{ marginBottom: 10 }}>Built with</div>
              <div className="cf-stack-pills">
                {STACK.map(t => <span key={t} className="cf-stack-pill">{t}</span>)}
              </div>
            </div>

            {/* Footer note */}
            <div className="cf-about-footer" style={{ marginTop: 24 }}>
              <Code2 size={13} style={{ color: '#A8A8B3' }} />
              <span style={{ color: '#A8A8B3', fontSize: 12 }}>Open source · Built for hackathon 2024</span>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="cf-about-stats-section">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                className="cf-stat-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <s.icon size={20} style={{ color: '#4F7CFF', marginBottom: 12 }} />
                <div className="cf-stat-val">{s.value}</div>
                <div className="cf-stat-lbl">{s.label}</div>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div
              className="cf-stat-card cf-stat-cta"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ gridColumn: 'span 2' }}
            >
              <GraduationCap size={22} style={{ color: 'white', marginBottom: 10 }} />
              <div style={{ fontWeight: 800, fontSize: 16, color: 'white', marginBottom: 6 }}>
                Ready to get started?
              </div>
              <div style={{ fontSize: 12, color: '#A8A8B3', marginBottom: 16 }}>
                Join 2,400+ students already using CampusFlow.
              </div>
              <button className="cf-btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}
                onClick={() => { setTab('register'); scrollTo('hero'); }}>
                Create free account <ArrowRight size={13} />
              </button>
            </motion.div>
          </div>
        </div>
      </FadeSection>

      {/* ── Footer ── */}
      <footer className="cf-footer">
        <div className="cf-logo-icon" style={{ width: 28, height: 28, borderRadius: 8 }}>
          <GraduationCap size={14} color="white" />
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          © 2024 CampusFlow · Made with passion for B.Tech students
        </span>
      </footer>

      {/* ── Floating auth modal ── */}
      <AnimatePresence>
        {cardOpen && (
          <motion.div className="cf-modal-backdrop" key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.target === e.currentTarget && close()}>
            <motion.div className="cf-modal-card" key="card"
              initial={{ opacity: 0, scale: 0.88, y: 28 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0,  scale: 0.88, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}>

              <button className="cf-modal-close" onClick={close}><X size={16} /></button>

              <div className="cf-card-logo" style={{ marginBottom: 18 }}>
                <div className="cf-logo-icon" style={{ width: 28, height: 28, borderRadius: 8 }}>
                  <GraduationCap size={14} color="white" />
                </div>
                <span className="cf-logo-text" style={{ fontSize: 13 }}>Campus<em>Flow</em></span>
              </div>

              <div className="cf-card-title">
                <h2>{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
                <p>{tab === 'login' ? 'Continue your academic journey.' : 'Join thousands of B.Tech students.'}</p>
              </div>

              <div className="cf-tabs">
                <motion.div className="cf-tab-indicator"
                  animate={{ left: tab === 'login' ? 4 : 'calc(50%)' }}
                  style={{ width: 'calc(50% - 4px)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                <button className={`cf-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
                <button className={`cf-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
              </div>

              <AnimatePresence mode="wait">
                {tab === 'login'
                  ? <LoginForm    key="login"    onSwitch={() => setTab('register')} />
                  : <RegisterForm key="register" onSwitch={() => setTab('login')} />
                }
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

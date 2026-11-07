import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { profile } from '../data/site';
import { ArrowUpRight } from './ui';

const nav = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/sponsoring', label: 'Sponsoring' },
  { to: '/life', label: 'Life' },
  { to: '/organizations', label: 'Where I work' },
];

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme());
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    setTheme(next);
  };
  return (
    <button className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`site-header ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand">
          {profile.name}
        </Link>
        <nav className="main-nav" aria-label="Main">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="btn btn-primary btn-sm hide-mobile" href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight />
          </a>
          <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>
      <nav className="mobile-nav" aria-label="Mobile">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to}>
            {n.label}
          </NavLink>
        ))}
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-title">Site</p>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/life">Life</Link>
          </div>
          <div>
            <p className="footer-title">Work</p>
            <Link to="/organizations">Where I work</Link>
            <Link to="/sponsoring">Sponsoring</Link>
          </div>
          <div>
            <p className="footer-title">Elsewhere</p>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {profile.name}
          </span>
          <span>Illustrations: generated neon line art</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  useEffect(() => {
    const page = nav.find((n) => pathname.startsWith(n.to));
    document.title = page ? `${page.label} — ${profile.name}` : profile.name;
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

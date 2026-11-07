import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Art as ArtRef } from '../data/site';

const base = import.meta.env.BASE_URL;

export function artUrl(name: ArtRef): string {
  return `${base}art/${name}.svg`;
}

/** Neon line-art illustration, cropped to a fixed aspect ratio. */
export function Art({
  name,
  ratio = '16 / 10',
  className = '',
  eager = false,
}: {
  name: ArtRef;
  ratio?: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`art ${className}`} style={{ aspectRatio: ratio }}>
      <img src={artUrl(name)} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </div>
  );
}

export function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className="icon">
      <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className="icon">
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const isExternal = (to: string) => /^(https?:|mailto:)/.test(to);

/** Pill button — `primary` is filled, `secondary` is outlined, `ghost` is text. */
export function Button({
  to,
  children,
  variant = 'primary',
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const cls = `btn btn-${variant}`;
  if (isExternal(to)) {
    return (
      <a className={cls} href={to} target={to.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
        {children}
        <ArrowUpRight />
      </a>
    );
  }
  return (
    <Link className={cls} to={to}>
      {children}
      {variant === 'ghost' && <ArrowRight />}
    </Link>
  );
}

/** Link that opens externally or routes internally, without button styling. */
export function SmartLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (isExternal(to)) {
    return (
      <a className={className} href={to} target={to.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {action && <Button to={action.to} variant="ghost">{action.label}</Button>}
    </div>
  );
}

/** Large page intro used at the top of every page. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-hero container">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children && <div className="hero-actions">{children}</div>}
    </header>
  );
}

/** Card with an illustration on top and text below. */
export function Card({
  to,
  art,
  meta,
  title,
  text,
  ratio,
}: {
  to: string;
  art: ArtRef;
  meta?: string;
  title: string;
  text?: string;
  ratio?: string;
}) {
  return (
    <SmartLink to={to} className="card">
      <Art name={art} ratio={ratio} />
      <div className="card-body">
        {meta && <p className="card-meta">{meta}</p>}
        <h3 className="card-title">
          {title}
          {isExternal(to) && <ArrowUpRight />}
        </h3>
        {text && <p className="card-text">{text}</p>}
      </div>
    </SmartLink>
  );
}

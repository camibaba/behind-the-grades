// Original hand-drawn doodles. Purely decorative: always aria-hidden.
type Props = { className?: string };

export function StarDoodle({ className = "", size = 22 }: Props & { size?: number }) {
  return (
    <svg className={`doodle ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.5c.6 3.7 1.4 6.1 2.6 6.9 1.6.9 4.4.6 6.9 1.2-2.3 1.5-4.2 2.8-4.6 4-.3 1.7.7 4.4 1.1 6.8-2.2-1.5-4.4-3.1-5.8-3.1-1.6.1-4 1.9-6.1 3.3.5-2.5 1.3-5.2.9-6.8-.5-1.4-2.6-2.7-4.6-4.1 2.6-.6 5.5-.3 7-1.3 1.2-.9 1.9-3.4 2.6-6.9z"
        fill="var(--orange)"
        stroke="var(--blue)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UnderlineDoodle({ className = "" }: Props) {
  return (
    <svg className={`doodle doodle-underline ${className}`} viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M3 10c37-6 67 3 102-3s65-3 92 2" fill="none" stroke="var(--orange)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowDoodle({ className = "" }: Props) {
  return (
    <svg className={`doodle doodle-arrow ${className}`} width="56" height="76" viewBox="0 0 60 80" aria-hidden="true" focusable="false">
      <path d="M8 4c22 9 37 29 31 60" fill="none" stroke="var(--blue)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M28 55l11 11 9-13" fill="none" stroke="var(--blue)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

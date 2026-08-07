// Restrained line-icon set for the solutions pages only.
// Self-contained component, not shared with the rest of the site.

export type IconName =
  | "chat" | "calendar" | "mobile" | "search" | "chart" | "star"
  | "image" | "alert" | "check" | "bell" | "paw" | "utensils"
  | "coin" | "lock" | "clock" | "gallery" | "route" | "badge"
  | "sparkle" | "arrow-right";

const paths: Record<IconName, React.ReactNode> = {
  chat: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-3.442-.618L3 21l1.395-3.72C3.512 16.128 3 14.61 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  ),
  calendar: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6h15a.75.75 0 01.75.75V19.5a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75V6.75A.75.75 0 014.5 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h.01M12 12h.01M16.5 12h.01M7.5 15.75h.01M12 15.75h.01M16.5 15.75h.01" />
    </>
  ),
  mobile: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3.75h3a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5zM11.25 18h1.5" />
  ),
  search: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM21 21l-4.35-4.35" />
  ),
  chart: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 20.25h18M6 20.25v-6M11 20.25V9M16 20.25v-9.5M21 20.25V6" />
  ),
  star: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.75l2.6 5.35 5.9.75-4.27 4.13 1.02 5.87L12 15.9l-5.25 2.85 1.02-5.87-4.27-4.13 5.9-.75L12 2.75z" />
  ),
  image: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l4.72-4.72a1.5 1.5 0 012.12 0l2.16 2.16M14.25 14.25l1.72-1.72a1.5 1.5 0 012.12 0L21 15.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
    </>
  ),
  gallery: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25h11.25a.75.75 0 01.75.75v11.25a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V6a.75.75 0 01.75-.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25v10.5a.75.75 0 01-.75.75H8.25" />
    </>
  ),
  alert: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3h.008M4.5 19.5h15a1.5 1.5 0 001.3-2.25l-7.5-13a1.5 1.5 0 00-2.6 0l-7.5 13A1.5 1.5 0 004.5 19.5z" />
  ),
  check: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l1.75 1.75L15 10.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </>
  ),
  bell: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.85 23.85 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  ),
  paw: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5c-2.5 0-4.5 1.8-4.5 3.6 0 1.2 1 1.9 2.2 1.9.9 0 1.4-.4 2.3-.4s1.4.4 2.3.4c1.2 0 2.2-.7 2.2-1.9 0-1.8-2-3.6-4.5-3.6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.2 11.2a1.6 1.9 0 11-3.2 0 1.6 1.9 0 013.2 0zM10.1 8.3a1.6 1.9 0 11-3.2 0 1.6 1.9 0 013.2 0zM16.1 8.3a1.6 1.9 0 11-3.2 0 1.6 1.9 0 013.2 0zM19 11.2a1.6 1.9 0 11-3.2 0 1.6 1.9 0 013.2 0z" />
    </>
  ),
  utensils: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3v6.75M6 3v6.75M9 3v6.75M7.5 9.75V21M16.5 3c-1.24 0-2.25 1.68-2.25 4.5S15.26 12 16.5 12s2.25-1.68 2.25-4.5S17.74 3 16.5 3zM16.5 12V21" />
  ),
  coin: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v9M9.75 9.75c0-1.1 1-2 2.25-2s2.25.9 2.25 1.75c0 2.5-4.5 1.5-4.5 4 0 .85 1 1.75 2.25 1.75s2.25-.9 2.25-2" />
    </>
  ),
  lock: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6 10.5h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V12A1.5 1.5 0 016 10.5z" />
  ),
  clock: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.75" />
    </>
  ),
  route: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75L15 3m0 0l5.25 3M15 3v13.5M9 6.75L3.75 9.75m5.25-3v13.5m0 0L3.75 21m5.25-1.5L15 21m0-4.5l5.25 3m-5.25-3V21" />
  ),
  badge: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l1.75 1.75L15 10.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c1.5 1.4 3.35 2.1 5.25 2.1 0 7.5-2.6 11.2-5.25 12.9-2.65-1.7-5.25-5.4-5.25-12.9 1.9 0 3.75-.7 5.25-2.1z" />
    </>
  ),
  sparkle: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  ),
  "arrow-right": (
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  ),
};

export default function Icon({ name, className = "w-6 h-6", style }: { name: IconName; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      {paths[name]}
    </svg>
  );
}
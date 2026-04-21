"use client";

interface IconProps {
  d: string;
  size?: number;
  stroke?: number;
}

function Icon({ d, size = 14, stroke = 1.5 }: IconProps) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function IconSearch() {
  return <Icon d="M7 12.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm4-1.5 3.5 3.5" />;
}

export function IconBell() {
  return <Icon d="M8 1.5v1M4 6a4 4 0 1 1 8 0v3l1.5 2.5h-11L4 9V6Zm2 6.5a2 2 0 0 0 4 0" />;
}

export function IconSettings() {
  return (
    <Icon d="M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0-9v2M8 12.5v2m6.5-6.5h-2M3.5 8h-2m10.6-4.6-1.4 1.4M4.3 11.7l-1.4 1.4m9.2 0-1.4-1.4M4.3 4.3 2.9 2.9" />
  );
}

export function IconPlus() {
  return <Icon d="M8 3v10M3 8h10" />;
}

export function IconX() {
  return <Icon d="M3 3l10 10M13 3L3 13" />;
}

export function IconChev() {
  return <Icon d="M6 3l5 5-5 5" />;
}

export function IconCheck() {
  return <Icon d="M3 8l3.5 3.5L13 4" stroke={2} />;
}

export function IconNews() {
  return <Icon d="M2.5 3h9v10h-9V3Zm9 2.5H14v7.5H2.5M5 5.5h4M5 7.5h4M5 9.5h4" />;
}

export function IconStar() {
  return (
    <Icon d="M8 2l1.8 3.7 4.2.6-3 3 .7 4.1L8 11.5l-3.7 1.9.7-4.1-3-3 4.2-.6L8 2Z" />
  );
}

export function IconBook() {
  return (
    <Icon d="M3 2h4a2 2 0 0 1 2 2v10a1.5 1.5 0 0 0-1.5-1.5H3V2Zm10 0H9a2 2 0 0 0-2 2v10a1.5 1.5 0 0 1 1.5-1.5H13V2Z" />
  );
}

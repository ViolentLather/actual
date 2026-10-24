import type { SVGProps } from 'react';

export function SfLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={32}
      height={32}
      aria-hidden="true"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="var(--sf-primary, #4f2cf0)" />
      <path
        d="M16 7.5 8.5 24.5h3.6l1.5-3.7h4.8l1.5 3.7h3.6L16 7.5Zm-1.2 10.4L16 14.8l1.2 3.1h-2.4Z"
        fill="#ffffff"
      />
    </svg>
  );
}

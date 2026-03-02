// ABOUTME: MDX link component that opens external URLs in new windows
// ABOUTME: Adds target="_blank" and rel="noopener noreferrer" for http/https links

import { type ComponentPropsWithoutRef } from 'react';

export function ExternalLink({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isExternal = href?.startsWith('http://') || href?.startsWith('https://');

  return (
    <a
      href={href}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      {...props}
    >
      {children}
    </a>
  );
}

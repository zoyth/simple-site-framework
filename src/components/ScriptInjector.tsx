// ABOUTME: Script injection components for custom HTML/JS in head and body
// ABOUTME: Allows injecting analytics, fonts, widgets, and tracking code

'use client';

import { useEffect } from 'react';

export interface HeadScriptsProps {
  /**
   * Array of HTML strings to inject in <head>
   * Can include <script>, <link>, <meta>, etc.
   */
  scripts?: string[];
}

export interface BodyEndScriptsProps {
  /**
   * Array of HTML strings to inject before </body>
   * Typically chat widgets, tracking pixels, etc.
   */
  scripts?: string[];
}

/**
 * Injects scripts into document head
 * Use in your root layout's <head> section
 */
export function HeadScripts({ scripts }: HeadScriptsProps) {
  if (!scripts || scripts.length === 0) return null;

  return (
    <>
      {scripts.map((script, index) => (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: script }}
          suppressHydrationWarning
        />
      ))}
    </>
  );
}

/**
 * Injects scripts at end of body
 * Use in your root layout before closing </body>
 */
export function BodyEndScripts({ scripts }: BodyEndScriptsProps) {
  useEffect(() => {
    if (!scripts || scripts.length === 0) return;

    // Create a container for the scripts
    const container = document.createElement('div');
    container.style.display = 'none';

    scripts.forEach((script) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = script;

      // Execute scripts by moving them to the container
      Array.from(wrapper.children).forEach((element) => {
        if (element instanceof HTMLScriptElement) {
          // Clone script to ensure it executes
          const newScript = document.createElement('script');
          Array.from(element.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (element.innerHTML) {
            newScript.innerHTML = element.innerHTML;
          }
          document.body.appendChild(newScript);
        } else {
          // For non-script elements (like noscript, img pixels)
          document.body.appendChild(element.cloneNode(true));
        }
      });
    });

    // Cleanup function
    return () => {
      // Remove injected scripts on unmount
      const injectedScripts = document.querySelectorAll(
        'script[data-injected="true"]'
      );
      injectedScripts.forEach((script) => script.remove());
    };
  }, [scripts]);

  return null;
}

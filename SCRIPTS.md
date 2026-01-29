# Script Injection Guide

The framework supports injecting custom HTML, scripts, and tracking code into your pages.

## Configuration

Create a scripts configuration file:

```typescript
// src/config/scripts.ts
import { type ScriptsConfig } from '@zoyth/simple-site-framework';

export const siteScripts: ScriptsConfig = {
  // Scripts for <head> section
  head: [
    // Google Analytics
    `<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>`,
    `<script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>`,

    // Plausible Analytics (privacy-friendly alternative)
    `<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>`,

    // Custom meta tags
    `<meta name="theme-color" content="#F16531">`,

    // Font preconnect
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
  ],

  // Scripts for end of <body>
  bodyEnd: [
    // Intercom chat widget
    `<script>
      window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
        app_id: "YOUR_APP_ID"
      };
    </script>`,
    `<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/YOUR_APP_ID';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();</script>`,

    // Facebook Pixel
    `<script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    </script>`,
    `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/></noscript>`,

    // Hotjar
    `<script>
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>`,
  ],
};
```

## Usage in Layout

Update your root layout to inject the scripts:

```typescript
// src/app/layout.tsx
import { HeadScripts, BodyEndScripts } from '@zoyth/simple-site-framework/components';
import { siteScripts } from '@/config/scripts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadScripts scripts={siteScripts.head} />
      </head>
      <body>
        {children}
        <BodyEndScripts scripts={siteScripts.bodyEnd} />
      </body>
    </html>
  );
}
```

## Environment-Specific Scripts

You can conditionally include scripts based on environment:

```typescript
// src/config/scripts.ts
export const siteScripts: ScriptsConfig = {
  head: [
    // Only include analytics in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          `<script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}"></script>`,
          `<script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          </script>`,
        ]
      : []),
  ],
  bodyEnd: [],
};
```

## Common Use Cases

### Google Analytics 4
```typescript
head: [
  `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>`,
  `<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>`,
]
```

### Plausible Analytics (Privacy-Friendly)
```typescript
head: [
  `<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>`,
]
```

### Crisp Chat
```typescript
bodyEnd: [
  `<script type="text/javascript">
    window.$crisp=[];
    window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
    (function(){
      d=document;
      s=d.createElement("script");
      s.src="https://client.crisp.chat/l.js";
      s.async=1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  </script>`,
]
```

### Custom Meta Tags
```typescript
head: [
  `<meta name="theme-color" content="#F16531">`,
  `<meta name="apple-mobile-web-app-capable" content="yes">`,
  `<link rel="manifest" href="/manifest.json">`,
]
```

## Security Considerations

⚠️ **Important:** The script injection uses `dangerouslySetInnerHTML`, which can pose XSS risks if you inject untrusted content.

**Best Practices:**
1. Only inject scripts from trusted sources (analytics providers, known widgets)
2. Never inject user-generated content
3. Use environment variables for IDs/tokens instead of hardcoding
4. Review all scripts before deploying to production
5. Use Content Security Policy (CSP) headers when possible

## Debugging

If scripts aren't loading:

1. **Check browser console** for errors
2. **View page source** to verify scripts are injected
3. **Check Network tab** to see if external scripts load
4. **Verify script order** - some scripts depend on others loading first
5. **Test in production mode** - some scripts only work in production

## Next.js Script Component Alternative

For better performance, consider using Next.js's built-in `Script` component for some scripts:

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

Use the framework's `ScriptInjector` for:
- Scripts that need specific positioning
- Scripts with inline configuration
- Legacy scripts that don't work well with Next.js Script component

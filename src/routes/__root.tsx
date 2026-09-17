import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatch,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CookieConsent } from "@/components/site/cookie-consent";
import { Toaster } from "@/components/ui/sonner";
import { fetchSiteChrome, type SiteChrome } from "@/lib/cms";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async (): Promise<{ chrome: SiteChrome }> => {
    const chrome = await fetchSiteChrome();
    return { chrome };
  },
  head: ({ loaderData }) => {
    const chrome = (loaderData as { chrome?: SiteChrome } | undefined)?.chrome;
    const logoUrl =
      (chrome?.settings as { logo_url?: string } | null | undefined)?.logo_url ??
      "/favicon.ico";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Quorlex Soft — Software, AI and Cloud Engineering" },
        {
          name: "description",
          content:
            "Quorlex Soft builds custom software, SaaS platforms, AI systems and cloud infrastructure for organisations worldwide.",
        },
        { name: "author", content: "Quorlex Soft" },
        { property: "og:site_name", content: "Quorlex Soft" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap",
        },
        { rel: "icon", href: logoUrl },
        { rel: "apple-touch-icon", href: logoUrl },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * Hook to access site chrome data (site_settings, nav_items, footer, socials)
 * from any child route.
 */
export function useSiteChrome(): SiteChrome {
  const match = useMatch({ from: "__root__", shouldThrow: true });
  return (match.loaderData as { chrome: SiteChrome }).chrome;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { chrome } = Route.useLoaderData();

  const settings = chrome.settings;
  const organizationSchema = settings
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: settings.company_name,
        description: settings.positioning ?? undefined,
        email: settings.email ?? undefined,
        telephone: settings.phone ?? undefined,
        address: settings.registered_in
          ? {
              "@type": "PostalAddress",
              addressLocality: settings.registered_in,
            }
          : undefined,
      }
    : null;

  return (
    <QueryClientProvider client={queryClient}>
      {organizationSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      ) : null}
      <div className="flex min-h-screen flex-col">
        <Header chrome={chrome} />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer chrome={chrome} />
      </div>
      <CookieConsent />
      <Toaster />
    </QueryClientProvider>
  );
}

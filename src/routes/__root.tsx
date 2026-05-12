import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cigar-dark px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-cigar-gold" style={{ fontFamily: "'Cirkus',serif" }}>404</h1>
        <h2 className="mt-4 text-xl text-cigar-cream">Page not found</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-cigar-gold text-cigar-gold px-6 py-2 text-sm tracking-widest uppercase hover:bg-cigar-gold hover:text-cigar-dark transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adwaya Prana — Premium Cigars" },
      { name: "description", content: "Premium handcrafted cigars from the finest tobacco leaves." },
      { property: "og:title", content: "Adwaya Prana — Premium Cigars" },
      { property: "og:description", content: "Premium handcrafted cigars from the finest tobacco leaves." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lora:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
  const client = getQueryClient();
  return (
    <QueryClientProvider client={client}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}

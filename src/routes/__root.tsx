import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const HIDE_NAVBAR_ROUTES = ['/login', '/onboarding']

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'BeeSafe',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <TanStackQueryProvider>
          {children}
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showNavbar = !HIDE_NAVBAR_ROUTES.includes(pathname)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Spacer when navbar is shown so the scroll container sits below it; scrollbar runs full height to bottom */}
      {showNavbar && <div className="h-16 shrink-0" aria-hidden />}
      <div className="main-scroll min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
      {showNavbar && <Navbar />}
    </div>
  )
}

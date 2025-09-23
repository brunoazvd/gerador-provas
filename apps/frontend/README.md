/src
  - main.tsx
  - App.tsx
  /app
    - routes.tsx        # definição das rotas
    - providers.tsx     # todos os providers globais (ThemeProvider, AuthProvider, etc.)
  /context              # Contextos globais
    - AuthContext.tsx   # contexto de autenticação
    - ThemeContext.tsx  # exemplo: tema light/dark
    - ExamContext.tsx   # contexto específico de provas
  /components
    /ui                 # componentes shadcn/ui (botão, input, dialog…)
    /common             # componentes genéricos do app (Navbar, Sidebar, Layout…)
    /feature            # componentes específicos de alguma feature
  /lib
    - utils.ts
    - fetcher.ts
    - cn.ts              # utilitário classNames (do shadcn)
  /hooks
    - useAuth.ts         # hooks que consomem contextos globais
    - useTheme.ts
  /types
    - auth.ts
    - exam.ts
  /assets
    - react.svg
    - logo.png
  /styles
    - globals.css
    - App.css
  /pages
    - homepage.tsx
    /feature             # páginas específicas de alguma feature
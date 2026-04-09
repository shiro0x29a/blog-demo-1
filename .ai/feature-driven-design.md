# Feature-Driven Design / Feature-Based Architecture / Self-Contained Feature

Архитектура проекта **Nextjs-Elite-Boilerplate**, адаптированная под feature-driven подход.

```
src/
├── features/                          # 🔥 Основная директория фич
│   ├── auth/                          # Фича: аутентификация
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── logout-button.tsx
│   │   ├── hooks/
│   │   │   ├── use-login.ts
│   │   │   └── use-session.ts
│   │   ├── api/
│   │   │   └── auth-client.ts        # клиентские вызовы API
│   │   ├── schemas/
│   │   │   └── auth.schema.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── store/                     # если используете Zustand / Context
│   │   │   └── auth-store.ts
│   │   └── index.ts                   # публичное API фичи
│   │
│   ├── dashboard/                     # Фича: дашборд (общая логика)
│   │   ├── components/
│   │   │   ├── stats-card.tsx
│   │   │   └── recent-activity.tsx
│   │   ├── hooks/
│   │   ├── api/
│   │   └── index.ts
│   │
│   ├── user-dashboard/                # Фича: юзер-дашборд
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   ├── admin-dashboard/               # Фича: админ-дашборд
│   │   ├── components/
│   │   │   ├── admin-stats.tsx
│   │   │   └── user-management.tsx
│   │   ├── hooks/
│   │   ├── api/
│   │   └── index.ts
│   │
│   ├── i18n/                          # Фича: интернационализация
│   │   ├── components/
│   │   │   └── language-switcher.tsx
│   │   ├── hooks/
│   │   │   ├── use-translations.ts
│   │   │   └── use-language.ts
│   │   ├── lib/
│   │   │   ├── get-translations.ts
│   │   │   └── language-context.tsx
│   │   └── index.ts
│   │
│   ├── theme/                         # Фича: темизация
│   │   ├── components/
│   │   │   ├── theme-toggle.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── hooks/
│   │   │   └── use-theme.ts
│   │   └── index.ts
│   │
│   └── notifications/                 # Фича: уведомления (toast)
│       ├── components/
│       │   └── toast.tsx
│       ├── hooks/
│       │   └── use-toast.ts
│       └── index.ts
│
├── shared/                            # 🧩 Переиспользуемый код (бывший src/shared)
│   ├── ui/                            # UI-кирпичики (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── input-error.tsx
│   │   ├── password-input.tsx
│   │   ├── label.tsx
│   │   ├── sheet.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tooltip.tsx
│   │   └── toast.tsx
│   │
│   ├── components/                    # Универсальные компоненты
│   │   ├── common/
│   │   ├── icon/
│   │   ├── logo.tsx
│   │   ├── text-link.tsx
│   │   └── hero-section.tsx
│   │
│   ├── layout/                        # Глобальные лейауты
│   │   ├── client-layout.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   │
│   ├── hooks/                         # Универсальные хуки
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   │
│   ├── lib/                           # Утилиты и конфиги
│   │   ├── auth/                      # Auth-утилиты
│   │   ├── config/                    # Конфиги (site, metadata)
│   │   ├── i18n/                      # i18n-утилиты
│   │   ├── env.ts
│   │   ├── schemas.ts
│   │   └── utils.ts
│   │
│   └── types/                         # Глобальные типы
│       └── common.types.ts
│
├── app/                               # 📁 Next.js App Router (тонкий слой маршрутизации)
│   ├── (public)/                      # Публичные маршруты
│   │   ├── page.tsx                   # импортирует { HeroSection } из shared/components
│   │   └── about/
│   │       └── page.tsx
│   │
│   ├── (protected)/                   # Защищённые маршруты
│   │   ├── @admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx           # импортирует { AdminDashboard } из features/admin-dashboard
│   │   ├── @user/
│   │   │   └── dashboard/
│   │   │       └── page.tsx           # импортирует { UserDashboard } из features/user-dashboard
│   │   ├── unauthorized/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                           # API Routes
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts
│   │   └── health/
│   │       └── route.ts
│   │
│   ├── auth/                          # NextAuth route handler
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── manifest.ts
│   ├── robots.ts
│   └── sitemap.ts
│
├── locales/                           # Переводы (en.json, ru.json, ...)
├── e2e/                               # E2E тесты (Playwright)
├── public/                            # Статика
└── ... конфиги (eslint, prettier, tailwind, vitest, playwright)
```

## Правила

### 1. Фичи самодостаточны

Каждая фича в `features/` содержит всё необходимое для своей работы:
- **components/** — React-компоненты, специфичные для фичи
- **hooks/** — кастомные хуки
- **api/** — клиенты для запросов к API
- **schemas/** — Zod-схемы для валидации
- **types/** — TypeScript-типы
- **store/** — состояние (Zustand, Context, и т.д.)
- **index.ts** — публичное API (экспортирует только то, что нужно вовне)

### 2. Shared — только переиспользуемое

В `shared/` находится код, который используется **в нескольких фичах**:
- **ui/** — примитивы shadcn/ui (button, card, input, и т.д.)
- **components/** — универсальные компоненты (logo, text-link, hero-section)
- **layout/** — глобальные лейауты (header, sidebar, client-layout)
- **hooks/** — хуки, не привязанные к фичам (use-mobile, use-toast)
- **lib/** — утилиты, конфиги, i18n, auth-хелперы
- **types/** — глобальные типы

### 3. App — тонкий слой маршрутизации

Файлы в `app/` **не должны содержать бизнес-логики**. Они только:
- Импортируют компоненты из `features/` или `shared/`
- Определяют layout и маршруты
- Обрабатывают серверную часть (metadata, revalidate, и т.д.)

### 4. Направления импортов

```
app/        → импортирует из → features/ или shared/
features/*  → импортирует из → shared/ (но не из других features/*)
shared/*    → никуда не импортирует из features/ или app/
```

### 5. Стек проекта

- **UI:** shadcn/ui + tailwindcss v4 + lucide-react
- **Валидация:** zod
- **Аутентификация:** next-auth
- **Темизация:** next-themes
- **Тесты:** vitest (unit) + playwright (e2e)
- **Анимации:** tw-animate-css
- **Аналитика:** @vercel/analytics

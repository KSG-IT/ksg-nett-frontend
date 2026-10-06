# KSG-nett frontend

The single-page app for KSG-nett. It is built with React and TypeScript and talks to the GraphQL API in [KSG-IT/ksg-nett](https://github.com/KSG-IT/ksg-nett).

## Stack

| Part            | Choice                                                                                 |
| --------------- | -------------------------------------------------------------------------------------- |
| Build           | [Vite](https://vite.dev/) 8, TypeScript 5                                              |
| UI              | React 19, [Mantine](https://mantine.dev/) 9, Tabler icons, TipTap editor               |
| Data            | [Apollo Client](https://www.apollographql.com/docs/react/) 3 against `POST /graphql/`  |
| Forms           | [react-hook-form](https://react-hook-form.com/) with [zod](https://zod.dev/) 4 schemas |
| Client state    | [zustand](https://zustand.docs.pmnd.rs/) (logged-in user, token, sidebar)              |
| Notifications   | `@mantine/notifications`                                                               |
| Charts          | `@mantine/charts` (on recharts)                                                        |
| Errors          | Sentry                                                                                 |
| Tests           | Jest with ts-jest, for `.ts` files                                                     |
| Package manager | Yarn 4 through corepack                                                                |

## Quickstart

You need Node 22 (see `.nvmrc`). Vite 8 needs Node 20.19 or later.

```sh
corepack enable   # installs the Yarn version from "packageManager" in package.json
yarn install
yarn start        # http://localhost:3000
```

`yarn start` uses `.env.development`, so the app talks to the development backend (`https://ksg-nett-dev.samfundet.no`). Log in with your account on that server.

### Use a local backend

Run the backend from [KSG-IT/ksg-nett](https://github.com/KSG-IT/ksg-nett) on port 8000. Then create `.env.development.local`:

```sh
VITE_API_URL="http://localhost:8000"
```

Use `.env.development.local`, not `.env` or `.env.local`. Vite gives `.env.development` priority over those two files.

Set `VITE_PORT` to run the dev server on a port other than 3000.

## Scripts

| Command                  | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `yarn start`             | Dev server with hot reload (also `yarn dev`)   |
| `yarn build`             | Type check with `tsc`, then a production build |
| `yarn test`              | Run the Jest tests in `src`                    |
| `yarn build:development` | Build with `.env.development`                  |
| `yarn build:production`  | Build with `.env.production`                   |

## Branches, CI and deploy

| Branch    | Deploys to                          |
| --------- | ----------------------------------- |
| `develop` | development (`app-dev.ksg-nett.no`) |
| `master`  | production                          |

- Branch from `develop` and open the pull request against `develop`.
- Name branches `<type>/<short-description>`, for example `feature/voucher-revenue` or `fix/allergy-day-selection`. Use `feature`, `fix`, `refactor` or `chore`.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/) with the module as scope: `feat(economy): ...`, `fix(schedules): ...`.
- Add a line for user-visible changes under `[unreleased]` in `CHANGELOG.md`.
- CI runs `yarn build` and `yarn test` on each pull request to `develop` and `master`.
- GitHub Actions build and deploy on push to `develop` and `master` (`.github/workflows/`).
- A pre-commit hook runs Prettier on staged files. The config is in `.prettierrc`.

## Code structure

```
src/
├── components/   shared components (PermissionGate, Breadcrumbs, Table, ...)
├── containers/   app shell: Root, MainLayout, Navbar
├── routes/       public and private routes, RestrictedRoute
├── modules/      one folder per feature
├── store/        zustand store
├── util/         helpers, hooks, permissions, date-fns wrapper
└── theme.ts      Mantine theme
```

Each feature module has the same files. See `src/modules/quotes/` for an example.

```
src/modules/<module>/
├── views/              route-level components, with index.ts
├── components/         components for those views, with index.ts
├── queries.ts          gql query documents
├── mutations.ts        gql mutation documents
├── mutations.hooks.ts  use<Feature>Mutations() hook
└── types.graphql.ts    *Returns and *Variables types
```

## Code style

These rules are for new code. Old code does not follow all of them. Fix old code in separate pull requests, not as part of a feature.

### Components

- Write function components. Declare the props interface above the component:

  ```tsx
  interface QuoteCardProps {
    quote: QuoteNode
  }

  export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => { ... }
  ```

- Use named exports, and export from the folder's `index.ts`. Use `export default` only for a route that `React.lazy` loads.
- Import across modules with absolute paths from `src` (`components/...`, `modules/...`, `util/...`). Use relative paths only inside one module.
- Keep components small. Split a component that does more than one job or has more than about 5 props.
- Write UI text in Norwegian and code names in English.

### Queries and mutations

- Put `gql` documents in `queries.ts` and `mutations.ts`, and their types in `types.graphql.ts`.
- Type each `useQuery` and `useMutation` with `<*Returns, *Variables>`.
- Return `<FullPageError />` on error and `<FullContentLoader />` while a page loads:

  ```tsx
  const { data, loading, error } = useQuery<
    UserQueryReturns,
    UserQueryVariables
  >(USER_QUERY, { variables: { id } })

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />
  ```

  A resolver returns `null` when the object does not exist. Handle that case.

- Wrap the mutations of a module in one hook in `mutations.hooks.ts`:

  ```ts
  export function useQuoteMutations() {
    const [createQuote, { loading: createQuoteLoading }] = useMutation<
      CreateQuoteReturns,
      CreateQuoteVariables
    >(CREATE_QUOTE_MUTATION)

    return { createQuote, createQuoteLoading }
  }
  ```

- Do not change an Apollo result in place. Copy it first (`[...list].sort()`). Development builds freeze query results, so in-place changes fail on `app-dev` only.
- Do not copy query data into `useState`.

### Forms

Use react-hook-form with a zod schema and `zodResolver`. Take the form types from the schema (`z.infer`). Shared rules are in `src/util/validation.ts`.

Larger forms are split in three files. See `src/modules/economy/components/DepositForm/`:

| File                       | Content                                          |
| -------------------------- | ------------------------------------------------ |
| `CreateDepositForm.tsx`    | the form markup                                  |
| `useCreateDepositLogic.ts` | the zod schema, `useForm` and the submit handler |
| `useCreateDepositAPI.ts`   | the mutation and default values                  |

### Styling

- Use Mantine components and style props (`gap`, `c`, `fw`, `p`) first.
- Use responsive props (`cols={{ base: 1, sm: 2 }}`, `visibleFrom`) instead of `isMobile` checks.
- Write new styles in a `<Component>.module.css` file next to the component, with Mantine CSS variables. Do not add new `createStyles` calls.
- Import `Badge` from `components/Badge`, not from `@mantine/core`.

### Permissions

Use the strings in `src/util/permissions.ts` (`PERMISSIONS.economy.view.deposit`) with `PermissionGate` and `RestrictedRoute`. Do not write permission strings by hand.

### Dates and money

- Format dates with `format` from `util/date-fns`. It sets the Norwegian locale.
- Show NOK with Mantine `NumberFormatter` (`suffix=" kr"`), or `useCurrencyFormatter` when you need a string.

### Tests

Put pure logic in a `.ts` file next to the feature, with a `<name>.test.ts` file beside it. Jest transforms only `.ts` files, so there are no component tests.

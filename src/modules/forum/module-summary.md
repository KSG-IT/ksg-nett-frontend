# forum — Module Summary

## 1. Purpose / Responsibility

Community discussion forum for KSG members. Currently in early development with basic thread listing and thread detail UI in place but no live data integration yet.

## 2. Key Pages / Views

| Route                | Component        | Purpose                                                     |
| -------------------- | ---------------- | ----------------------------------------------------------- |
| `/forum`             | `ForumDashboard` | Thread list with search placeholder and "New Thread" button |
| `/forum/:threadSlug` | `ForumThread`    | Thread detail with rich text reply editor                   |

> **Note**: Forum link in the main navbar is commented out — feature is not yet publicly enabled.

## 3. GraphQL Operations

**None implemented.** Thread and post data is currently hardcoded/mocked. Backend permissions (`forum.add_thread`, `forum.add_post`) exist, suggesting backend models are ready.

## 4. Key Components

| Component        | Purpose                                                               |
| ---------------- | --------------------------------------------------------------------- |
| `ForumDashboard` | `CardTable` of threads (title, author, date, reply count, view count) |
| `ForumThread`    | Thread content card + Tiptap reply editor                             |

## 5. State Management

No state management implemented. Tiptap `useEditor` hook only.

## 6. Notable Patterns

- **Lazy-loaded** routes for code splitting
- **`PermissionGate`** on "New Thread" with `PERMISSIONS.forum.add.thread`
- **Tiptap** editor (StarterKit + Link) consistent with handbook and summaries modules
- **Scaffold-only** — UI exists but awaits backend GraphQL schema connection

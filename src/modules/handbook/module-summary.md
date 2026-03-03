# handbook — Module Summary

## 1. Purpose / Responsibility

Centralised document management for organisational handbooks and guidelines. Supports CRUD operations on documents with rich text editing, audit metadata, and role-based access control.

## 2. Key Pages / Views

| Route                            | Component        | Purpose                                                          |
| -------------------------------- | ---------------- | ---------------------------------------------------------------- |
| `/handbook`                      | `Handbook`       | List all documents; single-click to select, double-click to open |
| `/handbook/create`               | `CreateDocument` | Form to create a new document                                    |
| `/handbook/document/:documentId` | `DocumentDetail` | View / edit a document (`?mode=edit` query param)                |

## 3. GraphQL Operations

**Queries**

- `ALL_DOCUMENTS_QUERY` — list with id, name, timestamps, updatedBy
- `DOCUMENT_DETAIL_QUERY` — full content + creator/updater metadata

**Mutations**

- `CREATE_DOCUMENT_MUTATION` — `CreateDocumentInput { name, content }`
- `PATCH_DOCUMENT` — `PatchDocumentInput { name, content }`
- `DELETE_DOCUMENT` — returns `{ found: boolean }`

## 4. Key Components

| Component            | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `DocumentStack`      | Scrollable document list with last-editor + relative timestamp |
| `DocumentForm`       | Create/edit form — `TextInput` + Tiptap rich text editor       |
| `useDocumentLogic`   | Form state (react-hook-form + Yup) + Tiptap editor instance    |
| `useDocumentFormAPI` | Mutation orchestration, navigation, toast notifications        |

## 5. State Management

- **Apollo** — query caching + `refetchQueries` on all mutations
- **react-hook-form + Yup** — local form validation (non-empty content guard)
- **Local** — selected document tracking in list view; edit-mode toggle in detail view
- **React Router** — `?mode=edit` query param activates edit mode on first render (via `useRef` guard)

## 6. Notable Patterns

- **Two hooks** separate form state (`useDocumentLogic`) from API calls (`useDocumentFormAPI`)
- **Tiptap** editor with StarterKit + Link extensions; content rendered via `dangerouslySetInnerHTML`
- **`PermissionGate`** on create, edit, delete UI (three levels: add / change / delete)
- **`date-fns`** relative timestamps ("for X time ago")
- On create success navigates directly to new document's detail page

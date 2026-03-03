# organization — Module Summary

## 1. Purpose / Responsibility

Manages KSG's internal groups (gangs), interest groups, user memberships (with status types), and featured member highlights. Provides views for browsing the org structure and admin tools for managing members and group info.

## 2. Key Pages / Views

| Route                         | Component             | Purpose                                          |
| ----------------------------- | --------------------- | ------------------------------------------------ |
| `/internal-groups`            | `InternalGroups`      | Card grid of all groups split by type            |
| `/internal-groups/:id`        | `InternalGroupDetail` | Group detail: info, highlights, settings tabs    |
| `/internal-groups/:id/manage` | `ManageInternalGroup` | Admin: active/historical memberships + add users |

## 3. GraphQL Operations

**Queries**: `ALL_INTERNAL_GROUPS_BY_TYPE`, `INTERNAL_GROUP_QUERY`, `INTERNAL_GROUP_USER_HIGHLIGHTS_BY_INTERNAL_GROUP`, `ALL_INTERNAL_GROUP_POSITIONS`, `MANAGE_USERS_DATA_QUERY`

**Mutations**: `PATCH_INTERNAL_GROUP`, `PATCH_INTERNAL_GROUP_POSITION_MEMBERSHIP`, `CREATE/PATCH_INTERNAL_GROUP_USER_HIGHLIGHT`, `ASSIGN_NEW_INTERNAL_GROUP_POSITION_MEMBERSHIP`, `QUIT_KSG`, `CREATE/PATCH/DELETE_INTERVIEW_SCHEDULE_TEMPLATE`

## 4. Key Components

| Component                                       | Purpose                                              |
| ----------------------------------------------- | ---------------------------------------------------- |
| `InternalGroupTabs`                             | Info / Highlights / Settings tabs                    |
| `InternalGroupInfo`                             | Member list by position + group description          |
| `InternalGroupEditForm`                         | Edit name, rich-text description, banner image       |
| `InternalGroupUserHighlights`                   | Grid of highlight cards with edit/add modals         |
| `UserManagementTable`                           | Members table with status dropdown + Quit KSG button |
| `UserManagementAddUser`                         | Modal to assign new position to user                 |
| `useEditHighlightAPI` / `useEditHighlightLogic` | Split API/form-validation hooks                      |

## 5. State Management

- **Apollo** — all queries + mutations; `refetchQueries` after membership changes
- **react-hook-form + Yup** — highlight edit forms with image validation
- **Local** — modal open/close; selected items

## 6. Notable Patterns

- **`PermissionGate`** on management tabs, edit forms, and highlight editing
- **Semester shorthand** displayed for membership dates ("V25")
- **Image file upload** with `URL.createObjectURL()` preview before submit
- **Tiptap** (StarterKit + Link) for group description rich text
- **Dual membership view** — active (editable) + historical (read-only) in manage page

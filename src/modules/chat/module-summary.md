# chat — Frontend Module Summary

## 1. Purpose / Responsibility

Placeholder frontend module. The chat feature is served entirely as a Django-rendered page (not a React SPA view) via the backend's `chat/templates/chat/chat.html` template and Django Channels WebSocket consumer.

## 2. Key Pages / Views

No React routes or components. Chat is accessed directly at the backend URL `/internal/chat/`.

## 3. GraphQL / WebSocket

No GraphQL. WebSocket at `ws/.../ws/chat/` handles all real-time messaging (see backend `chat` module summary for protocol details).

## 4. Key Components

None — `index.ts` exports nothing.

## 5. State Management

None in the frontend. All chat state lives in Redis (50-message history, user presence set), managed by the Django Channels consumer.

## 6. Notable Patterns

- **Django-first architecture**: chat runs independently of the React SPA; no JS framework dependencies
- **Not in React Router**: chat link in the Navbar is accessed as an external URL, not a React route
- The module folder exists as a structural placeholder for a potential future React migration

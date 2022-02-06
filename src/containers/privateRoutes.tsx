import { Dashboard } from 'modules/dashboard'
import { UserProfile } from 'modules/users'
import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

export const PlaceholderComponent: React.FC<RouteComponentProps> = () => {
  const [sidebar, setSidebar] = useState(false)

  const toggleSidebar = () => {
    setSidebar(!sidebar)
  } 
  return (
    <div>
      <span>Sidebar is {sidebar ? 'open' : 'closed'}</span>
      <br />
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  )
}

/* 
Make sure to put new routes under "parent" routes,
i.e: /qoutes must come before /quotes/quoteId
*/
export const privateRoutes = [
  {path: "/users", name: "Medlemmer", Component: PlaceholderComponent},
  {path: "/users/:userId", name: "Medlemsprofil", Component: UserProfile},
  {path: "/dashboard", name: "Kontrollpanel", Component: Dashboard},
  {path: "/economy", name: "Økonomi", Component: PlaceholderComponent},
  {path: "/schedules", name: "Vaktplan", Component: PlaceholderComponent},
  {path: "/summaries", name: "Møtereferat", Component: PlaceholderComponent},
  {path: "/admissions", name: "Tilganger", Component: PlaceholderComponent},
  {path: "/quotes", name: "Sitater", Component: PlaceholderComponent},
  {path: "/chat", name: "Chat", Component: PlaceholderComponent},
  {}
]


import { Tabs } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom'
import classes from './ScheduleTabs.module.css'

interface ScheduleTab {
  path: string
  label: string
  managersOnly: boolean
}

// Planlegging comes between Vaktplan and Roster in a later step
const TABS: ScheduleTab[] = [
  { path: 'v2', label: 'Vaktplan', managersOnly: false },
  { path: 'roster', label: 'Roster', managersOnly: true },
  { path: 'rules', label: 'Regler', managersOnly: true },
]

interface ScheduleTabsProps {
  scheduleId: string
  canManage: boolean
}

// The pages of one schedule. Only managers see the roster pages. With one
// page left there is nothing to choose, so the tabs are hidden.
export const ScheduleTabs: React.FC<ScheduleTabsProps> = ({
  scheduleId,
  canManage,
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tabs = TABS.filter(tab => canManage || !tab.managersOnly)
  if (tabs.length < 2) return null

  const active = tabs.find(tab => pathname.endsWith(`/${tab.path}`))?.path

  return (
    <Tabs
      value={active ?? null}
      onChange={path => navigate(`/schedules/${scheduleId}/${path}`)}
    >
      <Tabs.List className={classes.list}>
        {tabs.map(tab => (
          <Tabs.Tab key={tab.path} value={tab.path} className={classes.tab}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  )
}

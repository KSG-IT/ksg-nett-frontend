import { MessageBox } from 'components/MessageBox'

// The backend gives the roster pages to the schedule's managers only
export const ManagersOnly: React.FC = () => (
  <MessageBox type="info">
    Bare de som administrerer vaktplanen kan se denne siden.
  </MessageBox>
)

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tabs } from '@mantine/core'
import CreateShiftTab from './CreateShift'

const ScheduleAdmin = () => {
  const tabs = [
    {
      text: 'Create shift',
    },
    {
      text: 'Change shift',
    },
  ]
  return (
    <Tabs>
      <Tabs.Tab label="Create shift" icon={<FontAwesomeIcon icon="plus" />}>
        <CreateShiftTab />
      </Tabs.Tab>
      <Tabs.Tab
        label="Delete shift"
        icon={<FontAwesomeIcon icon="crosshairs" />}
      >
        Content 2
      </Tabs.Tab>
    </Tabs>
  )
}

export default ScheduleAdmin

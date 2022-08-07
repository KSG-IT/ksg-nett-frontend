import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover, Text } from '@mantine/core'
import { useState } from 'react'

interface InfoPopoverProps {
  content: string
}

export const InfoPopover: React.VFC<InfoPopoverProps> = ({ content }) => {
  const [opened, setOpened] = useState(false)
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      withArrow
      trapFocus={false}
      closeOnEscape={false}
      transition="pop-top-left"
      width={260}
    >
      <Popover.Target>
        <FontAwesomeIcon
          icon={'question-circle'}
          size="lg"
          color="gray"
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <div style={{ display: 'flex' }}>
          <Text size="sm">{content}</Text>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

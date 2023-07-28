import { Popover, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useState } from 'react'

interface InfoPopoverProps {
  content: string
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({ content }) => {
  const [opened, setOpened] = useState(false)
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      withArrow
      trapFocus={false}
      closeOnEscape={false}
      transitionProps={{ duration: 0, transition: 'pop-top-left' }}
      width={260}
    >
      <Popover.Target>
        <IconInfoCircle
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

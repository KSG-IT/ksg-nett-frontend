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
      placement="center"
      withArrow
      trapFocus={false}
      closeOnEscape={false}
      transition="pop-top-left"
      width={260}
      styles={{ body: { pointerEvents: 'none' } }}
      target={
        <FontAwesomeIcon
          icon={'question-circle'}
          size="lg"
          color="gray"
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        />
      }
    >
      <div style={{ display: 'flex' }}>
        <Text size="sm">{content}</Text>
      </div>
    </Popover>
  )
}

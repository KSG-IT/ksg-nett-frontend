import { forwardRef } from 'react'
import { Box, CloseButton } from '@mantine/core'
import { IconUser, IconUserPlus } from '@tabler/icons-react'

interface ValueProps {
  value: string
  label: string
  onRemove: () => void
  [key: string]: unknown
}

export function Value({ label, onRemove, ...others }: ValueProps) {
  return (
    <div {...(others as React.HTMLAttributes<HTMLDivElement>)}>
      <Box
        style={{
          display: 'flex',
          cursor: 'default',
          alignItems: 'center',
          backgroundColor: 'white',
          border: '1px solid var(--mantine-color-gray-4)',
          paddingLeft: 10,
          borderRadius: 4,
        }}
      >
        <Box mt={4} mr={5}>
          <IconUser color={'lightgray'} />
        </Box>
        <Box style={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Box>
    </div>
  )
}

interface ItemProps {
  label?: string
  value?: string
  [key: string]: unknown
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }, ref) => {
    return (
      <div ref={ref} {...(others as React.HTMLAttributes<HTMLDivElement>)}>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Box mr={10}>
            <IconUserPlus color={'lightgray'} />
          </Box>
          <div>{label}</div>
        </Box>
      </div>
    )
  }
)

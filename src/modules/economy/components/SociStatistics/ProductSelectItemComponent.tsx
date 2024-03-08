import { CloseButton, Group, MultiSelectValueProps, Paper } from '@mantine/core'
import React, { forwardRef } from 'react'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: string
  label: string
  description: string
}

export const ProductSelectItemComponent = forwardRef<HTMLDivElement, ItemProps>(
  ({ icon, label, description, ...others }, ref) => {
    return (
      <Group ref={ref} {...others}>
        <div>{icon}</div>
        <div>
          <div>{description}</div>
        </div>
      </Group>
    )
  }
)

export const ProductSelectLabelComponentOld = forwardRef<
  HTMLDivElement,
  ItemProps
>(({ icon, label, description, ...others }, ref) => {
  return (
    <Group ref={ref} {...others}>
      <div>{icon}</div>
      <div>
        <div>{label}</div>
      </div>
    </Group>
  )
})

export function ProductSelectLabelComponent({
  value,
  label,
  icon,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & { value: string; icon: string }) {
  return (
    <Paper withBorder mr={2}>
      <Group {...others}>
        <div>{icon}</div>
        <div>
          <div>{label}</div>
        </div>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Group>
    </Paper>
  )
}

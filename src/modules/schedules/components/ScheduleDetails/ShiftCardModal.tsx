import { useState } from 'react'
import { createStyles, TextInput } from '@mantine/core'
import { ShiftCardSlot } from './ShiftCardSlot'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { AddShiftSlotPopover } from './AddShiftSlotPopover'
import { useForm } from 'react-hook-form'

interface ShiftCardModalProps {
  shift: ShiftNode
}

export const ShiftCardModal: React.FC<ShiftCardModalProps> = ({ shift }) => {
  const { classes } = useStyles()
  const { register } = useForm()
  return (
    <div className={classes.container}>
      <form>
        <TextInput {...register('title')} />
      </form>
    </div>
  )
}

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: '100%',
  },
}))

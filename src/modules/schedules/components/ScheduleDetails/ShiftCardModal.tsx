import { useState } from 'react'
import {
  Modal,
  Button,
  Group,
  Container,
  Stack,
  Avatar,
  SimpleGrid,
} from '@mantine/core'
import { ShiftCardSlot } from './ShiftCardSlot'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { AddShiftSlotPopover } from './AddShiftSlotPopover'

interface ShiftCardModalProps {
  shift: ShiftNode
}

export const ShiftCardModal: React.FC<ShiftCardModalProps> = ({ shift }) => {
  return (
    <Container p={'md'}>
      <Stack align={'center'} spacing={'xs'}>
        <SimpleGrid cols={2}>
          {shift.slots.map(slot => (
            <>
              <Avatar
                color={'samfundet-red'}
                size={'sm'}
                radius={'xl'}
                placeholder="https://m.media-amazon.com/images/M/MV5BMjA5NTE4NTE5NV5BMl5BanBnXkFtZTcwMTcyOTY5Mw@@._V1_.jpg"
              />
              <ShiftCardSlot key={slot.id} shiftSlot={slot} />
            </>
          ))}
        </SimpleGrid>
      </Stack>
      <Group position="right">
        <AddShiftSlotPopover shift={shift} />
      </Group>
    </Container>
  )
}

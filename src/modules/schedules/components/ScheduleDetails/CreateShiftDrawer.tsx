import {
  Button,
  Drawer,
  DrawerProps,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { useListState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconPlus, IconX } from '@tabler/icons-react'
import { LocationValues, RoleValues } from 'modules/schedules/consts'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { useState } from 'react'
import { LocationSelect } from '../LocationSelect'
import { ShiftRoleSelect } from '../ScheduleRoleSelect'

type RoleObject = {
  role: RoleValues
  count: number
}

interface CreateShiftDrawerProps extends DrawerProps {
  scheduleId: string
}
export const CreateShiftDrawer: React.FC<CreateShiftDrawerProps> = ({
  scheduleId,
  onClose,
  ...rest
}) => {
  const [date, setDate] = useState(new Date())
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [location, setLocation] = useState<LocationValues | null>(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [roles, handler] = useListState<RoleObject>([
    {
      role: RoleValues.ARRANGEMENTANSVARLIG,
      count: 1,
    },
  ])

  const { createShift, createShiftLoading, addSlotsToShift } =
    useShiftMutations()

  function resetForm() {
    setName('')
    setLocation(null)
    setStartTime('')
    setEndTime('')

    handler.setState([])
  }

  function handleCreateShift() {
    if (!name) {
      setNameError('Vennligst fyll inn navn')
      return
    }

    const datetimeStart = new Date(date)
    const datetimeEnd = new Date(date)

    const [startHours, startMinutes] = startTime.split(':')
    const [endHours, endMinutes] = endTime.split(':')

    datetimeStart.setHours(Number(startHours))
    datetimeStart.setMinutes(Number(startMinutes))
    datetimeStart.setSeconds(0)
    datetimeEnd.setHours(Number(endHours))
    datetimeEnd.setMinutes(Number(endMinutes))
    datetimeEnd.setSeconds(0)

    if (datetimeEnd < datetimeStart) {
      // datetime end is next day
      datetimeEnd.setDate(datetimeEnd.getDate() + 1)
    }

    // Daisychains together shift and slot mutation because I'm too lazy to do it in a single mutation
    // Alexander Orvik 2022-12-15 17:38
    // Back here to migrate to Mantine v6. Still too lazy to fix this mess
    // Alexander Orvik 2023-27-07 16:42
    createShift({
      variables: {
        input: {
          name,
          location,
          datetimeStart,
          datetimeEnd,
          schedule: scheduleId,
        },
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onCompleted({ createShift }) {
        const { shift } = createShift

        addSlotsToShift({
          variables: {
            shiftId: shift.id,
            slots: roles.map(role => ({
              shiftSlotRole: role.role,
              count: role.count,
            })),
          },
          refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
          onCompleted() {
            showNotification({
              message: 'Vakt opprettet',
              color: 'teal',
              icon: <IconPlus />,
            })
            resetForm()
            onClose()
          },
          onError({ message }) {
            showNotification({
              message,
              color: 'red',
              icon: <IconX />,
            })
          },
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message: message,
          color: 'red',
        })
      },
    })
  }

  function handleUpdateRoleList(
    index: number,
    count: number | undefined,
    role: RoleValues
  ) {
    if (count === undefined || count < 1) {
      handler.setItem(index, { role, count: 1 })
      return
    }

    handler.setItem(index, {
      role: role,
      count: count,
    })
  }

  function handleAddRole() {
    handler.append({
      role: RoleValues.ARRANGEMENTANSVARLIG,
      count: 1,
    })
  }

  function handleRemoveRole(index: number) {
    handler.remove(index)
  }

  return (
    <Drawer onClose={onClose} {...rest}>
      <Grid columns={2}>
        <Grid.Col span={2}>
          <TextInput
            label="Navn på skift"
            value={name}
            error={nameError}
            onChange={evt => setName(evt.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <DatePickerInput
            label="Dato"
            value={date}
            onChange={date => date && setDate(date)}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <LocationSelect
            label="Lokale"
            placeholder="Velg lokale"
            value={location}
            clearable
            onChange={setLocation}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <TimeInput
            label="Tid start"
            value={startTime}
            onChange={evt => setStartTime(evt.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <TimeInput
            label="Tid slutt"
            value={endTime}
            onChange={evt => setEndTime(evt.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <label>Roller</label>
        </Grid.Col>
        {roles.map((role, index) => (
          <>
            <Grid.Col span={1}>
              <ShiftRoleSelect
                value={role.role}
                onChangeCallback={val =>
                  handleUpdateRoleList(index, role.count, val)
                }
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <Group>
                <NumberInput
                  value={role.count}
                  onChange={val =>
                    val && handleUpdateRoleList(index, val, role.role)
                  }
                />
                <UnstyledButton onClick={() => handleRemoveRole(index)}>
                  <IconX />
                </UnstyledButton>
              </Group>
            </Grid.Col>
          </>
        ))}
        <Grid.Col span={2}>
          <Button
            leftIcon={<IconPlus />}
            variant="outline"
            onClick={handleAddRole}
          >
            Legg til rolle
          </Button>
        </Grid.Col>
        <Grid.Col span={2}>
          <Button fullWidth onClick={handleCreateShift}>
            Opprett vakt
          </Button>
        </Grid.Col>
      </Grid>
      <LoadingOverlay visible={createShiftLoading} />
    </Drawer>
  )
}

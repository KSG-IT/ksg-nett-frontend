import {
  Button,
  createStyles,
  FileInput,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconCashBanknote, IconNote, IconUpload } from '@tabler/icons'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'util/hooks'

import { useCreateDepositAPI } from './useCreateDepositAPI'
import { useCreateDepositLogic } from './useCreateDepositLogic'

const useStyles = createStyles(theme => ({}))

interface CreateDepositViewProps {
  onCompletedCallback: () => void
}

export const CreateDepositForm: React.FC<CreateDepositViewProps> = ({
  onCompletedCallback,
}) => {
  const { form, onSubmit } = useCreateDepositLogic({
    ...useCreateDepositAPI(),
    onCompletedCallback,
  })
  const { classes } = useStyles()
  const mobileSize = useMediaQuery('(max-width: 600px)')
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={'lg'} p={mobileSize ? 'xs' : 'xl'}>
        <SimpleGrid cols={1} spacing={'md'}>
          <NumberInput
            hideControls
            size={mobileSize ? 'xs' : 'sm'}
            variant="filled"
            error={errors?.amount?.message}
            label="Beløp"
            placeholder="Hvor mye socistøv du vil konvertere"
            icon={<IconCashBanknote size={14} />}
            onChange={value => value && setValue('amount', value)}
          />
          <TextInput
            size={mobileSize ? 'xs' : 'sm'}
            variant="filled"
            label="Beskrivelse"
            placeholder="Skriv en beskrivelse av innskuddet"
            icon={<IconNote size={14} />}
            {...register('description')}
          />
          <FileInput
            mt={'sm'}
            size={mobileSize ? 'sm' : 'md'}
            placeholder="Skjermbilde av bankoverføring"
            icon={<IconUpload size={14} />}
            accept="image/png,image/jpeg,image/jpg"
            onChange={value => value && setValue('receipt', value)}
          />
        </SimpleGrid>
        <Group position="apart" mt={'md'}>
          <Button
            variant="outline"
            color={'samfundet-red'}
            component={Link}
            to="/dashboard"
          >
            Avbryt
          </Button>
          <Button
            color={'samfundet-red'}
            size={mobileSize ? 'sm' : 'md'}
            disabled={isSubmitting}
            type="submit"
          >
            Lag innskudd
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

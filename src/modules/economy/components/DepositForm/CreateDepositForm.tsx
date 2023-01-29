import {
  Button,
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

interface CreateDepositViewProps {
  onCompletedCallback: () => void
}

export const CreateDepositForm: React.FC<CreateDepositViewProps> = ({
  onCompletedCallback,
}) => {
  const { form, onSubmit } = useCreateDepositLogic({
    ...useCreateDepositAPI(onCompletedCallback),
  })
  const mobileSize = useMediaQuery('(max-width: 600px)')
  const { formState, register, handleSubmit, setValue } = form
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
            required
            min={1}
            max={30_000}
            placeholder="Hvor mye socistøv du vil konvertere"
            icon={<IconCashBanknote size={14} />}
            onChange={value => value && setValue('amount', value)}
          />
          <TextInput
            size={mobileSize ? 'xs' : 'sm'}
            variant="filled"
            label="Kommentar"
            required
            placeholder="Skriv en hyggelig kommentar"
            icon={<IconNote size={14} />}
            {...register('description')}
          />
          <FileInput
            mt={'sm'}
            size={mobileSize ? 'sm' : 'md'}
            placeholder="Skjermbilde av bankoverføring"
            required
            label="Kvittering"
            icon={<IconUpload size={14} />}
            accept="image/png,image/jpeg,image/jpg"
            onChange={value => value && setValue('receipt', value)}
          />
        </SimpleGrid>
        <Group position="apart" mt={'md'}>
          <Button variant="outline" component={Link} to="/dashboard">
            Avbryt
          </Button>
          <Button
            size={mobileSize ? 'sm' : 'md'}
            disabled={isSubmitting}
            type="submit"
          >
            Send til godkjenning
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

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

import { useCreateDepositAPI } from './CreateDepositAPI'
import { useCreateDepositLogic } from './CreateDepositLogic'

const useStyles = createStyles(theme => ({
  button: {
    backgroundColor: theme.colors.brand,
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
}))

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
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={'lg'} p={'xl'}>
        <SimpleGrid cols={1} spacing={'md'}>
          <NumberInput
            hideControls
            size="md"
            variant="filled"
            error={errors?.amount?.message}
            label="Beløp"
            placeholder="Hvor mye socistøv du vil konvertere"
            icon={<IconCashBanknote size={14} />}
            onChange={value => value && setValue('amount', value)}
          />
          <TextInput
            size="md"
            variant="filled"
            label="Beskrivelse"
            placeholder="Skriv en beskrivelse av innskuddet"
            icon={<IconNote size={14} />}
            {...register('description')}
          />
          <FileInput
            size="md"
            withAsterisk
            placeholder="Skjermbilde av bankoverføring"
            icon={<IconUpload size={14} />}
            accept="image/png,image/jpeg,image/jpg"
            onChange={value => value && setValue('receipt', value)}
          />
        </SimpleGrid>
        <Group position="right" mt={'md'}>
          <Button
            color={'brand'}
            className={classes.button}
            size="md"
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

import { InternalGroupUserHighlightNode } from 'modules/organization/types'
import { useEditHighlightAPI } from './useEditHighlightAPI'
import { useEditHighlightLogic } from './useEditHighlightLogic'
import { useState } from 'react'
import {
  Button,
  Container,
  FileInput,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core'
import { InternalGroupSelect, UserSelect } from 'components/Select'
import { IconPhoto } from '@tabler/icons-react'

interface InternalGroupUserHighlightEditProps {
  highlight?: InternalGroupUserHighlightNode
  onCompletedCallback?: () => void
}

export const InternalGroupUserHighlightEditForm: React.FC<
  InternalGroupUserHighlightEditProps
> = ({ highlight, onCompletedCallback }) => {
  const { form, onSubmit } = useEditHighlightLogic(
    useEditHighlightAPI({ highlight, onCompletedCallback })
  )
  const { formState, register, handleSubmit, getValues, setValue } = form
  const { errors, isSubmitting } = formState
  const [user, setUser] = useState<string>(getValues('user'))
  const [internalGroup, setInternalGroup] = useState<string>(
    getValues('internalGroup')
  )
  const [image, setImage] = useState<File | null>(highlight?.image ?? null)
  const [isDirty, setIsDirty] = useState(false)

  function handleUserCallback(value: string) {
    setUser(value)
    setValue('user', value)
  }

  function handleInternalGroupCallback(value: string) {
    setInternalGroup(value)
    setValue('internalGroup', value)
  }

  function handleImageCallback(value: File) {
    setImage(value)
    setValue('image', value)
    setIsDirty(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
      >
        <Stack>
          <UserSelect
            label={'Bruker'}
            userId={user}
            onChange={handleUserCallback}
          />
          <InternalGroupSelect
            label={'Interngjeng'}
            internalGroupId={internalGroup}
            setInternalGroupCallback={handleInternalGroupCallback}
          />
          <TextInput
            label={'Okkupasjon'}
            placeholder={'Okkupasjon'}
            {...register('occupation', { required: true })}
            error={errors.occupation?.message}
          />
          <Switch my={'sm'} {...register('archived')} label={'Arkivert'} />
        </Stack>
        <Stack>
          <FileInput
            onChange={handleImageCallback}
            error={errors.image?.message}
            icon={<IconPhoto />}
            label={'Bilde'}
            placeholder={'Velg bilde av personen'}
            accept={'image/png,image/jpeg,image/jpg'}
          />
          <Container>
            <Image
              src={
                !isDirty
                  ? highlight?.image?.toString()
                  : URL.createObjectURL(image!)
              }
              radius={'md'}
              width={'100%'}
              height={250}
            />
          </Container>
        </Stack>
      </SimpleGrid>
      <Textarea
        autosize
        minRows={3}
        label={'Beskrivelse'}
        placeholder={'Skriv noe fint om din funk'}
        {...register('description', { required: true })}
        error={errors.description?.message}
      />
      <Group my={'sm'} grow>
        <Button disabled={isSubmitting} type={'submit'}>
          Lagre
        </Button>
      </Group>
    </form>
  )
}

import { Button, Group, NumberInput, Paper } from '@mantine/core'
import { UserSelect } from 'components/Select'
import { useProductOrderMutations } from 'modules/economy/mutations.hooks'
import { SOCI_SESSION_QUERY } from 'modules/economy/queries'
import { ME_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ProductSelect } from '../ProductSelect'

interface PlaceProductOrderProps {
  sociSessionId: string
}

export const PlaceProductOrder: React.FC<PlaceProductOrderProps> = ({
  sociSessionId,
}) => {
  const [userId, setUserId] = useState('')
  const [productId, setProductId] = useState('')
  const [orderSize, setOrderSize] = useState(1)

  const { placeProductOrder } = useProductOrderMutations()

  const handlePlaceProductOrder = () => {
    if (userId === '' || productId === '') return

    placeProductOrder({
      variables: {
        userId,
        productId,
        orderSize,
        sociSessionId,
      },
      refetchQueries: [SOCI_SESSION_QUERY, ME_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Bestilling lagt inn')
        setOrderSize(1)
      },
    })
  }
  return (
    <Paper p="md">
      <Group position="apart">
        <UserSelect setUserCallback={setUserId} />
        <ProductSelect value={productId} onChangeCallback={setProductId} />
        <NumberInput
          placeholder="Antall"
          value={orderSize}
          onChange={val => val && setOrderSize(val)}
        />
        <Button onClick={handlePlaceProductOrder}>Legg til</Button>
      </Group>
    </Paper>
  )
}

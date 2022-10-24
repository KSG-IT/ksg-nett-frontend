import { Button } from '@mantine/core'
import { IconRefresh } from '@tabler/icons'

interface SyncButtonProps {
  refetchLoading: boolean
  refetchCallback: () => void
}

export const SynCButton: React.FC<SyncButtonProps> = ({
  refetchLoading,
  refetchCallback,
}) => {
  return (
    <Button
      color="samfundet-red"
      leftIcon={<IconRefresh />}
      onClick={refetchCallback}
      loading={refetchLoading}
    >
      Oppdater
    </Button>
  )
}

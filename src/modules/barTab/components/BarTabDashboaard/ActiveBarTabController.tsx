import { Button, Group, Stack } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { MessageBox } from 'components/MessageBox'
import { BarTabStatusValues } from 'modules/barTab/enums'
import { useBarTabMutations } from 'modules/barTab/mutations.hooks'
import { ACTIVE_BAR_TAB_QUERY } from 'modules/barTab/queries'
import { BarTabNode } from 'modules/barTab/types.graphql'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { BarTabSummary } from '../BarTabSummary'
import { CreateAndSendInvoices } from '../CreateAndSendInvoices'
import { RegisterProductOrders } from './RegisterProductOrders'

interface ActiveBarTablControllerProps {
  barTab: BarTabNode | null
}

export const ActiveBarTablController: React.FC<
  ActiveBarTablControllerProps
> = ({ barTab }) => {
  const { createBarTab } = useBarTabMutations()

  function handleOpenBarTab() {
    createBarTab({
      variables: { input: {} },
      refetchQueries: [ACTIVE_BAR_TAB_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('BSF startet')
      },
    })
  }

  if (!barTab)
    return (
      <Stack>
        <MessageBox type="info">
          Velkommen til BSF modulen! Her har du mulighet til å starte en BSF, se
          over gammel data og også sende ut fakturaer.
        </MessageBox>
        <Group>
          <Button onClick={handleOpenBarTab}>Start ny BSF</Button>
          <Link to="customers">
            <Button>De andre gjengene</Button>
          </Link>

          <Link to="previous">
            <Button>Tidligere BSF'er</Button>
          </Link>
        </Group>
      </Stack>
    )

  if (barTab.status === BarTabStatusValues.OPEN)
    return <RegisterProductOrders barTab={barTab} />

  if (barTab.status === BarTabStatusValues.LOCKED)
    return <BarTabSummary barTab={barTab} />

  if (barTab.status === BarTabStatusValues.UNDER_REVIEW)
    return <CreateAndSendInvoices />

  // Need to structure this better
  return <FullPageError />
}

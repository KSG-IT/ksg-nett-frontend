import { useQuery } from '@apollo/client'
import { Button, Group, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { IconFileDownload } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserSelect } from 'components/Select'
import { ALL_USERS_WORKING_TODAY_AND_SOCI_PRODUCTS } from 'modules/schedules/queries'
import { AllUsersWorkingTodayReturns } from 'modules/schedules/types.graphql'
import { useState } from 'react'
import { useStore } from 'store'
import { format } from 'util/date-fns'
import { API_URL } from 'util/env'
import { UserOption } from 'util/user'

export const PrintWorkingToday: React.FC = ({}) => {
  const [userIds, setUserIds] = useState<string[]>([])
  const [userNames, setUserNames] = useState<string[]>([])
  const [productIds, setProductIds] = useState<string[]>([])
  const [productNames, setProductNames] = useState<string[]>([])
  const me = useStore(state => state.user)
  const { data, loading, error } = useQuery<AllUsersWorkingTodayReturns>(
    ALL_USERS_WORKING_TODAY_AND_SOCI_PRODUCTS,
    {
      onCompleted({ allUsersWorkingToday, defaultSociProducts }) {
        setUserIds(allUsersWorkingToday.map(user => user.id))
        setUserNames(allUsersWorkingToday.map(user => user.fullName))
        setProductIds(defaultSociProducts.map(product => product.id))
        setProductNames(defaultSociProducts.map(product => product.name))
      },
    }
  )

  function handleFetchList() {
    const formData = new FormData()
    formData.append('user_ids', JSON.stringify(userIds))
    formData.append('product_ids', JSON.stringify([1, 2, 3, 4, 5, 6]))
    formData.append('printed_by', me.id)

    fetch(`${API_URL}/economy/print-list`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        console.log(url)
        console.log(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Krysseliste - ${format(new Date(), 'yyyy-MM-dd')}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }

  function handleAddUserId(userOption: UserOption) {
    setUserIds([...userIds, userOption.value])
    setUserNames([...userNames, userOption.label])
  }

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const rows = userNames.map((userName, index) => (
    <tr>
      <td>{userName}</td>
      {productNames.map((productName, index) => (
        <td></td>
      ))}
    </tr>
  ))

  return (
    <Stack>
      <Group position="apart">
        <Title>Krysseliste for jobbende</Title>
        <Button
          leftIcon={<IconFileDownload />}
          color="samfundet-red"
          onClick={handleFetchList}
        >
          Last ned krysseliste
        </Button>
      </Group>

      <Paper p="md">
        <Table withColumnBorders withBorder>
          <thead>
            <tr>
              <th>Navn</th>
              {productNames.map((productName, index) => (
                <th key={index}>{productName}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
      <Group>
        <Text>Mangler det noen?</Text>
        <UserSelect setUserCallback={handleAddUserId} />
      </Group>
    </Stack>
  )
}

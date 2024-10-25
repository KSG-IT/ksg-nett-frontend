import { useQuery } from '@apollo/client'
import { Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'

import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  AllergyTransferList,
  EditAboutMe,
  MyEmailSettings,
} from '../components'
import { MY_SETTINGS_QUERY } from '../queries'
import { MySettingsQueryReturns } from '../types'
import { MyAddressSettings } from '../components/MyAddressSettings'

const MySettings: React.FC = () => {
  const { data, loading, error } =
    useQuery<MySettingsQueryReturns>(MY_SETTINGS_QUERY)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { me, allAllergies } = data

  return (
    <Stack>
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Mine innstillinger', path: '/my-settings' },
        ]}
      />
      <Title>Min profil</Title>
      <MyAddressSettings user={me} />
      <MyEmailSettings user={me} />
      <AllergyTransferList
        userAllergies={me.allergies}
        allAllergies={allAllergies}
      />
      {me.canRewriteAboutMe && <EditAboutMe aboutMe={me.aboutMe} />}
    </Stack>
  )
}

export default MySettings

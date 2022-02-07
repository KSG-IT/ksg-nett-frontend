import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { ActiveAdmissionTable } from './ActiveAdmissionTable'
import { CREATE_APPLICATIONS } from './mutation'
import { ACTIVE_ADMISSION_QUERY } from './queries'
import { StartAdmissionProcessCard } from './StartAdmissionProcessCard'
import {
  ActiveAdmissioneturns,
  CreateApplicationsReturns,
  CreateApplicationsVariables,
} from './types'

const Wrapper = styled.div``

const AddApplicantArea = styled.textarea``

export const AdmissionDashboard: React.VFC = () => {
  // Should display information about ongoing admission
  // admins should be able to open up a new admission if it does not exist
  const [emails, setEmails] = useState('')

  const { data, loading, error } = useQuery<ActiveAdmissioneturns>(
    ACTIVE_ADMISSION_QUERY,
    {
      pollInterval: 1000 * 60,
    }
  )

  const [createApplications] = useMutation<
    CreateApplicationsReturns,
    CreateApplicationsVariables
  >(CREATE_APPLICATIONS, { refetchQueries: ['ActiveAdmission'] })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleCreateApplications = () => {
    console.log(emails)
    const parsedEmails = emails.split('\n')
    console.log(parsedEmails)
    toast.promise(
      createApplications({ variables: { emails: parsedEmails } }).then(res => {
        console.log(res)
      }),
      {
        loading: 'Oppretter søknader',
        error: 'Noe gikk galt',
        success: 'søknader opprettet',
      }
    )
    setEmails('')
  }

  const { activeAdmission } = data

  if (activeAdmission === null) return <StartAdmissionProcessCard />

  return (
    <Wrapper>
      <label>Legg til epostadrersse</label>
      <AddApplicantArea
        value={emails}
        onChange={evt => setEmails(evt.target.value)}
      />
      <button onClick={handleCreateApplications}>Legg til nye søkere</button>
      <ActiveAdmissionTable admission={activeAdmission} />
    </Wrapper>
  )
}

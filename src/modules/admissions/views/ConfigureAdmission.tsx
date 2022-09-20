import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  ConfigureInterviewLocationAvailability,
  ConfigureInterviewSchedule,
  ConfigureInterviewTemplate,
  ConfigurePosistionAvailability,
  InterviewOverview,
  StartAdmissionProcessCard,
} from '../components/ConfigureAdmission'
import { ACTIVE_ADMISSION_QUERY } from '../queries'
import { ActiveAdmissioneturns } from '../types.graphql'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

const configWizardSwitchHandler = (
  configurationStage: WizardStage,
  setStageCallback: (stage: WizardStage) => void
) => {
  switch (configurationStage) {
    case 'START':
      return <StartAdmissionProcessCard setStageCallback={setStageCallback} />
    case 'SCHEDULE':
      return <ConfigureInterviewSchedule setStageCallback={setStageCallback} />
    case 'INTERVIEW_LOCATION_AVAILABILITY':
      return (
        <ConfigureInterviewLocationAvailability
          setStageCallback={setStageCallback}
        />
      )
    case 'INTERVIEW_TEMPLATE':
      return <ConfigureInterviewTemplate setStageCallback={setStageCallback} />
    case 'AVAILABLE_POSITIONS':
      return (
        <ConfigurePosistionAvailability setStageCallback={setStageCallback} />
      )
    case 'SUMMARY':
      return <InterviewOverview setStageCallback={setStageCallback} />
  }
}

export const ConfigurationWizard: React.VFC = () => {
  const [wizardStage, setWizardStage] = useState<WizardStage>('START')
  // This logic needs to be reoworked abd nived away from the useEffect hook

  // query admission
  const { loading, error, data } = useQuery<ActiveAdmissioneturns>(
    ACTIVE_ADMISSION_QUERY
  )

  useEffect(() => {
    if (!data) return

    const { activeAdmission } = data

    const initialStage = activeAdmission === null ? 'START' : 'SCHEDULE'
    setWizardStage(initialStage)
  }, [data])

  if (error) {
    return <FullPageError />
  }

  if (loading || !data) {
    return <FullContentLoader />
  }

  if (data?.activeAdmission?.status === 'OPEN')
    return <Navigate to="/admission" />

  return configWizardSwitchHandler(wizardStage, setWizardStage)
}

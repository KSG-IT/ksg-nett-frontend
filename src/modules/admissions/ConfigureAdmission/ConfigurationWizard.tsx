import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useEffect, useState } from 'react'
import { ACTIVE_ADMISSION_QUERY } from '../queries'
import { ActiveAdmissioneturns } from '../types'
import { ConfigureInterviewLocationAvailability } from './ConfigureInterviewLocationAvailability'
import { ConfigureInterviewSchedule } from './ConfigureInterviewSchedule'
import { ConfigureInterviewTemplate } from './ConfigureInterviewTemplate'
import { ConfigurePosistionAvailability } from './ConfigurePositionAvailability'
import { InterviewOverview } from './InterviewOverview'
import { StartAdmissionProcessCard } from './StartAdmissionProcessCard'
import { WizardStage } from './types'

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
    case null: // This could maybe function as an error catchall?
      return <FullContentLoader />
  }
}

export const ConfigurationWizard: React.VFC = () => {
  const [wizardStage, setWizardStage] = useState<WizardStage>(null)

  const { data, loading, error } = useQuery<ActiveAdmissioneturns>(
    ACTIVE_ADMISSION_QUERY
  )

  useEffect(() => {
    if (!data) return
    const { activeAdmission } = data

    if (activeAdmission === null) {
      setWizardStage('START')
      return
    }

    const { status } = activeAdmission
    if (status === 'CONFIGURATION') {
      setWizardStage('SCHEDULE')
    }
  }, [data, setWizardStage])

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  return configWizardSwitchHandler(wizardStage, setWizardStage)
}

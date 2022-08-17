import { useState } from 'react'
import {
  ConfigureInterviewLocationAvailability,
  ConfigureInterviewSchedule,
  ConfigureInterviewTemplate,
  ConfigurePosistionAvailability,
  InterviewOverview,
  StartAdmissionProcessCard,
} from '../components/ConfigureAdmission'

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

  return configWizardSwitchHandler(wizardStage, setWizardStage)
}

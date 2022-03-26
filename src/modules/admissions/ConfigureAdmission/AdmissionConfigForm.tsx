import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'components/Button'
import { PatchInterviewScheduleTemplateReturns } from 'modules/admissions/ConfigureAdmission/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import * as yup from 'yup'
import {
  InterviewScheduleTemplateNode,
  PatchInterviewScheduleTemplateInput,
} from '../types'
import { PATCH_INTERVIEW_SCHEDULE_TEMPLATE } from './mutations'
import { WizardStage } from './types'
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 50px);
  gap: 5px;
  margin-bottom: 10px;

  ${props => props.theme.media.mobile} {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
  }
`

const FormInput = styled.input`
  height: 35px;
  border-radius: 8px;
`

const FormInputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
`

const FormInputArea = styled.div`
  display: flex;
  width: 100%;
  hiehgt: 100%;
  flex-direction: column;
  justify-content: center;
`
interface AdmissionConfigFormsProps {
  interviewSchedule: InterviewScheduleTemplateNode
  setStageCallback: (stage: WizardStage) => void
}

export const AdmissionConfigForm: React.VFC<AdmissionConfigFormsProps> = ({
  interviewSchedule,
  setStageCallback,
}) => {
  const [saveInterviewSchedule] = useMutation<
    PatchInterviewScheduleTemplateReturns,
    PatchMutationVariables<InterviewScheduleTemplateNode>
  >(PATCH_INTERVIEW_SCHEDULE_TEMPLATE, {
    refetchQueries: ['InterviewScheduleTemplateQuery'],
    onCompleted() {
      setStageCallback('INTERVIEW_LOCATION_AVAILABILITY')
    },
  })

  let schema = yup.object().shape({
    defaultInterviewDuration: yup.string(),
    defaultBlockSize: yup.number(),
    defaultPauseDuration: yup.string(),
    interviewPeriodStart: yup.date(),
    interviewPeriodEnd: yup.date(),
    defaultInterviewPeriodDayStart: yup.string(),
    defaultInterviewPeriodDayEnd: yup.string(),
  })

  const { register, handleSubmit } =
    useForm<PatchInterviewScheduleTemplateInput>({
      resolver: yupResolver(schema),
      defaultValues: {
        defaultBlockSize: interviewSchedule.defaultBlockSize,
        // Graphene django cud parses timedelta as HH:mm if seconds is zero. Menaing that
        // if we just pass this back it doesn't know how to parse it since it expects
        // it on the HH:mm:ss format. Fix this by appending ":00"
        defaultInterviewDuration: `${interviewSchedule.defaultInterviewDuration}:00`,
        defaultPauseDuration: `${interviewSchedule.defaultPauseDuration}:00`,
        interviewPeriodStartDate: interviewSchedule.interviewPeriodStartDate,
        interviewPeriodEndDate: interviewSchedule.interviewPeriodEndDate,
        defaultInterviewDayStart: interviewSchedule.defaultInterviewDayStart,
        defaultInterviewDayEnd: interviewSchedule.defaultInterviewDayEnd,
      },
    })

  const onSubmit: SubmitHandler<PatchInterviewScheduleTemplateInput> = data => {
    saveInterviewSchedule({
      variables: { id: interviewSchedule.id, input: { ...data } },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Wrapper>
        <FormInputArea>
          <FormInputLabel>Standard intervjulengde</FormInputLabel>
          <FormInput {...register('defaultInterviewDuration')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Standard pauselengde</FormInputLabel>
          <FormInput {...register('defaultPauseDuration')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Antall intervjuer på rad</FormInputLabel>
          <FormInput {...register('defaultBlockSize')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Intervjutidspunkt start</FormInputLabel>
          <FormInput {...register('defaultInterviewDayStart')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Intervjutidspunkt slutt</FormInputLabel>
          <FormInput {...register('defaultInterviewDayEnd')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Intervjuperiode start</FormInputLabel>
          <FormInput {...register('interviewPeriodStartDate')} />
        </FormInputArea>
        <FormInputArea>
          <FormInputLabel>Intervjuperiode slutt</FormInputLabel>
          <FormInput {...register('interviewPeriodEndDate')} />
        </FormInputArea>
      </Wrapper>
      <Button type="submit">Neste steg</Button>
    </form>
  )
}

import { Input, Radio, RadioGroup, Stack } from '@mantine/core'
import { useState } from 'react'
import { booleanToRadio, radioToBoolean } from 'util/parsing'
import { usePatchApplicant } from '../mutations.hooks'
import { ApplicantNode } from '../types'

interface AdditionalInformationFieldsProps {
  applicant: Pick<
    ApplicantNode,
    'id' | 'canCommitThreeSemesters' | 'openForOtherPositions'
  >
}

export const AdditionalInformationFields: React.VFC<
  AdditionalInformationFieldsProps
> = ({ applicant }) => {
  const [openForOtherPositions, setOpenForOtherPositions] = useState(
    booleanToRadio(applicant.openForOtherPositions)
  )
  const [canCommitThreeSemesters, setCanCommitThreeSemesters] = useState(
    booleanToRadio(applicant.canCommitThreeSemesters)
  )

  const { patchApplicant } = usePatchApplicant()

  const handleChangeCanCommit = (val: 'yes' | 'no') => {
    setCanCommitThreeSemesters(val)
    const parsedCanCommitThreeSemesters = radioToBoolean(val)
    patchApplicant({
      variables: {
        id: applicant.id,
        input: {
          canCommitThreeSemesters: parsedCanCommitThreeSemesters,
        },
      },
    })
  }

  const handleChangeOpenForOtherPositions = (val: 'yes' | 'no') => {
    setOpenForOtherPositions(val)
    const parsedOpenForOtherPositions = radioToBoolean(val)
    patchApplicant({
      variables: {
        id: applicant.id,
        input: {
          openForOtherPositions: parsedOpenForOtherPositions,
        },
      },
    })
  }

  return (
    <Stack>
      <RadioGroup
        label="Kandidat åpen for andre verv?"
        onChange={handleChangeOpenForOtherPositions}
        value={openForOtherPositions}
      >
        <Radio value="yes" label="Ja" />
        <Radio value="no" label="Nei" />
      </RadioGroup>
      <RadioGroup
        label="Kan bli i 3 semestre?"
        onChange={handleChangeCanCommit}
        value={canCommitThreeSemesters}
      >
        <Radio value="yes" label="Ja" />
        <Radio value="not" label="Nei" />
      </RadioGroup>
      {/* ToDo add mutation. Maybe with some debounce handler */}
      <label>Begrunnelse</label>
      <Input disabled={radioToBoolean(canCommitThreeSemesters) || false} />
    </Stack>
  )
}

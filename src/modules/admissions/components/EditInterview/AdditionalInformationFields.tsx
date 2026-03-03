import { Radio, Stack } from '@mantine/core'
import { usePatchApplicant } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { booleanToRadio, radioToBoolean } from 'util/parsing'

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

  const handleChangeCanCommit = (val: string) => {
    setCanCommitThreeSemesters(val as '' | 'yes' | 'no')
    const parsedCanCommitThreeSemesters = radioToBoolean(
      val as '' | 'yes' | 'no'
    )
    patchApplicant({
      variables: {
        id: applicant.id,
        input: {
          canCommitThreeSemesters: parsedCanCommitThreeSemesters,
        },
      },
    })
  }

  const handleChangeOpenForOtherPositions = (val: string) => {
    setOpenForOtherPositions(val as '' | 'yes' | 'no')
    const parsedOpenForOtherPositions = radioToBoolean(val as '' | 'yes' | 'no')
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
      <Radio.Group
        label="Kandidat åpen for andre verv?"
        onChange={val => handleChangeOpenForOtherPositions(val as 'yes' | 'no')}
        value={openForOtherPositions}
      >
        <Radio value="yes" label="Ja" />
        <Radio value="no" label="Nei" />
      </Radio.Group>
      <Radio.Group
        label="Kan bli i 3 semestre?"
        onChange={val => handleChangeCanCommit(val as 'yes' | 'no')}
        value={canCommitThreeSemesters}
      >
        <Radio value="yes" label="Ja" />
        <Radio value="no" label="Nei" />
      </Radio.Group>
      {/* ToDo add mutation. Maybe with some debounce handler */}
      {/* <label>Begrunnelse</label>
      <Input disabled={radioToBoolean(canCommitThreeSemesters) || false} /> */}
    </Stack>
  )
}

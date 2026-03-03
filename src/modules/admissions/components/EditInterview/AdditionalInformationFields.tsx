import { Radio, Stack } from '@mantine/core'
import { usePatchApplicant } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { booleanToRadio, radioToBoolean, yesNoHandler } from 'util/parsing'

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

  const handleChangeCanCommit = yesNoHandler(yesNo => {
    setCanCommitThreeSemesters(yesNo)
    patchApplicant({
      variables: {
        id: applicant.id,
        input: { canCommitThreeSemesters: radioToBoolean(yesNo) },
      },
    })
  })

  const handleChangeOpenForOtherPositions = yesNoHandler(yesNo => {
    setOpenForOtherPositions(yesNo)
    patchApplicant({
      variables: {
        id: applicant.id,
        input: { openForOtherPositions: radioToBoolean(yesNo) },
      },
    })
  })

  return (
    <Stack>
      <Radio.Group
        label="Kandidat åpen for andre verv?"
        onChange={handleChangeOpenForOtherPositions}
        value={openForOtherPositions}
      >
        <Radio value="yes" label="Ja" />
        <Radio value="no" label="Nei" />
      </Radio.Group>
      <Radio.Group
        label="Kan bli i 3 semestre?"
        onChange={handleChangeCanCommit}
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

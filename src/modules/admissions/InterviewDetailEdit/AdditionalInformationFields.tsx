import { Group, Radio, RadioGroup, Stack, Text, Title } from '@mantine/core'
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
  /* Need to add mutations to these sections as well
    The ones here are mostily dealt with data saved directly on the applicant model
  */
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
      <Title>Annen info</Title>
      <Group>
        <Text size="lg">Åpen for andre verv</Text>
        <RadioGroup
          onChange={handleChangeOpenForOtherPositions}
          value={openForOtherPositions}
        >
          <Radio value="yes" label="Ja" />
          <Radio value="no" label="Nei" />
        </RadioGroup>
      </Group>
      <Group>
        <Text size="lg">Kan bli 3 semestre</Text>
        <RadioGroup
          onChange={handleChangeCanCommit}
          value={canCommitThreeSemesters}
        >
          <Radio value="yes" label="Ja" />
          <Radio value="not" label="Nei" />
        </RadioGroup>
      </Group>
    </Stack>
  )
}

import { Checkbox } from '@mantine/core'
import { useToggleApplicantWillBeAdmitted } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { renderPrioritycell } from 'modules/admissions/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ToggleApplicantWillBeAdmittedReturns {
  toggleApplicantWillBeAdmitted: {
    success: boolean
  }
}

interface ToggleApplicantInlineProps {
  applicant: ApplicantNode
}

export const ToggleApplicantTableRow: React.VFC<ToggleApplicantInlineProps> = ({
  applicant,
}) => {
  const [willBeAdmitted, setWillBeAdmitted] = useState(applicant.willBeAdmitted)

  const { toggleApplicantWillBeAdmitted } = useToggleApplicantWillBeAdmitted()

  const handleToggleApplicant = () => {
    // We execute the mutation with error feedback if anything goes wrong.
    // A lot of fallback handling here so we make sure we either save
    // the value or give proper feedback and reset the state (checbox in this caase)
    const toggleFallback = willBeAdmitted
    setWillBeAdmitted(!willBeAdmitted)

    toggleApplicantWillBeAdmitted({
      variables: { id: applicant.id },
      refetchQueries: ['AdmissionApplicantPreviewQuery'],
      onCompleted({ toggleApplicantWillBeAdmitted }) {
        const { success } = toggleApplicantWillBeAdmitted

        if (success) {
          setWillBeAdmitted(!willBeAdmitted)
          return
        }
        toast.error('No gikk galt')
      },
    }).then(({ data }) => {
      // I have a feeling this is not the best way to do this.
      // Should probably just do a mutation and disable it during
      // loading and set the value on success.
      if (data === null || data === undefined) {
        setWillBeAdmitted(toggleFallback)
        return
      }
      const {
        toggleApplicantWillBeAdmitted: { success },
      } = data

      if (!success) {
        setWillBeAdmitted(toggleFallback)
        return
      }
    })
  }

  return (
    <tr key={applicant.id}>
      <td key={applicant.fullName}>{applicant.fullName}</td>
      {applicant.priorities.map(priority => renderPrioritycell(priority))}
      <td key="togglecheckbox">
        <Checkbox checked={willBeAdmitted} onChange={handleToggleApplicant} />
      </td>
    </tr>
  )
}

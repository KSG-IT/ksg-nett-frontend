import { Checkbox } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useToggleApplicantWillBeAdmitted } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { renderPrioritycell } from 'modules/admissions/utils'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePermissions } from 'util/hooks/usePermissions'
import { PERMISSIONS } from 'util/permissions'

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
  const { hasPermissions } = usePermissions()

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
        showNotification({
          title: 'Noe gikk galt',
          message: '',
        })
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
      <td key={applicant.fullName}>
        <Link to={`/admissions/applicants/${applicant.id}`}>
          {applicant.fullName}
        </Link>
      </td>
      {applicant.priorities.map(priority => renderPrioritycell(priority))}
      <td key="togglecheckbox">
        <Checkbox
          disabled={!hasPermissions(PERMISSIONS.admissions.change.admission)}
          checked={willBeAdmitted}
          onChange={handleToggleApplicant}
        />
      </td>
    </tr>
  )
}

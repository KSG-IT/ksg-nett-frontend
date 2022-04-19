import { useMutation } from '@apollo/client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION } from '../AdmissionDashboard/mutations'
import { ApplicantNode } from '../types'

interface ToggleApplicantWillBeAdmittedReturns {
  toggleApplicantWillBeAdmitted: {
    success: boolean
  }
}

interface ToggleApplicantInlineProps {
  applicant: ApplicantNode
}

export const ToggleApplicantInline: React.VFC<ToggleApplicantInlineProps> = ({
  applicant,
}) => {
  const [willBeAdmitted, setWillBeAdmitted] = useState(applicant.willBeAdmitted)

  const [toggleApplicant] = useMutation<ToggleApplicantWillBeAdmittedReturns>(
    TOGGLE_APPLICANT_WILL_BE_ADMITTED_MUTATION,
    {
      variables: { id: applicant.id },
      onCompleted({ toggleApplicantWillBeAdmitted }) {
        const { success } = toggleApplicantWillBeAdmitted

        if (success) {
          setWillBeAdmitted(!willBeAdmitted)
          return
        }
        toast.error('No gikk galt')
      },
    }
  )

  const handleToggleApplicant = () => {
    const toggleFallback = willBeAdmitted
    setWillBeAdmitted(!toggleApplicant)
    toggleApplicant().then(({ data }) => {
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
    <div key={applicant.id}>
      <input
        type="checkbox"
        checked={willBeAdmitted}
        onChange={handleToggleApplicant}
      />
    </div>
  )
}

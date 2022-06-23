import { useQuery } from '@apollo/client'
import { Stack, Table } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { gql } from 'graphql-tag'
import React from 'react'
import { parseApplicantPriority } from '../parsing'
import { ApplicantPriority } from '../types'

type ApplicantPreview = {
  fullName: string
  id: string
  offeredInternalGroupPositionName: string
  applicantPriority: ApplicantPriority | 'N/A'
}

interface AdmissionApplicantsPreviewResults {
  admissionApplicantsPreview: ApplicantPreview[]
}

const ADMISSION_APPLICANT_PREVIEW_QUERY = gql`
  query AdmissionApplicantPreviewQuery {
    admissionApplicantsPreview {
      fullName
      offeredInternalGroupPositionName
      applicantPriority
    }
  }
`

const useAdmissionApplicantPreview = () => {
  return useQuery<AdmissionApplicantsPreviewResults>(
    ADMISSION_APPLICANT_PREVIEW_QUERY
  )
}

export const ResultPreview: React.VFC<{}> = ({}) => {
  /**
   * This preview should query the final admission result. This should
   * be grouped together per internal group in the future but for now
   * we just show a tbale with the applicants
   */

  const { data, error, loading } = useAdmissionApplicantPreview()

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { admissionApplicantsPreview } = data

  const applicantPreviewRows = admissionApplicantsPreview.map(preview => (
    <tr key={preview.id}>
      <td key="fullname">{preview.fullName}</td>
      <td key="position-offered">{preview.offeredInternalGroupPositionName}</td>

      {/* This field bugs probably because we need to pass an Enum value from the backend instead of string */}
      <td key="applicant-priority">
        {parseApplicantPriority(preview.applicantPriority)}
      </td>
    </tr>
  ))

  const summaryRow = (
    <tr key="summary-row">
      <td key="total">
        <b>Totalt</b>
      </td>
      <td key="total-value">{admissionApplicantsPreview.length}</td>
    </tr>
  )

  return (
    <Stack>
      <MessageBox type="info">
        Her ser du hvordan det endelig opptaket kommer til å se ut når du
        avslutter det.
      </MessageBox>
      <Table>
        <thead>
          <tr>
            <td key="name">Navn</td>
            <td key="position-offered">Stilling tilbudt</td>
            <td key="applicant-priority">Søker prioritet</td>
          </tr>
        </thead>
        <tbody>
          {applicantPreviewRows}
          {summaryRow}
        </tbody>
      </Table>
    </Stack>
  )
}

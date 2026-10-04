import { useQuery } from '@apollo/client'
import { Stack, Table } from '@mantine/core'
import { CardTable } from 'components/CardTable'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { gql } from 'graphql-tag'
import { InternalGroupPositionPriorityApplicantPriorityValues } from 'modules/admissions/consts'
import { parseApplicantPriority } from 'modules/admissions/parsing'
import React from 'react'

type ApplicantPreview = {
  fullName: string
  id: string
  offeredInternalGroupPositionName: string
  applicantPriority:
    | InternalGroupPositionPriorityApplicantPriorityValues
    | 'N/A'
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

export const ResultPreview: React.FC = () => {
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
    <Table.Tr key={preview.id}>
      <Table.Td key="fullname">{preview.fullName}</Table.Td>
      <Table.Td key="position-offered">
        {preview.offeredInternalGroupPositionName}
      </Table.Td>

      {/* This field bugs probably because we need to pass an Enum value from the backend instead of string */}
      <Table.Td key="applicant-priority">
        {parseApplicantPriority(preview.applicantPriority)}
      </Table.Td>
    </Table.Tr>
  ))

  const summaryRow = (
    <Table.Tr key="summary-row">
      <Table.Td key="total">
        <b>Totalt</b>
      </Table.Td>
      <Table.Td key="total-value">{admissionApplicantsPreview.length}</Table.Td>
    </Table.Tr>
  )

  return (
    <Stack>
      <MessageBox type="info">
        Her ser du hvordan det endelig opptaket kommer til å se ut når du
        avslutter det.
      </MessageBox>
      <CardTable>
        <Table.Thead>
          <Table.Tr>
            <Table.Th key="name">Navn</Table.Th>
            <Table.Th key="position-offered">Stilling tilbudt</Table.Th>
            <Table.Th key="applicant-priority">Søker prioritet</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {applicantPreviewRows}
          {summaryRow}
        </Table.Tbody>
      </CardTable>
    </Stack>
  )
}

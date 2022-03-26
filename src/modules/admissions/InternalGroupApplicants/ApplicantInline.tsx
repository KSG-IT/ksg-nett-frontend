import styled from 'styled-components'
import { CoreApplicantNode } from './types'

const Wrapper = styled.div``

interface ApplicantInlineProps {
  applicant: CoreApplicantNode
}

export const ApplicantInline: React.VFC<ApplicantInlineProps> = () => {
  return <Wrapper></Wrapper>
}

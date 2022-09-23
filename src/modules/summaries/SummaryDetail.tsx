import { useQuery } from '@apollo/client'
import { IconEdit } from '@tabler/icons'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import { SummaryDetailQueryVariables, SummaryDetailsQueryReturns } from '.'
import { SUMMARY_QUERY } from './queries'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  padding: 16px;
  overflow-y: scroll;
`

const ParticipantsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  gap: 5px;
  ${props => props.theme.media.mobile} {
    margin: 15px 0;
  }
`

const TitleSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 45px;
  align-items: center;
  justify-content: space-between;
`

const SummaryTitle = styled.h1`
  margin: 0;
`

interface SummaryDetailParams {
  summaryId: string
}

export const SummaryDetail = () => {
  const params = useParams<keyof SummaryDetailParams>() as SummaryDetailParams
  const navigate = useNavigate()

  const { error, loading, data } = useQuery<
    SummaryDetailsQueryReturns,
    SummaryDetailQueryVariables
  >(SUMMARY_QUERY, {
    variables: { id: params.summaryId },
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { summary } = data

  if (summary === null) return <FullPage404 />

  return (
    <Wrapper>
      <TitleSection>
        <SummaryTitle>{summary.type}</SummaryTitle>
        <Link to={`/summaries/${summary.id}/edit`}>
          <IconEdit />
        </Link>
      </TitleSection>
      <ParticipantsRow>
        Tilestede:
        {summary.participants.map((user, i) => (
          <UserThumbnail user={user} size="sm" key={i} />
        ))}
      </ParticipantsRow>
      <ParticipantsRow>
        Referent
        <UserThumbnail user={summary.reporter} size="sm" />
      </ParticipantsRow>

      <ReactMarkdown plugins={[remarkGfm]}>{summary.contents}</ReactMarkdown>
    </Wrapper>
  )
}

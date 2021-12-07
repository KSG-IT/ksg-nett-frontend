import { useState } from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { UserNode, UserThumbnail } from 'modules/users'
import { SUMMARY_QUERY } from './queries'
import { useQuery, useMutation } from '@apollo/client'
import { useParams } from 'react-router'
import { SummaryQueryReturns, SummaryQueryVariables } from '.'
import format from 'date-fns/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PATCH_SUMMARY } from './mutations'
import remarkGfm from 'remark-gfm'

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

  > a {
    margin-left: 5px;
  }
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

interface ParamProps {
  summaryId: string
}

const TextArea = styled.textarea`
  width: 100%;
  height: 900px;
`

export const SummaryDetail = () => {
  const params = useParams<ParamProps>()
  const [editing, setEditing] = useState(false)
  const [contents, setContents] = useState<string>('')
  const [summaryTitle, setSummaryTitle] = useState('')
  const [participants, setParticipants] = useState<UserNode[]>([])
  const [reporter, setReporter] = useState<UserNode | null>(null)

  const [patchSummary] = useMutation(PATCH_SUMMARY, {
    variables: {
      id: params.summaryId,
      input: {
        contents: contents,
      },
    },
  })

  const { loading } = useQuery<SummaryQueryReturns, SummaryQueryVariables>(
    SUMMARY_QUERY,
    {
      variables: { id: params.summaryId },
      onCompleted(data) {
        const { summary } = data
        setContents(summary.contents)
        setSummaryTitle(
          `Referat: ${summary.summaryType} - ${format(
            new Date(summary.date),
            'dd.M.yyyy'
          )}`
        )
        setParticipants(summary.participants)
        setReporter(summary.reporter)
      },
    }
  )

  if (loading) return <span>Loading lol</span>

  return (
    <Wrapper>
      <TitleSection>
        <SummaryTitle>{summaryTitle}</SummaryTitle>
        {editing ? (
          <button
            onClick={() => {
              patchSummary()
              setEditing(!editing)
            }}
          >
            Lagre
          </button>
        ) : (
          <FontAwesomeIcon
            icon="edit"
            cursor="pointer"
            size="lg"
            onClick={() => {
              setEditing(!editing)
            }}
          />
        )}
      </TitleSection>
      <ParticipantsRow>
        Tilestede:
        {participants.map((user, i) => (
          <UserThumbnail user={user} size="small" key={i} />
        ))}
      </ParticipantsRow>
      <ParticipantsRow>
        Referent:
        {reporter !== null && <UserThumbnail user={reporter} size="small" />}
      </ParticipantsRow>
      {editing ? (
        <TextArea
          value={contents}
          onChange={evt => setContents(evt.target.value)}
        />
      ) : (
        <ReactMarkdown plugins={[remarkGfm]}>{contents}</ReactMarkdown>
      )}
    </Wrapper>
  )
}

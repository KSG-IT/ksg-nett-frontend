import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const ALL_SUMMARY_GROUPINGS = gql`
  query AllSummaryGroupings {
    allSummaryGroupings {
      id
      name
      displayName
    }
  }
`

type SummaryGroupingNode = {
  id: string
  name: string
  displayName: string
}

interface AllSummaryGroupingsReturns {
  allSummaryGroupings: SummaryGroupingNode[]
}

interface SummaryGroupingSelectProps {
  setGroupCallback: (group: string) => void
}

export const SummaryGroupingSelect: React.VFC<SummaryGroupingSelectProps> = ({
  setGroupCallback,
}) => {
  const [summaryGroupings, setSummaryGroupings] = useState<
    SummaryGroupingNode[]
  >([])
  const [group, setGroup] = useState('')

  useQuery<AllSummaryGroupingsReturns>(ALL_SUMMARY_GROUPINGS, {
    onCompleted(data) {
      const { allSummaryGroupings } = data
      setSummaryGroupings(allSummaryGroupings)
    },
  })

  useEffect(() => {
    setGroupCallback(group)
  }, [group, setGroupCallback])

  return (
    <select value={group} onChange={evt => setGroup(evt.target.value)}>
      {summaryGroupings.map(grouping => (
        <option value={grouping.id}>{grouping.name}</option>
      ))}
    </select>
  )
}

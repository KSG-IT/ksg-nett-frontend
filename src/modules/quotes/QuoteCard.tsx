import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from 'context/Authentication'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from 'modules/users'
import { useState } from 'react'
import styled from 'styled-components'
import {
  CreateQuoteVoteReturns,
  CreateQuoteVoteVariables,
  DeleteQuoteVoteReturns,
  DeleteQuoteVoteVariables,
} from '.'
import { CREATE_QUOTE_VOTE, DELETE_QUOTE_VOTE } from './mutations'
const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: 5px;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadow.default};
  display: flex;
  flex-direction: column;

  gap: 5px;
  min-width: 150px;
  max-width: 300px;
`

const QuoteText = styled.span`
  display: flex;
  font-weight: 600;
  font-size: 16px;
`

const QuoteContext = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.gray1};
  font-style: italic;
`

const QuoteFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TaggedContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`

const VoteContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`

interface VoteIconProps {
  active: boolean
}

const UpvoteIcon = styled(FontAwesomeIcon)<VoteIconProps>`
  color: ${props => (props.active ? props.theme.colors.success : 'black')};
  :hover {
    cursor: pointer;
  }
`

interface QuoteCardProps {
  quote: Pick<QuoteNode, 'text' | 'id' | 'tagged' | 'context' | 'sum'>
}
export const QuoteCard: React.VFC<QuoteCardProps> = ({ quote }) => {
  const [upvoted, setUpvoted] = useState(false)
  const [voteSum, setVoteSum] = useState(quote.sum)
  const [upvote] = useMutation<
    CreateQuoteVoteReturns,
    CreateQuoteVoteVariables
  >(CREATE_QUOTE_VOTE)
  const [deleteUpvote] = useMutation<
    DeleteQuoteVoteReturns,
    DeleteQuoteVoteVariables
  >(DELETE_QUOTE_VOTE)
  const me = useAuth()
  // Anchor vote value to user so we can use it here if we want?

  const handleUpvote = () => {
    if (!upvoted) {
      setUpvoted(true)
      setVoteSum(voteSum + 1)
      try {
        upvote({
          variables: { input: { quote: quote.id, value: 1, caster: me.id } },
        })
      } catch {
        alert('Could not upvode')
      }
    } else {
      setUpvoted(false)
      setVoteSum(voteSum - 1)
    }
  }

  return (
    <Wrapper>
      <QuoteText>&apos;&apos;{quote.text}&apos;&apos;</QuoteText>
      <QuoteContext>{quote.context}</QuoteContext>
      <QuoteFooter>
        <TaggedContainer>
          {quote.tagged.map(user => (
            <UserThumbnail user={user} size="small" />
          ))}
        </TaggedContainer>
        {/* <VoteContainer>
          <span>{voteSum}</span>
          <span>
            <UpvoteIcon
              icon="thumbs-up"
              active={upvoted}
              onClick={handleUpvote}
            />
          </span>
        </VoteContainer> */}
      </QuoteFooter>
    </Wrapper>
  )
}

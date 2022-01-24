import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from 'context/Authentication'
import { QuoteNode } from 'modules/quotes/types'
import { UserThumbnail } from 'modules/users'
import { useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import {
  CreateQuoteVoteReturns,
  CreateQuoteVoteVariables,
  DeleteUserQuoteVoteReturns,
  DeleteUserQuoteVoteVariables,
} from '.'
import { CREATE_QUOTE_VOTE, DELETE_USER_QUOTE_VOTE } from './mutations'
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
  height: fit-content;
`

const QuoteText = styled.span`
  display: flex;
  font-size: 14px;
  font-family: Comic Sans MS, Comic Sans, cursive;
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
  $upvoted: boolean
}

const UpvoteIcon = styled(FontAwesomeIcon)<VoteIconProps>`
  // Transient prop forwarding
  color: ${props => (props.$upvoted ? props.theme.colors.success : 'black')};
  :hover {
    cursor: pointer;
  }
`

interface QuoteCardProps {
  quote: Pick<QuoteNode, 'text' | 'id' | 'tagged' | 'context' | 'sum'>
}
export const QuoteCard: React.VFC<QuoteCardProps> = ({ quote }) => {
  const me = useAuth()
  const [upvoted, setUpvoted] = useState(me.upvotedQuoteIds.includes(quote.id))
  const [voteSum, setVoteSum] = useState(quote.sum)
  const [upvote] = useMutation<
    CreateQuoteVoteReturns,
    CreateQuoteVoteVariables
  >(CREATE_QUOTE_VOTE)
  const [deleteUpvote] = useMutation<
    DeleteUserQuoteVoteReturns,
    DeleteUserQuoteVoteVariables
  >(DELETE_USER_QUOTE_VOTE)
  const handleUpvote = () => {
    if (!upvoted) {
      toast
        .promise(
          upvote({
            variables: { input: { quote: quote.id, value: 1 } },
          }),
          {
            loading: 'Oppstemmer sitat...',
            error: 'Kunne ikke oppstemme sitat!',
            success: 'Sitat oppstemt!',
          }
        )
        .then(res => {
          const quoteSum = res.data?.createQuoteVote.quoteVote.quote.sum
          setUpvoted(true)
          setVoteSum(quoteSum ?? voteSum)
        })
    } else {
      toast
        .promise(deleteUpvote({ variables: { quoteId: quote.id } }), {
          loading: 'Sletter stemme...',
          error: 'Kunne ikke slette stemme',
          success: 'Stemme slettet!',
        })
        .then(res => {
          const { data } = res
          const quoteSum = data?.deleteUserQuoteVote.quoteSum
          setUpvoted(false)
          setVoteSum(quoteSum ?? voteSum)
        })
    }
  }

  return (
    <Wrapper>
      <QuoteText>{quote.text}</QuoteText>
      <QuoteContext>{quote.context}</QuoteContext>
      <QuoteFooter>
        <TaggedContainer>
          {quote.tagged.map(user => (
            <UserThumbnail user={user} size="small" key={user.id} />
          ))}
        </TaggedContainer>
        <VoteContainer>
          <span>{voteSum}</span>
          <span>
            <UpvoteIcon
              icon="thumbs-up"
              $upvoted={upvoted}
              onClick={handleUpvote}
            />
          </span>
        </VoteContainer>
      </QuoteFooter>
    </Wrapper>
  )
}

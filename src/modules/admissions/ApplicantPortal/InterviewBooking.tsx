import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { BOOK_INTERRVIEW_MUTATION } from './mutations'
import { INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY } from './queries'
import { InterviewsAvailableForBookingReturns } from './types'

const Wrapper = styled.div``

const BookInterviewButton = styled.button``

interface InterviewBookingProps {
  applicantToken: string
}

export const InterviewBooking: React.VFC<InterviewBookingProps> = ({
  applicantToken,
}) => {
  const [dayOffset, setDayOffset] = useState(0)
  const { data, error, loading } =
    useQuery<InterviewsAvailableForBookingReturns>(
      INTERVIEWS_AVAILABLE_FOR_BOOKING_QUERY,
      {
        pollInterval: 20000, // polls every 30 seconds
        variables: {
          dayOffset: dayOffset,
        },
      }
    )
  const [bookInterview] = useMutation(BOOK_INTERRVIEW_MUTATION, {
    refetchQueries: ['GetApplicantFromToken'],
  })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleBookInterview = (interviewIds: string[]) => {
    bookInterview({
      variables: {
        interviewIds: interviewIds,
        applicantToken: applicantToken,
      },
    }).then(res => {
      const {
        data: {
          bookInterview: { ok },
        },
      } = res
      if (!ok) {
        toast.error('Noe gikk galt, prøv igjen')
      }
    })
  }
  return (
    <Wrapper>
      {data.interviewsAvailableForBooking.map(day => {
        return (
          <div key={`${day.date}`}>
            {format(new Date(day.date), 'EEEE dd MMM')}
            {day.interviewSlots.map((slot, i) => {
              const unavailable = slot.interviewIds.length === 0
              return (
                <BookInterviewButton
                  key={i}
                  disabled={unavailable}
                  onClick={() => {
                    handleBookInterview(slot.interviewIds)
                  }}
                >
                  {format(new Date(slot.interviewStart), 'HH:mm')}
                </BookInterviewButton>
              )
            })}
          </div>
        )
      })}
      <button
        onClick={() => {
          setDayOffset(dayOffset + 2)
        }}
      >
        Ingen av disse tidspunktene passer for meg
      </button>
    </Wrapper>
  )
}

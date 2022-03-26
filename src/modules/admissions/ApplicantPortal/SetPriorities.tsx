import { useMutation, useQuery } from '@apollo/client'
import { PATCH_APPLICANT } from 'modules/admissions/mutations'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ApplicantNode, InternalGroupPositionPriorityNode } from '../types'
import {
  ADD_INTERNAL_GROUP_POSITION_PRIORITY,
  DELETE_INTERNAL_GROUP_POSITION_PRIORITY,
} from './mutations'
import { INTERNAL_GROUP_POSITIONS_AVAILABLE_FOR_APPLICANTS_QUERY } from './queries'
import {
  AddInternalGroupPositionPriorityReturns,
  AddInternalGroupPositionPriorityVariables,
  InternalGroupPositionsAvailableForApplicantReturns,
} from './types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PriorityContainer = styled.div`
  display: flex;
  flex-direction: column;
`

interface InternalGroupPosition {
  id: string
  name: string
}

interface SetPrioritiesProps {
  applicant: ApplicantNode
}

export const SetPriorities: React.VFC<SetPrioritiesProps> = ({ applicant }) => {
  // === Local state variables ===
  // Initial priority state are applicant non-null priorities
  const [priorities, setPriorities] = useState<
    InternalGroupPositionPriorityNode[]
  >(
    applicant.priorities.filter(
      priority => priority !== null
    ) as InternalGroupPositionPriorityNode[]
  )
  const [internalGroupPositions, setInternalGroupPositions] = useState<
    InternalGroupPosition[]
  >([])
  const [filteredInternalGroupPositions, setFilteredInternalGroupPositions] =
    useState<InternalGroupPosition[]>([])

  useEffect(() => {
    // We handle what internal group positions we want to display for the user
    const filteredPriorities = applicant.priorities.filter(
      priority => priority !== null
    )
    const priorityIds = filteredPriorities.map(
      priority => priority!.internalGroupPosition.id
    )
    const availableInternalGroupPositions = internalGroupPositions.filter(
      position => !priorityIds.includes(position.id)
    )

    // Filtered positions are those which are available for the user to add to their priority listing
    setFilteredInternalGroupPositions(availableInternalGroupPositions)
    setPriorities(filteredPriorities as InternalGroupPositionPriorityNode[])
  }, [applicant.priorities, internalGroupPositions])

  // === Queries and mutations ===
  useQuery<InternalGroupPositionsAvailableForApplicantReturns>(
    INTERNAL_GROUP_POSITIONS_AVAILABLE_FOR_APPLICANTS_QUERY,
    {
      onCompleted(data) {
        const { internalGroupPositionsAvailableForApplicants } = data
        setInternalGroupPositions(internalGroupPositionsAvailableForApplicants)
      },
    }
  )

  // Saves priorities and moves the applicant to the interview booking phase
  const [applicantNextPhase] = useMutation(PATCH_APPLICANT, {
    variables: {
      id: applicant.id,
      input: {
        status: 'HAS_SET_PRIORITIES',
      },
    },
    refetchQueries: ['GetApplicantFromToken'],
  })

  const [deleteInternalGroupPriority] = useMutation(
    DELETE_INTERNAL_GROUP_POSITION_PRIORITY,
    { refetchQueries: ['GetApplicantFromToken'] }
  )

  const [addPriority] = useMutation<
    AddInternalGroupPositionPriorityReturns,
    AddInternalGroupPositionPriorityVariables
  >(ADD_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['GetApplicantFromToken'],
  })

  //  === Handlers ===
  const handleAddPriority = (internal_group_position_id: string) => {
    addPriority({
      variables: {
        internalGroupPositionId: internal_group_position_id,
        applicantId: applicant.id,
      },
    })
  }

  const handleDeletePriority = (priorityId: string) => {
    deleteInternalGroupPriority({ variables: { id: priorityId } })
  }

  const handleMoveToInterviweBooking = () => {
    applicantNextPhase()
  }

  // ToDo move this to local state and update in useEffect
  const canMoveOn = priorities.length > 0
  const canAddPriority = priorities.length < 3

  return (
    <Wrapper>
      <PriorityContainer>
        {priorities.map(priority => {
          return (
            <span>
              {priority.internalGroupPosition.name}
              <button
                onClick={() => {
                  handleDeletePriority(priority.id)
                }}
              >
                Slett prioritet
              </button>
            </span>
          )
        })}
      </PriorityContainer>
      {canAddPriority && (
        <div>
          {filteredInternalGroupPositions.map(position => (
            <button
              key={position.name}
              onClick={() => {
                handleAddPriority(position.id)
              }}
            >
              {position.name}
            </button>
          ))}
        </div>
      )}
      {canMoveOn ? (
        <button onClick={handleMoveToInterviweBooking}>Book intervju</button>
      ) : (
        'Du må minst ha 1 stilling før du kan booke intervju'
      )}
    </Wrapper>
  )
}

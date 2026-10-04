import { Table } from '@mantine/core'
import React from 'react'
import { InternalGroupPositionPriorityBadge } from './components/InternalGroupPositionPriorityBadge'
import { InternalGroupPositionPriority } from './types.graphql'
/**
 * The compiler was not happy with returning react fragments and other HTML DOM elements wihtout
 * the .tsx extention being applied
 *
 * Probably means this should be re-written to a component
 * @param priority An applicant prioirity object we want to render in a table
 * @returns A fraagment of two table-data <Table.Td /> elements
 */

export const renderPrioritycell = (
  // ToDo: Rewrite to a component
  priority: InternalGroupPositionPriority
) => {
  // We need table cell content regardless of the priority being null or not
  if (priority === null)
    return (
      // Prpbably need to pass the index as an argument here instead
      <React.Fragment key={'Nullvalue'}>
        {/* Needs some unique shit */}
        <Table.Td></Table.Td>
        <Table.Td></Table.Td>
      </React.Fragment>
    )

  return (
    <React.Fragment key={`${priority.id}-${priority.applicantPriority}`}>
      <Table.Td>{priority.internalGroupPosition.internalGroup.name}</Table.Td>
      <Table.Td>
        <InternalGroupPositionPriorityBadge priority={priority} />
      </Table.Td>
    </React.Fragment>
  )
}

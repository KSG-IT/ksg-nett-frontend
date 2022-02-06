import React from "react";
import { StaticContext } from "react-router";
import { Link as BaseLink, RouteComponentProps } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'


const Link = styled(BaseLink)`
  display: flex;
  align-items: center;
  svg {
    margin: 0 4px 0 ;
  }
`
const TextWrapper = styled.div`
  display: flex;
`

interface Crumb {
  name?: string
  Component?: React.FC<RouteComponentProps<{}, StaticContext, unknown>> | (() => JSX.Element)
  path?: string
}

interface BreadCrumbsPros {
  crumbs: Crumb[]
}

export const Breadcrumbs: React.FC<BreadCrumbsPros> = ({ crumbs }) => {
  // Don't render a single breadcrumb.
  if (crumbs.length <= 1) {
    return null;
  }

  return (
    <TextWrapper className="mb-4 bg-gray-300">
      {/* Link back to any previous steps of the breadcrumb. */}
      {crumbs.map(({ name, path }, key) =>
        key + 1 === crumbs.length ? (

          <span key={key} className="bold">
            {name}
          </span>
        ) : (
          <Link key={key} className="underline text-blue-500 mr-4" to={path as string}>
            {name}
            <FontAwesomeIcon icon={['fas', 'chevron-right']} color="black" />
          </Link>
        )
      )}
    </TextWrapper>
  );
};
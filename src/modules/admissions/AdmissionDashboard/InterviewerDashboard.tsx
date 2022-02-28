import styled from 'styled-components'

const Wrapper = styled.div``

export const InterviewerDashboard: React.VFC = () => {
  // This dashboard is how interviewers will be interacting with the admissions process
  // Here we can filter applicants based on their priority status so they easuly can
  // see where they need to allocate themselves.

  // Should also show statistics on interviews you have had and we can also do
  // a highsore list based on this.

  return (
    <Wrapper>
      <div>Din statistikk</div>
      <div>Søkertabell</div>
    </Wrapper>
  )
}

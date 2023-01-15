import { MessageBox } from 'components/MessageBox'

export const CreateDepositInfoBox: React.FC = () => {
  return (
    <MessageBox type="info">
      Her kan du opprette et nytt innskudd på kontoen din. Bankoverføringer kan
      gjøres til <b>1503.88.72882</b> eller du kan betale med vipps. Velg "kjøp
      noe/betal til" og søk <b>95034</b>, da får du opp Societeten. Ved bruk av
      vipps er det gebyr på 5%, altså 5kr per 100kr du vil sende.
    </MessageBox>
  )
}

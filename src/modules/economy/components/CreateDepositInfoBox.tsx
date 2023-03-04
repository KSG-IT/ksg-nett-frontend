import { MessageBox } from 'components/MessageBox'

export const CreateDepositInfoBox: React.FC = () => {
  return (
    <MessageBox type="info">
      Innskudd benytter seg av betalingstjenesten{' '}
      <b>
        <a href="https://stripe.com" target="_blank">
          Stripe
        </a>
      </b>{' '}
      for å behandle og verifisere kortbetalinger. KSG-nett lagrer under ingen
      omstendigheter kredittkortinformasjon. Betalingen innebærer et
      behandlingsgebyr. Det er fortsatt mulig å benytte seg av bankoverføringer,
      dette har ikke et gebyr men kan ta noe lengre tid. Kontonummeret til
      Societen er <b>1503.88.72882</b>.
    </MessageBox>
  )
}

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
      for å behandle og verifisere betalinger. KSG-nett lagrer under ingen
      omstendigheter kredittkortinformasjon. Betalingen innebærer et
      behandlingsgebyr.
    </MessageBox>
  )
}

import { useMe } from 'util/hooks'
import { CreateDepositForm } from '../components'

export const DebtCollection: React.FC = () => {
  const me = useMe()

  return (
    <div>
      <h1>Hei, {me.firstName}!</h1>
      <section>
        <p>Du skylder penger.</p> Her har du mulighet til å se vakter, men ikke
        noe annet. For å få tilgang til resten av siden må du opprertte et
        innskudd og få det godkjent.
        <CreateDepositForm onCompletedCallback={() => {}} />
      </section>
    </div>
  )
}

import { useMe } from 'util/hooks'
import { DepositFlow } from './DepositFlow'

/** The deposit form on the debt page starts with the amount the user owes */
export const DebtCollectionDepositForm: React.FC = () => {
  const me = useMe()

  return <DepositFlow initialAmount={Math.abs(me.balance)} />
}

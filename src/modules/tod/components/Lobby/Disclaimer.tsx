import { useQuery } from '@apollo/client'
import { IconArrowRight, IconMessage } from '@tabler/icons-react'
import { FeedbackModal } from 'modules/dashboard/components/Feedback'
import { useState } from 'react'
import { TOD_FEEDBACK_ENABLED_QUERY } from '../../queries'
import { TodFeedbackEnabledReturns } from '../../types.graphql'
import classes from './Disclaimer.module.css'

interface DisclaimerProps {
  onStart: () => void
  onBack: () => void
}

// Shown each time before a game starts: the cards are old, and an AI set
// the spice levels.
export const Disclaimer: React.FC<DisclaimerProps> = ({ onStart, onBack }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const { data } = useQuery<TodFeedbackEnabledReturns>(
    TOD_FEEDBACK_ENABLED_QUERY
  )
  const canSendFeedback = data?.getFeatureFlagByKey?.enabled === true

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !feedbackOpen) onBack()
  }

  return (
    <div
      className={classes.panel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tod-disclaimer-title"
      onKeyDown={handleKeyDown}
    >
      <div className={classes.body}>
        <h2 id="tod-disclaimer-title" className={classes.title}>
          Før dere starter
        </h2>
        <ul className={classes.points}>
          <li>
            Kortene ble skrevet i 2020 av to unge alkoholikere tidlig i sin KSG
            karriere. Noe av innholdet kan være utdatert, støtende og/eller bare
            veldig kleine. Vi beklager på forhånd.
          </li>
          <li>
            Spice-level (Mild, Krydret, Drøy) er satt av KI og kan være feil.
          </li>
          <li>
            Er det noe dere føler som må fjernes, eller noe som bør endres?{' '}
            {canSendFeedback
              ? 'Send en tilbakemelding til KSG-IT.'
              : 'Si ifra til KSG-IT.'}{' '}
            Dere kan også fjerne kort, eller legge til nye selv under «Se og
            endre kortene».
          </li>
        </ul>
        <div className={classes.actions}>
          <button
            type="button"
            className={classes.start}
            onClick={onStart}
            autoFocus
          >
            Start spillet <IconArrowRight size="1em" stroke={2.4} />
          </button>
          {canSendFeedback && (
            <button
              type="button"
              className={classes.secondary}
              onClick={() => setFeedbackOpen(true)}
            >
              <IconMessage size="1em" /> Gi tilbakemelding
            </button>
          )}
          <button type="button" className={classes.back} onClick={onBack}>
            Tilbake
          </button>
        </div>
      </div>
      <FeedbackModal
        opened={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        context="Truth or Drink"
        intro="Et kort som bør bort, endres eller ha et annet krydringsnivå? Skriv gjerne hvilket kort det gjelder."
      />
    </div>
  )
}

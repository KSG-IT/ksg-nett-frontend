//function to translate SummaryType value to a label
import { SummaryType } from './types'
import { summaryTypeChoices } from './conts'

export const getSummaryTypeLabel = (type: SummaryType) => {
  //find the summaryTypeChoice with the same value as the type
  const summaryTypeChoice = summaryTypeChoices.find(
    choice => choice.value === type
  )
  //return the label of the summaryTypeChoice
  return summaryTypeChoice?.label
}

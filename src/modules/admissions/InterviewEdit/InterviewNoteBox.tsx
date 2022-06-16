import { Textarea } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'util/hooks'
import { usePatchInterview } from '../mutations.hooks'

interface InterviewNoteBoxProps {
  interviewId: string
  initialValue: string
  field: 'notes' | 'discussion'
}

export const InterviewNoteBox: React.VFC<InterviewNoteBoxProps> = ({
  interviewId,
  initialValue,
  field,
}) => {
  /**
   * Executes a mutation saving the contents of the textarea to the database
   * after a given timeout from the last change.
   */
  const [value, setValue] = useState(initialValue)
  const [lastSavedValue, setLastSavedValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 5000)

  const { patchInterview } = usePatchInterview()

  useEffect(() => {
    const input = {
      // This notation dynamically creates a property on the input object
      // meaning it could either be 'notes' or 'discussion' fields so we can
      // use the same input object for both.
      [field]: debouncedValue,
    }

    if (lastSavedValue === debouncedValue) {
      return
    }
    patchInterview({ variables: { id: interviewId, input: input } }).then(() =>
      setLastSavedValue(debouncedValue)
    )
  }, [debouncedValue])

  return (
    <Textarea
      minRows={12}
      value={value}
      onChange={evt => setValue(evt.target.value)}
    />
  )
}

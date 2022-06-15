import { useMutation } from '@apollo/client'
import { Textarea } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'util/hooks'
import { PATCH_INTERVIEW } from '../mutations'

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

  const [save] = useMutation(PATCH_INTERVIEW)

  useEffect(() => {
    const input = {
      [field]: debouncedValue,
    }

    if (lastSavedValue === debouncedValue) {
      return
    }
    save({ variables: { id: interviewId, input: input } }).then((data: any) => {
      setLastSavedValue(debouncedValue)
    })
  }, [debouncedValue])

  return (
    <Textarea
      minRows={12}
      value={value}
      onChange={evt => setValue(evt.target.value)}
    />
  )
}

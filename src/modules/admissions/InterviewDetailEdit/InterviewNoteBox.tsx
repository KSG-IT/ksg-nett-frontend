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
   * A 'secure' notebox which debounces the text area value and saves its value to the correspondong
   * field
   */
  const [value, setValue] = useState(initialValue)
  const [lastSavedValue, setLastSavedValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 5000)
  const [savedAt, setSavedAt] = useState(new Date()) // Can use this for updating somewhere

  const [save] = useMutation(PATCH_INTERVIEW)

  useEffect(() => {
    const input = {
      [field]: debouncedValue,
    }
    console.log(input)

    if (lastSavedValue === debouncedValue) {
      console.log('No changes, no mutation')
      return
    }
    save({ variables: { id: interviewId, input: input } }).then((data: any) => {
      console.log(data)
      console.log('saved, updating last saved')
      setLastSavedValue(debouncedValue)
    })
  }, [debouncedValue])

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {}
  return (
    <Textarea
      minRows={12}
      value={value}
      onChange={evt => setValue(evt.target.value)}
    />
  )
}

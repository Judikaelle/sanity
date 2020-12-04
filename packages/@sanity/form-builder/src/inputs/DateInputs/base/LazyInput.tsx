import React from 'react'
import {TextInput} from '@sanity/ui'

type Props = Omit<React.ComponentProps<typeof TextInput>, 'onChange'> & {
  onChange?: (
    event: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>
  ) => void
}
/**
 * A TextInput that only emit onChange when it has to
 * By default it will only emit onChange when: 1) user hits enter or 2) user leaves the
 * field (e.g. onBlur) and the input value at this time is different from the given `value` prop
 */
export const LazyInput = ({onChange, onBlur, onKeyPress, value, ...rest}: Props) => {
  const [inputValue, setInputValue] = React.useState<string>()

  const handleChange = React.useCallback((event) => {
    setInputValue(event.currentTarget.value)
  }, [])

  const checkEvent = React.useCallback(
    (event) => {
      const currentValue = event.currentTarget.value
      if (currentValue !== `${value}`) {
        if (onChange) {
          onChange(event)
        }
      }
      setInputValue(undefined)
    },
    [onChange, value]
  )

  const handleBlur = React.useCallback(
    (e) => {
      checkEvent(e)
      if (onBlur) {
        onBlur(e)
      }
    },
    [checkEvent, onBlur]
  )

  const handleKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        checkEvent(e)
      }
      if (onKeyPress) {
        onKeyPress(e)
      }
    },
    [checkEvent, onKeyPress]
  )

  return (
    <TextInput
      {...rest}
      value={inputValue === undefined ? value : inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
    />
  )
}

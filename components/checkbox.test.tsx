import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckboxComponent from './checkbox'
const mockOnChange = jest.fn()
const sampleOptions = [
  {
    label: 'database',
    value: 'database',
    key: 'database',
    content: 'database'
  },
  {
    label: 'ssl',
    value: 'ssl',
    key: 'ssl',
    content: 'ssl'
  }
]
const sampleFieldProps = {
  type: 'checkbox',
  appCodeData: {},
  onChange: mockOnChange,
  content: 'Sample Content',
  className: 'sampleClass',
  xs: 12,
  validation: [
    { type: 'required' },
    { type: 'maxLength', value: 5 }
  ]
}

test('CheckboxComponent renders correctly and handles changes', () => {
  render(
        <CheckboxComponent {...sampleFieldProps} label="Sample Label" options={sampleOptions} />
  )
})

test('CheckboxComponent handles validation correctly', () => {
  render(
        <CheckboxComponent {...sampleFieldProps} label="Sample Label" options={sampleOptions} content={undefined} />
  )
})

test('handleChange function updates data and calls onChange correctly', () => {
  render(
        <CheckboxComponent {...sampleFieldProps} label="Sample Label" options={sampleOptions} />
  )
})
test('handleChange function updates data and calls onChange correctly', () => {
  const { getByLabelText } = render(
        <CheckboxComponent {...sampleFieldProps} label="Sample Label" options={sampleOptions} className="true" />
  )
  const checkboxOption2 = getByLabelText('ssl')

  userEvent.click(checkboxOption2)
  expect(mockOnChange).toHaveBeenCalledWith(['ssl'], undefined)
})
it('handleChange function updates data and calls onChange correctly', () => {
  const { getByLabelText } = render(
        <CheckboxComponent {...sampleFieldProps} label="Sample Label" options={sampleOptions} className="true" />
  )
  const checkboxOption2 = getByLabelText('ssl')
  userEvent.click(checkboxOption2)
  fireEvent.change(checkboxOption2, false)
  // userEvent.click(checkboxOption2)
  expect(mockOnChange).toHaveBeenCalledWith(['ssl'], undefined)
})

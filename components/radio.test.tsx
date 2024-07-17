import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import RadioComonent from './radio'

const keyvault = {
  label: 'Keyvault',
  key: 'keyvault',
  configure: true,
  type: 'radio',
  default: 'true',
  xs: 6,
  options: [
    {
      label: 'Yes',
      value: 'true'
    },
    {
      label: 'No',
      value: 'false'
    }
  ]
}
test('RadioComponent renders correctly', () => {
  render(<RadioComonent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...keyvault} />)
})

test('RadioComponent renders correctly on change Input', () => {
  render(<RadioComonent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
  } } {...keyvault} />)
  fireEvent.click(screen.getByLabelText('No'))
})

test('RadioComponent renders with initial value', () => {
  render(<RadioComonent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
  } } {...keyvault} data="false" />)
  expect(screen.getByLabelText('No')).toBeChecked()
})

test('RadioComponent calls onChange handler on input change', () => {
  const mockOnChange = jest.fn()
  render(<RadioComonent appCodeData={undefined} onChange={mockOnChange} {...keyvault} />)
  fireEvent.click(screen.getByLabelText('No'))
  expect(mockOnChange).toHaveBeenCalledWith('false', 'keyvault')
})

test('RadioComponent renders with error message', () => {
  const errorProps = { ...keyvault, error: 'Test Error' }
  render(<RadioComonent appCodeData={undefined} onChange={jest.fn()} {...errorProps} />)
  const errorElement = screen.getByText('Test Error')
  expect(errorElement).toBeInTheDocument()
})

test('RadioComponent renders with label', () => {
  render(<RadioComonent appCodeData={undefined} onChange={jest.fn()} {...keyvault} />)
  const labelElement = screen.getByText('Keyvault')
  expect(labelElement).toBeInTheDocument()
})

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import InputComonent from './input'

describe('InputComonent', () => {
  const mockOnChange = jest.fn()

  const fieldProps = {
    dataKey: 'testKey',
    data: 'testData',
    label: 'Test Label',
    onChange: mockOnChange,
    xs: 6,
    children: null,
    error: undefined,
    validation: [
      { type: 'required' },
      { type: 'maxLength', value: 10 }
    ]
  }

  test('InputComponent renders correctly on change Input', () => {
    render(<InputComonent type={''} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    }} />)
    fireEvent.change(screen.getByPlaceholderText('Enter undefined'), { target: { value: '13' } })
  })

  test('renders with error when error prop is provided', () => {
    const errorProps = { ...fieldProps, error: 'Test Error' }
    const { getByText } = render(<InputComonent type={''} appCodeData={undefined} {...errorProps} />)
    const errorElement = getByText('Test Error')
    expect(errorElement).toBeInTheDocument()
  })


  test('InputComponent renders with placeholder text', () => {
    render(<InputComonent type={''} appCodeData={undefined} onChange={jest.fn()} />)
    const inputElement = screen.getByPlaceholderText('Enter Test Label')
    expect(inputElement).toBeInTheDocument()
  })

  test('InputComponent renders with initial value', () => {
    render(<InputComonent type={''} appCodeData={undefined} data="Initial Value" onChange={jest.fn()} />)
    const inputElement = screen.getByDisplayValue('Initial Value')
    expect(inputElement).toBeInTheDocument()
  })

  test('InputComponent calls onChange handler on input change', () => {
    const mockOnChange = jest.fn()
    render(<InputComonent type={''} appCodeData={undefined} onChange={mockOnChange} />)
    const inputElement = screen.getByPlaceholderText('Enter Test Label')
    fireEvent.change(inputElement, { target: { value: 'New Value' } })
    expect(mockOnChange).toHaveBeenCalledWith('New Value', 'testKey')
  })

  test('InputComponent renders with error message', () => {
    const errorProps = { ...fieldProps, error: 'Test Error', onChange: jest.fn() } // Add 'onChange' property
    render(<InputComonent type={''} appCodeData={undefined} {...errorProps} />)
    const errorElement = screen.getByText('Test Error')
    expect(errorElement).toBeInTheDocument()
  })

  // Add more tests as needed...
})
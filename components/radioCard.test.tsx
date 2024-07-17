import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import RadioCardComonent from './radioCard'

const database = {
  label: 'Database',
  key: 'database',
  configure: true,
  type: 'radioCard',
  options: [
    {
      label: 'Yes',
      value: 'true',
      description: 'Description - Additional Info'
    },
    {
      label: 'No',
      value: 'false',
      description: 'Description - Additional Info'
    }
  ]
}

test('RadioCardComponent renders correctly', () => {
  render(<RadioCardComonent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...database}/>)
})

test('RadioComponent renders correctly on change Input', () => {
  render(<RadioCardComonent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
  } } {...database}/>)
  fireEvent.click(screen.getByTestId('accordion-button-0'))
})

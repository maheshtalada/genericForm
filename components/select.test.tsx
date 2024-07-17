import React from 'react'
import { render } from '@testing-library/react'
import SelectComponent from './select'

const database = {
  label: 'Database',
  key: 'database',
  configure: true,
  type: 'radioCard',
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

test('SectionComponent renders correctly', () => {
  render(<SelectComponent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...database}/>)
})

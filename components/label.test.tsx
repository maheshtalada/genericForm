import React from 'react'
import { render } from '@testing-library/react'
import LabelComponent from './label'
const appOwner = {
  label: 'App Owner',
  key: 'appOwner',
  type: 'label',
  configure: false,
  xs: 3
}
test('LabelComponent renders correctly', () => {
  render(<LabelComponent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...appOwner} />)
})

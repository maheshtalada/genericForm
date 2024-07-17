import React from 'react'
import { render } from '@testing-library/react'
import HeadingComponent from './heading'

const templateName = {
  key: 'templateName',
  type: 'heading',
  configure: false,
  xs: 12
}
test('DividerComponent renders correctly', () => {
  render(<HeadingComponent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...templateName} />)
})

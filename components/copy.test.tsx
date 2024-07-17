import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import CopyComponent from './copy'

const props = {
  label: 'Subscription Name',
  key: 'subscriptionName',
  type: 'copy',
  allowCopy: true,
  configure: false,
  xs: 6

}
test('CopyComponent renders correctly', () => {
  render(<CopyComponent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...props} />)
})

test('CopyComponent renders correctly on click copy icon', () => {
  render(<CopyComponent appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  } } {...props} />)
  const copyIconButton = screen.getByTestId('copyIconButton')
  fireEvent.click(copyIconButton)
  const tooltip = screen.getByRole('button', { name: /text copied to clipboard/i })
  expect(tooltip).toBeInTheDocument()
})

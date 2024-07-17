import React from 'react'
import { render } from '@testing-library/react'
import HtmlContent from './html-content'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FieldProps {
  type: string
  appCodeData: any
  onChange: (value: any) => void
  content: string
  className: string
  xs: number
}
test('CloneComponent renders correctly', () => {
  render(<HtmlContent type={'text'} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  }} />)
})

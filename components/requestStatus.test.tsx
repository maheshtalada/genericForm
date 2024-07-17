import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RequestStatus from './requestStatus'

const mockData = {
  status: 'submitted',
  statusHistory: [
    {
      status: 'submitted',
      owner: 'John Doe',
      updatedAt: '2023-01-01T12:00:00Z'
    }
  ]
}
const field = {
  label: 'App Owner',
  key: 'appOwner',
  type: 'label',
  xs: 3
}

test('renders RequestStatus component with mock data', () => {
  render(<RequestStatus data={mockData} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  }} {...field}/>)
  expect(screen.getByText('Submitted')).toBeInTheDocument()
})
test('clicking on a step triggers a tooltip', () => {
  render(<RequestStatus data={mockData} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  }} {...field}/>)
  const stepElement = screen.getByText('Submitted')
  userEvent.click(stepElement)
})
test('request status for completed', () => {
  const mockCompData = {
    status: 'completed',
    statusHistory: [
      {
        status: 'submitted',
        owner: 'John Doe',
        updatedAt: '2023-01-01T12:00:00Z'
      }
    ]
  }
  render(<RequestStatus data={mockCompData} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
    throw new Error('Function not implemented.')
  }} {...field}/>)
  const stepElement = screen.getByText('Submitted')
  userEvent.click(stepElement)
})

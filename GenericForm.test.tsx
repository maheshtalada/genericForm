import React from 'react'
import { fireEvent, render, waitFor, screen, getByLabelText } from '@testing-library/react'
import FormField from './FormField'
import GenericForm from './genericFormComponent'
import userEvent from '@testing-library/user-event'

const referenceData = {
  appCode: 'AAPN',
  costCenter: '',
  drTier: 'DR4',
  resources: 'ssl',
  name: 'Advanced Analytics Personalization (AAPN) ',
  portfolio: 'Data Management',
  appOwner: 'Rajiv Vipani',
  supportGrp: 'Digital.MarketingSRE',
  appSysId: '5a847f571b4e6554c5388738cd4bcbf9',
  aksNamespace: 'yes',
  subscriptionId: '72f74a79-764f-41bb-9b4c-f9b4ffd06d4f',
  subscriptionName: 'az-entaks-nonprod-01',
  dnsIp: '172.25.160.191',
  clusterName: 'esco-aksba1-nonprod-westus-cluster-01',
  resourceGroup: 'az-entaks-nonprod-01-esco-dev-westus-rg-01',
  location: 'westus',
  status: false,
  subnets: 3,
  secondaryClusterName: '',
  secondarySubscriptionId: '',
  secondarySubscriptionName: '',
  secondaryResourceGroupName: '',
  secondaryLocation: '',
  environment: 'dev7',
  templateName: 'Secure Azure Container with SQL'
}
const schema = {
  templateName: {
    key: 'templateName',
    type: 'heading',
    configure: false,
    xs: 12
  },
  resources: {
    label: 'Resources',
    key: 'resources',
    type: 'checkbox',
    xs: 12,
    options: [
      {
        label: 'Resources1',
        value: 'database',
        key: 'resource1',
        content: ''
      },
      {
        label: 'Resources2',
        value: 'ssl',
        key: 'resource2',
        content: ''
      }
    ],
    validation: [
      {
        type: 'required',
        message: 'Resources required'
      }
    ],
    children: [{
      label: 'Small',
      description: 'SQL DB 2vCores - Small',
      content: '390.41',
      details: 'Azure SQL Database - Serverless Cloud Database',
      optionsReferenceId: 'database',
      value: 'SQL Database (S)'
    }]
  },
  appCode: {
    label: 'Application Code',
    key: 'appCode',
    type: 'label',
    configure: false,
    xs: 3,
    validation: [
      {
        type: 'required',
        message: 'Resources required'
      }
    ],
    children: [{
      label: 'Small',
      description: 'SQL DB 2vCores - Small',
      content: '390.41',
      details: 'Azure SQL Database - Serverless Cloud Database',
      optionsReferenceId: 'database',
      value: 'SQL Database (S)'
    }]
  },
  environment: {
    label: 'Environment',
    key: 'environment',
    type: 'label',
    configure: false,
    xs: 3
  },
  appOwner: {
    label: 'App Owner',
    key: 'appOwner',
    type: 'label',
    configure: false,
    xs: 3
  },
  costCenter: {
    label: 'Cost Center',
    key: 'costCenter',
    type: 'label',
    configure: false,
    xs: 3
  },
  dividerA: {
    type: 'divider'
  },
  subnets: {
    label: 'Network/Subnet',
    key: 'subnets',
    type: 'label',
    allowCopy: false,
    configure: false,
    xs: 3
  },
  aksNamespace: {
    label: 'DR Category',
    key: 'drTier',
    type: 'label',
    allowCopy: false,
    configure: false,
    xs: 9
  },
  dividerB: {
    type: 'divider',
    xs: 12
  },
  subscription: {
    label: 'Subscription Name',
    key: 'subscriptionName',
    type: 'copy',
    allowCopy: true,
    configure: false,
    xs: 6
  },
  keyvault: {
    label: 'Keyvault',
    key: 'keyvault',
    configure: true,
    type: 'radio',
    default: 'true',
    xs: 3,
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
  },
  dividerC: {
    type: 'divider',
    xs: 12
  },
  database: {
    label: 'Select Database',
    key: 'database',
    type: 'radioCard',
    source: 'database',
    optionsReferenceId: 'database',
    contentFormatter: 'cost',
    default: 'SQL Database (S)',
    xs: 9,
    options: [
      {
        label: 'Small',
        content: '$306.99/mo',
        value: 'SQL Database (S)',
        description: 'test'
      },
      {
        label: 'Medium',
        content: '$410.00/mo',
        value: 'SQL Database (M)',
        description: 'test'
      },
      {
        label: 'Large',
        content: '$520.99/mo',
        value: 'SQL Database (L)',
        description: 'test'
      },
      {
        label: 'None',
        content: '$0.00/mo',
        value: 'none',
        description: 'test'
      }
    ]
  },
  databaseB: {
    label: 'Select Database',
    key: 'database',
    type: 'radioCard',
    source: 'database',
    optionsReferenceId: 'database',
    contentFormatter: 'cost',
    default: 'SQL Database (S)',
    xs: 9,
    validation: [
      {
        type: 'required',
        message: 'Resources required'
      }
    ],
    options: [
      {
        label: 'Small',
        content: '$306.99/mo',
        value: 'SQL Database (S)',
        description: 'test'
      },
      {
        label: 'Medium',
        content: '$410.00/mo',
        value: 'SQL Database (M)',
        description: 'test'
      },
      {
        label: 'Large',
        content: '$520.99/mo',
        value: 'SQL Database (L)',
        description: 'test'
      },
      {
        label: 'None',
        content: '$0.00/mo',
        value: 'none',
        description: 'test'
      }
    ],
    children: [{
      label: 'Small',
      description: 'SQL DB 2vCores - Small',
      content: '390.41',
      details: 'Azure SQL Database - Serverless Cloud Database',
      optionsReferenceId: 'database',
      value: 'SQL Database (S)'
    }]
  }
}

const schemaData = {
  databaseA: [
    {
      label: 'Small',
      description: 'SQL DB 2vCores - Small',
      content: '390.41',
      details: 'Azure SQL Database - Serverless Cloud Database',
      optionsReferenceId: 'database',
      value: 'SQL Database (S)'
    },
    {
      label: 'Medium',
      description: 'SQL DB 4vCores - Medium',
      content: '780.82',
      details: 'Azure SQL Database - Serverless Cloud Database',
      value: 'SQL Database (M)'
    },
    {
      label: 'Large',
      description: 'SQL DB 6vCores - Large',
      content: '1171.78',
      details: 'Azure SQL Database - Serverless Cloud Database',
      value: 'SQL Database (L)'
    },
    {
      label: 'None',
      description: 'None',
      content: '0.00',
      details: null,
      value: 'none'
    }
  ]
}
it('FormFieldComponent renders correctly', () => {
  render(<GenericForm referenceData={referenceData} schema={schema} data={schemaData} onSubmit={() => { }} onConfirm={() => { }} />)
  screen.getByText('Submit')
})
fit('submits the form without errors', async () => {
  render(
    <GenericForm schema={schema} data={schemaData} onSubmit={() => { }} onConfirm={() => { }} />
  )
  const appCode = userEvent.click(screen.getByText('Resources1'))
  const yesRadio = screen.getByLabelText('Yes')
  const noRadio = screen.getByLabelText('No')

  expect(yesRadio).toBeChecked()

  fireEvent.click(yesRadio)
  expect(yesRadio).toBeChecked()

  fireEvent.click(noRadio)
  expect(noRadio).toBeChecked()
  fireEvent.click(screen.getByText('Submit'))
  await waitFor(() => {
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
it('correctly handles schema change', () => {
  render(
    <GenericForm schema={schema} data={schemaData} onSubmit={() => { }} onConfirm={() => { }} />
  )
  jest.spyOn(global, 'fetch').mockRejectedValueOnce('Validation error')
})

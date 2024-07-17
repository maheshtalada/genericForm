import React from 'react'
import Select, { Option } from '@albertsons/uds/molecule/Select'
import Typography from '@mui/material/Typography'
import { findIndex } from 'lodash'
import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import LabelTitleComponent from './label-title'
import { type FieldProps } from '../FormField'
import { setXS, trimString, getDefaultOption } from '../hooks/useDependableRules'
import { getReadOnlyState } from '../hooks/useBaseField'

const SelectComponent = (props: FieldProps): any => {
  const { data, label, placeholder, dependableData, defaultOption,  onChange, options, dataKey, xs, children, error, isReadOnly } = props
  const items = options.map(option => ({ name: option.label, num: option.value }))
  const selectedItem = findIndex(items, { num: String(data) })
  
  const readOnly = getReadOnlyState(props)

  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '11px', marginTop: '1rem' }}>
      <LabelTitleComponent {...props} />
      <Select
        className='w-40 schema__select'
        items={items}
        value={items?.[selectedItem] || ''} // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        placeholder={typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : 'Select option'} // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        itemText='name'
        disabled={readOnly}
        onChange={(item: any) => { onChange(item.num, dataKey) }}
        error={error !== undefined}
      >
        {items.map((item, idx) => (
          <Option key={item} item={item} disabled={item.num < 0} />
        ))}
      </Select>
      {error && (
        <Typography component="span" sx={{
          color: '#E53014 !important',
          fontSize: '1rem !important',
          fontWeight: '400 !important',
          fontFamily: 'Nunito Sans, sans-serif !important',
          lineHeight: '1.5 !important',
          margin: '0 5px',
          width: 'auto',
          textTransform: 'capitalize'
        }}>
          {error}
        </Typography>
      )}
    </Grid>

  )
}

export default SelectComponent

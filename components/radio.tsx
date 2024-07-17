import React from 'react'
import Grid from '@mui/material/Grid'
import { isEmpty } from 'lodash'
import LabelTitleComponent from './label-title'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { type FieldProps } from '../FormField'
import { getReadOnlyState } from '../hooks/useBaseField'
import { setXS, trimString, evaluateExpr } from '../hooks/useDependableRules'

const RadioComonent = (props: FieldProps): any => {
  const { data, label, onChange, expression, populate, compareData, appCodeData, options, dataKey, xs, initialData, conditionalReadonly, children, isReadOnly, error } = props
  let readOnly = getReadOnlyState(props);

  React.useEffect(() => {
    if (populate && data) {
      poluateExtraFields(data)
    }
  }, [data, populate, dataKey])

  const poluateExtraFields = (data) => {
    if (populate && populate.length > 0) {
      populate.forEach(item => {
        onChange(data, item.key)
      })
    }
  }

  const onRadioChange = (value, key) => {
    onChange(value, key);
    poluateExtraFields(value);
  }

  return (
    <>
      <Grid item xs={setXS(xs, children)} sx={{ transition: 'right 1s ease-in-out', marginTop: '1rem' }}>
        <FormControl sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <LabelTitleComponent {...props} />
          <RadioGroup
            row
            aria-labelledby='demo-row-radio-buttons-group-label'
            name={dataKey}
            value={trimString(data)}
            onChange={(event) => { onRadioChange(event.target.value, dataKey) }}
            sx={{ marginRight: '16px', marginTop: '13px' }}>
            {options.map((option, i) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio disabled={readOnly} />}
                label={trimString(option.label)} />
            ))}
          </RadioGroup>
          { error && <div className='leading-4 text-error mt-1 ml-7 whitespace-nowrap select-none truncate text-sm'>
            {error}
          </div>}
        </FormControl>
      </Grid>
    </>
  )
}

export default RadioComonent

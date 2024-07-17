
import React from 'react'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import { uniq } from 'lodash'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@albertsons/uds/molecule/Checkbox'
import LabelTitleComponent from './label-title'
import { type FieldProps } from '../FormField'
import { getReadOnlyState } from '../hooks/useBaseField'
import { setXS, trimString, evaluateExpr } from '../hooks/useDependableRules'


const CheckboxComponent = ( props: FieldProps): any => {
  let { data = [], label, onChange, options, dependableData, compareData, conditionalReadonly, expression, dataKey, xs, children, error, initialData, validation, isReadOnly, appCodeData } = props
  let required = false
  if (validation && Array.isArray(validation) && (validation.length > 0)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    validation.forEach(v => {
      required = (v.type === 'required')
    })
  }

  let readOnly = getReadOnlyState(props);
  
  const validateContent = (content: string): React.ReactNode => {
    if (content !== '') {
      return <div dangerouslySetInnerHTML={{ __html: content ?? '' }} />
    }
    return undefined
  }

  const handleChange = (checked: boolean, value: string): any => {
    if (checked) {
      data = Array.isArray(data) && data.length ? [...data, value] : [value]
    } else {
      const index = data.indexOf(value)
      if (index > -1) {
        data.splice(index, 1)
      }
    }
    data = data && Array.isArray(data) ? uniq(data) : data
    onChange(data, dataKey)
  }

  const isOptionReadOnly = (conditionalReadonly?:any, compareData?:any )=> {
    if (conditionalReadonly) {
      return getReadOnlyState({...props, conditionalReadonly, compareData})
    }
    return readOnly  
  }

  return (
    <>
    <Grid item xs={setXS(xs, children)} sx={{ transition: 'right 1s ease-in-out', marginTop: '1rem' }}>
      <FormControl sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px'  }}>
          <LabelTitleComponent {...props} />
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginRight: '16px', alignItems: 'center', height: '40px' }}>
          {
            options.map((option: { key: string, label: string | undefined, value: string, content: string,  conditionalReadonly?: any, compareData?:any}, index: number) => (<Checkbox
              key={index.toString()}
              className='checkbox__class'
              label={trimString(String(option.label))}
              name={dataKey}
              disabled={isOptionReadOnly(option?.conditionalReadonly, option?.compareData)}
              checked={(data.indexOf(option.value) > -1)}
              onChange={(e) => { handleChange(e.target.checked, option.value) }}
              error={ error? true: false}>
                {validateContent(option.content)}
              </Checkbox>
            ))
          }
          </div>
          { error && <div className='leading-4 text-error mt-1 ml-7 whitespace-nowrap select-none truncate text-sm'>
            {error}
          </div>}
      </FormControl>
     </Grid>
    </>
  )
}

export default CheckboxComponent

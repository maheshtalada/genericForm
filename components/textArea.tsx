import React from 'react'
import Grid from '@mui/material/Grid'
import LabelTitleComponent from './label-title'
import { type FieldProps } from '../FormField'
import { setXS, trimString, evaluateExpr } from '../hooks/useDependableRules'
import  TextareaAutosize from '@mui/base/TextareaAutosize';
import { getReadOnlyState } from '../hooks/useBaseField'
import { Box } from '@mui/material'


const TextAreaComponent = (props: FieldProps): any => {
  const { dataKey, expression,  data, label, placeholder, onChange, xs, dependableData = {}, conditionalReadonly, children, error, isReadOnly, isForm, minRows=1, maxRows=2 } = props;
  let readOnly = getReadOnlyState(props)
  if (conditionalReadonly) {
    const expr = expression || conditionalReadonly;
    readOnly = evaluateExpr(expr, dependableData);
  }
  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', marginTop: isForm === false ? '0' : '1rem' }}>
      <LabelTitleComponent {...props}/>
      <TextareaAutosize id="ta-basic"
        className={`w-80 inputGenericField ${error ? 'datefield-error-outline' : ''}`}
        onChange={(e) => onChange(e.target.value, dataKey)}
        value={data}
        minRows={minRows}
        maxRows={maxRows}
        name='inputName'
        disabled={readOnly}
        placeholder={typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}`}
    />
    {error && <Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', alignItems: 'center' }} >
        {error}</Box>}
    </Grid>
  )
}

export default TextAreaComponent

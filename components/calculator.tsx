
import React from 'react'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { type FieldProps } from '../FormField'
import LabelTitleComponent from './label-title'
import { setXS, trimString, TypeHandlers } from '../hooks/useDependableRules'

const LableData = styled('label')({
  color: '#7C7575',
  fontFamily: 'Nunito Sans',
  fontSize: '11px',
  fontWeight: '400',
  lineHeight: '10px',
  textTransform: 'uppercase',
  fontStyle: 'normal'
})

const InputData = styled('p')({
  color: '#0F1012',
  fontFamily: 'Nunito Sans',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'normal',
})

const SingleLine = styled('span')({
  overflow: 'hidden',
  width: '90%',
  height: '100%',
  display: 'block',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const CalculatorComponent = (props: FieldProps): any => {

  const { label, data = '', xs, children, contentFormatter, contentUnit } = props;
  return (
    <Grid className='calculator-container' item xs={setXS(xs, children)} md={setXS(xs, children)} lg={setXS(xs, children)} sx={{ display: 'flex', alignItems:'flex-start', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
      <LabelTitleComponent {...props} />
      <InputData className='calculator-data'>{trimString(data) && TypeHandlers(contentFormatter, data, contentUnit)}</InputData>
    </Grid>
  )
}

export default CalculatorComponent

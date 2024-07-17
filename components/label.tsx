import React from 'react'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import LabelTitleComponent from './label-title'
import { styled } from '@mui/material/styles'
import { type FieldProps } from '../FormField'
import { setXS, TypeHandlers, transformData } from '../hooks/useDependableRules'

const InputData = styled('div')({
  color: '#0F1012',
  fontFamily: 'Nunito Sans',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '700',
  width: '100%',
  maxWidth: '85vw'
})

const SingleLine = styled('span')({
  overflow: 'hidden',
  width: '90%',
  height: '100%',
  display: 'block',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const LabelComponent = (props: FieldProps): any => {
  const { label = '', data = '', xs, children, isMultiLine, contentFormatter, isForm, onChange  } = props;
  let value = data;
  if (contentFormatter !== undefined) {
    value = TypeHandlers(contentFormatter, data)
  }
  value = transformData(value)
  
 
  const labelValue = Array.isArray(value) ? value.join(', ') : value
  return (
    <Grid item xs={setXS(xs, children)} md={setXS(xs, children)} lg={setXS(xs, children)} sx={{ display: 'flex', flexDirection: 'column', gap: isForm === false ? '0px' : '10px', marginTop: isForm === false ? '0px' : '1rem' }}>
      <LabelTitleComponent {...props}/>
      <Tooltip placement="top-start" title={labelValue}>
        {isMultiLine === true
          ? <InputData>{labelValue}</InputData>
          : <InputData style={{lineHeight: isForm === false ? 'normal' : '40px'}}><SingleLine>{labelValue}</SingleLine></InputData>
        }
      </Tooltip>
    </Grid>
  )
}

export default LabelComponent

import React from 'react';
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import DatePicker from '@albertsons/uds/molecule/DatePicker'
import LabelTitleComponent from './label-title'
import { setXS, evaluateExpr } from '../hooks/useDependableRules'
import moment from 'moment'

const SupAstrix = styled('sup')({
  color: '#E53014',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'Nunito Sans',
  lineHeight: '16px',
  position: 'relative',
  top: '1px'
})

const DateComponent = (props) => {
  const { dataKey, data, label, placeholder, dependableData = {}, onChange, maxDate = true,  xs, conditionalReadonly, children, isReadOnly, error, validation } = props;
  let readOnly = isReadOnly;
  let maxDateFlg = maxDate ? new Date() : '' 
  if (conditionalReadonly) {
    readOnly = evaluateExpr(conditionalReadonly, dependableData);
  } 

  const handleDateChange = (selectedDate: string) => {
   
    if(selectedDate){
      const dateString = selectedDate && moment(selectedDate).format('YYYY-MM-DD')
      onChange(dateString, dataKey)
    }
    
  }

  return (
    <Grid item xs={setXS(xs, '')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', marginTop: '1rem' }}>
      <LabelTitleComponent {...props} />
      <DatePicker className='dateField'
      maxDate={maxDateFlg}
      value={[data]}
      disabled={readOnly}
      onChange={(selectedDate) => handleDateChange(selectedDate.toString())}
      placeholder={placeholder} />
    </Grid>
  )
}

export default DateComponent
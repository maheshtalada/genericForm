import React from 'react'
import { type FieldProps } from '../FormField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import DatePicker from '@albertsons/uds/molecule/DatePicker'
import { setXS } from '../hooks/useDependableRules'
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

const DatePickerComponent = (props: FieldProps) => {
    const { dataKey, data, label, placeholder, onChange, xs, children, error, validation, isReadOnly } = props
  let required = false
  if (validation && Array.isArray(validation) && (validation.length > 0)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    validation.forEach(v => {
      if (v.type === 'required') {
        required = true
      }
    })
  }

  const handleDateChange = (selectedDate: string) => {
    if (selectedDate) {
      const dateString = selectedDate && moment(selectedDate).format('YYYY-MM-DD HH:mm:ss.SSSSSSS Z')
      onChange(dateString, dataKey)
    }
  }

  return (
    <Grid item xs={setXS(xs, '')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', marginTop: '1rem' }}>
      <Typography component={'div'} sx={{
        color: '#7C7575',
        fontFamily: 'Nunito Sans',
        fontSize: '11px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '15px',
        textTransform: 'uppercase'
      }}>{label} {required && <SupAstrix>*</SupAstrix>}</Typography>
      <DatePicker className='dateField'
      value={[data]}
      onChange={(selectedDate) => handleDateChange(selectedDate.toString())}
      placeholder={placeholder} />
    </Grid>
  )
}

export default DatePickerComponent
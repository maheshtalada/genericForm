import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LabelTitleComponent from './label-title'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { ReactComponent as Clear } from 'assets/closeimage.svg'
import { type FieldProps } from '../FormField'
import { setXS, trimString } from '../hooks/useDependableRules'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

const SupAstrix = styled('sup')({
  color: '#E53014',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'Nunito Sans',
  lineHeight: '16px',
  position: 'relative',
  top: '1px'
})

const InputComonent = (props: FieldProps): any => {
  const { dataKey, data, label, placeholder, onChange, xs, children, error, validation, isReadOnly, isForm, isMultiLine } = props;
  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', marginTop: isForm === false ? '0' : '1rem' }}>
      <LabelTitleComponent {...props}/>
      <TextField id="standard-basic"
      fullWidth
      className={`w-80 inputGenericField ${error ? 'text-error' : ''}`}
      onChange={(e) => onChange(e.target.value, dataKey)}
      value={data}
      multiline={isMultiLine}
      maxRows={2}
      name='inputName'
      disabled={isReadOnly}
      placeholder={typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}`}
      error={error !== undefined}
      helperText={Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', alignItems: 'center' }} >
      {error}</Box>)}
      InputProps={{
        endAdornment: data && !isReadOnly && (
          <InputAdornment position="end">
            <IconButton
              aria-label='clear input'
              onClick={() => onChange('', dataKey)}
              edge="end"
            >
              <Clear style={{ width :'16px', height: '16px'}} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: true,
        disableAnimation: true
      }}
    />
    </Grid>
  )
}

export default InputComonent

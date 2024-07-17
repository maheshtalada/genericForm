import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import Image from '@albertsons/uds/molecule/Image'
import { type FieldProps } from '../FormField'
import { setXS, trimString } from '../hooks/useDependableRules'
import clearicon from 'assets/closeimage.svg'

const SupAstrix = styled('sup')({
  color: '#E53014',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'Nunito Sans',
  lineHeight: '16px',
  position: 'relative',
  top: '1px'
})

const AutoCompleteComonent = ({ dataKey, data, label, options = [], placeholder, onChange, xs, children, error, validation, isReadOnly, isForm, isNotSort = false }: FieldProps): any => {
  const [selectedValue, setSelectedValue] = React.useState<{ label: string, value: string }>() 
  const [inputValue, setInputValue] = React.useState('')
  let sortedOptions
  if(!isNotSort) {
    sortedOptions = [...options].sort((a, b) => a.label.localeCompare(b.label))
  } else {
    sortedOptions = [...options]
  }
  const hint = React.useRef('')
  let required = false
  let maxLength
  if (validation && Array.isArray(validation) && (validation.length > 0)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    validation.forEach(v => {
      if (v.type === 'required') {
        required = true
      }
      if (v.type === 'maxLength') {
        maxLength = v.value
      }
    })
  }

  React.useEffect(() => {
    if (data && sortedOptions.length > 0) {
      const appVal = sortedOptions.filter(option => String(option.label).toLowerCase() === String(data).toLowerCase())[0]
      if (appVal) {
        setSelectedValue(appVal)
        setInputValue(appVal.label)
      }
    } else {
      setSelectedValue({ label: '', value: '' })
            setInputValue('')

    }
  }, [data, sortedOptions.length])

  const getInputProps = (params: any, inputData: string): any => {
    let inputPropsValue = { ...params.InputProps }
    if (inputData === '') {
      inputPropsValue = {
        ...params.InputProps,
        onKeyDown: (e: any) => {
          if (e.key === 'Enter') {
            e.stopPropagation()
          }
        }
        // endAdornment: (
        //   <InputAdornment position='end'>
        //     <IconButton edge='end' sx={{ mr: '4px' }}>
        //     <Image src={searchIcon} variant='circle' hideBorder size='sm' alt='Search' width={16} height={16} ></Image>
        //     </IconButton>
        //   </InputAdornment>
        // )
      }
    }
    return inputPropsValue
  }

  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', marginTop: isForm === false ? '0' : '1rem' }}>
      <Typography component={'div'} sx={{
        color: '#7C7575',
        fontFamily: 'Nunito Sans',
        fontSize: '11px',
        fontWeight: '400',
        lineHeight: '15px',
        textTransform: 'uppercase',
        fontStyle: 'normal',
        marginRight: '13px',
        width: '100%'
      }}>{label} {required && <SupAstrix>*</SupAstrix>}</Typography>
      <Autocomplete
        disableClearable={false}
        disablePortal={true}
        readOnly={isReadOnly}
        value={options.find(v => v.label === selectedValue?.label) || {}}
        disabled={isReadOnly}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            if (sortedOptions[0]) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
              setInputValue(sortedOptions[0].label)
            }
            const appVal = sortedOptions.filter(option => option.label === inputValue)[0]
            if (appVal) {
              setSelectedValue(appVal)
              setInputValue(appVal.label)
            }
            if (hint.current !== '') {
              // setAppInputValue(hint.current)
              event.preventDefault()
            }
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          } else if ((event.key === 'Backspace') || (event.key === 'Delete')) {
            setSelectedValue({ label: '', value: '' })
            setInputValue('')
          }
        }}
        inputValue={inputValue}
        freeSolo={isForm}
        clearIcon={inputValue && <Image src={clearicon} variant='circle' alt='Search' className='clear-Icon'></Image>}
        onBlur={() => {
          hint.current = ''
        }}
        onInputChange={(e: any, newValue: any | null, reason) => {
          if (reason === 'clear') {
            setSelectedValue({ label: '', value: '' })
            setInputValue('')
          }
        }}
        filterOptions={(options, state) => {
          const displayOptions = options.filter((option) =>
            option.label
              .toLowerCase()
              .trim()
              .includes(state.inputValue.toLowerCase().trim())
          )
          sortedOptions = displayOptions
          return displayOptions
        }}
        onChange={(event: any, newValue: any | null) => {
          if (Boolean(newValue) && Boolean(newValue.value)) {
            setSelectedValue(newValue)
            setInputValue(newValue.label)
            onChange(newValue.value, dataKey)
          } else {
            setInputValue('')
            onChange('', dataKey)
          }
          hint.current = ''
        }}
        id={dataKey}
        data-testid={dataKey}
        options={sortedOptions}
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        getOptionLabel={(option: any | null) => option.label ? option.label : ''}
        sx={{ width: '95%', marginBottom: '32px' }}
        renderInput={(params) => {
          return (
            <Box sx={{ position: 'relative' }}>
              <Typography sx={{
                position: 'absolute',
                opacity: 0,
                mt: '11px',
                ml: '14.3px',
                zIndex: 9999,
                fontFamily: 'Nunito Sans',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 200,
                lineHeight: '20px'
              }}>
                {hint.current}
              </Typography>
              <TextField {...params}
                InputProps={getInputProps(params, inputValue)}
                onChange={(e) => {
                  const newValue = e.target.value
                  setInputValue(newValue)
                  const matchingOption = sortedOptions.find((option: { label: string }) =>
                    option.label.startsWith(newValue)
                  )
                  if (newValue !== '' && typeof matchingOption !== 'undefined') {
                    hint.current = matchingOption.label
                  } else {
                    hint.current = ''
                  }
                }} 
                error={error}
                helperText={Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', ml: '-14px', alignItems: 'center' }} >
                  {error}</Box>)}
                placeholder={typeof placeholder !== 'undefined' ? trimString(placeholder) : `Enter ${label}`} />
            </Box>
          )
        }}
        renderOption={(props, option) => (
          <Box component='li' sx={{ flexGrow: 1, padding: '16px', borderBottom: '1px solid var(--wires-xtra-light-grey, #EAEAEA)', '&:last-child': { border: 'none' } }} {...props}>
            <Stack
              direction='row'
              spacing={2}
              justifyContent='flex-start'
              alignItems='center'
            >
              <Typography gutterBottom variant='body2' component='div'
                sx={{
                  flexGrow: 1,
                  color: '#0F1012',
                  fontFamily: 'Nunito Sans',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '300',
                  lineHeight: 'normal',
                  letterSpacing: '0.28px',
                  textTransform: dataKey !== 'envs' ? 'capitalize': 'initial',
                  '& .MuiAutocomplete-input': {
                    fontFamily: 'Nunito Sans',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: 'normal'
                  }
                }}>
                {option.label}
              </Typography>
            </Stack>
          </Box>
        )}
      />
    </Grid>
  )
}

export default AutoCompleteComonent
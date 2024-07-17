import React, { lazy } from 'react'
import { Box, TextField, Stack, Grid, CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import Image from '@albertsons/uds/molecule/Image'
import Modal from '@albertsons/uds/molecule/Modal'
import clearicon from 'assets/closeimage.svg'
import LabelTitleComponent from './label-title'
import SolutionRequestService from 'services/componentServices'
import { debounce, findIndex } from 'lodash'
import { setXS, trimString } from '../hooks/useDependableRules'

const ConfirmSolutionModal = lazy(async () => await import('components/confirmSolutionModal/confirmSolutionModal'))

interface AppCodeDataInterface {
  appCode: string
  exists: boolean
  status: string
  appName: string
}

const AutoSuggestAppcode = (props: any): React.ReactElement => {
  const { dataKey, data, label, placeholder, children, onChange, config, xs, error, validation, isReadOnly, isForm } = props
  const defaultAppCodeData = { label: '', data: { environments: '' } }
  const [appCodeData, setAppCodeData] = React.useState<{ data: { environments: any } } | any>(defaultAppCodeData)
  const [appInputValue, setAppInputValue] = React.useState(data)
  const [loading, setLoading] = React.useState(false)
  const [, setshowAppDetails] = React.useState<boolean>(false)
  const [appcodeValue, setAppCodeValue] = React.useState<{ label: string, value: any }>({ label: '', value: '' })
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [appCodeList, setAppCodeList] = React.useState<AppCodeDataInterface[]>([])
  const [selectedModalAppCode, setSelectedModalAppCode] = React.useState<{ appCode: any; appName: string } | null>(null)
  const [, setAutocompleteBackValue] = React.useState(appcodeValue)
  const [, setSelectedAppName] = React.useState('')
  const [errorModal, setErrorModal] = React.useState(false)

  let required = false
  let maxLength
  if (validation && Array.isArray(validation) && (validation.length > 0)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    validation.forEach(v => {
      if (v.type === 'required') {
        required = true
      }
    })
  }

  React.useEffect(() => {
    fetchSolutionAppCodeList()
  }, [])

  const onCancel = () => {
    setOpen(false)
    setAppInputValue('')
    setAppCodeValue({ label: '', value: '' })
    setAutocompleteBackValue({ label: '', value: '' })
    setshowAppDetails(false)
  }

  const onContinue = () => {
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setAppInputValue(newValue)
    if (newValue.length >= 2) {
      debouncedFetchSolutionAppCodeListWithParam(newValue)
    } else {
      fetchSolutionAppCodeList()
    }
  }

  const fetchSolutionAppCodeList = (): void => {
    SolutionRequestService.getAppCodeList().then((response: any) => {
      const appCodeList = response.data.data.appCodes || []
      const sortedAppCodeOptions = appCodeList.sort((a, b) => a.appCode.localeCompare(b.appCode))
      setAppCodeList(sortedAppCodeOptions)
    }).catch((error) => {
      console.log('error', error)
    })
  }
  const emitShowAppErr = (appErr: boolean): void => {
    //props.setAppErr(appErr)
  }

  const clearInputData = (): void => {
    setAppInputValue('')
    setAppCodeValue({ label: '', value: '' })
    setErrorModal(false)
    fetchSolutionAppCodeList()
  }

  React.useEffect(() => {
    if (appInputValue === '') {
      setAppCodeData(defaultAppCodeData)
    }
  }, [appInputValue])

  const findGetAppcodeDetails = (appCodeData)=> {
    const appCodeIndex = findIndex(appCodeList, {appCode: appCodeData.appCode })
    if(appCodeIndex > -1) {
      return appCodeList[appCodeIndex]
    }
    return ''
  }
  
  const fetchSolutionAppCodeListWithParam = (appcode: string): void => {
    setLoading(true)
    SolutionRequestService.getAppCodeListWithParam(appcode)
      .then((response: any) => {
        const snowAppCodeList = response.data.data.appCodes
        const applength = snowAppCodeList.length
        if (applength === 0) {
          setErrorModal(true)
        } else {
          for(const appCode in snowAppCodeList){
            const appCodeDetails = findGetAppcodeDetails(snowAppCodeList[appCode])
            snowAppCodeList[appCode] = {...snowAppCodeList[appCode], ...appCodeDetails }
          }
          setErrorModal(false)
        }
        const defaultSelectedAppCode = snowAppCodeList.length > 0 ? snowAppCodeList[0].appName : ''
        setSelectedAppName(defaultSelectedAppCode)
        setAppCodeList(snowAppCodeList)
      })
      .catch((error) => {
        console.error('error', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const debouncedFetchSolutionAppCodeListWithParam = debounce(
    fetchSolutionAppCodeListWithParam,
  500
  )

  let appcodOptions = appCodeList.map((appCodeData: any) => ({
    label: appCodeData.appCode,
    value: appCodeData.appCode
  }))

  const onKeyDown = React.useCallback((event) => {
    if (event.key === 'Tab') {
      if (props.showAppErr === true) {
        emitShowAppErr(false)
      }
      if (appCodeList[0]) {
        setAppCodeData(appCodeList[0])
        setAppInputValue(appcodOptions[0].label)
      } else {
        emitShowAppErr(true)
      }
    } // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    else if ((event.key === 'Backspace') || (event.key === 'Delete')) {
      setAppInputValue('')
      setErrorModal(false)
      fetchSolutionAppCodeList()
    }
  }, [])

  const populateFields = (data) => {
    const keys = Object.keys(data);
    for (const key of keys) {
      onChange(data[key], key)
    }
  }

  const onAutoChange = React.useCallback((event: any, newValue: any | null) => {
    setAutocompleteBackValue(newValue)
    setAppInputValue(newValue ? newValue.label : '')
    setAppCodeValue(newValue)
    if (newValue) {
      const selectedAppCodeData = appCodeList.find((appCodeData: any) => appCodeData.appCode === newValue.value)
      const selectedIndex = appCodeList.findIndex((appCodeData: any) => appCodeData.appCode === newValue.value)
      if (selectedAppCodeData) {
        if (
          (selectedAppCodeData.status === "Approved" || selectedAppCodeData.status === "Awaiting Approval") &&
          selectedAppCodeData.exists === true
        ) {
          setOpen(true)
          setshowAppDetails(false)
          setSelectedModalAppCode({
            appCode: newValue.value,
            appName: selectedAppCodeData.appName
          })
        } else if (selectedIndex > -1) {
          setshowAppDetails(true)
          populateFields(appCodeList[selectedIndex])
        }
      }
    } else {
      setOpen(false)

    }
  }, [appcodeValue, appCodeList])

  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px', marginTop: '1rem' }}>
      <LabelTitleComponent {...props} />
      <Autocomplete
        disableClearable={false}
        disablePortal={true}
        value={appcodeValue}
        onKeyDown={onKeyDown}
        className='solutionAppcode'
        inputValue={appInputValue}
        freeSolo
        loading={loading}
        autoComplete={false}
        clearIcon={appInputValue && (<div onClick={clearInputData}><Image src={clearicon} variant='circle' alt='Clear' className='clear-Icon'></Image></div>)}
        onChange={onAutoChange}
        filterOptions={(options, state) => {
          const displayOptions = options.filter((option) =>
            option.label
              .toLowerCase()
              .trim()
              .includes(state.inputValue.toLowerCase().trim())
          )
          appcodOptions = displayOptions
          return displayOptions
        }}
        options={appcodOptions}
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        getOptionLabel={(option: any | null) => option.label ? option.label : ''}
        sx={{ width: '95%', marginTop: '7px' }}
        renderInput={(params) => {
          return (
            <Box sx={{ position: 'relative' }}>
              <TextField {...params}
              error={errorModal}
              helperText={Boolean(errorModal) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', ml: '-14px', alignItems: 'center' }}>
                Please enter a valid App Code</Box>)}
                placeholder={typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `${label}`}
                autoComplete='off'
                onChange={handleInputChange}
              />
              {loading && <CircularProgress size={18} sx={{ position: 'absolute', right: '35px', top: 'auto', bottom: '10px', transform: 'translateY(-50%)' }} />}
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
      <Modal className='solutionModal' minWidth={449} maxWidth={449} minHeight={264} maxHeight={264} isOpen={isOpen} onClose={() => setOpen(false)}>
        <ConfirmSolutionModal isOpen={false} onCancel={onCancel} onContinue={onContinue} selectedAppCode={selectedModalAppCode} />
      </Modal>
    </Grid>
  )
}

export default AutoSuggestAppcode

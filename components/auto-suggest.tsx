import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { Box, TextField, styled, Stack, Grid, CircularProgress, Chip } from '@mui/material'
import { findIndex as _findIndex, find as _find } from 'lodash'
import Typography from '@mui/material/Typography'
import clearicon from 'assets/closeimage.svg'
import Image from '@albertsons/uds/molecule/Image'
import { type FieldProps } from '../FormField'
import { setXS, trimString, getDefaultOption, extractKeysFromExpression, isObjectNotEmpty, replaceWithValues, REPLACE_EMPTY_TYPE } from '../hooks/useDependableRules'
import ComponentServices from 'services/componentServices'
import LabelTitleComponent from './label-title'
import { debounce } from 'lodash'
import { ReactComponent as Clearicon } from 'assets/deletechip.svg'
import { getReadOnlyState } from '../hooks/useBaseField'

const AutoSuggestComponent = (props: FieldProps): any => {
  const { dataKey, data = '', supportData, options = [], dependableData = {}, label, placeholder, onChange, config, xs, children, error, validation, isReadOnly, isForm, multiSelect } = props
  const getData = (data: any) => {
    if (data && multiSelect && typeof data === 'string') {
      return [data]
    }
    return data
  }
  const [inputValue, setInputValue] = React.useState<any>(getData(data))
  const [loading, setLoading] = React.useState(false)
  const stringData = JSON.stringify(dependableData)
  const [autoOptions, setAutoOptions] = React.useState<any>([])

  const readOnly = getReadOnlyState(props)

  const getOptions = (suggestions) => {
    if (!suggestions.length) return []
    if (config?.optionsConfig) {
      return suggestions.map(suggestion => ({
        label: getOptionsData(config?.optionsConfig['label'], suggestion),
        data: getOptionsData(config?.optionsConfig['value'], suggestion),
        value: getOptionsData(config?.optionsConfig['value'], suggestion),
      }))
    }
    return []
  }

  /*
    improve above logic to 
  */
  const getOptionsData = (optionData, data) => {
    if (optionData.length === 1) {
      return data[optionData]
    }
  }

  React.useEffect(() => {
    if (config?.loadData === 'onload' && isObjectNotEmpty(dependableData)) {
      fetchData()
    }
    if (config?.loadData === 'type' && inputValue) {
      const value = inputValue === 'resourceGroupSuggestions' ? '' : inputValue
      fetchData(value)
    }
  }, [stringData])

  const getCondition = React.useCallback((value) => {
    if (config?.condition) {
      if (dataKey === 'resourceGroupSuggestions') {
        if (value && config?.fields) {
          if (typeof config.condition === 'string') {
            config.condition = JSON.parse(config.condition)
          }
          config.condition[`${config?.fields}`] = { "Op.substring": value }
        }
        if (typeof config.condition === 'object') {
          config.condition = JSON.stringify(config.condition)
        }
      }
      const expressionkeys = extractKeysFromExpression(config.condition)
      return replaceWithValues(config.condition, expressionkeys, { ...dependableData, "input": value }, REPLACE_EMPTY_TYPE)
    }
  }, [config?.condition, dependableData])

  const fetchData = async (value: any = '') => {
    try {
      setLoading(true)
      const queryCondition = getCondition(value)
      if (!(config?.tableName || config?.fields || queryCondition || config?.source)) {
        return
      }
      const objArray = [
        `tableName=${config?.tableName ? config?.tableName : ''}`,
        `fields=${config?.fields ? config?.fields : ''}`,
        `condition=${queryCondition ? queryCondition : ''}`,
        `source=${config?.source ? config?.source : ''}`,
        `authType=${config?.authType ? config?.authType : ''}`,
        `authUrl=${config?.authUrl ? config?.authUrl : ''}`,
        `restUrl=${config?.restUrl ? config?.restUrl : ''}`,
        `data=${config?.data ? JSON.stringify(config.data) : ''}`,
      ]
      if (dataKey === 'resourceGroupSuggestions' && value === '' && config?.limit) {
        objArray.push(`limit=${config.limit}`)
      }
      const suggestionsResponce = await ComponentServices.getAutoSuggestData(`${objArray.join('&')}`)
      const { suggestions } = suggestionsResponce.data
      setLoading(false)
      if (suggestions && suggestions.length > 0) {
        const newState = getOptions(suggestions)
        if (newState.length > 0) {
          if (config?.defaultOption && (config?.loadData === 'onload' || (config?.loadData === 'type' && dataKey === 'resourceGroupSuggestions' && value === ''))) {
            const dataOption = _find(newState, { value: inputValue })
            if (!dataOption) {
              const defaultValue = getDefaultOption(newState, config?.defaultOption, dependableData);
              setInputValue(defaultValue)
              onChange(defaultValue, dataKey)
            }
          }
          setAutoOptions(newState)
        }
      }
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  const onInputChangeHandler = React.useCallback(debounce((e: any, newValue: any, reason: any) => {
    if (reason === 'reset') return
    if (config?.loadData !== 'type') return
    if (multiSelect && reason === 'clear') return
    if (config?.minChar !== undefined && newValue.length < config?.minChar) return
    setInputValue(newValue)
    onChangeInput(newValue)
  }, 600), [])

  const onChangeInput = React.useCallback(debounce(async (value) => {
    fetchData(value)
  }, 600), [])

  const onChangeHandler = React.useCallback((e, value) => {
    let data: string | string[] = multiSelect ? [] : ''
    if (multiSelect && Array.isArray(value) && value.length > 0) {
      data = value.map(item => (item.label))
    } else if (!multiSelect && value?.data !== undefined) {
      data = value.data
    }
    setInputValue(data)
    onChange(data, dataKey)
  }, [])

  const getDefault = React.useMemo(() => {
    const dataOption = _find(autoOptions, { value: inputValue })
    return dataOption || {}
  }, [inputValue, autoOptions])

  const getExtraProps = () => {
    if (inputValue) {
      if (multiSelect) {
        if (Array.isArray(inputValue) && inputValue.length > 0) {
          inputValue.forEach((item: string) => {
            if (_findIndex(autoOptions, { label: item }) === -1) setAutoOptions([...autoOptions, { value: item, label: item }])
          })
          return { value: inputValue.map(item => ({ value: item, label: item })) }
        } else {
          return { value: [] }
        }
      }
      return { value: getDefault }
    }
    return {}
  }

  const extraProps = getExtraProps()

  const ChipWrapper = (tagProps: any) => {
    const { index, tag } = tagProps
    const [isExpanded, setExpanded] = React.useState<boolean>(false)
    return (
      <Chip
        {...tagProps}
        key={index}
        label={tag}
        deleteIcon={<Clearicon />}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        sx={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: isExpanded ? '100% !important' : '280px !important',
          margin: '1px !important',
          transition: 'all 0.5s ease',
          borderRadius: '8px',
          background: '#BCDFFD',
          fontFamily: 'Nunito Sans',
          color: '#000',
          padding: '8px 0',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '16px',
          '.MuiChip-label': {
            padding: '0 6px'
          },
          '.MuiChip-deleteIcon': {
            margin: '0 6px 0 -3px'
          }
        }}
      />
    )
  }

  const getClassName = (): string => {
    let className = ''
    if (props?.className) {
      className = props.className
    }
    if (config?.className) {
      className += ` ${config.className}`
    }
    if (Boolean(multiSelect)) {
      className += ` auto-suggest-multi`
    }
    if (Boolean(readOnly)) {
      className += ' auto-suggest-readonly'
    }
    return className.trim()
  }

  const renderAutocomplete = () => {
    return (<Autocomplete
      className={getClassName()}
      multiple={Boolean(multiSelect)}
      key={`${dataKey}-${getDefault?.value}`}
      {...extraProps}
      disableClearable={false}
      disablePortal={true}
      readOnly={readOnly}
      freeSolo
      autoComplete={false}
      loading={loading}
      clearIcon={inputValue && <Image src={clearicon} variant='circle' alt='Search' className='clear-Icon' />}
      onInputChange={onInputChangeHandler}
      onChange={onChangeHandler}
      id={dataKey}
      data-testid={dataKey}
      options={autoOptions}
      isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      getOptionLabel={(option: any | null) => option?.label || ''}
      sx={{ width: '95%' }}
      renderTags={(value: readonly string[], getTagProps) => (multiSelect && <Grid className={config?.isHorizontalScroll && 'enable-horizontal-scroll-tags'} item xs={12} sx={{ margin: '10px 20px 10px 0', maxWidth: '95% !important', overflowX: 'auto' }}>
        {
          value.map((option: any | null, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <ChipWrapper key={String() + '-tag'} tag={option?.label} index={index} value={[...value]} {...tagProps} />
            );
          })
        }
      </Grid>)
      }
      renderInput={(params) => {
        return (<Box sx={{ position: 'relative' }}>
          <TextField {...params}
            error={error}
            helperText={Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', ml: '-14px', alignItems: 'center' }} >
              {error}</Box>)}
            placeholder={typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `${label}`} />
          {loading && <CircularProgress size={18} sx={{ position: 'absolute', right: '35px', top: 'auto', bottom: '10px', transform: 'translateY(-50%)' }} />}
        </Box>
        )
      }}
      renderOption={(props, option: any | null) => (
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
              {option?.label}
            </Typography>
          </Stack>
        </Box>
      )}
    />)
  }

  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: isForm === false ? '0px' : '10px', marginTop: isForm === false ? '0' : '1rem' }}>
      <LabelTitleComponent {...props} />
      {renderAutocomplete()}
    </Grid>
  )
}

export default AutoSuggestComponent

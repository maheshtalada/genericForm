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
import { Chip } from '@mui/material'
import { ReactComponent as Clearicon } from 'assets/deletechip.svg'
import { getReadOnlyState } from '../hooks/useBaseField'

const CurrentServicesDiv = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '10px',
  alignSelf: 'stretch',
  borderRadius: '4px',
  marginBottom: '24px',
  background: '#FFFFFF',
  width: '98%',
  maxWidth: '98%'
})

const InputComonent = (props: FieldProps): any => {
  const { dataKey, data, label, placeholder, onChange, xs, children, error, validation, isReadOnly, isForm, isMultiLine, multiSelect, config } = props;
  const readOnly = getReadOnlyState(props)
  const getInputValue = (data: string) => {
    if (multiSelect) {
      return ''
    }
    return data
  }
  const [inputValue, setInputValue] = React.useState<string>(getInputValue(data))
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])
  const [isHorizontalScroll, setHorizontalScroll] = React.useState<boolean>(config?.isHorizontalScroll || false)

  React.useEffect(() => {
    if (multiSelect && data && data.length > 0) {
      if (Array.isArray(data)) {
        setSelectedValues([...data])
      } else if (typeof data === 'string') {
        setSelectedValues([data])
      }
    }
  }, [])

  const onChangeHandler = (e) => {
    try {
      let data = e?.target?.value || ''
      setInputValue(data)
      if (!multiSelect) {
        onChange(data, dataKey)
      }
      if (multiSelect && data && (e?.key === 'Enter')) {
        const index = selectedValues.findIndex(val => (val === data))
        if (index === -1) {
          setSelectedValues(prev => ([...prev, data]))
          setInputValue('')
          onChange([...selectedValues, data], dataKey)
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleRemoveFilter = (tag: string) => {
    if (tag) {
      const index = selectedValues.findIndex(val => (val === tag))
      if (index !== -1) {
        selectedValues.splice(index, 1)
        setSelectedValues([...selectedValues])
        if (selectedValues.length > 0) {
          onChange([...selectedValues], dataKey)
        } else {
          onChange('', dataKey)
        }
      }
    }
  }

  const getInputTagsClasses = (): string => {
    let classNames = ''
    if (multiSelect) {
      classNames = 'display-tags'
      if (isHorizontalScroll) {
        classNames += ' enable-horizontal-scroll-tags'
      }
    }
    return classNames
  }

  const showSelectedTags = (tags: string[]) => {
    return <CurrentServicesDiv className={getInputTagsClasses()}>
      {tags?.map((tag, index) => (
        <ChipWrapper key={String(index) + '-tag'} tag={tag} index={index} />
      ))}
    </CurrentServicesDiv>
  }

  const ChipWrapper = ({ tag, index }) => {
    const [isExpanded, setExpanded] = React.useState<boolean>(false)
    const labelRef = React.useRef<HTMLSpanElement>(null)

    const handleMouseLeave = () => {
      setExpanded(false)
      if (labelRef.current) {
        labelRef.current.scrollLeft = 0
      }
    }
    const getByLabelText = (tag: string) => {
      if (tag && tag.length > 0) {
        if (config?.isTagLink) {
          let link = tag
            if (tag.includes('www.') || tag.includes('http')) {
              link = tag.match(/(www.|http:|https:)+[^\s]+[\w]/g)?.[0] ?? ''
              if (link && link.startsWith('www.')) {
                link = `https://${link}`
              }
            }
          return (<a href={link} style={{color: '#000'}} target='_blank' rel='noreferrer'>{tag}</a>)
        }
        if (tag.length > 150) {
          setHorizontalScroll(true)
        }
        return tag
      }
    }

    return (
      <Chip key={index}
        label={<Box
          component='span'
          ref={labelRef}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={handleMouseLeave}
          sx={{
             display: 'block',
             overflow: 'hidden',
            textOverflow: isExpanded ? 'unset' : 'ellipsis',
            transition: 'max-width 0.5s ease',
          }}
        >
          {tag && getByLabelText(tag)}
        </Box> }
        deleteIcon={<Clearicon />}
        sx={{
          transition: 'all 0.5s ease',
          borderRadius: '8px',
          background: '#BCDFFD',
          maxWidth: '100%',
          fontFamily: 'Nunito Sans',
          color: '#000',
          padding: '8px 0',
          height: 'auto',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '16px',
          '.MuiChip-label': {
             whiteSpace: isExpanded ? 'normal' : 'nowrap',
             maxWidth: isExpanded ? '97%' : '280px',
          },
          '.MuiChip-deleteIcon': {
            margin: '0 6px 0 -3px'
          },
        }}
        onDelete={() => handleRemoveFilter(tag)} />
    )
  }

  return (
    <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', marginTop: isForm === false ? '0' : '1rem' }}>
      <LabelTitleComponent {...props} />
      <TextField id="standard-basic"
        fullWidth
        className={`w-80 inputGenericField ${error ? 'datefield-error-outline' : ''}`}
        onChange={(e) => onChangeHandler(e)}
        onKeyUp={(e) => onChangeHandler(e)}
        value={inputValue}
        multiline={isMultiLine}
        maxRows={2}
        name='inputName'
        disabled={readOnly}
        placeholder={typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}`}
        error={error !== undefined}
        helperText={Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', alignItems: 'center' }} >
          {error}</Box>)}
        InputProps={{
          endAdornment: data && !readOnly && (
            <InputAdornment position="end">
              <IconButton
                aria-label='clear input'
                onClick={() => onChangeHandler('')}
                edge="end"
              >
                <Clear style={{ width: '16px', height: '16px' }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
          disableAnimation: true
        }}
      />
      {selectedValues.length > 0 && showSelectedTags(selectedValues)}
    </Grid>
  )
}

export default InputComonent

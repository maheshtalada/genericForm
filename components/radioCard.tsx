import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Chip from '@mui/material/Chip'
import { type FieldProps } from '../FormField'
import LabelTitleComponent from './label-title'
import { LABELS } from 'constants/constants'
import { TypeHandlers, setXS, trimString } from '../hooks/useDependableRules'
import Check from 'assets/Checkcircle.png'
import { getReadOnlyState } from '../hooks/useBaseField'

const RadioCardComonent = (props: FieldProps): any => {
  const { data, label, xs, populate, contentUnit, onChange, showOnlyActive = false, options, dataKey, children, contentFormatter = '' } = props
  const expandedArray: boolean[] = []
  const [expanded, setExpanded] = React.useState<boolean[]>(expandedArray)
  const [optionsData, setOptionsData] = React.useState<any[]>([])

  let readOnly = getReadOnlyState(props);

  React.useEffect(() => {
    options.forEach(option => (option.suggested = (String(option.value).toLowerCase() === String(props.default).toLowerCase())))
    setOptionsData([...options])
  }, [0])

  React.useEffect(() => {
    const selectedOption = optionsData.find((option) => { return String(option.value).toLowerCase() === String(data).toLowerCase()})
    if (selectedOption !== undefined) {
      onChange(
        selectedOption.value,
        dataKey
      )
    }
    if (populate && selectedOption !== undefined && selectedOption.value) {
      poluateExtraFields(selectedOption)
    }
  }, [data, dataKey, optionsData])

  const poluateExtraFields = (selectedOption) => {
    if (populate && populate.length > 0 && selectedOption !== undefined) {
      populate.forEach(item => {
        if (selectedOption[item.sourceKey]) {
          const value = selectedOption[item.sourceKey]
          onChange(value, item.key)
        } else {
          onChange(selectedOption.value, item.key)
        }
      })
    }
  }

  const onChangeSelect = (option, key) => {
    onChange(option.value, key);
    if (populate && option.value) {
      poluateExtraFields(option);
    }
  }

  const handleExpand = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    let updatedExpanded: boolean[] = []
    optionsData.forEach((val: any, index: number) => {
      if (index === 0) {
        updatedExpanded = [false]
      } else {
        updatedExpanded.push(false)
      }
    })
    if (isExpanded) {
      updatedExpanded[panel] = !updatedExpanded[panel]
    }
    setExpanded([...updatedExpanded])
  }

  const renderCardDescription = (description: string): string => {
    if (description === 'None') {
      return ''
    }
    if (description?.includes(' - ')) {
      return description?.split(' - ')[0]
    }
    return description
  }

  return (
    <Grid container direction="row" item lg={data === '' ? 6 : 12} md={data === '' ? 6 : 12} sm={12} sx={{ flexDirection: 'row', display: 'flex', flexWrap: 'wrap', paddingBottom: '15px', marginTop: '1rem' }}>
      <Grid item xs={12}>
        <LabelTitleComponent {...props} />
      </Grid>
      {optionsData.map((option, i) => (
        !showOnlyActive
          ? <Grid key={option.value} item lg={setXS(xs, children)} md={setXS(xs, children)} sm={6} sx={{ paddingRight: '14px', maxWidth: '100%!important' }}>
            <Card
              style={{
                width: '100%',
                cursor: readOnly ? 'not-allowed' : 'pointer',
                boxShadow:
                  (String(option.value).toLowerCase() === String(data).toLowerCase())
                    ? '0 4px 8px 0 #bcc8e1'
                    : 'rgba(188, 200, 225, 0.3) 0px 4px 8px 0px',
                borderRadius: '8px',
                border:
                  (String(option.value).toLowerCase() === String(data).toLowerCase())
                    ? '2px solid #cee7ff'
                    : '2px solid rgba(255, 255, 255, 0.5)',
                margin: '16px 16px 0 0'
              }}
              onClick={() => {
                if (readOnly !== true) {
                  onChangeSelect(
                    option,
                    dataKey
                  )
                }
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    color: 'rgb(15, 16, 18)',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: 'normal',
                    fontFamily: 'Nunito sans',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  {trimString(option.label)}
                  {data === '' && optionsData.length === 1 &&
                    <div>
                      <img src={Check} alt='mark' />
                    </div>
                  }
                  {
                    option.suggested && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
                    <>
                      {option.displayName === 'Medium'
                        ? <Chip label={LABELS.SUGGESTED} size='small' data-testid={`suggested-chip-${option.name}`} // eslint-disable-line @typescript-eslint/restrict-template-expressions
                          sx={{ color: '#142D18', fontSize: '10px', float: 'right', position: 'absolute', fontStyle: 'normal', background: '#E9F8EA', fontWeight: '500', lineHeight: '11.5px', letterSpacing: '-0.5px', '@media (max-width: 1024px)': { position: 'relative' }, '@media (min-width: 1470px)': { position: 'relative' } }} />
                        : <Chip label={LABELS.SUGGESTED} size='small' data-testid={`suggested-chip-${option.name}`} // eslint-disable-line @typescript-eslint/restrict-template-expressions
                          sx={{ color: '#142D18', fontSize: '10px', fontStyle: 'normal', float: 'right', background: '#E9F8EA', fontWeight: '500', lineHeight: '11.5px', letterSpacing: '-0.5px' }} />
                      }
                    </>
                  }
                </Typography>
                <Typography sx={{
                  color: '#0F1012',
                  fontSize: '14px',
                  fontFamily: 'Nunito sans',
                  fontStyle: 'normal',
                  fontWeight: '300',
                  lineHeight: 'normal',
                  margin: '0 0 5px 0',
                  height: option?.description === 'None' ? '19px' : 'auto'
                }}>{renderCardDescription(option?.description)}</Typography>
                <Divider sx={{ background: '#EAEAEA', borderColor: '#EAEAEA' }} />
                <Typography
                  sx={{
                    letterSpacing: '0.00938em',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                    fontFamily: 'Nunito sans',
                    margin: '8px 0px'
                  }}
                  color="rgb(15, 16, 18)"
                >
                  {TypeHandlers(contentFormatter, option.content, contentUnit)}
                </Typography>
                <Divider sx={{ background: '#EAEAEA', borderColor: '#EAEAEA' }} />
                {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                <Accordion sx={{ boxShadow: 'none' }} expanded={expanded[`${i}`]} onChange={handleExpand(i)}>
                  <AccordionSummary
                    /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
                    expandIcon={<ExpandMoreIcon className={option.label === 'None' ? 'expand-none' : 'expand'} id={`icon${i}`} />}
                    aria-controls={`panel${i}bh-content`} /* eslint-disable-line @typescript-eslint/restrict-template-expressions */
                    id={`panel${i}bh-header`} sx={{ p: 0, '& .Mui-expanded': { m: 0 } }} /* eslint-disable-line @typescript-eslint/restrict-template-expressions */
                    /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
                    data-testid={`accordion-button-${i}`}>
                    <Typography sx={{ width: option.label === 'None' ? 'auto' : '33%', flexShrink: 0, fontSize: '14px', fontWeight: '600', color: '#0F1012', fontFamily: 'Nunito sans' }}>
                      {option.label === 'None' ? LABELS.DETAILS_NA : LABELS.DETAILS}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Typography sx={{ fontSize: '12px', fontFamily: 'Nunito sans', fontWeight: 300 }}>{option.details}</Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
          : (String(option.value).toLowerCase() === String(data).toLowerCase()) &&
          <Grid>
            <Card
              style={{
                width: '100%',
                border: '1px solid var(--wires-med-grey, #C0C0C0)',
                borderRadius: '8px',
                margin: '16px 16px 0 0'
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    color: 'rgb(15, 16, 18)',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: 'normal',
                    fontFamily: 'Nunito sans',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  {trimString(option.label)}
                  {data === '' && optionsData.length === 1 &&
                    <div>
                      <img src={Check} alt='mark' />
                    </div>
                  }
                  {
                    option.suggested && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
                    <>
                      {option.displayName === 'Medium'
                        ? <Chip label={LABELS.SUGGESTED} size='small' data-testid={`suggested-chip-${option.name}`} // eslint-disable-line @typescript-eslint/restrict-template-expressions
                          sx={{ color: '#142D18', fontSize: '10px', float: 'right', position: 'absolute', fontStyle: 'normal', background: '#E9F8EA', fontWeight: '500', lineHeight: '11.5px', letterSpacing: '-0.5px', '@media (max-width: 1024px)': { position: 'relative' }, '@media (min-width: 1470px)': { position: 'relative' } }} />
                        : <Chip label={LABELS.SUGGESTED} size='small' data-testid={`suggested-chip-${option.name}`} // eslint-disable-line @typescript-eslint/restrict-template-expressions
                          sx={{ color: '#142D18', fontSize: '10px', fontStyle: 'normal', float: 'right', background: '#E9F8EA', fontWeight: '500', lineHeight: '11.5px', letterSpacing: '-0.5px' }} />
                      }
                    </>
                  }
                </Typography>
                <Typography sx={{
                  color: '#0F1012',
                  fontSize: '14px',
                  fontFamily: 'Nunito sans',
                  fontStyle: 'normal',
                  fontWeight: '300',
                  lineHeight: 'normal',
                  margin: '0 0 5px 0',
                  height: option?.description === 'None' ? '19px' : 'auto'
                }}>{renderCardDescription(option?.description)}</Typography>
                <Divider sx={{ background: '#EAEAEA', borderColor: '#EAEAEA' }} />
                <Typography
                  sx={{
                    letterSpacing: '0.00938em',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                    fontFamily: 'Nunito sans',
                    margin: '8px 0px'
                  }}
                  color="rgb(15, 16, 18)"
                >
                  {TypeHandlers(contentFormatter, option.content, contentUnit)}
                </Typography>
              </CardContent>
            </Card></Grid>
      ))
      }
    </Grid>
  )
}

export default RadioCardComonent

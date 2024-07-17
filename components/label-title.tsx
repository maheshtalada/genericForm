import React from 'react'
import Tooltip from '@albertsons/uds/molecule/Tooltip'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material/styles'
import { type FieldProps } from '../FormField'
import { trimString } from '../hooks/useDependableRules'
import { LABELS } from 'constants/constants'
import useApprovedDataObject from 'hooks/useApprovedDataObject'

const SupAstrix = styled('sup')({
  color: '#E53014',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'Nunito Sans',
  lineHeight: '16px',
  position: 'relative',
  top: '1px'
})

const LabelTitleComponent = (props: FieldProps): any => {
  const { selectValue, dateValue, defaultValues } = useApprovedDataObject()
  const { label = '', tooltip, validation } = props
  let hasUpdatedData = false
  let tooltipData = tooltip ? `<span>${trimString(tooltip)}</span>` : ''
  let required = false

  if (validation && Array.isArray(validation) && (validation.length > 0)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    validation.forEach(v => {
      if (v.type === 'required') {
        required = true
      }
    })
  }

  const getApprovedValues = (propsData: {props: any, index: number}): string => {
    let data = ''
    if (propsData?.props?.type) {
      switch(propsData.props.type) {
        case 'select': 
          data = selectValue(propsData)
          break
        case 'date':
          data = dateValue(propsData)
          break
        default:
          data = defaultValues(propsData)
      }
    }
    return data ? data : 'None'
  }

  if (props?.updatedData) {
    const index = props.updatedData.findIndex(data => (data.key === props.dataKey))
    if (index > -1) {
      const approvedData = getApprovedValues({props, index})
      if (approvedData) {
        hasUpdatedData = true
        if (tooltip && tooltip.length > 0) {
          tooltipData = `<span>${trimString(tooltip)}</span><br/><br/><span>${LABELS.COMPARISON_TOOLTIP_LABEL}  ${approvedData}</span>`
        } else {
          tooltipData = `<span>${LABELS.COMPARISON_TOOLTIP_LABEL}  ${approvedData}</span>`
        }
      }
    }
  }

  return (
    <Typography component={'div'} sx={{
      color: hasUpdatedData ? '#AB4205' : '#7C7575',
      fontFamily: 'Nunito Sans',
      fontSize: hasUpdatedData ? '0.8rem': '11px',
      fontStyle: 'normal',
      fontWeight: hasUpdatedData ? '800' : '400',
      lineHeight: '15px',
      textTransform: 'uppercase'
    }}>
      <label style={{display:'inline-flex', gap:'3px'}}>
        {trimString(label)}
        {tooltipData &&
          <Tooltip className='wraptext' zIndex={10} anchor="right" variant='dark'>
            <InfoOutlinedIcon style={{ fontSize: '14px', color: '#7c7575' }}/>
            <Tooltip.Popover>
                <span className="labelTooltip" dangerouslySetInnerHTML={{ __html: tooltipData ?? '' }}></span>
            </Tooltip.Popover>
          </Tooltip>
        }
      </label>
      {required && <SupAstrix>*</SupAstrix>}
     
    </Typography>
  )
}

export default LabelTitleComponent

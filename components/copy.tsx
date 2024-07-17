
import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import CopyIcon from 'assets/copy.svg'
import { IconButton, Tooltip } from '@mui/material'
import { useCopyToClipboard } from 'hooks/useCopyToClipboard'
import LabelTitleComponent from './label-title'
import { type FieldProps } from '../FormField'
import { setXS, trimString } from '../hooks/useDependableRules'

const Value = styled('div')({
  borderRadius: '4px',
  marginRight: '20px'
})

const InputData = styled('span')({
  display: '-webkit-box'
})

const GreyDiv = styled('div')({
  background: 'rgb(249, 249, 249)',
  color: '#0F1012',
  fontFamily: 'Nunito Sans',
  fontSize: '16px',
  fontWeight: '600',
  fontStyle: 'normal',
  lineHeight: 'normal',
  textOverflow: 'ellipsis',
  padding: '16px',
  alignItems: 'center',
  alignSelf: 'stretch',
  minHeight: '24px',
  borderRadius: '4px',
  marginTop: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
})

const SingleLine = styled('span')({
  overflow: 'hidden',
  width: '90%',
  height: '100%',
  display: 'block',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})


const CopyComponent = (props: FieldProps): any => {
  const { label, data, xs, children, isMultiLine, isReadOnly } = props
  const [value, copy] = useCopyToClipboard()
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)
  const [subscriptionName, setSubscriptionName] = React.useState<string | string[]>(data)

  React.useEffect(() => {
    if (Array.isArray(data) && data.length) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      setSubscriptionName(data[0])
    } else if (typeof data === 'string' && data.includes(',')) {
      setSubscriptionName(data.split(',')[0])
    } else if (typeof data === 'string') {
      setSubscriptionName(data)
    }
  }, [data])
  return (
    <Grid item xs={setXS(xs, children)} sx={{ flexDirection: 'column', display: 'flex', marginTop: '1rem' }}>
      {isReadOnly ? '' :<LabelTitleComponent {...props} />}
      <Value>
        <InputData>
          <GreyDiv>
            {isReadOnly ?
            ''
            : isMultiLine ? subscriptionName : <SingleLine>{trimString(String(subscriptionName))}</SingleLine>} { /* eslint-disable-line @typescript-eslint/strict-boolean-expressions */ }
            <Tooltip title="Text Copied to Clipboard" placement="top" open={isTooltipVisible}>
              <IconButton
                sx={{ paddingTop: '0' }}
                data-testid='copyIconButton'
                onClick={async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
                  await copy(data) // eslint-disable-line @typescript-eslint/restrict-template-expressions
                  setIsTooltipVisible(true)
                  setTimeout(() => { setIsTooltipVisible(false) }, 1500)
                }}>
                <img src={CopyIcon} alt='copy' />
              </IconButton>
            </Tooltip>
            <p style={{ display: 'none' }}>{value}</p>
          </GreyDiv>
        </InputData>
      </Value>
    </Grid>
  )
}

export default CopyComponent

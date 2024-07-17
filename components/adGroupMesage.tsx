import React from 'react'
import Grid from '@mui/material/Grid'
import Tooltip from '@albertsons/uds/molecule/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { trimString } from '../hooks/useDependableRules'
import { LABELS } from 'constants/constants'

const ADGroupMessageComponent = (props: any): any => {
    const [labelValue, setLabelValue] = React.useState<string>('')

    React.useEffect(() => {
        let data = ''
        if (props?.adGroupEnabled === false) {
            data += LABELS.AD_GROUP_DISABLED_TOOLTIP
        }
        if (props?.azureAdGroupEnabled === false) {
            if (data === '') {
                data += LABELS.AZURE_AD_GROUP_DISABLED_TOOLTIP
            } else {
                data += ' / Azure AD group'
            }
        }
        if (props?.gcpADGroupEnabled === false) {
            if (data === '') {
                data += LABELS.GCP_AD_GROUP_DISABLED_TOOLTIP
            } else {
                data += ' / GCP AD group'
            }
        }
        setLabelValue(data)
    }, [props?.adGroupEnabled, props?.azureAdGroupEnabled, props?.gcpADGroupEnabled])

    return (
        <>
            {
                (props?.adGroupEnabled === false || props?.azureAdGroupEnabled === false || props?.gcpADGroupEnabled === false) &&
                <Grid item container xs={12} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '10px', width: 'auto' }}>
                    <Grid item sx={{ position: 'relative', display:'inline-flex', gap:'3px' }}>
                        <span style={{color: '#FF5E48'}}>{LABELS.AD_GROUP_DISABLED_MESSAGE}</span>
                        <span>
                            {trimString(labelValue) &&
                                <Tooltip className='wraptext' zIndex={10} anchor="right" variant='dark'>
                                    <InfoOutlinedIcon style={{ fontSize: '14px', color: '#7c7575' }} />
                                    <Tooltip.Popover>
                                        <span className="labelTooltip">{trimString(labelValue)}</span>
                                    </Tooltip.Popover>
                                </Tooltip>
                            }
                        </span>
                    </Grid>
                </Grid>
            }
        </>

    )
}

export default ADGroupMessageComponent

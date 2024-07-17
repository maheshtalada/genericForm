import React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import type { StepIconProps } from '@mui/material/StepIcon'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import type { TooltipProps } from '@mui/material/Tooltip'
import { Grid, IconButton } from '@mui/material'
import moment from 'moment'
import CompleteIcon from 'assets/complete.svg'
import { type FieldProps } from '../FormField'
import { setXS } from '../hooks/useDependableRules'

const QontoConnector = styled(StepConnector)((props: QontoConnectorProps) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 70,
    left: 0,
    width: '90%'
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: props.disablecolor,
    borderTopWidth: 4,
    borderRadius: '18px',
    height: '4px'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: props.color
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: props.color
    }
  }
}))

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    display: 'none'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#E99E43'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#E99E43'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    display: 'none'
  }
}))
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean, active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'white',
  fontFamily: 'Nunito Sans',
  fontSize: '12px',
  fontStyle: 'normal',
  lineHeight: '16px',
  letterSpacing: '0em',
  zIndex: 1,
  color: '#000',
  width: 20,
  height: 20,
  display: 'flex',
  borderRadius: '50%',
  borderColor: '#000',
  borderWidth: '1px',
  borderStyle: 'solid',
  justifyContent: 'center',
  paddingLeft: 0,
  '& span .css-ascpo7-MuiStepLabel-root.Mui-disabled': {
    display: 'none'
  },
  alignItems: 'center',
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  ...(ownerState.active && {
    backgroundColor: 'black',
    color: 'white',
    borderStyle: 'solid',
    fontWeight: 700
  }),
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  ...(ownerState.completed && {
    backgroundColor: '#000',
    borderColor: '#000',
    color: 'white'
  })
}))

const colorlibStepIcon = (props: StepIconProps): React.ReactElement => {
  const { active, completed, className } = props
  return (
    <ColorlibStepIconRoot
      sx={{ position: 'absolute', top: 0 }}
      ownerState={{ completed, active }}
      className={className}
    >{props.icon}
    </ColorlibStepIconRoot>
  )
}

const completedIcon = (props: StepIconProps): React.ReactElement => {
  const { active, completed, className } = props
  return (
    <ColorlibStepIconRoot
      sx={{ position: 'absolute', top: 0 }}
      ownerState={{ completed, active }}
      className={className}
    >
      <IconButton
        data-testid='iconButton' >
        <img src={CompleteIcon} alt='copy' />
      </IconButton>
    </ColorlibStepIconRoot>
  )
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    backGroundColor: 'var(--tooltip-75, rgba(0, 0, 0, 0.75))',
    borderRadius: '2px 0 0 0'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--tooltip-75, rgba(0, 0, 0, 0.75))',
    padding: '6px 8px',
    borderRadius: '2px',
    color: 'var(--character-primary-inverse, #FFF )',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '22px',
    fontFamily: 'Roboto'
  }
}))

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const steps = [
  {
    status: 'Submitted',
    color: '#F3AF5D',
    disablecolor: 'rgba(243, 175, 93, 0.12)'
  },
  {
    status: 'Approved',
    color: '#45C652',
    disablecolor: 'rgba(69, 198, 82, 0.12)'
  },
  {
    status: 'Provisioning',
    color: '#318EC2',
    disablecolor: 'rgba(49, 142, 194, 0.12)'
  },
  {
    status: 'Rejected',
    color: '#DA5B5D',
    disablecolor: 'rgba(117, 117, 117, 0.15)'
  },
  {
    status: 'Cancelled',
    color: '#DA5B5D',
    disablecolor: 'rgba(117, 117, 117, 0.15)'
  },
  {
    status: 'Withdrawn',
    color: '#DDE1E5',
    disablecolor: 'rgba(117, 117, 117, 0.15)'
  },
  {
    status: 'Completed',
    color: '#757575',
    disablecolor: 'rgba(117, 117, 117, 0.15)'
  }
]

interface QontoConnectorProps {
  color: string
  disablecolor: string
}

const RequestStatus = ({ dataKey, data, onChange, xs, children }: FieldProps): React.ReactElement => {
  const [statusSteps, setstatusSteps] = React.useState<{ status: string, color: string, disablecolor: string } | any>([])
  const [statusList, setstatusList] = React.useState<{ status: string, color: string, disableColor: string } | any>([])

  const getStatusHistory = (): void => {
    switch (data.status) {
      case 'submitted':
      case 'approved':
      case 'provisioning':
        // eslint-disable-next-line no-case-declarations
        const openStatusList = [
          {
            status: 'submitted'
          },
          {
            status: 'approved'
          },
          {
            status: 'provisioning'
          },
          // {
          //   status: 'cancelled'
          // },
          {
            status: 'completed'
          }
        ]
        // eslint-disable-next-line no-extra-boolean-cast
        openStatusList.forEach((value: any, index: number) => {
          const statusHistory = data.statusHistory
          if (statusHistory.length > 0 && index <= (statusHistory.length - 1)) {
            value.owner = data.statusHistory[index].owner
            value.updatedAt = data.statusHistory[index].updatedAt
          }
        })
        setstatusList([...openStatusList])
        getAllSteps([...openStatusList])
        break
      case 'withdrawn':
      case 'completed':
      case 'rejected':
      case 'cancelled':
        setstatusList([...data.statusHistory])
        getAllSteps([...data.statusHistory])
        break
    }
  }

  const getActiveStep = (): number => {
    let stepNumber: number = statusList.findIndex((status: { status: string }) => { return status.status === data.status })
    switch (data.status) {
      case 'withdrawn':
      case 'completed':
      case 'rejected':
      case 'cancelled':
        stepNumber = stepNumber + 1
        break
    }
    return stepNumber
  }

  const getAllSteps = (statusList): any => {
    const allSteps: Array<{ status: string, color: string, disablecolor: string } | any> = []
    if (statusList.length !== allSteps.length) {
      statusList.forEach((value: any, index: number): any => {
        const statusStepper = steps.find((status, key) => capitalize(value.status) === status.status)
        allSteps.push({ ...statusStepper, ...value })
      })
      setstatusSteps([...allSteps])
    }
  }

  React.useEffect(() => {
    // getAllSteps()
    if (data?.statusHistory?.length > 0) {
      getStatusHistory()
    }
  }, [data?.status])

  return (
    <>
      {
        statusSteps.length > 0
          // eslint-disable-next-line multiline-ternary
          ? <Grid item xs={setXS(xs, children)} sx={{ paddingTop: '12px', paddingBottom: '22px', marginBottom: '3.1%' }}>
            <Stack sx={{ width: '100%' }} spacing={4} >
            <Stepper
              alternativeLabel
              connector={<ColorlibConnector />}
              sx={{
                '& .Mui-active': { fontWeight: '700!important', fontFamily: 'Nunito Sans' },
                '& .Mui-completed': { fontWeight: '700!important', fontFamily: 'Nunito Sans' },
                '& .Mui-disabled': { color: '#000', fontFamily: 'Nunito Sans' }
              }}
              activeStep={Number(getActiveStep())}
            >
              {statusSteps.map((step: { status: string, color: string, disablecolor: string, owner: string, updatedAt: string }, index: number) =>
                // eslint-disable-next-line  multiline-ternary
                statusSteps.length > index ? (
                  <Step
                    sx={{ display: 'flex', alignItems: 'flex-start', paddingLeft: 0 }}
                    key={step.status}
                  >
                    <StepLabel
                      StepIconComponent={data.status === 'completed' ? completedIcon : colorlibStepIcon}
                      sx={{
                        alignItems: 'flex-start',
                        paddingTop: 2,
                        color: '#000',
                        fontFamily: 'Nunito Sans',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: '18px',
                        letterSpacing: '0em'
                      }}
                    >
                      {capitalize(step.status)}{' '}
                      { // eslint-disable-next-line no-extra-boolean-cast
                        Boolean(step.owner)
                          ? <BootstrapTooltip title={<React.Fragment>
                            <div>{moment(step.updatedAt).format('DD MMM, HH:mm')} </div>
                            <div>{step.owner}</div>
                          </React.Fragment>}>
                            <QontoConnector
                              color={step.color}
                              disablecolor={step.disablecolor}
                            />
                          </BootstrapTooltip>
                          : <QontoConnector
                            color={step.color}
                            disablecolor={step.disablecolor}
                          />}
                    </StepLabel>
                  </Step>
                ) : null
              )}
            </Stepper>
          </Stack></Grid> : ''
      }</>
  )
}

export default RequestStatus

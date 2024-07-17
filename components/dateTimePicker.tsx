import React from 'react'
import { type FieldProps } from '../FormField'
import Grid from '@mui/material/Grid'
import { setXS, trimString } from '../hooks/useDependableRules'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import LabelTitleComponent from './label-title'
import { getReadOnlyState } from '../hooks/useBaseField'
import moment  from 'moment-timezone'
import dayjs from 'dayjs'
import { Box } from '@mui/material'

const DateTimePickerComponent = (props: FieldProps) => {
    const { dataKey, data, label, placeholder, onChange, xs, expression,  children, error, validation, isReadOnly, dependableData = {}, maxDate = true, conditionalReadonly, format = 'date', formatConfig} = props;

    const [cleared, setCleared] = React.useState<boolean>(false)
    const [pickedDate, setPickedDate] = React.useState<string>(data && moment(data).format('YYYY-MM-DD HH:mm:ss.SSSSSSS Z'))

    let readOnly = getReadOnlyState(props);
    let timezone = formatConfig && formatConfig?.convert
    let showTimezone = formatConfig && formatConfig?.showTimezone
    let sysTZ = ''

    if (showTimezone) {
        sysTZ = moment.tz.guess()
    }

    const handleDateChange = (selectedDate: string) => {
        let dateString = selectedDate
        if (selectedDate) {
           dateString = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss.SSSSSSS Z')
            switch (format) {
                case 'date':
                    dateString = moment(selectedDate).format('YYYY-MM-DD')
                    break
                case 'time':
                    dateString = moment(selectedDate).format('HH:mm:ss')
                    break
                case 'datetime':
                    dateString = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss')
                    break
            }
            if (timezone) {
                switch (timezone) {
                    case 'GMT':
                    case 'UTC':
                        dateString = moment.utc(selectedDate).format('YYYY-MM-DD HH:mm:ss.SSSSSSS Z')
                        break
                }
            }
        }
        onChange(dateString, dataKey)
    }

    const disableWeekends = (day: any): boolean => {
        return new Date(day['$d']).getDay() === 0 || new Date(day['$d']).getDay() === 6
    }

    React.useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500)

            return () => clearTimeout(timeout)
        }
        return () => { };
    }, [cleared])

    const getValue = () => {
        if (pickedDate) {
            if (showTimezone) {
                return dayjs(moment(pickedDate).tz(sysTZ).toString())
            }
            return dayjs(pickedDate)
        }
        return null
    }

    const updateDate = (selectedDate) => {
        if (selectedDate !== null) {
            setPickedDate(selectedDate.toString())
            handleDateChange(selectedDate.toString())
        } else {
            setPickedDate('')
            handleDateChange('')
        }
    }

    return (
        <Grid item xs={setXS(xs, '')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', marginTop: '1rem' }}>
            <LabelTitleComponent {...props} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {
                    format === 'date' &&
                    <DesktopDatePicker
                        className={`dateField ${error ? 'datefield-error-outline' : ''}`}
                        disabled={readOnly}
                        shouldDisableDate={disableWeekends}
                        value={getValue()}
                        onChange={updateDate}
                        slotProps={{
                            textField: { 
                                placeholder: typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}`,
                                helperText: Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', alignItems: 'center', ml: '-14px' }} >
                                {error}</Box>)
                            },
                            field: { clearable: Boolean(pickedDate), onClear: () => setCleared(true) }
                        }}
                    />
                }
                {
                    format === 'datetime' &&
                    <DateTimePicker
                        className={`dateField ${error ? 'datefield-error-outline' : ''}`}
                        label={pickedDate ? sysTZ : typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}` }
                        disabled={readOnly}
                        shouldDisableDate={disableWeekends}
                        format={`MM/DD/YYYY hh:mm A`}
                        value={getValue()}
                        onChange={updateDate}
                        slotProps={{
                            textField: {
                                placeholder: typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}`,
                                helperText: Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', alignItems: 'center', ml: '-14px' }} >{error}</Box>)
                            },
                            field: { clearable: Boolean(pickedDate), onClear: () => setCleared(true) }
                        }}
                    />
                }
                {
                    format === 'time' &&
                    <TimePicker
                        className={`dateField ${error ? 'datefield-error-outline' : ''}`}
                        disabled={readOnly}
                        value={getValue()}
                        onChange={updateDate}
                        slotProps={{
                            textField: {
                                placeholder: typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : `Enter ${label}`,
                                helperText: Boolean(error) && (<Box component='span' sx={{ display: 'flex', color: '#FF5E48', fontFamily: 'Nunito Sans', fontSize: '12px', fontWeight: '600', alignItems: 'center', ml: '-14px' }} >{error}</Box>)
                            },
                            field: { clearable: Boolean(pickedDate), onClear: () => setCleared(true) }
                        }}
                    />
                }
            </LocalizationProvider>
        </Grid>
    )
}

export default DateTimePickerComponent
import React from 'react'
import Grid from '@mui/material/Grid'
import { type FieldProps } from '../FormField'
import CommentUser from 'assets/commentUser.svg'
import moment from 'moment'

const CommentsComponent = (props: FieldProps): any => {
  const { label = '', data = '', xs, children, isMultiLine, contentFormatter, splitValue, isForm, onChange } = props
  let value = data
  const [userColors, setUserColors] = React.useState({})

  const bgColors = ['#FFADAD', '#FFD6A5', '#D4D77C', '#88C97A', '#5EBCC5', '#A0C4FF', '#ACB11C', '#BDB2FF', '#FFC6FF', '#CB6969']

  const getInitials = (name: string): string => {
    if (name.length > 0) {
      if (name.length < 3) {
        return name.toUpperCase()
      }
    const nameParts = name.split(' ').filter(part => part && !part.startsWith('('))
    const initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    return initials
  }
  return ''
}

  const getUserColor = (userId) => {
    if (!userColors[userId]) {
      const color = bgColors[parseInt(userId, 10) % bgColors.length]
      setUserColors((prevColors) => ({ ...prevColors, [userId]: color }))
    }
    return userColors[userId]
  }

  React.useEffect(() => {
    if (value && Array.isArray(value)) {
      const newUserColors = {}
      value.forEach((d) => {
        newUserColors[d.user_id] = getUserColor(d.user_id)
      })
      setUserColors(newUserColors)
    }
  }, [value])

  const getDate = (date: any) => {
    if (moment(new Date()).format('MM/DD/yy') === moment(date).format('MM/DD/yy')) {
      return 'Today'
    } else if (moment(new Date(Date.now() - 86400000)).format('MM/DD/yy') === moment(new Date(date)).format('MM/DD/yy')) {
      return 'Yesterday'
    } else {
      return moment(date).format("MMM DD/YY")
    }
  }

  return (
    <Grid xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: isForm === false ? '0px' : '16px', marginTop: isForm === false ? '0px' : '1rem' }}>
      {
        value && Array.isArray(value) && value.length > 0 && value.map(d => {
          return (
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', padding: '12px', borderBottom: '1px solid rgb(241, 244, 249)' }}>
              <Grid item>
                <div
                  style={{
                    backgroundColor: getUserColor(d.user_id),
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}
                >
                  {getInitials(d.user_name)}
                </div>
              </Grid>

              <Grid item xs={11} sx={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: '14px', fontWeight: '700', color: 'rgb(43, 48, 60)', fontStyle: 'normal', lineHeight: '24px', gap: '5px' }}>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '98%' }}>
                  <Grid style={{ fontWeight: '400', fontSize: '13px' }}>{d.user_name}</Grid>
                  <Grid>{getDate(d.created)}{moment(d.created).format(', HH:mm')}</Grid>
                </Grid>
                <Grid item xs={12} sx={{ width: '98%' }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                {d.details ? JSON.parse(d.details).data.comments.replace(/ +/g, ' ') : ''}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          )
        })

      }

    </Grid>
  )
}

export default CommentsComponent

import React from 'react'
import Grid from '@mui/material/Grid'
import LabelTitleComponent from './label-title'
import { type FieldProps } from '../FormField'
import { setXS } from '../hooks/useDependableRules'
import moment from 'moment'

const ListComponent = (props: FieldProps): any => {
  const { label = '', data = '', xs, children } = props;
  let value = JSON.parse(data)

  return (
    <Grid item xs={setXS(xs, children)} md={setXS(xs, children)} lg={setXS(xs, children)} sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '1rem' }}>
      <LabelTitleComponent {...props} />
      {
        value && Array.isArray(value) && value.length > 0 &&
        value.map(d => (
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', fontFamily: 'Nunito Sans, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', lineHeight: '24px', gap: '5px' }}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '98%' }}>
              <Grid style={{ fontWeight: '700' }}>{d.author}</Grid>
              <Grid>{moment(new Date(Number(d.timestamp))).format('YYYY-MM-DD HH:mm:ss')}</Grid>
            </Grid>
            <Grid item xs={12} sx={{ width: '98%' }}>
              {d.comment}
            </Grid>
          </Grid>
        ))

      }
    </Grid>
  )
}

export default ListComponent

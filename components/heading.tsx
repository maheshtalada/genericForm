
import { Grid, Typography } from '@mui/material'
import React from 'react'
import { type FieldProps } from '../FormField'
import { setXS, trimString } from '../hooks/useDependableRules'

const HeadingComponent = ({ data, xs, children }: FieldProps): any => {
  return <Grid item xs={setXS(xs, children)} sx={{ margin: '0 0 32px' }}>
        <Typography sx={{
          color: '#000',
          fontFamily: 'Nunito Sans',
          fontSize: '18px',
          fontStyle: 'normal',
          fontWeight: '800',
          lineHeight: 'normal'
        }}>{trimString(data)}
      </Typography>
      </Grid>
}

export default HeadingComponent


import { Grid } from '@mui/material'
import React from 'react'
import { type FieldProps } from '../FormField'
import { setXS } from '../hooks/useDependableRules'

const HtmlContent = ({ content, className, xs, children }: FieldProps): any => {
  return <Grid item xs={setXS(xs, children)} sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop:  '1rem' }}>
        <div className={className} dangerouslySetInnerHTML={{ __html: content ?? '' }} />
      </Grid>
}

export default HtmlContent

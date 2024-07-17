
import React from 'react'
import Grid from '@mui/material/Grid'
import { Divider } from '@mui/material'

const DividerComponent = (): any => {
  return (
        <Grid item xs={12}>
                <Divider id='divdata' sx={{
                  background: '#EAEAEA',
                  borderColor: '#EAEAEA',
                  margin: '16px 0',
                  // width: '48vw',
                  width: '98%',
                  '@media (max-width: 1440px)': {
                    width: '45vw'
                  }
                }}/>
            </Grid>
  )
}

export default DividerComponent

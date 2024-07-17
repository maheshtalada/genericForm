import React from 'react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { type FieldProps } from '../FormField'
import Grid from '@mui/material/Grid'
import { setXS } from '../hooks/useDependableRules'
import CardContent from '@mui/material/CardContent'

const CardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const CardComonent = (props: FieldProps): any => {
    const { data, label, xs, children } = props

    return (
        <Grid container direction='row' item xs={setXS(xs, children)} sx={{ flexDirection: 'row', display: 'flex', flexWrap: 'wrap', paddingBottom: '15px', marginTop: '1rem' }}>
            <Card sx={{ borderRadius: '8px', width: '100%' }}>
                <CardContainer style={{
                    padding: '20px', width: '100%', border: '2px solid #F3F3F3', borderRadius: '8px',
                    boxShadow: '0px 2px 8px 0px rgba(188, 200, 225, 0.20)'
                }}>
                    <Box className='card-section' style={{ width: '100%' }}>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data}
                        </Typography>
                        </CardContent>
                        {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
                    </Box>
                </CardContainer>
            </Card>
        </Grid>
    )
}

export default CardComonent
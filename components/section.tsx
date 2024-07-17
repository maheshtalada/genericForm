
import React from 'react'
import Typography from '@mui/material/Typography'
import { Box, Grid, Collapse} from '@mui/material'
import {AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles'
import { type FieldProps } from '../FormField'

const Section = styled('span')({
  margin: '0px',
  letterSpacing: '0.00938em',
  color: 'var(--neutrals-warm-gray, #7C7575)',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '800',
  lineHeight: 'normal',
  fontFamily: 'Nunito Sans',
  paddingTop: '12px',
  display: 'flex',
  flexDirection: 'row'
})

const fieldsetStyles = {
  borderRadius: "8px",
  padding: "16px",
  border: "1px solid #ccc",
  marginRight: "10px",
  width: "100%"
};

const legendStyles = {
  padding: "10px",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  cursor: "pointer",
  display: 'flex'
}

const SectionComponent = ({ title, children, fieldSet = true, collapsed = false, config }: FieldProps): any => {
  const [isOpen, setIsOpen] = React.useState(!collapsed)
  const toggleFieldset = () => {
    setIsOpen(!isOpen);
  };

  if(fieldSet) {
    return (
      <Box component="fieldset" sx={fieldsetStyles}> 
        <legend style={legendStyles} onClick={toggleFieldset} >
        { isOpen ? <RemoveOutlined /> : <AddOutlined />}
        &nbsp;{title}
        </legend>
        { children && 
        <Collapse in={isOpen}><Grid item sx={{ display: 'flex', flexFlow: 'wrap', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', }}>
          {children}</Grid>
        </Collapse>
        }
      </Box>
    )
  }

  return (
    <>
      {title && <Grid item xs={12}>
        <Typography variant="h4" component="div">
          <Section>
            {title}
          </Section>
        </Typography>
      </Grid>}
      {children && isOpen && <Grid className={config?.isHorizontalScroll && 'section-children'} item xs={12} sx={{ display: 'flex', flexFlow: 'wrap', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {children}
      </Grid>}
    </>
  )
}

export default SectionComponent

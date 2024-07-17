import React from 'react'
import { saveAs } from 'file-saver'
import Button from '@albertsons/uds/molecule/Button'
import Typography from '@mui/material/Typography'
import RequestService from 'services/request'

const DownloadBoilerplateComponent = (props: { templateId: number, templateName: string }): React.ReactElement => {

  const downloadZipFile = async (templateId: number) => {
    RequestService.downloadZipFile({ boilerplateCodeId: templateId }).then(response => {
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/zip' })
      const filename = response.headers.get("content-disposition").split('filename=')[1]
      // Use file-saver to save the Blob as a file
      saveAs(blob, filename)
    }).catch(error => {
      console.log('Error downloading file:', error)
    })
  }

  return <>
    {
      props.templateName &&
      <Button
        variant='secondary'
        data-testid='download'
        className='download-button'
        onClick={() => { downloadZipFile(props.templateId) }}
      >
        <Typography
          variant='body1'
          sx={{
            color: 'var(--character-primary-inverse)',
            textAlign: 'center',
            fontFamily: 'Nunito Sans',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '40px',
            opacity: '1',
            visibility: 'visible',
            textTransform: 'capitalize',
            padding: '8px',
            textWrap: 'nowrap'
          }}
        >
          {props.templateName}
        </Typography>
      </Button>
    }
  </>
}

export default DownloadBoilerplateComponent
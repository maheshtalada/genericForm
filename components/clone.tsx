
import React from 'react';
import { FieldProps } from 'components/genericForm/FormField'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@albertsons/uds/molecule/Button';
import { styled } from '@mui/material/styles';
import { LABELS } from 'constants/constants';
import { getReadOnlyState } from 'components/genericForm/hooks/useBaseField';

const Section = styled('span')({
  margin: '0px',
  letterSpacing: '0.00938em',
  color: 'var(--neutrals-warm-gray, #7C7575)',
  fontSize: '14px',
  fontWeight: '800',
  fontFamily: 'Nunito Sans',
  paddingTop: '12px',
  display: 'flex',
  flexDirection: 'row'
});

const fieldsetStyles = {
  borderRadius: "8px",
  padding: "16px",
  border: "1px solid #ccc",
  margin: "10px 10px 10px 0px",
  width: "100%"
};

interface CloneComponent {
  id: number;
  childComponent: React.ReactNode;
}

const CloneComponent = (props: FieldProps) => {
  const { dataKey, data, title, xs, children, removeComponentData, onChange, onCloneAdd } = props;
  const [cloneComponent, setCloneComponent] = React.useState<CloneComponent[]>([]);
  const [indexCount, setIndexCount] = React.useState(0);
 
  const readOnly = getReadOnlyState(props)
  
  const populateComponents = React.useCallback((cloneIndex: any, isPopulateData = false) => {
    let initialComponents: any[] = []
    let childComponents = {}
    if (children && Array.isArray(children) && children.length > 0) {
      initialComponents = React.Children.map(children, (child, index) => {
        if (child && typeof child !== 'string') {
          const childDataKey = child?.props?.dataKey;
          const elementDataKey = childDataKey?.split("(*).")?.at(-1);
          const newDataKey = childDataKey?.replace('*', cloneIndex);
          const extraProps = isPopulateData && data?.[cloneIndex]?.[elementDataKey] !== undefined ? { data: data?.[cloneIndex]?.[elementDataKey] } : {};
          if (isPopulateData) {
            onChange && data?.[cloneIndex]?.[elementDataKey] !== undefined && onChange(data[cloneIndex][elementDataKey], newDataKey)
          }
          childComponents[childDataKey] = {
            key: newDataKey
          }
          return React.cloneElement(child, {
            dataKey: newDataKey,
            key: `${newDataKey}-${cloneIndex}`,
            ...extraProps
          })
        }
      })
    }
    onCloneAdd && onCloneAdd({dataKey, index: cloneIndex, childComponent: childComponents})
    return ({ id: cloneIndex, childComponent: initialComponents });
  }, [children, data, onChange]);

  React.useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const initialComponents:any = data.map((_, index) => (populateComponents(index, true)));
      setCloneComponent(initialComponents);
      setIndexCount(data.length);
      onChange && onChange('', dataKey)
    } else {
      setCloneComponent([populateComponents(0)]);
      setIndexCount(data?.length || 1);
    }
  }, []);
 
  const addCloneComponent = React.useCallback(() => {
    setCloneComponent((prev:CloneComponent[]) => [
      ...prev,
      populateComponents(indexCount)
    ]);
    setIndexCount(prev => prev + 1);
  }, [children, dataKey, indexCount]);


  const removeComponent = (children:any) => {
    //loop through and get all the dataKeys from the children
    const dataKeys = children.childComponent.map((child:any) => child.props.dataKey);
    dataKeys?.forEach((dataKey:any) => {
      if(removeComponentData !== undefined) {
        removeComponentData(dataKey)
      }
    })
  };

  const removeCloneComponent = React.useCallback(id => {
    setCloneComponent((prev:CloneComponent[]) => {
     const removedList = prev.find((item) => item.id === id);
     setTimeout(() => { removeComponent(removedList) }, 0);
     return prev.filter((item:any) => item.id !== id)
    });
  }, []);

  const renderedClones = React.useMemo(() => {
    return (
      <Grid item xs={12} key={`index`}>
      { cloneComponent.map((component:any, index:any) => {
        return (
          <Grid item xs={12} key={component.id}>
            <Grid container paddingRight={'2rem'} sx={{position: 'relative'}}>
              {component.childComponent}
              {Boolean(readOnly) === false &&
                (<Grid sx={{display: 'flex', position: 'absolute', right: '-10px', gap: '5px', bottom: '10%', '@media (max-width: 1550px)': { bottom: '25% !important'}}}>
                {(index + 1) === cloneComponent.length && <Button className='clone_button' variant='primary' onClick={addCloneComponent}>{LABELS.ADD_MORE}</Button>}
                {cloneComponent.length > 1 && <Button className='clone_button' variant='secondary' onClick={() => removeCloneComponent(component.id)}>{LABELS.REMOVE_LAST}</Button>}
              </Grid>)
              }
            </Grid>
          </Grid>
        );
      })}
      </Grid>
    )
  }, [addCloneComponent, cloneComponent, removeCloneComponent]);
  
  
  return (
    <Box component="fieldset" sx={fieldsetStyles}>
      <Grid container spacing={2}>
        {title && (
          <Grid item xs={12}>
            <Typography variant="h4" component="div">
              <Section>{title}</Section>
            </Typography>
          </Grid>
        )}
        {renderedClones}
      </Grid>
    </Box>
  );
};

export default CloneComponent;

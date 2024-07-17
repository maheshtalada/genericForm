import React, { type ReactNode } from 'react'
import Button from '@albertsons/uds/molecule/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { isEmpty, findIndex, cloneDeep } from 'lodash'
import useComponentsArray from 'components/genericForm/hooks/useComponentsArray'
import useFlattenedObjectData from 'hooks/useFlattenedObjectData'
import { validateRules } from './hooks/useValidator'
import FormField from './FormField'
import { isComponentVisible } from './hooks/useBaseField'
import useTransformer from './hooks/useTransformPaths'
import { isObjectNotEmpty, updateAppCodeData, updateValidationRules } from './hooks/useDependableRules'
import Alert from '@albertsons/uds/molecule/Alert'
import { LABELS } from 'constants/constants'


export type ResponseDataProps = Record<string, string | boolean | number | object | string[] | null>

export interface GenericFormProps {
  children?: ReactNode
  schema: ResponseDataProps
  data: ResponseDataProps
  onSubmit?: (payload: any, event) => void
  onConfirm?: () => void
  isViewMode?: boolean
  referenceData?: any
  isSubmitRequired?: any
  isReplicateModel?: boolean
  submit?: boolean
  isShowAlert?: boolean
  initialData?: ResponseDataProps
  updatedData?: ResponseDataProps
}

export interface GenericFormContextProps {
  data?: any
  payload?: ResponseDataProps
  onChange?: (data: any, dataKey: any) => void
  isViewMode: boolean
}

export const GenericFormContext = React.createContext<GenericFormContextProps>({
  data: {},
  payload: {},
  onChange: () => { },
  isViewMode: false
})

const GenericForm = ({ data, schema, children, initialData, updatedData, isSubmitRequired = true, isShowAlert = true, isReplicateModel = false, onSubmit, onConfirm, isViewMode = false, referenceData, submit }: GenericFormProps): any => {
  const { components, flattenComponentList, portalComponents, schemaData, isDataUpdated = false } = useComponentsArray(cloneDeep(schema), referenceData, data)
  const [flattenComponents, setFlattenComponents] = React.useState<any>(flattenComponentList)
  const initialApprovedData = useFlattenedObjectData(initialData);
  const [appCodeData, setAppCodeData] = React.useState({})
  const [errorState, setErrorState] = React.useState<any>()
  
  React.useEffect(() => {
    if (isDataUpdated) {
      setAppCodeData(updateAppCodeData(flattenComponents, schemaData, {}))
    }
  }, [isDataUpdated])

  React.useEffect(() => {console.log('flattenComponents', flattenComponents)},[flattenComponents])

  const getUpdatedState = (key, value, appCodeData, flattenComponents): any => {
    const data = {
      [key]: value
    }
    return updateAppCodeData(flattenComponents, appCodeData, data)
  }

  const mandatoryComponents = React.useMemo(() => {
    return Object.values(flattenComponents).filter((component: any) => component?.validation)
  }, [flattenComponents])

  React.useEffect(() => {console.log('mandatoryComponents', mandatoryComponents)},[mandatoryComponents])

  const onSchemaChange = React.useCallback((value: any, key: any): any => {
    console.log('onSchemaChange flattenComponents', flattenComponents)
    console.log('onSchemaChange mandatoryComponents', mandatoryComponents)
    setAppCodeData((appCodeData) => {
      const updatedState = getUpdatedState(key, value, appCodeData, flattenComponents);
      const changedComIndex = findIndex(components, { key })
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (changedComIndex > -1 && components[changedComIndex].children) {
        const children = components[changedComIndex].children
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        let removeIDs: any = [];
        for (const child in children) {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (children[child]?.condition && !isComponentVisible(children[child]?.condition, updatedState)) {
            removeIDs.push(children[child]?.key);
          }
        }

        setErrorState((errorState) => {
          if (isEmpty(errorState)) {
            return errorState
          }
          for (const rId of removeIDs) {
            delete errorState[rId];
          }
          return errorState;
        })
      }

      const compIndex = findIndex(mandatoryComponents, { key })
      if (compIndex > -1) {
        const errComp: any = mandatoryComponents[compIndex];
        const rules = updateValidationRules(errComp?.validation, updatedState)
        const error = (Array.isArray(value) && value.length > 0) ? validateValueList(value, rules) : validateRules(value, rules)

        if (!error) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          setErrorState((errorState) => {
            if (errorState?.[key]) {
              delete errorState[key]
            }
            return errorState
          })
        } else if (error !== undefined) {
          setErrorState((errorState) => {
            return {
              ...errorState,
              [key]: error
            }
          })
        }
      }
      return updatedState;
    })
  }, [mandatoryComponents, flattenComponents])

  const validateValueList = (value: any[], validationRules: any): any => {
    let error;
    value.some((val) => (error = validateRules(val, validationRules)));
    return error;
  };

  const removeComponentData = React.useCallback((componentKey: any) => {
    setAppCodeData((prevData: any) => {
      delete prevData?.[componentKey]
      return prevData
    })
    setFlattenComponents((prev) => {
      delete prev?.[componentKey]
      return prev
    });
  }, [appCodeData, setAppCodeData])

  const onSchemaSubmit = React.useCallback(async (event) => {
    console.log('onSchemaSubmit flattenComponents', flattenComponents)
    console.log('onSchemaSubmit mandatoryComponents', mandatoryComponents)
    try {
      const errors = await errorValidator()
      setErrorState(errors)
      setAppCodeData((prev) => ({...prev, errorCount: Math.random()}))
    } catch (e) {
      // console.log(appCodeData, useTransformer(appCodeData))
      if ((appCodeData as any)?.errorCount) {
        delete (appCodeData as any).errorCount
      }
      onSubmit?.(useTransformer(appCodeData), event)
    }
  }, [appCodeData, mandatoryComponents])

  const errorValidator = React.useCallback(async () => {
    // takes flatten comps, appdata, errorsate
    // return new error state
    return await new Promise((resolve, reject) => {
      
      const erorrs = mandatoryComponents.reduce((errorObject: any, component: any): boolean => {
        const { key, validation, condition } = component
        const isVisible = isComponentVisible(condition, appCodeData)
        if (!appCodeData[key] && !isVisible) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          return errorObject
        }
        const value = appCodeData[key]
        const rules = updateValidationRules(validation, appCodeData)
        const error = (Array.isArray(value) && value.length > 0) ? validateValueList(value, rules) : validateRules(value, rules)
        if (error) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          return {
            ...errorObject,
            [key]: error
          }
        } else {
          delete errorObject[key];
          return errorObject
        }

      }, {})

      if (!isEmpty(erorrs)) {
        resolve(erorrs)
      }
      reject(erorrs)
    })
  }, [appCodeData, errorState])

  // useCallback
  const renderComponents = (components: any, appCodeData: any): any => {
    return components.map((component: any) => {
      return renderComponent(component, appCodeData)
    })
  }

  const onCloneAdd = React.useCallback(({dataKey, index, childComponent}) => {
    if (schema && isObjectNotEmpty(schema)) {
      let schemaComponent: any = {}
      Object.keys(schema).find((key) => {
        schemaComponent = schema[key]
        return (schemaComponent && isObjectNotEmpty(schemaComponent) && schemaComponent.key === dataKey && schemaComponent) 
      })
      if (schemaComponent?.children) {
        Object.keys(schemaComponent.children).forEach((key) => {
          const child = schemaComponent?.children?.[key]
          const childKey = child?.key
          if (childKey && childComponent[childKey] != undefined) {
            childComponent[schemaComponent.children[key].key] = {
              ...child,
              key: childComponent[childKey].key
            }
          }
        })
      }
    }
    Object.keys(childComponent).forEach((key) => {
      setFlattenComponents((prev) => ({
        ...prev,
        [childComponent[key].key]: childComponent[key]
      }))
    })
  }, [])

  // useCallback
  const renderComponent = (component: any, appCodeData: any): any => {
    return (
      <FormField {...{
        ...component,
        data: appCodeData?.[component.key],
        dataKey: component.key,
        appCodeData,
        initialData: initialApprovedData,
        updatedData,
        removeComponentData,
        onChange: onSchemaChange,
        onCloneAdd: onCloneAdd,
        error: errorState?.[component.key]
      }}>
        {component.children !== undefined && renderComponents(component.children, appCodeData)} {/* eslint-disable-line @typescript-eslint/strict-boolean-expressions */}
      </FormField>
    )
  }

  const renderScheme = React.useMemo(() => renderComponents(components, appCodeData), [components, appCodeData, errorState, flattenComponents])

  const renderPortalComponents = React.useMemo(() => renderComponents(portalComponents, appCodeData), [portalComponents, appCodeData, errorState])
  return (
    <GenericFormContext.Provider value={{ data: appCodeData, isViewMode }}>
      {!isEmpty(schema) && !isEmpty(errorState) && isShowAlert && <Alert isOpen={errorState} sticky={true} autoClose={false} dismissible={true} variant='error' size='small'>
        <div>{LABELS.VALIDATION_ERROR_LABEL}</div>
        {
          errorState // eslint-disable-line @typescript-eslint/strict-boolean-expressions
            ? Object.keys(errorState).map((error, index) => (
              <div key={index}>{errorState[error].charAt(0).toUpperCase() + errorState[error].slice(1) + ' ! \n'}</div> // eslint-disable-line @typescript-eslint/restrict-plus-operands
            ))
            : 'None'
        }
      </Alert>}
      {!isEmpty(schema) && !isEmpty(appCodeData) && renderScheme}
      {!isEmpty(schema) && !isEmpty(appCodeData) && isSubmitRequired && <Grid item xs={12} style={{ justifyContent: 'end', alignItems: 'flex-end', float: 'right', padding: '14px', display: 'flex' }}>
        <Button onClick={onSchemaSubmit} width={100}>
          <Typography
            variant='body1'
            sx={{
              color: 'var(--character-primary-inverse)',
              textAlign: 'center',
              fontFamily: 'Nunito Sans',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '22px',
              opacity: '1',
              visibility: 'visible',
              textTransform: 'capitalize',
              width: '53px',
              height: '20px'
            }}
          >
            {LABELS.CONFIGURE_INFRA_SUBMIT}
          </Typography>
        </Button>
      </Grid>}

      {!isEmpty(schema) && !isEmpty(appCodeData) && !isReplicateModel && typeof children !== 'undefined' && <Grid className='portal-component' xs={12} sx={{ position: 'absolute', bottom: '0', right: '0', width: 'calc(55vw - 25px)', '@media (min-width: 2000px)': { margin: '0 10%' } }} >
        <form onSubmit={(e) => { e.preventDefault(); onSchemaSubmit(e.nativeEvent) }}>
          <Card sx={{ backgroundColor: 'white', boxShadow: '2px -2px 8px 0px rgba(72, 72, 72, 0.1)', width: 'calc(100% + 37px)', padding: '14px 40px 12px', position: 'relative', right: '37px' }}>
            <Grid item xs={12} sx={{ display: 'flex', flexFlow: 'wrap', width: '100%', gap: '24px', alignItems: 'center', justifyContent: 'flex-end', }}>
              {portalComponents.length > 0 && renderPortalComponents}
              {children}
            </Grid>
          </Card>
        </form>
      </Grid>}
      {
        !isEmpty(schema) && isReplicateModel &&
        <Grid item xs={12} sx={{ display: 'flex', position: 'sticky', bottom: '0', background: '#fff', right: '0', flexFlow: 'wrap', width: '100%', gap: '24px', alignItems: 'center', justifyContent: 'flex-end', }}>
          <form onSubmit={(e) => { e.preventDefault(); onSchemaSubmit(e.nativeEvent) }}>
            {children}
          </form>
        </Grid>
      }
    </GenericFormContext.Provider>
  )
}

export default GenericForm

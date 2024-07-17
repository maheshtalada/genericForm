import React, { useMemo } from 'react'
import ComponentTypeIndex from 'components/genericForm/componentTypeIndex'
import useBaseFormField from 'components/genericForm/hooks/useBaseField'

export interface FieldProps {
  type: string
  title?: string
  label?: string
  data?: any
  dataKey?: any
  default?: any
  condition?: string
  appCodeData: any
  xs?: any
  children?: any
  options?: any
  onChange: (data: any, dataKey: any) => void
  contentFormatter?: any
  error?: any
  validation?: any
  content?: string | TrustedHTML
  className?: string
  placeholder?: string
  isReadOnly?: boolean
  isNotSort?: boolean
  isMultiLine?: boolean
  expression?: any
  populate?: any
  variables?: any
  portal?: any
  contentUnit?: any
  splitValue?: any
  maxDate?: any
  conditionalReadonly?: any
  showOnlyActive?: boolean
  tooltip?: any
  isForm?: boolean
  config?: any
  supportData?: any
  dependableData?: any
  defaultOption?: any
  minRows?: number
  maxRows?: number
  format?:string
  formatConfig?: any
  initialData?: any
  updatedData?: any,
  compareData?: string
  fieldSet?: boolean
  collapsed?: boolean
  multiSelect?: boolean
  removeComponentData?: (dataKey: any) => void
  onCloneAdd?: (dataKey: any) => void
}

const FormField = (props: FieldProps): any => {
  const { type, data, dataKey, error, children } = props
  const { isVisible, dependableData } = useBaseFormField({ ...props })
  return useMemo(() => {
    const FormComponent = ComponentTypeIndex?.[type]
    if (!FormComponent) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      return null
    }

    if (!isVisible) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      return null
    }
    return <FormComponent {...props} dependableData={dependableData || ''}/>
  }, [type, dataKey, data, isVisible, error, dependableData])
}

export default FormField
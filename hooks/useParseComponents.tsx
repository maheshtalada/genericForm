import { useMemo } from 'react'
import { type ResponseDataProps } from '../genericFormComponent'
import { referenceOptions } from './useDependableRules'

const useComponentsArray = (schema: ResponseDataProps, referenceData: ResponseDataProps): any => {
  const data = useMemo(() => {
    const flttenComps = {}
    const compObjToArray = (schema: any): any => {
      return Object.keys(schema).map((field: any) => {
        if (schema[field].optionsReferenceId && !schema[field].options) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          schema[field].options = referenceOptions(referenceData, schema[field].optionsReferenceId)
          flttenComps[field] = { ...flttenComps[field], options: schema[field].options }
        }
        if (schema[field]?.children) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          schema[field].children = compObjToArray(schema[field]?.children)
          flttenComps[field] = schema[field]
          return schema[field]
        }
        if (schema[field]?.replicatePopup && schema[field]?.replicatePopupConfig) {
          schema[field].map((prop: any) => {
            schema[field][prop] = Object.keys(schema[field]?.replicatePopupConfig).find((key) => key === prop)
          
      })        }
        if (schema[field]?.confirmationPopup && schema[field]?.confirmationPopupConfig) {
          schema[field].map((prop: any) => {
              schema[field][prop] = Object.keys(schema[field]?.confirmationPopupConfig).find((key) => key === prop)
            
        })
      }
        flttenComps[field] = schema[field]
        return schema[field]
      })
    }
    return {
      components: compObjToArray(schema),
      flattenComponents: flttenComps
    }
  }, [schema])

  return { ...data }
}

export default useComponentsArray

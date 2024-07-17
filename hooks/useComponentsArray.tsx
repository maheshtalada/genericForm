import { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { type ResponseDataProps } from '../genericFormComponent'
import { referenceOptions } from './useDependableRules'

const componentsArray = (schemaJSON: ResponseDataProps, referenceData: ResponseDataProps, schemaData: any): any => {
  
  const getNestedData = (dotSeparatedKey: string, data: object)=> {
    if(!dotSeparatedKey) return '';
    const nestedKeys = dotSeparatedKey.split('.')
    return nestedKeys.reduce(
      (o: any, key) => (o && o?.[key]),
      data
    )
  }

  const updateDefaultData = (data, component)=> {
    const parsedData = getNestedData(component.key, data)
    data[component.key] = parsedData
    if(component.default && !data[component.key]) {
      data[component.key] = component.default
    } 
    return data
  }

  const ComponentData = useMemo(() => {
    let flattenComps = {}
    let data = cloneDeep(schemaData); 
    const compObjToArray = (schema: any): any => {
      return Object.keys(schema).map((field: any) => {
        if (schema[field]?.optionsReferenceId && !schema[field]?.options) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          schema[field].options = referenceOptions(referenceData, schema[field].optionsReferenceId)
        }
       
        if (schema[field]?.children) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          schema[field].children = compObjToArray(schema[field]?.children)
          data = updateDefaultData(data, schema[field])
          flattenComps[field] = schema[field]
          return schema[field]
        }

        data = updateDefaultData(data, schema[field])
        flattenComps[field] = schema[field]
        return schema[field]
      })
    }
    const allComponents = compObjToArray(cloneDeep(schemaJSON));
    let components:any = [];
    let portalComponents:any = [];
    allComponents.forEach( comp => {
      if(comp.portal) {
        portalComponents.push(comp)
      } else {
        components.push(comp)
      }
    })

    return {
      components,
      portalComponents,
      flattenComponentList: flattenComps,
      schemaData : data,
      isDataUpdated: true
    }
  }, [schemaJSON, schemaData])

  return { ...ComponentData }
}

export default componentsArray

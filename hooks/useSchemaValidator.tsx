import React from 'react'
import { ResponseDataProps } from 'components/genericForm/genericFormComponent'
import { ComponentsMap } from 'components/genericForm/componentsConfig'

export const useSchemaValidator = (schema: ResponseDataProps): any => {
    function parseComponent(component: ResponseDataProps, errorKey: string, errors: any = [], callback: any) {
        callback(component, errorKey, errors);
        Object.keys(component).forEach(key => {
            if (key !== 'options'
            && key !== 'validation'
            && key !== 'replicatePopupConfig'
            && key !== 'confirmationPopupConfig'
            && key !== 'config'
            && key !== 'supportData'
            && key !== 'splitValue'
            && key !== 'variables'
            && key !== 'children'
            && key !== 'default'
            && key !== 'keyValueFields'
            && key !== 'defaultOption'
            && key != 'populate') {
                const property = component[key] as ResponseDataProps
                if (Array.isArray(property)) {
                    property.forEach(child => {
                        parseComponent(child, key, errors, callback)
                    })
                }
                if (typeof property === 'object') {
                    parseComponent(property, key, errors, callback)
                }
            }
        })
    }

   
    const errors: any = []
    parseComponent(schema, '', errors, (component: ResponseDataProps, key: string, errorObj: any = {}) => {
        if (key) {
            const componentErrors: string[] = [];
            if (!(component && component.type)) {
                // console.log('component', component)
                componentErrors.push('type is missing')
            } else if (component && component.type && String(component.type).includes('-hidden') === false) {
                const dataTypeMap = ComponentsMap.find((e) => (e.type === component.type))
                if (dataTypeMap === undefined) {
                    // console.log('component', component)
                    componentErrors.push('type is invalid')
                }
                else {
                    if (dataTypeMap.schamvalidation?.isKeyRequired && !(component.key)) {
                        // console.log('component', component)
                        componentErrors.push('key is missing')
                    }
                    if (dataTypeMap.schamvalidation?.isLabelRequired && !(component.label)) {
                        // console.log('component', component)
                        componentErrors.push('label is missing')
                    }
                    if (dataTypeMap.schamvalidation?.isOptionsRequired && !(component.options)) {
                        // console.log('component', component)
                        componentErrors.push('options are missing')
                    }
                    if (dataTypeMap.schamvalidation?.isContentRequired && !(component.content)) {
                        // console.log('component', component)
                        componentErrors.push('content is missing')
                    }
                }
            }
            if (componentErrors.length) {
                console.log('componentErrors', componentErrors)
                const err: any = {}
                err[key] = component
                err['errors'] = componentErrors;
                errors.push(err)
            }
        }
    })
    return errors

}

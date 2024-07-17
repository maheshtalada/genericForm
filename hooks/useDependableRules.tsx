import { parse, eval as evaluate, compile } from 'expression-eval'
import { cloneDeep, isEmpty, isObject } from 'lodash'
import AzureIcon from 'assets/secure-azure-container-with-sql.svg'
import SpringIcon from 'assets/spring.svg'
import SpringBootIcon from 'assets/spring-boot.svg'
import NodejsIcon from 'assets/nodejs.svg'
import GcpIcon from 'assets/gcp.svg'
import GcpContainerIcon from 'assets/gcp-container.svg'
import NewPatternIcon from 'assets/new-pattern.svg'
import moment from 'moment'

export const REPLACE_EMPTY_TYPE = 'empty'
export const MAX_VALUE_EXPR_KEY = 'maxValueExpression'

const startIndexes  =  {
  match: 1,
  split: 0
}

export const parseExpression = (condition: string, data:any = {}): string => {
  try {
    return evaluate(parse(condition), data)
  } catch (error) {
    console.error('parseExpression', error)
  }
  return ''
}

export const evaluateExpr = (expr, data) => {
  try {
    const astFn = compile(expr);
    const value = astFn(data);
    if(!isNaN(value) || typeof value === 'string') {
      return value
    }
    return;
  } catch (error)  {
    console.error('evaluateExpr', error)
  }
}

export const extractKeysFromExpression = (expression?: string): any => {
  try {
    expression = expression ?? ''
    const pattern = /\|(.*?)\|/g
    const matches = [...expression.matchAll(pattern)]
    return matches.map(match => match[1])
  } catch (error) {
    console.error('extractKeysFromExpression', error)
  }
}

export const isObjectNotEmpty = (obj: any)=> { 
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== "") {
      return true; 
    }   
  }   
  return false
}

export const referenceOptions = (referenceData: any, referenceId: string): any => {
  if (isEmpty(referenceData)) {
    return []
  }
  return (Array.isArray(referenceData[referenceId]) ? referenceData[referenceId] : [referenceData[referenceId]]) ?? []
}

export const isCheckForCondition = (condition?: any): any => {
  const conditionToString = String(condition)
  if (/^((true|false|undefined)|)$/.test(conditionToString)) {
    return false
  }
  return true
}

export const replaceWithValues = (condition?: any, values?: any, data?: any, type?: any): any => {
  try {
    values = values.filter(value => value);
    return values.reduce((condition, value) => { // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return condition.replace(`|${value}|`, data?.[value] || '') // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    }, condition)
  } catch (error) {
    console.error('replaceWithValues', error)
  }
}

export const TypeHandlers = (type, data, unit = 'mo'): string => {
  const typeData = type
  type = (type && typeof type === 'string' && type.includes('replace:')) ? 'replace' : type;
  switch(type) {
    case 'cost':
      return `$${data}/${unit}`;
    case 'zeropad':
      if (!data) {
        return data;
      }
      return data.padStart(2, '0');
    case 'lower':
      if (data) {
        return data.toLowerCase();
      }
      return data;
    case 'upper':
      if (data) {
        return data.toUpperCase();
      }
      return data;
    case 'date':
      if (data) {
        if (moment(data).format() === 'Invalid date') {
          return moment(new Date(data.split('.')[0])).format('MM/DD/YYYY HH:mm:ss')
        }
        return moment(data).format('MM/DD/YYYY HH:mm:ss')
      }
      return data;
    case 'replace': // replace:<pattern>:<value>
      if (data && typeof data === 'string' && typeData && typeof typeData === 'string') {
        const replacementPattern: string = typeData.includes('replace:') ? typeData.split('replace:')[1] : '';
        const pattern: string = replacementPattern?.length > 0 ? replacementPattern.split(':')[0] : '';
        const value: string = replacementPattern?.length > 0 ? replacementPattern.split(':')[1] : '';
        return pattern.length > 0 && value.length > 0 ? data?.replaceAll(pattern, value) : data;
      }
      return data;
    default:
      return data;
  }
}

const searchPatterns = {
  contains(options, phrase) {
    return options && options.filter(option => option?.value && option.value.indexOf(phrase) > -1) || [];
  },
  
  match(options, phrase){
    return options && options.filter(option => option?.value === phrase) || [];
  }
}

export const getDefaultOption = (options, defaultOption: any, supportData, selectedValue?:any) => {
  try {
    if(selectedValue){
      return selectedValue
    }

    if(defaultOption?.searchPhrase && options.length > 0) {
      const searchStr = evaluateExpr(defaultOption?.searchPhrase, supportData);
      if(searchPatterns?.[defaultOption?.searchPattern]){
        const matches: any = searchPatterns[defaultOption.searchPattern](options, searchStr)
        if(matches.length > 0) {
          return matches[0].value || ''
        }
        return options[0].value || ''
      }else {
        return options[0].value
      }
    }
  } catch (error) {
    console.error('getDefaultOption', error)
  }
  return '';
}

export const setXS = (xs, children): any => {
  if (xs) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    return parseInt(xs)
  } else if (
    children && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    Object.keys(children).length > 0
    ) {
      return 12
    } else {
      return 3
    }
  }
  
  export const updateValidationRules = (rules, data): any => {
    try {
      const maxValueExprIndex = rules.findIndex( (obj)=> obj.hasOwnProperty(MAX_VALUE_EXPR_KEY))
      if(maxValueExprIndex > -1 && !rules[maxValueExprIndex].value) {
        const expr = rules[maxValueExprIndex].maxValueExpression
        const valAst = compile(expr)
        try {
          const exprValue = valAst(data)
          rules[maxValueExprIndex] = {...rules[maxValueExprIndex], value: exprValue < 0 ? exprValue : Infinity};
          return rules;
        } catch(e) {
          return rules.slice(maxValueExprIndex)
        }
      }
      return rules
    } catch (error) {
      console.error('updateValidationRules', error)
    }
  }
  
  const genrateKeyValueField = (data, fields, separator = ''): any => {
    try {
      let valuesArray: String[] = [];
      for(let i = 0; i < fields.length; i++) {
        const value = data?.[fields[i]] || evaluateExpr(fields[i], data)
        if(value){
          valuesArray.push(value)
        }
      }
      return valuesArray.join(separator)
    }catch(e){
      console.error('failed to build value for kayvaluefields list', e);
      return 'NA'
    }
  }
  
  const accessDataDynamically = (startKey: string, depth: number, data: any, captureKey?: string, captureIndex?: number)=> {
    let result = startKey;
    for (let i = 0; i < depth; i++) {
      if (captureKey && i === captureIndex) { // Capture a specific key mentioned in captureKey by updating result
        result = result + '_' + captureKey
      }
      result = data[result];
      if (result === undefined) {
        return ''; // Return empty if any key does not exist
      }
    }
    return result;
  }
  
  const populateDefaultValue = (component:any, data:any): string => {
    try {
      const {captureIndex, captureKey, populateDepth, populateDefault } = component;
      if(data[component.key]) {
        return data[component.key]
      }
      return accessDataDynamically(populateDefault, populateDepth, data, captureKey, captureIndex)
    } catch (error) {
      console.error('updateValidationRules', error)
    }
    return ''
  };

  const generateSplitValue = (splitValue:any, data:any) => {
    const { pattern, keys, method = 'match', defaultValueIndex = ''} = splitValue
      const matchList = data?.[method](pattern);
      if(!matchList || !matchList.length) return;
      if(String(defaultValueIndex)) {
        return matchList?.[Number(startIndexes[method]) + defaultValueIndex]
      }
      const populatedData = {}
      keys.forEach( (keyItem:any, index:any) => {
        let keyValue = matchList?.[Number(startIndexes[method]) + index]
        if(keyItem.default && !keyValue) {
          keyValue = keyItem.default
        } 
        const value = TypeHandlers(keyItem?.contentFormatter,keyValue)
        populatedData[keyItem.key] = value
      })
      return populatedData;
  };
  
  const generateKeyData = (component, data, defaultData): string => {
    let newValue:any = data[component.key] || component.default || '' // eslint-disable-line  @typescript-eslint/strict-boolean-expressio;
    const newObject = { ...data, ...defaultData };
    if(component.populateDefault){
      newValue = populateDefaultValue(component, { ...newObject })
    }
    
    if (component.keyValue) { // eslint-disable-line  @typescript-eslint/strict-boolean-expressions
      const expressionkeys = extractKeysFromExpression(component.keyValue)
      newValue = replaceWithValues(component.keyValue, expressionkeys, { ...newObject }, REPLACE_EMPTY_TYPE)
    }
    
    if (component.keyValueFields) { // eslint-disable-line  @typescript-eslint/strict-boolean-expressions
      newValue = genrateKeyValueField({ ...newObject, ...component?.variables},component.keyValueFields, component.separator)
    }
    
    if(component.defaultOption) {
      newValue = getDefaultOption(component.options, component.defaultOption, newObject, newObject[component.key]);
    }

    if(component.splitValue){
      const { keys, pattern, method, dataKey, defaultValueIndex } = component.splitValue;
      if((keys || defaultValueIndex) && pattern && method && dataKey) {
        newValue = generateSplitValue(component.splitValue, newObject?.[dataKey]);
      }
    }
    
    // handles mix of both direct key and key wrapped with |<key>|
    if(component.expression && !component.default) {
      newValue = component.expression;
      const expressionkeys = extractKeysFromExpression(newValue);
      const dataObj = {...newObject, variables: component.variables}
      if(expressionkeys.length){
        newValue = replaceWithValues(newValue, expressionkeys, dataObj, REPLACE_EMPTY_TYPE)
      }
      newValue = evaluateExpr(newValue, dataObj)
    }
    
    if(component.valueFormatter && newValue && typeof newValue === 'string') {
      return TypeHandlers(component.valueFormatter, newValue)
    }
    
    return newValue;
  }
  
  export const trimString = (label: string): string => typeof label === 'string' ? label.trim() : label
  
  export const transformData = (data: string) => {
    data = trimString(data)
    if (!data) {
      return 'NA'
    }
    if (data === 'true') {
      return 'Yes'
    }
    if (data === 'false') {
      return 'No'
    }
    return data
  }

  export const evalConditionExpr = (condition:string, appCodeData: any)=> {
    // extract keys
    const expressionkeys = extractKeysFromExpression(condition);
    if(expressionkeys.length > 0) {
      const expression = replaceWithValues(condition, expressionkeys, appCodeData)
      return parseExpression(expression)
    }
    return evaluateExpr(condition, appCodeData)
  }
  
  export const updateAppCodeData = (flattenComponents, appCodeData, defaultData): any => {
    const currentFieldData = cloneDeep(defaultData)
    for (const field in flattenComponents) {
      let newValue;
      if (!defaultData[flattenComponents[field].key]) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        const { condition } = flattenComponents[field]
        if (!isCheckForCondition(condition)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          newValue = generateKeyData(flattenComponents[field], appCodeData, defaultData) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        } else {
          const isVisible = evalConditionExpr(condition, { ...appCodeData, ...defaultData });
          if (isVisible) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
            newValue = generateKeyData(flattenComponents[field], appCodeData, defaultData) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
          } else {
            if (condition) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
              newValue = '';
              delete appCodeData[flattenComponents[field].key] // eslint-disable-line @typescript-eslint/no-dynamic-delete
            }
          }
        }
      }
      if(newValue !== undefined && newValue !== null) {
        if(isObject(newValue) && flattenComponents[field]?.splitValue) {
          appCodeData = {...appCodeData, ...newValue}
        }else{
          appCodeData[flattenComponents[field].key] = newValue
        }
      }
    }
    
    return {
      ...appCodeData,
      ...currentFieldData
    }
  }
  
  export const getImageData = (iconName: string): any => {
    let icon = NewPatternIcon
    switch (iconName) {
      case 'secure-azure-container-with-sql.png':
      icon = AzureIcon
      break
      case 'spring-boot-icon.png':
      icon = SpringBootIcon
      break
      case 'spring-batch-icon-new.png':
      icon = SpringIcon
      break
      case 'nodejs_icon.png':
      icon = NodejsIcon
      break
      case 'generic-gke-infrastructure.png':
      icon = GcpContainerIcon
      break
      case 'gcp-virtual-machine.png':
      icon = GcpIcon
      break
      case 'azure-virtual-machine.png':
      icon = NewPatternIcon
      break
    }
    return icon
  }
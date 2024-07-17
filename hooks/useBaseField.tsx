import { useMemo, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { type FieldProps } from '../FormField'
import {  isCheckForCondition, evalConditionExpr, evaluateExpr } from './useDependableRules'

const useBaseFormField = ({ condition, type, data, supportData, dataKey, appCodeData, splitValue }: FieldProps): any => {
  const isVisible = useMemo(() => {
    return isComponentVisible(condition, appCodeData)
  }, [condition, type, data, dataKey, appCodeData]);

  const dependableData = useMemo(()=>{
    let data: any = {};
    for( const i in supportData){
      data[supportData[i]] = (appCodeData?.[supportData[i]])?.toString();
    }
    return data
  },[type, data, dataKey, appCodeData, supportData] )

  return {
    isVisible,
    dependableData
  }
}

export const isComponentVisible = (condition, appCodeData): any => {
  if (!isCheckForCondition(condition)) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    return true
  }
  return evalConditionExpr(condition, appCodeData) 
}

export const getReadOnlyState = (props):any => {
  const {isReadOnly,  appCodeData, expression, conditionalReadonly, compareData, dependableData = '' } = props;
  let readOnly = isReadOnly;
  if (conditionalReadonly) {
    const expr = expression || conditionalReadonly;
    if(compareData){
      readOnly = props[compareData] && !isEmpty( props[compareData]) && evaluateExpr(expr,  props[compareData]);
    }else {
      const data = !isEmpty(dependableData) && dependableData || appCodeData
      readOnly = appCodeData && !isEmpty(appCodeData) && evaluateExpr(expr, data);
    }
  } 
  return readOnly
}

export default useBaseFormField
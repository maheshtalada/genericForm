import { parseExpression, extractKeysFromExpression, replaceWithValues, setXS, updateAppCodeData } from './useDependableRules'

describe('Your Utility Functions', () => {
  it('should parse expression safely', () => {
    const result = parseExpression('2 + 2')
    expect(result).toBe(4)
  })

  it('should extract keys from expression', () => {
    const keys = extractKeysFromExpression('|key1| and |key2|')
    expect(keys).toEqual(['key1', 'key2'])
  })

  it('should replace values in condition', () => {
    const condition = '|value1| and |value2|'
    const values = ['value1', 'value2']
    const data = { value1: 'foo', value2: 'bar' }
    const result = replaceWithValues(condition, values, data)
    expect(result).toBe('foo and bar')
  })

  it('should set XS value correctly', () => {
    const xsValue = setXS(5, {})
    expect(xsValue).toBe(5)
    const xsWithChildren = setXS(undefined, { child: 'value' })
    expect(xsWithChildren).toBe(12)
    const xsWithoutChildren = setXS(undefined, {})
    expect(xsWithoutChildren).toBe(3)
  })
})

describe('updateAppCodeData function', () => {
  it('should update appCodeData with flattenComponents and defaultData', () => {
    const flattenComponents = {
      field1: { key: 'field1Key', condition: '' },
      field2: { key: 'field2Key', condition: 'someCondition' }
    }

    const appCodeData = {
      field1Key: 'appCodeDataField1'
    }

    const defaultData = {
      field1Key: 'defaultDataField1',
      field2Key: ''
    }

    const expectedUpdatedData = {
      ...appCodeData,
      ...defaultData,
      field2Key: ''
    }
    const result = updateAppCodeData(flattenComponents, appCodeData, defaultData)
    expect(result).toEqual(expectedUpdatedData)
  })
})

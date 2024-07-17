// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import Validation from './useValidator'

describe('Validation', () => {
  it('should validate required field', () => {
    expect(Validation.validateRequired(true, '', 'Custom message')).toBe('Custom message')
    expect(Validation.validateRequired(false, 'test', '')).not.toBeNull()
  })

  it('should validate minimum value', () => {
    expect(Validation.validateMinValue(5, 'test', 'Custom message')).toBe(true)
    expect(Validation.validateMinValue(3, '', 'Custom message')).toBe(true)
  })

  it('should validate maximum value', () => {
    expect(Validation.validateMaxValue(10, 'test', 'Custom message')).toBe(true)
    expect(Validation.validateMaxValue(20, 'test', 'Custom message')).toBe(true)
  })

  it('should validate minimum length', () => {
    expect(Validation.validateMinLength(5, '123', 'Custom message')).toBe('Custom message###5')
    expect(Validation.validateMinLength(4, '', 'Custom message')).toBe('Custom message###4')
  })

  it('should validate maximum length', () => {
    expect(Validation.validateMaxLength(5, '12345678', 'Custom message')).toBe('Custom message###5')
    expect(Validation.validateMaxLength(5493, '', 'Custom message')).toBe(true)
  })

  it('should validate pattern', () => {
    expect(Validation.validatePattern('test', 'abc', '########')).toBe('########')
    expect(Validation.validatePattern('test', '', '########')).toBe(true)
  })

  it('validateRequired function', () => {
    expect(Validation.validateRequired(true, '', 'This field is required')).toBe('This field is required')
    expect(Validation.validateRequired(true, 'Some Value')).toBe(true)
  })

  it('validateMinValue function', () => {
    expect(Validation.validateMinValue(5, '3', 'Please enter a minimum of ### value')).toBe('Please enter a minimum of ### value###5')
    expect(Validation.validateMinValue(5, '5')).toBe(true)
    expect(Validation.validateMinValue(5, '8')).toBe(true)
  })

  it('returns true if the value is within the maximum limit', () => {
    const maxValue = 100
    const valueWithinLimit = '50'
    const result = Validation.validateMaxValue(maxValue, valueWithinLimit)
    expect(result).toBe(true)
  })

  it('returns a message if the value exceeds the maximum limit', () => {
    const maxValue = 100
    const valueExceedsLimit = '150'
    const expectedMessage = 'Please enter a minimum of ### value###100'
    const result = Validation.validateMaxValue(maxValue, valueExceedsLimit)
    expect(result).toBe(expectedMessage)
  })

  it('returns custom message if provided when the value exceeds the maximum limit', () => {
    const maxValue = 100
    const valueExceedsLimit = '150'
    const expectedMessage = 'Please enter a minimum of ### value###100'
    const result = Validation.validateMaxValue(maxValue, valueExceedsLimit)
    expect(result).toBe(expectedMessage)
  })
})

describe('Validation Class', () => {
  it('should validate required fields', () => {
    const result = Validation.validateRequired(true, '')
    expect(result).toBe('This field is required')
    const validResult = Validation.validateRequired(true, 'Some value')
    expect(validResult).toBe(true)
  })

  it('should validate minimum value', () => {
    const result = Validation.validateMinValue(5, '3')
    expect(result).toBe('Please enter a minimum of ### value###5')
    const validResult = Validation.validateMinValue(5, '8')
    expect(validResult).toBe(true)
  })
})

describe('YourClass _buildRegex method', () => {
  it('should correctly build a regular expression without flags', () => {
    const pattern = 'example'
    const regex = Validation._buildRegex(pattern)
    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toBe(pattern)
    expect(regex.flags).toBe('')
  })

  it('should correctly build a regular expression with flags', () => {
    const pattern = '/example/i'
    const regex = Validation._buildRegex(pattern)
    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toBe('example')
    expect(regex.flags).toBe('i')
  })

  it('should handle patterns without starting slash', () => {
    const pattern = 'example\\/g'
    const regex = Validation._buildRegex(pattern)
    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toBe(pattern)
    expect(regex.flags).toBe('')
  })
})

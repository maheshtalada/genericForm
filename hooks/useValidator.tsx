class Validation {
  validateRequired (isRequired: boolean, value: string, message = 'This field is required'): string | boolean {
    if (!this._required(isRequired, value)) {
      return message
    }
    return true
  }

  validateMinValue (min: number, value: string, message = 'Please enter a minimum of ### value'): string | boolean {
    if (!this._minValue(min, value)) {
      return `${message}###${min}`
    }
    return true
  }

  validateMaxValue (max: number, value: string, message = 'Please enter a minimum of ### value'): string | boolean {
    if (!this._maxValue(max, value)) {
      return `${message}###${max}`
    }
    return true
  }

  validateMinLength (length: number, value: string, message = 'Please enter a minimum of ### characters'): string | boolean {
    if (!this._minLength(length, value)) {
      return `${message}###${length}` // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    }
    return true
  }

  validateMaxLength (length: number, value: string, message = 'Please enter the maximum characters of ###'): string | boolean {
    if (!this._maxLength(length, value)) {
      return `${message} ${length < 0 ? (value.length + length) : length}`
    }
    return true
  }

  validatePattern (pattern: string, value: string, message: '########'): any {
    if (!this._testPattern(pattern, value)) {
      return message
    }
    return true
  }

  _buildRegex (pattern: any): any {
    let flags = ''
    if (pattern.indexOf('/') === 0) {
      const lastSlash = pattern.lastIndexOf('/')
      flags = pattern.substr(lastSlash + 1) // eslint-disable-line @typescript-eslint/restrict-plus-operands
      pattern = pattern.substr(1, lastSlash - 1)
    }
    return new RegExp(pattern, flags)
  }

  _toCamelCase (arr: any[]): any {
    return arr.join('-').replace(/-\w/g, (m) => m[1].toUpperCase())
  }

  _required (isRequired: boolean, value: string): boolean {
    value = String(value)
    if (isRequired && value.trim().length === 0) {
      return false
    }
    return true
  }

  _minLength (length: number, value: string): boolean {
    if (value.trim().length < length) {
      return false
    }
    return true
  }

  _minValue (min: number = 0, value: string = '0'): boolean {
    if (parseFloat(value) < parseFloat(String(min))) {
      return false
    }
    return true
  }

  _maxValue (max: number = 0, value: string = '0'): boolean {
    return !(parseFloat(value) > parseFloat(String(max)))
  }

  _maxLength (length: number, value: string): boolean {
    if(length < 0 ){
      return false
    }

    value = String(value);
    if (value.trim().length > length) {
      return false
    }
    return true
  }

  _testPattern (pattern: string, value: string): boolean {
    if (value === '') {
      return true
    }

    const regex = this._buildRegex(pattern)
    return regex.test(value)
  }

  parseRule (validationRule: { type: string, value: string, message: string }): { name: string, value: string | boolean, message: string } {
    return {
      name: this._toCamelCase(['validate', validationRule.type]),
      value: validationRule.value || true,
      message: validationRule.message || '' // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    }
  }
}

const Validator = new Validation()

export const validateRules = (value, validationRules: Array<{ type: string, value: string, message: string }>): any => {
  for (let i = 0; i < validationRules.length; ++i) {
    const rule = Validator.parseRule(validationRules[i])
    if (Validator[rule.name]) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      const results = Validator[rule.name](rule.value, value || '', rule.message)
      if (results !== true) {
        return results || 'Invalid Field Data' // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      }
    }
  }
}

export default Validator

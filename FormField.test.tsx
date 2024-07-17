import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FormField, { FieldProps } from './FormField';

describe('FormField', () => {
  const defaultProps: FieldProps = {
    type: 'text',
    title: 'Test Field',
    label: 'Test Label',
    onChange: jest.fn(),
    appCodeData: {} // Add the missing appCodeData property
  };

  it('renders the component correctly', () => {
    const { getByLabelText } = render(<FormField {...defaultProps} />);
    const inputElement = getByLabelText('Test Label');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls the onChange function when input value changes', () => {
    const { getByLabelText } = render(<FormField {...defaultProps} />);
    const inputElement = getByLabelText('Test Label');
    fireEvent.change(inputElement, { target: { value: 'Test Value' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('Test Value', undefined);
  });

  it('renders the component with a default value', () => {
    const { getByLabelText } = render(<FormField {...defaultProps} default="Default Value" />);
    const inputElement = getByLabelText('Test Label') as HTMLInputElement;
    expect(inputElement.value).toBe('Default Value');
  });

  it('renders the component with initial data', () => {
    const { getByLabelText } = render(<FormField {...defaultProps} initialData="Initial Data" />);
    const inputElement = getByLabelText('Test Label') as HTMLInputElement;
    expect(inputElement.value).toBe('Initial Data');
  });

  it('renders the component with a placeholder', () => {
    const { getByPlaceholderText } = render(<FormField {...defaultProps} placeholder="Test Placeholder" />);
    const inputElement = getByPlaceholderText('Test Placeholder');
    expect(inputElement).toBeInTheDocument();
  });
  // Add more tests here...

});
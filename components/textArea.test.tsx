import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TextAreaComponent from './textArea';

describe('TextAreaComponent', () => {
it('renders without errors', () => {
    render(<TextAreaComponent type="" appCodeData="" onChange={() => {}} />);
    // Add your assertions here
});

it('renders the label', () => {
    const label = 'Test Label';
    render(<TextAreaComponent type="" appCodeData="" onChange={() => {}} label={label} />);
    // Add your assertions here
});

it('calls the onChange callback when the value changes', () => {
    const onChange = jest.fn();
    render(<TextAreaComponent type="" appCodeData="" onChange={onChange} />);
    // Simulate a value change event
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test Value' } });
    // Add your assertions here
    expect(onChange).toHaveBeenCalledWith('Test Value', undefined);
});

  // Add more test cases as needed
});
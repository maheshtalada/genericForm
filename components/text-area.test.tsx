import { render, screen, fireEvent } from '@testing-library/react';
import InputComponent from './text-area';

describe('InputComponent', () => {
    test('renders without error', () => {
        render(<InputComponent type="text" appCodeData={[]} onChange={() => { }} />);
        // Add your assertions here
    });

    test('calls onChange when input value changes', () => {
        const onChange = jest.fn();
        render(<InputComponent type="text" appCodeData={[]} onChange={onChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test value' } });
        expect(onChange).toHaveBeenCalledWith('Test value', 'dataKey');
    });

    test('renders the label', () => {
        const label = 'Test label';
        render(<InputComponent type="text" appCodeData={[]} onChange={() => { }} label={label} />);
        const labelElement = screen.getByText('Test label');
        expect(labelElement).toBeInTheDocument();
    });

    // Add more tests here
});
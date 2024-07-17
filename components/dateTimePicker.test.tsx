import React from 'react';
import { render, screen } from '@testing-library/react';
import DateTimePickerComponent from './dateTimePicker';

describe('DateTimePickerComponent', () => {
    it('renders without crashing', () => {
        render(<DateTimePickerComponent type="datetime" appCodeData={[]} onChange={() => {}} />);
        expect(screen.getByTestId('dateTimePicker')).toBeInTheDocument();
    });

    it('displays the label title', () => {
        const label = 'Select Date and Time';
        render(<DateTimePickerComponent label={label} type="datetime" appCodeData={[]} onChange={() => {}} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('calls the onChange function when the date and time is selected', () => {
        const onChange = jest.fn();
        render(<DateTimePickerComponent type="datetime" appCodeData={[]} onChange={onChange} />);
        const dateTimePicker = screen.getByTestId('dateTimePicker');
        dateTimePicker.click();
        expect(onChange).toHaveBeenCalled();
    });

    it('renders the component with a default value', () => {
        const defaultValue = '2022-01-01 12:00:00';
        render(<DateTimePickerComponent type="datetime" appCodeData={[]} onChange={() => {}} data={defaultValue} />);
        const dateTimePicker = screen.getByTestId('dateTimePicker');
        expect(dateTimePicker).toHaveValue(defaultValue);
    });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CloneComponent from './clone';

describe('CloneComponent', () => {
  it('renders without crashing', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} />);
    expect(screen.getByTestId('clone-component')).toBeInTheDocument();
  });

  it('renders the child component', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} />);
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('calls the onChange function when input value changes', () => {
    const onChange = jest.fn();
    render(<CloneComponent type="text" appCodeData={[]} onChange={onChange} />);
    const inputElement = screen.getByLabelText('Test Label');
    fireEvent.change(inputElement, { target: { value: 'Test Value' } });
    expect(onChange).toHaveBeenCalledWith('Test Value', undefined);
  });

  it('renders the component with a default value', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} default="Default Value" />);
    const inputElement = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(inputElement.value).toBe('Default Value');
  });

  it('adds a new clone component', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} />);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    expect(screen.getAllByTestId('clone-component')).toHaveLength(2);
  });

  it('removes a clone component', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} />);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    expect(screen.getAllByTestId('clone-component')).toHaveLength(1);
  });

  it('calls the removeComponentData function when a clone component is removed', () => {
    const removeComponentData = jest.fn();
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} removeComponentData={removeComponentData} />);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    expect(removeComponentData).toHaveBeenCalled();
  });

  it('renders the component with initial data', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} initialData="Initial Data" />);
    const inputElement = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(inputElement.value).toBe('Initial Data');
  });

  it('renders the component with updated data', () => {
    render(<CloneComponent type="text" appCodeData={[]} onChange={() => {}} updatedData="Updated Data" />);
    const inputElement = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(inputElement.value).toBe('Updated Data');
  });

  // Add more tests here...

});
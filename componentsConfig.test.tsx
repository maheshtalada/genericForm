import { render } from '@testing-library/react';
import { ComponentsMap } from './componentsConfig';

describe('ComponentsMap', () => {
  it('should render all components without errors', () => {
    ComponentsMap.forEach((component) => {
        const Component = component.component;
        render(<Component type={''} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
          throw new Error('Function not implemented.')
        } } />);
    });
  });

  it('should render all components with the correct props', () => {
    ComponentsMap.forEach((component) => {
        const Component = component.component;
        render(<Component type={''} appCodeData={undefined} onChange={function (data: any, dataKey: any): void {
          throw new Error('Function not implemented.')
        } } />);
    });
  });
});
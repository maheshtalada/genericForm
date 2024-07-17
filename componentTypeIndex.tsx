import { ComponentsMap } from "components/genericForm/componentsConfig";
 
export type ComponentTypeIndexKey = Record<string, any>
 
const ComponentTypeIndex = ComponentsMap.reduce((componentObj, component) => ({...componentObj, [String(component.type)]: component.component}), {}) as ComponentTypeIndexKey
 
export default ComponentTypeIndex

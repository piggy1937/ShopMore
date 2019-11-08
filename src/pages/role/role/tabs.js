import React from 'react'
import LoadableComponent from '@/utils/LoadableComponent'
const RoleType   = LoadableComponent(import('./tableContent/roleType'), true);
const DepartmentType   = LoadableComponent(import('./tableContent/departmentType'), true);
const tabContentMaps={
   'roleType':<RoleType/>,
   'departmentType':<DepartmentType/>
}
export {tabContentMaps}
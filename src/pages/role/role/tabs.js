import React from 'react'
import LoadableComponent from '@/utils/LoadableComponent'
const RoleType   = LoadableComponent(import('./tableContent/roletype/roleType'), true);
const DepartmentType   = LoadableComponent(import('./tableContent/department/departmentType'), true);
const tabContentMaps={
   'roleType':<RoleType/>,
   'departmentType':<DepartmentType/>
}
export {tabContentMaps}
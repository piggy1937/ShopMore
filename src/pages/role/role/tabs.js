import React from 'react'
import LoadableComponent from '@/utils/LoadableComponent'
const RoleType   = LoadableComponent(import('./tableContent/roleType'), true);
const tabContentMaps={
   'roleType':<RoleType/>
}
export {tabContentMaps}
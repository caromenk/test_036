import { useEffect, useState } from 'react'
import { baseComponents } from './editorComponents/baseComponents'

import * as iconLibrary from '@mdi/js'
import { EditorStateType } from './editorController/editorState'

const getIconKeys = (elementType: any) => {
  const baseComponent = baseComponents.find((com) => com.type === elementType)
  if (!baseComponent) return { directIconKeys: [], arrayOfObjectProperties: [] }
  const properties: any =
    ('schema' in baseComponent && baseComponent?.schema?.properties) || []
  const directIconKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'icon'
  )
  const directArrayKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'array'
  )
  const arrayOfObjectProperties = directArrayKeys.map((key) => {
    const arrayProperties = properties[key].items?.[0]?.properties
    const arrayPropertyKeys = Object.keys(arrayProperties)
    const iconPropertyKeys = arrayPropertyKeys.filter(
      (key) => arrayProperties[key].type === 'icon'
    )
    return {
      key,
      properties: arrayProperties,
      propertyKeys: iconPropertyKeys,
    }
  }) // eg. key=items -> properties

  const arrayOfObjectIconKeys = arrayOfObjectProperties
    .map((array) => array.propertyKeys)
    ?.flat()
  return { directIconKeys, arrayOfObjectProperties, arrayOfObjectIconKeys }
}

export const useElementIcons = (elements: EditorStateType['elements']) => {
  const [icons, setIcons] = useState<{ [key: string]: string }>({})
  useEffect(() => {
    const loadIcons = async () => {
      const iconsNames = elements
        .map((el: any) => {
          const {
            directIconKeys,
            arrayOfObjectProperties,
            arrayOfObjectIconKeys,
          } = getIconKeys(el.type)
          const directIconNames = directIconKeys.map(
            (iconKey) => el?.props?.[iconKey]
          )
          const arrayItemIconNames = arrayOfObjectProperties
            ?.map((props) => {
              return el?.props?.[props.key]?.map((it: any) => {
                return props.propertyKeys.map((key) => it?.[key])
              })
            })
            .flat()
          const allIconNames = [...directIconNames, ...arrayItemIconNames]
          return allIconNames
        })
        .flat()
        .filter((el) => el && !Object.keys(icons).includes(el))
      if (!iconsNames.length) return
      const iconsNew: any = {}
      for (const iconName of iconsNames) {
        if (!icons[iconName]) {
          iconsNew[iconName] = (iconLibrary as any)?.[iconName]
        }
      }
      setIcons((current) => ({ ...current, ...iconsNew }))
    }
    loadIcons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // currently only load icons on mount -> change dep array to [location.pathname] and filter relevant icons per page
  return icons
}

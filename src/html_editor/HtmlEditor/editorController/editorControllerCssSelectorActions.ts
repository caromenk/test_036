import { v4 as uuid } from 'uuid'
import { CSSProperties, useCallback, Dispatch, SetStateAction } from 'react'
import { EditorStateType } from './editorState'
import { EditorControllerCssSelectorActionsType } from './editorControllerTypes'

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useEditorControllerCssSelectorActions = (
  params: EditorControllerHtmlElementActionsParams
): EditorControllerCssSelectorActionsType => {
  const { editorState, setEditorState } = params

  const getSelectedCssClass = useCallback(
    (id?: string) => {
      const selectedClassName = id ?? editorState.ui.selected.cssSelector ?? ''
      const selectedClass = editorState.cssSelectors.find(
        (sel) => sel._id === selectedClassName
      )
      // const commonWorkspace = editorState?.cssWorkspaces?.common;
      // const selectedClassStyle = commonWorkspace?.[selectedClass] ?? {};
      return selectedClass
    },
    [editorState?.cssSelectors, editorState.ui.selected.cssSelector]
  )

  const changeClassName = useCallback(
    (newClassname: string, currentId: string) => {
      const newClassName = newClassname
      if (!newClassName) return
      const selectedClass = editorState.ui.selected.cssSelector
      if (!selectedClass) return
      if (!/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(selectedClass)) {
        return
      }
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
        },
        cssSelectors: current.cssSelectors.map((cssSelector) =>
          currentId === cssSelector._id
            ? {
                ...cssSelector,
                _userId: newClassName,
              }
            : cssSelector
        ),
      }))
    },
    [editorState.ui.selected.cssSelector, setEditorState]
  )

  const changeAddClassRuleName = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            addRuleName: newValue,
          },
        },
      }))
    },
    [setEditorState]
  )

  const changeAddClassRuleValue = useCallback((newValue: string) => {
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        detailsMenu: {
          ...current.ui.detailsMenu,
          addRuleValue: newValue,
        },
      },
    }))
  }, [])

  const removeRule = useCallback(
    (ruleName: string) => {
      if (!editorState.ui.selected.cssSelector) return

      setEditorState((current) => {
        // const currentClass =
        //   current?.cssWorkspaces?.common?.[
        //     current.ui.selected.cssSelector ?? ""
        //   ];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const { [ruleName as keyof CSSProperties]: _, ...restClassRules } =
        //   currentClass;

        return {
          ...current,
          cssSelectors: current.cssSelectors.map((cssSelector) => {
            if (cssSelector._id === current.ui.selected.cssSelector) {
              const ruleNameTyped = ruleName as keyof CSSProperties
              const { [ruleNameTyped]: _rOut, ...restRules } = cssSelector
              return restRules
            }
            return cssSelector
          }),
        }
      })
    },
    [editorState.ui.selected.cssSelector, setEditorState]
  )

  const addNewRule = useCallback(() => {
    if (!editorState.ui.selected.cssSelector) return
    if (
      !editorState.ui.detailsMenu.addRuleName ||
      !editorState.ui.detailsMenu.addRuleValue
    )
      return

    setEditorState((current) => ({
      ...current,
      // cssWorkspaces: {
      //   ...current?.cssWorkspaces,
      //   common: {
      //     ...current?.cssWorkspaces?.common,
      //     [current.ui.selected.cssSelector ?? ""]: {
      //       ...current?.cssWorkspaces?.common?.[
      //         current.ui.selected.cssSelector ?? ""
      //       ],
      //       [editorState.ui.detailsMenu.addRuleName ?? ""]:
      //         editorState.ui.detailsMenu.addRuleValue ?? "",
      //     },
      //   },
      // },
      ui: {
        ...current.ui,
        detailsMenu: {
          ...current.ui.detailsMenu,
          addRuleName: '',
          addRuleValue: '',
        },
      },
      cssSelectors: current.cssSelectors.map((cssSelector) => {
        if (cssSelector._id === current.ui.selected.cssSelector) {
          const newRuleName = editorState.ui.detailsMenu.addRuleName
          const newRuleValue = editorState.ui.detailsMenu.addRuleValue
          if (!newRuleName) return cssSelector
          return {
            ...cssSelector,
            [newRuleName]: newRuleValue,
          }
        }
        return cssSelector
      }),
    }))
  }, [
    editorState.ui.selected.cssSelector,
    editorState.ui.detailsMenu.addRuleName,
    editorState.ui.detailsMenu.addRuleValue,
    setEditorState,
  ])

  const toggleEditRule = useCallback(
    (ruleName: keyof CSSProperties) => {
      const cssClass = getSelectedCssClass(
        editorState.ui.selected.cssSelector ?? ''
      )
      const existingRuleValue = cssClass?.[ruleName]
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            ruleName: ruleName,
            ruleValue: (existingRuleValue as string) ?? '',
          },
        },
      }))
    },
    [editorState.ui.selected.cssSelector, setEditorState, getSelectedCssClass]
  )

  const changeEditRuleValue = useCallback(
    (newValue: string) => {
      if (!editorState.ui.selected.cssSelector) return
      const currentEditRuleName = editorState?.ui?.detailsMenu?.ruleName
      if (!currentEditRuleName || !newValue) return

      setEditorState((current) => ({
        ...current,
        // cssWorkspaces: {
        //   ...current?.cssWorkspaces,
        //   common: {
        //     ...current?.cssWorkspaces?.common,
        //     [current.ui.selected.cssSelector ?? ""]: {
        //       ...current?.cssWorkspaces?.common?.[
        //         current.ui.selected.cssSelector ?? ""
        //       ],
        //       [currentEditRuleName ?? ""]: newValue ?? "",
        //     },
        //   },
        // },
        cssSelectors: current.cssSelectors.map((cssSelector) => {
          if (cssSelector._id === current.ui.selected.cssSelector) {
            return {
              ...cssSelector,
              [currentEditRuleName]: newValue,
            }
          }
          return cssSelector
        }),
      }))
    },
    [
      editorState?.ui?.detailsMenu?.ruleName,
      setEditorState,
      editorState.ui.selected.cssSelector,
    ]
  )

  const addCssSelector = useCallback(
    (newVal: string) => {
      setEditorState((current) => {
        const newClassNameRaw = 'newClass'
        const newClassNameOccurences = current?.cssSelectors.filter((sel) =>
          sel?._userId.includes(newClassNameRaw)
        )
        const newClassName =
          newClassNameRaw +
          (newClassNameOccurences?.length
            ? `_${newClassNameOccurences?.length}`
            : '')
        return {
          ...current,
          cssSelectors: [
            ...current.cssSelectors,
            {
              _id: uuid(),
              _userId: newClassName,
              _type: 'css',
              _parentId: 'common',
              _userID: '',
            },
          ],
        }
      })
    },
    [setEditorState]
  )

  const deleteCssSelector = useCallback(
    (name: string) => {
      setEditorState((current) => {
        // const cssCommonWorkspace = current.cssWorkspaces?.common;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const { [name]: _nOut, ...cssCommonWorkspaceExDeleteItem } =
        //   cssCommonWorkspace;
        return {
          ...current,
          // cssWorkspaces: {
          //   ...current?.cssWorkspaces,
          //   common: cssCommonWorkspaceExDeleteItem,
          // },
          cssSelectors: current.cssSelectors.filter(
            (cssSelector) => cssSelector._id !== name
          ),
        }
      })
    },
    [setEditorState]
  )

  return {
    removeRule,
    addNewRule,
    toggleEditRule,
    changeEditRuleValue,
    changeClassName,
    changeAddClassRuleName,
    changeAddClassRuleValue,
    deleteCssSelector,
    addCssSelector,
  }
}

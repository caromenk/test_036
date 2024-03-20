import React, { useCallback, useMemo } from 'react'
import { Stack, Typography, Box, useTheme } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import { getStylesFromClasses } from '../../../renderElements'
import { CSS_RULES_VALUES_OPTIONS } from '../../../defs/CssRuleNamesDict'
import { CSelect } from '../../../../components/inputs/CSelect'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { cssRulesFilterOptions } from './_defHtmlElementCssRulesFilterOptions'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { Flex } from '../../../../components/basics/Flex'
import { getInitialStyles } from '../../../utils'
import { mdiCodeBlockTags, mdiRefresh } from '@mdi/js'
import { ButtonType } from '../../../../components/buttons/Button/Types'
import { Button } from '../../../../components/buttons/Button/Button'
import { CssFileIcon } from '../../../../components/icons/CssFileIcon'
import { CssStyleAddSelector } from '../cssClass/CssStyleSelector'

export type RightMenuCssRuldeTabProps = {
  editorController: EditorControllerType
}

const defaultCssRules = Object.keys(getInitialStyles() || {})

export const RightMenuCssRuleTab = (props: RightMenuCssRuldeTabProps) => {
  const { editorController } = props
  const {
    editorState,
    selectedHtmlElement2: selectedHtmlElement,
    selectedHtmlElementStyleAttributes2: cssAttributes,
    actions,
  } = editorController
  const {
    toggleHtmlElementEditCssRule,
    changeHtmlElementEditedCssRuleValue,
    removeCurrentHtmlElementStyleAttribute,
  } = actions.htmlElement
  const { selectHtmlElementCssPropertiesListFilter } = actions.ui.detailsMenu

  const theme = useTheme()
  const activeEditRule =
    editorState?.ui?.detailsMenu?.htmlElement?.editCssRuleName
  const className = (selectedHtmlElement as any)?.attributes?.className

  const classAttributes = useMemo(
    () =>
      !className
        ? {}
        : getStylesFromClasses(className, editorState?.cssSelectors),
    [className, editorState?.cssSelectors]
  )

  const attributes = useMemo(() => {
    const allAttributes = {
      ...classAttributes,
      ...cssAttributes,
    }
    return Object.keys(
      editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter === 'all'
        ? allAttributes
        : editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter ===
          'classes'
        ? classAttributes
        : cssAttributes
    )
  }, [
    cssAttributes,
    classAttributes,
    editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter,
  ])

  const classAttributeNames = Object.keys(classAttributes)

  console.log('ATTRIBUTS', attributes, classAttributes, cssAttributes)

  const ruleValueEditOptions =
    (activeEditRule &&
      activeEditRule in CSS_RULES_VALUES_OPTIONS &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (CSS_RULES_VALUES_OPTIONS as any)?.[activeEditRule]) ||
    []

  const handleToggleEditRule = useCallback(
    (attributeName: string) => {
      toggleHtmlElementEditCssRule(attributeName)
    },
    [toggleHtmlElementEditCssRule]
  )

  const handleTakeoverEditedRuleValue = useCallback(
    (newValue: string) => {
      if (!activeEditRule) return
      changeHtmlElementEditedCssRuleValue(newValue, activeEditRule)
    },
    [activeEditRule, changeHtmlElementEditedCssRuleValue]
  )

  const handleRemoveRule = useCallback(
    (attributeName: string) => {
      removeCurrentHtmlElementStyleAttribute(attributeName)
    },
    [removeCurrentHtmlElementStyleAttribute]
  )

  return (
    <>
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Box>
          <CSelect
            value={
              editorState?.ui?.detailsMenu?.htmlElement?.cssRulesFilter ?? ''
            }
            onChange={selectHtmlElementCssPropertiesListFilter}
            options={cssRulesFilterOptions}
          />
        </Box>
        <CGrid
          gridTemplateColumns="auto auto"
          alignItems="center"
          position="relative"
          // gap={"16px 0"}
        >
          <Box
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          >
            Rule
          </Box>
          <Box
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          >
            Value
          </Box>
          <Box minHeight={24} fontWeight={700}></Box>
          <Box fontWeight={700}></Box>
          {attributes?.map((attributeName) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ruleValue = (cssAttributes as any)?.[attributeName] ?? ''
            return (
              <>
                <Typography variant="body2" height="16px" mt={1}>
                  {attributeName}
                </Typography>

                <Flex
                  mt={1}
                  // justifyContent="space-between"
                  minHeight={24}
                  alignItems="center"
                >
                  <ClickTextField
                    variant="autocomplete"
                    value={
                      editorState?.ui?.detailsMenu?.htmlElement?.editCssRuleName
                        ? editorState?.ui?.detailsMenu?.htmlElement
                            ?.editCssRuleName ?? ''
                        : ruleValue
                    }
                    onToggle={(isEdit) =>
                      handleToggleEditRule(isEdit ? attributeName : '')
                    }
                    options={ruleValueEditOptions}
                    onChange={handleTakeoverEditedRuleValue}
                    typographyProps={{
                      variant: 'body2',
                      height: '16px',
                      color: 'text.secondary',
                    }}
                    handleRemoveItem={() => handleRemoveRule(attributeName)}
                    deleteIcon={
                      defaultCssRules.includes(attributeName)
                        ? mdiRefresh
                        : undefined
                    }
                    deleteIconTooltip={
                      defaultCssRules.includes(attributeName)
                        ? 'Reset to default'
                        : 'Remove rule'
                    }
                    fullwidth={true}
                  />
                  <Box minWidth={24} minHeight={24}>
                    <Button
                      icon={
                        classAttributeNames.includes(attributeName) ? (
                          <CssFileIcon />
                        ) : (
                          mdiCodeBlockTags
                        )
                      }
                      tooltip={
                        classAttributeNames.includes(attributeName)
                          ? 'styles from classes'
                          : 'styles from element' +
                            (defaultCssRules.includes(attributeName)
                              ? ' (default attribute)'
                              : '')
                      }
                      disabled={true}
                      iconButton={true}
                      type={ButtonType.text}
                    />
                  </Box>
                </Flex>
              </>
            )
          })}
          <Box
            minHeight={24}
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          ></Box>
          <Box
            minHeight={24}
            fontWeight={700}
            borderBottom={'1px solid ' + theme.palette.text.primary}
          ></Box>
        </CGrid>

        {/* Add rule  */}
        <CssStyleAddSelector
          editorController={editorController}
          isElementStyles={true}
        />
      </Stack>
    </>
  )
}

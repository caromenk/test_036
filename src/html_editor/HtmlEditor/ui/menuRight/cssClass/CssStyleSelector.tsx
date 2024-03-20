import { mdiPlus } from '@mdi/js'
import { Box, Typography } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { Flex } from '../../../../components/basics/Flex'
import { CAutoComplete } from '../../../../components/inputs/CAutoComplete'
import {
  CSS_RULES_VALUES_OPTIONS,
  CSS_RULE_NAMES_OPTIONS,
} from '../../../defs/CssRuleNamesDict'
import { Button } from '../../../../components/buttons/Button/Button'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'

export type CssStyleSelectorProps = {
  editorController: EditorControllerType
  isElementStyles?: boolean
}

export const CssStyleAddSelector = (props: CssStyleSelectorProps) => {
  const { editorController, isElementStyles } = props
  const { editorState, actions } = editorController
  const { addNewRule, changeAddClassRuleName, changeAddClassRuleValue } =
    actions.cssSelector
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement

  const handleAddNewRule = useCallback(() => {
    if (isElementStyles) {
      changeCurrentHtmlElementStyleAttribute(
        editorState.ui.detailsMenu.addRuleValue,
        editorState.ui.detailsMenu.addRuleName
      )
      return
    }
    addNewRule()
  }, [
    addNewRule,
    isElementStyles,
    changeCurrentHtmlElementStyleAttribute,
    editorState.ui.detailsMenu,
  ])

  const ruleValueOptions = useMemo(() => {
    return (
      (editorState.ui.detailsMenu.addRuleName &&
        editorState.ui.detailsMenu.addRuleName in CSS_RULES_VALUES_OPTIONS &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (CSS_RULES_VALUES_OPTIONS as any)?.[
          editorState.ui.detailsMenu.addRuleName
        ]) ||
      []
    )
  }, [editorState.ui.detailsMenu.addRuleName])

  return (
    <Box>
      <Box mt={2}>
        <Typography fontWeight={700} color="text.primary">
          Add Rule
        </Typography>
      </Box>
      <Flex gap={1} spacing={1} width="100%" mt={2} alignItems="center">
        <Box flexGrow={1}>
          <CAutoComplete
            disableHelperText={true}
            label="Rule"
            name="newRule"
            options={CSS_RULE_NAMES_OPTIONS}
            value={editorState.ui.detailsMenu.addRuleName}
            onChange={changeAddClassRuleName}
            sx={{ width: '140px' }}
          />
        </Box>
        <Box flexGrow={1}>
          <CAutoComplete
            disableHelperText={true}
            label="Value"
            disabled={!editorState.ui.detailsMenu.addRuleName}
            name="newRuleValue"
            options={ruleValueOptions}
            value={editorState.ui.detailsMenu.addRuleValue}
            onChange={changeAddClassRuleValue}
            sx={{ width: '140px' }}
          />
        </Box>
        <Box pt={2}>
          <Button
            iconButton={true}
            icon={mdiPlus}
            disabled={
              !editorState.ui.detailsMenu.addRuleName ||
              !editorState.ui.detailsMenu.addRuleValue
            }
            tooltip={
              !editorState.ui.detailsMenu.addRuleName ||
              !editorState.ui.detailsMenu.addRuleValue
                ? 'Please provide a rule name and value'
                : 'Add Rule'
            }
            onClick={handleAddNewRule}
          />
        </Box>
      </Flex>
    </Box>
  )
}

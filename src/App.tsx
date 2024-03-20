import React from 'react'
import { ThemeProvider } from '@mui/material'

import { HtmlRenderer } from './html_editor/HtmlEditor/HtmlRenderer.tsx'
import { useEditorController } from './html_editor/HtmlEditor/editorController/editorController'
import { useElementIcons } from './html_editor/HtmlEditor/iconUtils.ts'
import { reloadSerializedThemes } from './html_editor/HtmlEditor/apiController/transformEditorStateTheme.ts'
import {
  muiDarkSiteTheme,
  muiLightSiteTheme,
} from './html_editor/theme/muiTheme.tsx'

import appEditorRawState from '../website.json'

const themes = reloadSerializedThemes((appEditorRawState as any)?.themes, [
  muiLightSiteTheme,
  muiDarkSiteTheme,
])
const appEditorState = {
  ...appEditorRawState,
  themes: themes,
  theme: themes.find((theme) => theme.name === appEditorRawState.defaultTheme),
  elements: appEditorRawState.elements.map((el) => {
    return { ...el }
  }),
}

function App() {
  const editorController = useEditorController({
    initialEditorState: appEditorState as any,
  })
  const { editorState, appState } = editorController
  const { theme } = editorState
  const icons = useElementIcons(editorState.elements)

  return (
    <ThemeProvider theme={theme}>
      <HtmlRenderer editorController={editorController} icons={icons} />
    </ThemeProvider>
  )
}

export default App

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { renderHtmlElements } from "./renderElements.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { uniq } from "lodash";
import { EditorControllerType } from "./editorController/editorControllerTypes.ts";

// -> must be generated dynamically!
// import siteProps from '../site_props.json'

export type HtmlRendererProps = {
  editorController: EditorControllerType;
  icons?: { [key: string]: string };
};

export const HtmlRenderer = (props: HtmlRendererProps) => {
  const { editorController, icons } = props;
  const { editorState, setEditorState } = editorController;
  const handleSelectElement = React.useCallback(() => {}, []);
  const location = useLocation();

  console.log("ELEMENTS", editorState.elements, icons);

  const renderPage = React.useCallback(
    (page: string) => {
      const pageElements = editorState.elements.filter(
        (el) => el._page === page
      );
      const pageElementsAdj = pageElements.map((el) => {
        if (el._parentId) return el;
        return el;
        return {
          ...el,
          attributes: {
            ...((el as any)?.props ?? {}),
            // style: {
            //   ...((el as any)?.props.style ?? {}),
            //   bgcolor: 'background.paper',
            // },
          },
        };
      });
      // console.log(
      //   'renderPage',
      //   page,
      //   pageElements,
      //   pageElementsAdj,
      //   editorController
      // )
      // console.log('Should render PAGE, ', page, pageElements, pageElementsAdj)

      return renderHtmlElements(
        pageElementsAdj,
        editorController,
        handleSelectElement,
        true,
        icons
      );
    },
    [editorState, editorController, handleSelectElement, icons]
  );

  // change the route, renderer uses editorState.ui.selected.page to render the page
  useEffect(() => {
    console.log("location changed", location.pathname);
    const pageName = location.pathname.slice(1) || "index";
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selected: { ...current.ui.selected, page: pageName },
      },
    }));
    // const loadIcons = async () => {
    //   const comoponentsWithIcons = editorState.elements.filter((el) => {
    //     const baseComponent = baseComponents?.find((bc) => bc.type === el._type)
    //     const hasIconProperty =
    //       (baseComponent as any)?.schema?.properties?.icon?.type ===
    //       PropertyType.icon
    //     return hasIconProperty && el?._page === pageName
    //   })
    //   for (let c = 0; c < comoponentsWithIcons.length; c++) {
    //     const el = comoponentsWithIcons[c]
    //     const baseComponent = baseComponents?.find((bc) => bc.type === el._type)
    //     const key = (el as any)?.props?.icon
    //     const icon = await eval(`import('@mdi/js/${key}')`) //-> is external code from server pov (transpiles import -> require -> problem!)
    //     if (!key) return
    //     ;(el as any).icon = icon
    //   }

    //   const icons = comoponentsWithIcons.reduce((acc, el) => {
    //     // const baseComponent = baseComponents?.find((bc) => bc.type === el._type)

    //     const key = (el as any)?.props?.icon
    //     const icon = (el as any)?.icon
    //     if (!key || !icon) return acc
    //     return { ...acc, [key]: icon }
    //   }, {})
    //   console.log('ICONS', icons, comoponentsWithIcons)

    //   setIcons((current) => ({ ...current, ...icons }))
    // }
    // loadIcons()
  }, [location.pathname]);

  const remainingPages = React.useMemo(() => {
    const pages = uniq(editorState?.elements?.map((el) => el._page) ?? []);
    const pagesExIndex = pages.filter((page) => page !== "index");
    return pagesExIndex;
  }, [editorState]);

  return (
    <Box height="100%" bgcolor="background.default">
      <Routes>
        <Route path="/" element={renderPage("index")} />
        {remainingPages?.map((pageName) => (
          <Route
            key={pageName}
            path={`/${pageName}`}
            element={renderPage(pageName)}
          />
        ))}
      </Routes>
    </Box>
  );
};

import React, { useState } from "react";
import { EditorState, RichUtils, Modifier } from "draft-js";

import "@fontsource/oswald"; // Defaults to weight 400
import "@fontsource/fredoka"; // Defaults to weight 400
import "@fontsource/dancing-script"; // Defaults to weight 400
import "@fontsource/arvo"; // Defaults to weight 400

import SvgEditor from "./SvgEditor";
import SVGCanvas from "./SVGCanvas";

import "./styles.css";

export default function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isShowImage, setIsShowImage] = useState(false);

  const fontSizeMap = {
    12: "FONTSIZE_12",
    16: "FONTSIZE_16",
    24: "FONTSIZE_24",
    32: "FONTSIZE_32",
    48: "FONTSIZE_48",
  };

  const toggleFontStyle = (fontStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, fontStyle));
  };

  // Apply custom inline style for font size
  const applyFontSize = (editorState, fontSize) => {
    const selection = editorState.getSelection();

    // Remove any existing font size styles
    const currentContent = editorState.getCurrentContent();
    const contentWithoutFontSize = Object.keys(fontSizeMap).reduce(
      (contentState, size) => {
        return Modifier.removeInlineStyle(contentState, selection, size);
      },
      currentContent
    );

    // Apply the new font size
    const newContentState = Modifier.applyInlineStyle(
      contentWithoutFontSize,
      selection,
      `FONTSIZE_${fontSize}`
    );

    // Return new EditorState with the updated content
    return EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );
  };

  const handleFontSizeChange = (event) => {
    console.log("handleFontSizeChange");
    const newFontSize = event.target.value;
    console.log(event.target.value);
    // setEditorState(applyFontSize(editorState, newFontSize));
    setEditorState(
      RichUtils.toggleInlineStyle(editorState, `FONTSIZE_${newFontSize}`)
    );
  };

  return (
    <div className="App">
      <SvgEditor
        editorState={editorState}
        toggleFontStyle={toggleFontStyle}
        setEditorState={setEditorState}
        handleFontSizeChange={handleFontSizeChange}
      />
      <hr />
      <button onClick={() => setIsShowImage(!isShowImage)}>Show image</button>
      {isShowImage && <SVGCanvas editorState={editorState} />}
      {/* <TextToSVG /> */}
    </div>
  );
}

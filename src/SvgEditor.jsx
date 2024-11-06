import React from "react";
import { Editor } from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  FREDOKA: {
    fontFamily: "Fredoka, sans-serif",
  },
  OSWALD: {
    fontFamily: "Oswald, sans-serif",
  },
  LOBSTER: {
    fontFamily: "Lobster, cursive",
  },
  ARVO: {
    fontFamily: "Arvo, serif",
  },
  DANCING_SCRIPT: {
    fontFamily: "Dancing Script, cursive",
  },
  FONTSIZE_12: { fontSize: "12px" },
  FONTSIZE_16: { fontSize: "16px" },
  FONTSIZE_24: { fontSize: "24px" },
  FONTSIZE_32: { fontSize: "32px" },
  FONTSIZE_48: { fontSize: "48px" },
};

const SvgEditor = ({
  editorState,
  toggleFontStyle,
  setEditorState,
  handleFontSizeChange,
}) => {
  return (
    <div>
      <div>
        <select onChange={handleFontSizeChange}>
          <option value="12">12px</option>
          <option value="16">16px</option>
          <option value="24">24px</option>
          <option value="32">32px</option>
          <option value="48">48px</option>
        </select>
        {/* Buttons to apply the custom fonts */}
        <button onClick={() => toggleFontStyle("FREDOKA")}>FREDOKA</button>
        <button onClick={() => toggleFontStyle("OSWALD")}>OSWALD</button>
        <button onClick={() => toggleFontStyle("ARVO")}>ARVO</button>
        <button onClick={() => toggleFontStyle("DANCING_SCRIPT")}>
          DANCING SCRIPT
        </button>
        <button onClick={() => toggleFontStyle("BOLD")}>Bold</button>
        <button onClick={() => toggleFontStyle("ITALIC")}>Italic</button>
        <button onClick={() => toggleFontStyle("UNDERLINE")}>Underline</button>
        <button onClick={() => toggleFontStyle("STRIKETHROUGH")}>
          Strikethrough
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "300px",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          customStyleMap={styleMap} // Apply the custom inline style map
          placeholder="Write something..."
        />
      </div>
      <div></div>
    </div>
  );
};

export default SvgEditor;

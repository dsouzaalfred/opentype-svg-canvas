import oswaldTTF from "./fonts/oswald-cyrillic-400-normal.ttf";
import lobsterTTF from "./fonts/lobster-latin-400-normal.ttf";
import fredokaTTF from "./fonts/fredoka-latin-400-normal.ttf";

// Load fonts from local files or URLs
const fetchFont = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer(); // Convert response to ArrayBuffer
  return opentype.parse(arrayBuffer); // Parse font using opentype.js
};

// Load Roboto and Lobster fonts from local paths
export async function loadFonts() {
  const oswald = await fetchFont(oswaldTTF);
  const lobster = await fetchFont(lobsterTTF);
  const fredoka = await fetchFont(fredokaTTF);
  return { oswald, lobster, fredoka };
}

// Convert EditorState to SVG paths
const editorStateToSVG = async (editorState) => {
  const contentState = editorState.getCurrentContent();
  const rawContent = convertToRaw(contentState);

  const { oswald, lobster, fredoka } = await loadFonts();

  let svgPaths = "";
  let x = 0;
  let y = 100; // Starting point for text rendering

  // Iterate over each block (line of text)
  rawContent.blocks.forEach((block) => {
    console.log({ block });
    const { text, inlineStyleRanges } = block;
    let x = 0;
    let y = 100; // Adjust Y position based on line height

    let currentFont = fonts.fredoka; // Default Font

    // Iterate through the characters and apply styles (like bold, italic)
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let fontToUse = currentFont; // Use Roboto or Lobster depending on styles

      // Check if this character has any inline styles (bold, italic, etc.)
      inlineStyles.forEach((style) => {
        if (i >= style.offset && i < style.offset + style.length) {
          // Check for a specific style and apply a different font
          if (style.style === "BOLD") {
            fontToUse = lobsterFont; // Use Lobster for bold text as an example
          }
        }
      });

      // Get the glyph for the character and convert it to a path
      const glyph = fontToUse.charToGlyph(char);
      const path = glyph.getPath(x, y, 72); // Set font size to 72px

      svgPaths += path.toSVG(); // Convert the glyph path to SVG
      x += glyph.advanceWidth; // Move the cursor to the right for the next character
    }
  });
};

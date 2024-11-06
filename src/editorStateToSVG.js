import { convertToRaw } from "draft-js";
import opentype from "opentype.js";

const fonts = {
  OSWALD: {
    default: "fonts/oswald-latin-400-normal.ttf",
    bold: "fonts/oswald-latin-600-normal.ttf",
  },
  ARVO: {
    default: "fonts/arvo-latin-400-normal.ttf",
    bold: "fonts/arvo-latin-700-normal.ttf",
  },
  FREDOKA: {
    default: "fonts/fredoka-latin-400-normal.ttf",
    bold: "fonts/fredoka-latin-600-normal.ttf",
  },
  DANCING_SCRIPT: {
    default: "fonts/dancing-script-latin-400-normal.ttf",
    bold: "fonts/dancing-script-latin-700-normal.ttf",
  },
};

// Function to convert EditorState to SVG
export async function editorStateToSVG(editorState) {
  const contentState = editorState.getCurrentContent();
  const rawContent = convertToRaw(contentState);

  const defaultFontSize = 36; // Default font size
  let svgPaths = "";
  let index = 0;
  // Iterate over each block (line of text)
  for (const block of rawContent.blocks) {
    const { text, inlineStyleRanges } = block;
    let x = 0;
    let line = index == 0 ? 1 : index * defaultFontSize;
    let y = defaultFontSize * 1.2 + line; // Adjust Y position based on line height
    let isItalic = false;
    let isUnderline = false;
    let isStrikethrough = false;
    let fontSize = defaultFontSize;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let fontToUse = null;
      let fontName = "FREDOKA";
      try {
        const font = await opentype.load(fonts["FREDOKA"].default);
        fontToUse = font;
        fontName = "FREDOKA";
      } catch (e) {
        console.log(e);
      }

      for (const style of inlineStyleRanges) {
        if (i >= style.offset && i < style.offset + style.length) {
          console.log("style.style", style.style);
          if (style.style === "OSWALD") {
            try {
              const font = await opentype.load(fonts["OSWALD"].default);
              fontToUse = font;
              fontName = "OSWALD";
            } catch (e) {
              console.log(e);
            }
          } else if (style.style === "ARVO") {
            try {
              const font = await opentype.load(fonts["ARVO"].default);
              fontToUse = font;
              fontName = "ARVO";
            } catch (e) {
              console.log(e);
            }
          } else if (style.style === "DANCING_SCRIPT") {
            try {
              const font = await opentype.load(fonts["DANCING_SCRIPT"].default);
              fontToUse = font;
              fontName = "DANCING_SCRIPT";
            } catch (e) {
              console.log(e);
            }
          }

          // Handle text decorations
          if (style.style === "BOLD") {
            switch (fontName) {
              case "OSWALD":
                fontToUse = await opentype.load(fonts["OSWALD"].bold);
                break;
              case "ARVO":
                fontToUse = await opentype.load(fonts["ARVO"].bold);
                break;
              case "FREDOKA":
                fontToUse = await opentype.load(fonts["FREDOKA"].bold);
                break;
              case "DANCING_SCRIPT":
                fontToUse = await opentype.load(fonts["DANCING_SCRIPT"].bold);
                break;
            }
          }
          if (style.style === "ITALIC") isItalic = true;
          if (style.style === "UNDERLINE") isUnderline = true;
          if (style.style === "STRIKETHROUGH") isStrikethrough = true;
          if (style.style.includes("FONTSIZE_")) {
            fontSize = parseInt(style.style.replace("FONTSIZE_", ""));
            y = fontSize * 1.2 + line;
          }
        }
      }

      // Get the glyph for the character and convert it to a path
      const glyph = fontToUse.charToGlyph(char);
      let path = glyph.getPath(x, y, fontSize); // Set font size to 36px

      if (isItalic) {
        // Apply a slant transformation for italic (skewX)
        // Transformation matrix: [1, 0, tan(angle), 1, 0, 0]
        const skewX = -0.3; // Adjust the skew value for the desired slant
        // Loop through each command in the path
        path.commands.forEach((command) => {
          if (
            command.type === "M" ||
            command.type === "L" ||
            command.type === "Q" ||
            command.type === "C"
          ) {
            // Apply the skew transformation to each coordinate
            command.x += skewX * command.y; // Skew the x-coordinate
            if (command.x1) command.x1 += skewX * command.y1; // For curves
            if (command.x2) command.x2 += skewX * command.y2; // For curves
          }
        });

        // Adjust the starting x position to compensate for the skew
        const compensationX = Math.abs(skewX * 36); // Adjust based on font size (36)
        path.commands.forEach((command) => {
          if (command.x !== undefined) {
            command.x += compensationX;
          }
          if (command.x1 !== undefined) {
            command.x1 += compensationX;
          }
          if (command.x2 !== undefined) {
            command.x2 += compensationX;
          }
        });
      }

      svgPaths += path.toSVG(); // Convert the glyph path to SVG

      // Draw underline if needed
      if (isUnderline) {
        const underlineY = y + fontSize * 0.2; // Adjust underline position
        svgPaths += `<line x1="${x}" y1="${underlineY}" x2="${
          x + (glyph.advanceWidth / fontToUse.unitsPerEm) * fontSize
        }" y2="${underlineY}" stroke="black" stroke-width="2" />`;
      }

      // Draw strikethrough if needed
      if (isStrikethrough) {
        const strikeY = y - fontSize * 0.4; // Adjust strikethrough position
        svgPaths += `<line x1="${x}" y1="${strikeY}" x2="${
          x + (glyph.advanceWidth / fontToUse.unitsPerEm) * fontSize
        }" y2="${strikeY}" stroke="black" stroke-width="2" />`;
      }
      // Adjust advanceWidth by scaling it with the font size (correct letter spacing)
      x += (glyph.advanceWidth / fontToUse.unitsPerEm) * fontSize;
    }
    index++;
  }

  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          ${svgPaths}
      </svg>
  `;
  return svg;
}

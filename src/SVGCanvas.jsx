import { useEffect, useRef } from "react";
import { editorStateToSVG } from "./editorStateToSVG";

const SVGCanvas = ({ editorState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderSVGOnCanvas = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Generate the SVG from EditorState
      const svg = await editorStateToSVG(editorState);

      // Create an image from the SVG string
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      // Create an Image object to render on the canvas
      const img = new Image();
      img.onload = () => {
        // Draw the SVG image on the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url); // Release the object URL once done
      };
      img.src = url;
    };

    renderSVGOnCanvas();
  }, [editorState]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid black" }}
    />
  );
};

export default SVGCanvas;

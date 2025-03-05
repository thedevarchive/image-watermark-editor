import './App.css';
import './dragdrop.css';
import { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";

function App() {
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [watermark, setWatermark] = useState("");

  const canvasRef = useRef(null);

  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
      setFilename(file.name);
    }
  };

  const addWatermark = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get text width
      const textWidth = ctx.measureText(watermark).width + 300;
      // Approximate text height (adjust as needed)
      const textHeight = 48;

      // Corrected center position
      const x = (canvas.width - textWidth) / 2;
      const y = (canvas.height + textHeight) / 2;

      const font = new FontFace("CoolFont", "url(/fonts/CoolFont.otf)");
      font.load().then(() => {
        document.fonts.add(font);
        ctx.font = "48px CoolFont";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText(watermark, x, y);
      });

    };
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "watermarked-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className='App-header'>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <MdFileUpload size={70} color="white" />
          {
            filename != "" ? (
              <p>{filename}</p>
            ) : (
              <p>Drag & Drop your files here</p>
            )
          }
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <div style={{ display: "flex" }}>
        <input type="text" value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
          placeholder="Enter watermark text" />
        <button onClick={addWatermark}>Add Watermark</button>
      </div>
      <button onClick={downloadImage}>Download</button>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;

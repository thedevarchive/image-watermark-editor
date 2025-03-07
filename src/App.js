import './App.css';
import './dragdrop.css';
import { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";

function App() {
  const [image, setImage] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [isWatermarked, setIsWatermarked] = useState(false);
  const [filename, setFilename] = useState("");
  const [watermark, setWatermark] = useState({
    text: "",
    x: 50, // percentage
    y: 50,  // percentage
    font: "Helvetica", // default font
    opacity: 60, // default opacity percentage
    fontSize: 30, // default font size in pixels
    color: "white" // default color
  });

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const fontOptions = [
    { value: "Helvetica", label: "Helvetica" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "CoolFont", label: "Mystery Font" }
  ];

  // Handles image file upload from input element
  const handleImageUpload = (event) => {
    // Get the first file from the input's files array
    const file = event.target.files[0];
    if (file) {
      // Create FileReader to read the image file
      const reader = new FileReader();
      // Set the image state with the result
      reader.onload = (e) => setImage(e.target.result);
      // Read the file as a data URL (base64 string)
      reader.readAsDataURL(file);
      // Update filename state with the uploaded file's name
      setFilename(file.name);
      setHasFile(true);
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
      const textWidth = ctx.measureText(watermark.text).width + 300;
      // Approximate text height (adjust as needed)
      const textHeight = 48;

      // Calculate position based on percentages
      const x = (canvas.width * watermark.x) / 100;
      const y = (canvas.height * watermark.y) / 100;

      // Get custom font from files
      const font = new FontFace("CoolFont", "url(/fonts/CoolFont.otf)");
      font.load().then(() => {
        document.fonts.add(font);
        ctx.font = `${watermark.fontSize}px ${watermark.font}`;
        ctx.fillStyle = `rgba(${watermark.color === 'white' ? '255, 255, 255' : '0, 0, 0'}, ${watermark.opacity / 100})`; // Convert percentage to decimal
        ctx.fillText(watermark.text, x, y);
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
      <div className="form-container">
        <div className="input-group">
          <span className="input-label">Watermark text:</span>
          <input
            type="text"
            value={watermark.text}
            onChange={(e) => setWatermark(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter watermark text"
            className="text-input"
          />
        </div>
        <div className="input-group">
          <span className="input-label">Font style:</span>
          <select 
            value={watermark.font}
            onChange={(e) => setWatermark(prev => ({ ...prev, font: e.target.value }))}
            className="select-input"
          >
            {fontOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))} 
          </select>
        </div>
        <div className="input-group">
          <span className="input-label">Font size:</span>
          <input
            type="range"
            value={watermark.fontSize}
            onChange={(e) => setWatermark(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
            min="30"
            max="72"
            className="slider-input"
            style={{ width: '200px' }}
          />
          <span style={{ 
            minWidth: '40px',
            fontSize: '20px'
          }}>{watermark.fontSize}px</span>
        </div>
        <div className="input-group">
          <span className="input-label">Transparency:</span>
          <input
            type="range"
            value={watermark.opacity}
            onChange={(e) => setWatermark(prev => ({ ...prev, opacity: Number(e.target.value) }))}
            min="0"
            max="100"
            className="slider-input"
            style={{ width: '200px' }}
          />
          <span style={{ 
            minWidth: '40px',
            fontSize: '20px'
          }}>{watermark.opacity}%</span>
        </div>
        <div className="input-group">
          <div className="input-group">
            <span className="input-label">X position:</span>
            <input
              type="number"
              value={watermark.x}
              onChange={(e) => setWatermark(prev => ({ ...prev, x: Math.max(0, Math.min(100, Number(e.target.value))) }))}
              placeholder="X position (%)"
              min="0"
              max="100"
              className="number-input"
            />
          </div>
          <div className="input-group">
            <span className="input-label">Y position:</span>
            <input
              type="number"
              value={watermark.y}
              onChange={(e) => setWatermark(prev => ({ ...prev, y: Math.max(0, Math.min(100, Number(e.target.value))) }))}
              placeholder="Y position (%)"
              min="0"
              max="100"
              className="number-input"
            />
          </div>
        </div>
        <div className="input-group">
          <span className="input-label">Color:</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '24px', color: 'white' }}>
              <input
                type="radio"
                value="white"
                checked={watermark.color === 'white'}
                onChange={(e) => setWatermark(prev => ({ ...prev, color: e.target.value }))}
              />
              White
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '24px', color: 'white' }}>
              <input
                type="radio"
                value="black"
                checked={watermark.color === 'black'}
                onChange={(e) => setWatermark(prev => ({ ...prev, color: e.target.value }))}
              />
              Black
            </label>
          </div>
        </div>
        <div className="input-group">
          <button onClick={addWatermark} disabled={!hasFile && watermark.text === ""} onChange={() => setIsWatermarked(true)}>Add Watermark</button>
          <button onClick={downloadImage} disabled={!isWatermarked}>Download</button>
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;

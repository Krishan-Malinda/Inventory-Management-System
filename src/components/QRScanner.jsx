import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

function QRScanner() {
  const [scannedData, setScannedData] = useState('');
  const [cameraActive, setCameraActive] = useState(false); // Control camera activation
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Canvas for processing webcam frames

  const scanQRCode = () => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;

    if (webcam && webcam.video.readyState === 4) {
      const video = webcam.video;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setScannedData(code.data); // QR Code detected
        setCameraActive(false); // Stop the camera once QR code is scanned
      } else {
        requestAnimationFrame(scanQRCode); // Keep scanning if no QR code is detected
      }
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };

  useEffect(() => {
    if (cameraActive) {
      requestAnimationFrame(scanQRCode); // Start scanning when camera is active
    }
  }, [cameraActive]);

  const handleStartScanning = () => {
    setScannedData(''); // Reset previous scanned data
    setCameraActive(true); // Activate the camera when the button is clicked
  };

  // This function handles file uploads and scans for QR codes in uploaded images
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setScannedData(code.data);
          } else {
            alert("No QR code found.");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='sub_component'>
      <h2 className='sub_title'>Scan QR Code</h2>

      <div>
        <h3>Scan using Webcam:</h3>
        {!cameraActive && (
          <button onClick={handleStartScanning}>Start Scanning</button>
        )}
        {cameraActive && (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>

      <div>
        <h3>Or Upload QR Code Image:</h3>
        <input type="file" onChange={handleFileUpload} />
      </div>

      {scannedData && (
        <div>
          <h3>Scanned Data:</h3>
          <pre>{scannedData}</pre>
        </div>
      )}
    </div>
  );
}

export default QRScanner;

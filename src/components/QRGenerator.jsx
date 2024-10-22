import React, { useState } from 'react';
import QRCode from 'react-qr-code';

function QRGenerator() {
  const [itemDetails, setItemDetails] = useState({
    name: '',
    serialNumber: '',
    model: '',
    location: '',
    purchaseDate: ''
  });
  const [qrData, setQRData] = useState('');

  const handleChange = (e) => {
    setItemDetails({ ...itemDetails, [e.target.name]: e.target.value });
  };

  const handleGenerateQR = () => {
    const qrString = JSON.stringify(itemDetails);
    setQRData(qrString);
  };

  const handleDownloadQR = () => {
    const svgElement = document.querySelector('svg'); // Get the QRCode as an SVG
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set canvas size larger than the QR code to allow a border
      const size = 256 + 20; // Add 20px for the border (10px each side)
      canvas.width = size;
      canvas.height = size + 30; // Additional height for the title

      // Fill background with white to make the border visible
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, size, canvas.height);

      // Draw the title using the serial number
      context.fillStyle = '#000000'; // Title color
      context.font = 'bold 16px Arial'; // Title font and size
      const title = itemDetails.serialNumber || 'QRCode';
      const titleWidth = context.measureText(title).width;
      context.fillText(title, (size - titleWidth) / 2, 20); // Center title

      // Draw the QR code with a margin of 10px for the border
      context.drawImage(img, 10, 30, 256, 256); // Position QR code below the title

      URL.revokeObjectURL(url);

      // Convert canvas to image (JPG format)
      const imgURL = canvas.toDataURL('image/jpeg');

      // Create dynamic file name based on serial number
      const fileName = `${title}.jpg`;

      const link = document.createElement('a');
      link.href = imgURL;
      link.download = fileName;
      link.click();
    };

    img.src = url;
  };

  return (
    <div className='sub_component'>
      <h2 className='sub_title'>Generate QR Code for Item</h2>
      {/* Input fields for item details */}
      <input className='inputs' name="name" placeholder="Item Name" onChange={handleChange} /><br />
      <input className='inputs' name="serialNumber" placeholder="Serial Number" onChange={handleChange} /><br />
      <input className='inputs' name="model" placeholder="Model" onChange={handleChange} /><br />
      <input className='inputs' name="location" placeholder="Location" onChange={handleChange} /><br />
      <input className='inputs' name="purchaseDate" placeholder="Purchase Date" onChange={handleChange} /><br />
      {/* Button to generate QR code */}
      <button onClick={handleGenerateQR} className='btn QR_generate_btn'>Generate QR Code</button>

      {/* Display QR code if qrData is not empty */}
      {qrData && (
        <div className='show_qr'>
          <h3>QR Code for Serial Number {itemDetails.serialNumber || 'Item'}:</h3>
          <QRCode value={qrData} size={256} />
          <button className='btn' onClick={handleDownloadQR}>Download QR as JPG</button>
        </div>
      )}
    </div>
  );
}

export default QRGenerator;

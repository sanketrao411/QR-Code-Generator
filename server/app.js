const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Service functions
const formatData = (data) => {
	const qrCodeText = `Product Name: ${data.name}, Product ID: ${data.id}, Price: $${data.price}, Quantity: ${data.quantity}`;
	return qrCodeText;
};

const generateQRCode = async (qrCodeText) => {
	const options = {
		errorCorrectionLevel: 'M',
		type: 'image/png',
		margin: 1
	};

	const qrCodeBuffer = await QRCode.toBuffer(qrCodeText, options);
	return qrCodeBuffer;
};

// Controller function
const generateQR = async (req, res) => {
	try {
		const { data } = req.body;

		// Format data for QR code
		const qrCodeText = formatData(data);

		// Generate QR code buffer
		const qrCodeBuffer = await generateQRCode(qrCodeText);

		// Send QR code as a downloadable file
		res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
		res.type('image/png').send(qrCodeBuffer);
	} catch (err) {
		console.error('Error generating QR code:', err);
		res.status(500).send({ error: 'Internal Server Error' });
	}
};

// Routes
app.post('/generate-qr', generateQR);

// Start server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});



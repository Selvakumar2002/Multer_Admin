const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/multer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define the schema and model for the form data
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    dob: String,
    gender: String,
    city: String,
    area: String,
    password: String,
    imagePath: String
});

const FormData = mongoose.model('FormData', formSchema);

// Define routes
app.post('/', upload.single('file'), async (req, res) => {
    try {
        const { name, email, contact, dob, gender, city, area, password } = req.body;
        const newFormData = new FormData({
            name,
            email,
            contact,
            dob,
            gender,
            city,
            area,
            password,
            imagePath: req.file.path
        });

        await newFormData.save();
        res.status(200).json({ message: 'Form submitted successfully', data: newFormData });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ message: 'Error submitting form', error });
    }
});

app.get('/', async (req, res) => {
    try {
        const forms = await FormData.find();
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ message: 'Error fetching form data', error });
    }
});

app.get('/:id', async (req, res) => {
    try {
        const form = await FormData.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form data not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ message: 'Error fetching form data', error });
    }
});

app.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const { name, email, contact, dob, gender, city, area, password } = req.body;
        const updatedData = {
            name,
            email,
            contact,
            dob,
            gender,
            city,
            area,
            password
        };

        if (req.file) {
            updatedData.imagePath = req.file.path;
        }

        const form = await FormData.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!form) {
            return res.status(404).json({ message: 'Form data not found' });
        }

        res.status(200).json({ message: 'Form data updated successfully', data: form });
    } catch (error) {
        console.error('Error updating form data:', error);
        res.status(500).json({ message: 'Error updating form data', error });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const form = await FormData.findByIdAndDelete(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form data not found' });
        }
        res.status(200).json({ message: 'Form data deleted successfully' });
    } catch (error) {
        console.error('Error deleting form data:', error);
        res.status(500).json({ message: 'Error deleting form data', error });
    }
});

// Start the server
app.listen(5000, () => {
    console.log("Server started on port 5000");
});

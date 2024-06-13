import React, { useState } from 'react';
import axios from 'axios';
import '../cssfile/Mainform.css'

const Mainform = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [cityAreas, setCityAreas] = useState({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email is invalid';
        if (!/^[0-9]{10}$/.test(contact)) newErrors.contact = 'Contact number must be 10 digits';
        if (!dob) newErrors.dob = 'Date of birth is required';
        if (!gender) newErrors.gender = 'Gender is required';
        if (!city) newErrors.city = 'City is required';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!image) {
            newErrors.image = 'Image file is required';
        } else if (image.size > 5 * 1024 * 1024) {
            newErrors.image = 'Image file size must be less than 5MB';
        }

        return newErrors;
    };

    const submit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('contact', contact);
            formData.append('dob', dob);
            formData.append('gender', gender);
            formData.append('city', city);
            formData.append('area', cityAreas[city] || '');
            formData.append('password', password);
            formData.append('file', image);

            try {
                const response = await axios.post('http://localhost:5000/', formData);
                console.log(response.data);
                // setName('');
                // setEmail('');
                // setContact('');
                // setDob('');
                // setGender('');
                // setCity('');
                // setCityAreas({});
                // setPassword('');
                // setConfirmPassword('');
                // setImage(null);
                // setErrors({});
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);
        setCityAreas((prev) => ({
            ...prev,
            [selectedCity]: ''
        }));
    };

    const handleCityInputChange = (city, value) => {
        setCityAreas((prev) => ({
            ...prev,
            [city]: value
        }));
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">FORM</h1>
            <form onSubmit={submit}>
                <div className="form-group mb-3">
                    <label>Name:</label>  <input type="text" className="form-control"    value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <div className="text-danger">{errors.name}</div>} 
                </div>
                <div className="form-group mb-3">
                    <label>Email:</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                <div className="form-group mb-3">
                    <label>Contact No:</label>
                    <input type="text" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} />
                    {errors.contact && <div className="text-danger">{errors.contact}</div>}
                </div>
                <div className="form-group mb-3">
                    <label>Date of Birth:</label>
                    <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} />
                    {errors.dob && <div className="text-danger">{errors.dob}</div>}
                </div>
                <div className="form-group mb-3">
                    <label>Gender:</label>
                    <div>
                        <input type="radio" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} /> Male
                        <input type="radio" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} /> Female
                    </div>
                    {errors.gender && <div className="text-danger">{errors.gender}</div>}
                </div>
                <div className="form-group mb-3">
                    <label>City:</label>
                    <select className="form-control" value={city} onChange={handleCityChange}>
                        <option value=''>Select City</option>
                        <option value='Tirupur'>Tirupur</option>
                        <option value='Erode'>Erode</option>
                        <option value='Salem'>Salem</option>
                        <option value='Coimbatore'>Coimbatore</option>
                    </select>
                    {errors.city && <div className="text-danger">{errors.city}</div>}
                </div>
                {city && cityAreas[city] !== undefined && (
                    <div className="form-group mb-3">
                        <label>{city} Area:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cityAreas[city]}
                            onChange={(e) => handleCityInputChange(city, e.target.value)}
                        />
                    </div>
                )}
                <div className="form-group mb-3">
                    <label>Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>
                <div className="form-group mb-3">
                    <label>Confirm Password:</label>
                    <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                </div>
                <div className="form-group mb-3">
                    <label>Image:</label>
                    <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                    {errors.image && <div className="text-danger">{errors.image}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Mainform;

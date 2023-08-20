import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './add_group.modal.css'; // Import the corresponding CSS file

const Bundeslaender = [
    'Baden-Württemberg',
    'Bayern',
    'Berlin',
    'Brandenburg',
    'Bremen',
    'Hamburg',
    'Hessen',
    'Mecklenburg-Vorpommern',
    'Niedersachsen',
    'Nordrhein-Westfalen',
    'Rheinland-Pfalz',
    'Saarland',
    'Sachsen',
    'Sachsen-Anhalt',
    'Schleswig-Holstein',
    'Thüringen'
];

function GroupForm({ isOpen, onRequestClose }) {
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        website: '',
        youtube: '',
        facebook: '',
        instagram: '',
        federation_member: false,
        state_long: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/group', formData);
            console.log('Group added successfully');
            onRequestClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error adding group:', error);
            // Display an error message to the user
            alert('An error occurred while adding the group. Please try again: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Gruppe eintragen Formular"
            className="modal-container"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <h2>Gruppe eintragen</h2>
                <div>Achtung: Du kannst die Gruppe anschließend nur bearbeiten wenn du dich einloggst.</div>
                <form className="modal-form" onSubmit={(e) => handleSubmit(e, formData)}>
                    <div>
                        <label>Name: *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                        <label>Straße:</label>
                        <input type="text" name="street" value={formData.street} onChange={handleInputChange} />
                        <label>Stadt: *</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                        <label>Website:</label>
                        <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder='https://www.' />
                    </div>
                    <div>
                        <label>YouTube:</label>
                        <input type="url" name="youtube" value={formData.youtube} onChange={handleInputChange} placeholder='https://www.youtube.com/@' />
                        <label>Facebook:</label>
                        <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder='https://www.facebook.com/' />
                        <label>Instagram:</label>
                        <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder='https://www.instagram.com/' />
                        <label>Bundesland:</label>
                        <select name="state_long" value={formData.state_long} onChange={handleInputChange}>
                            <option value="">Bundesland auswählen</option>
                            {Bundeslaender.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="button-container">
                        <button type="submit">Gruppe hinzufügen</button>
                        <button type="button" onClick={onRequestClose}>Abbrechen</button>
                    </div>
                </form>
            </div>
        </Modal>

    );
}

export default GroupForm;

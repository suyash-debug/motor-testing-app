import { useState } from 'react'
import './MotorDetailsForm.css'

function MotorDetailsForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    partNumber: '',
    windingType: 'AL',
    windingTurns: '',
    magnetType: 'China',
    bladeType: '',
    notes: ''
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setPhotoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.partNumber || !formData.windingTurns) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      windingTurns: parseInt(formData.windingTurns),
      photoFile: photoFile
    })
  }

  return (
    <div className="modal-overlay">
      <div className="motor-details-form-container">
        <h2>New Motor Details</h2>
        <p className="form-description">Enter motor specifications before logging test data</p>

        <form onSubmit={handleSubmit} className="motor-details-form">
          <div className="form-group">
            <label htmlFor="partNumber">Motor Part Number *</label>
            <input
              type="text"
              id="partNumber"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleChange}
              placeholder="e.g., MTR-2024-001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="windingType">Winding Type *</label>
            <select
              id="windingType"
              name="windingType"
              value={formData.windingType}
              onChange={handleChange}
              required
            >
              <option value="AL">Aluminum (AL)</option>
              <option value="CU">Copper (CU)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="windingTurns">Number of Winding Turns *</label>
            <input
              type="number"
              id="windingTurns"
              name="windingTurns"
              value={formData.windingTurns}
              onChange={handleChange}
              placeholder="e.g., 120"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="magnetType">Magnet Type *</label>
            <select
              id="magnetType"
              name="magnetType"
              value={formData.magnetType}
              onChange={handleChange}
              required
            >
              <option value="China">China</option>
              <option value="India">India</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bladeType">Blade Type</label>
            <input
              type="text"
              id="bladeType"
              name="bladeType"
              value={formData.bladeType}
              onChange={handleChange}
              placeholder="e.g., 3-Blade, 5-Blade"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Any Other Note</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or observations..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Motor Photo (Optional)</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            {!photoPreview ? (
              <button
                type="button"
                onClick={() => document.getElementById('photo').click()}
                className="upload-photo-btn"
                style={{
                  padding: '0.75rem',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  background: '#f9f9f9',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>📷</span>
                <span>Click to upload photo</span>
              </button>
            ) : (
              <div style={{ position: 'relative', width: '100%' }}>
                <img
                  src={photoPreview}
                  alt="Motor preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Motor & Start Testing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MotorDetailsForm

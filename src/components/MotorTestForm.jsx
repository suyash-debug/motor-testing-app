import { useState } from 'react'
import { updateMotor } from '../services/motorService'
import { uploadMotorImage, deleteMotorImage } from '../services/imageService'
import './MotorTestForm.css'

function MotorTestForm({ motor, onSubmit, onDeleteTest }) {
  const [formData, setFormData] = useState({
    rpm: '',
    current: '',
    powerFactor: '',
    wattage: '',
    airSpeed: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    partNumber: motor.partNumber,
    windingType: motor.windingType,
    windingTurns: motor.windingTurns,
    magnetType: motor.magnetType,
    bladeType: motor.bladeType || '',
    notes: motor.notes || ''
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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate that all required fields are filled
    if (!formData.rpm || !formData.current || !formData.powerFactor || !formData.wattage) {
      alert('Please fill in all required fields')
      return
    }

    // Submit the data
    const testData = {
      rpm: parseFloat(formData.rpm),
      current: parseFloat(formData.current),
      powerFactor: parseFloat(formData.powerFactor),
      wattage: parseFloat(formData.wattage)
    }

    // Add air speed if provided
    if (formData.airSpeed) {
      testData.airSpeed = parseFloat(formData.airSpeed)
    }

    onSubmit(testData)

    // Reset form
    setFormData({
      rpm: '',
      current: '',
      powerFactor: '',
      wattage: '',
      airSpeed: ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditClick = () => {
    setEditData({
      partNumber: motor.partNumber,
      windingType: motor.windingType,
      windingTurns: motor.windingTurns,
      magnetType: motor.magnetType,
      bladeType: motor.bladeType || '',
      notes: motor.notes || ''
    })
    setPhotoFile(null)
    setPhotoPreview(motor.photoUrl || null)
    setIsEditing(true)
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

  const handleSaveEdit = async () => {
    try {
      if (!editData.partNumber || !editData.windingTurns) {
        alert('Please fill in all required fields')
        return
      }

      const updates = {
        partNumber: editData.partNumber,
        windingType: editData.windingType,
        windingTurns: parseInt(editData.windingTurns),
        magnetType: editData.magnetType,
        bladeType: editData.bladeType,
        notes: editData.notes
      }

      // Handle photo update
      if (photoFile) {
        // Delete old photo if exists
        if (motor.photoPath) {
          try {
            await deleteMotorImage(motor.photoPath)
          } catch (error) {
            console.error('Error deleting old photo:', error)
          }
        }

        // Upload new photo
        const photoData = await uploadMotorImage(photoFile, motor.id)
        updates.photoUrl = photoData.url
        updates.photoPath = photoData.path
      } else if (photoPreview === null && motor.photoUrl) {
        // User removed the photo
        if (motor.photoPath) {
          try {
            await deleteMotorImage(motor.photoPath)
          } catch (error) {
            console.error('Error deleting photo:', error)
          }
        }
        updates.photoUrl = null
        updates.photoPath = null
      }

      await updateMotor(motor.id, updates)

      setIsEditing(false)
      setPhotoFile(null)
      setPhotoPreview(null)
    } catch (error) {
      console.error('Error updating motor:', error)
      alert('Failed to update motor details. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="motor-testing-container">
      {/* Motor Information Card */}
      <div className="motor-info-card">
        {!isEditing ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Motor: {motor.partNumber}</h2>
              <button onClick={handleEditClick} className="edit-btn" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                Edit Details
              </button>
            </div>

            {motor.photoUrl && (
              <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                <img
                  src={motor.photoUrl}
                  alt="Motor"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}

            <div className="motor-specs">
              <div className="spec-item">
                <span className="spec-label">Winding Type:</span>
                <span className="spec-value">{motor.windingType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Winding Turns:</span>
                <span className="spec-value">{motor.windingTurns}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Magnet Type:</span>
                <span className="spec-value">{motor.magnetType}</span>
              </div>
              {motor.bladeType && (
                <div className="spec-item">
                  <span className="spec-label">Blade Type:</span>
                  <span className="spec-value">{motor.bladeType}</span>
                </div>
              )}
              <div className="spec-item">
                <span className="spec-label">Test Points:</span>
                <span className="spec-value">{motor.testData.length}</span>
              </div>
              {motor.notes && (
                <div className="spec-item spec-item-full">
                  <span className="spec-label">Notes:</span>
                  <span className="spec-value">{motor.notes}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Edit Motor Details</h2>
            <div className="motor-edit-form">
              <div className="form-group">
                <label htmlFor="edit-partNumber">Motor Part Number *</label>
                <input
                  type="text"
                  id="edit-partNumber"
                  name="partNumber"
                  value={editData.partNumber}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-windingType">Winding Type *</label>
                <select
                  id="edit-windingType"
                  name="windingType"
                  value={editData.windingType}
                  onChange={handleEditChange}
                  required
                >
                  <option value="AL">Aluminum (AL)</option>
                  <option value="CU">Copper (CU)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-windingTurns">Number of Winding Turns *</label>
                <input
                  type="number"
                  id="edit-windingTurns"
                  name="windingTurns"
                  value={editData.windingTurns}
                  onChange={handleEditChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-magnetType">Magnet Type *</label>
                <select
                  id="edit-magnetType"
                  name="magnetType"
                  value={editData.magnetType}
                  onChange={handleEditChange}
                  required
                >
                  <option value="China">China</option>
                  <option value="India">India</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-bladeType">Blade Type</label>
                <input
                  type="text"
                  id="edit-bladeType"
                  name="bladeType"
                  value={editData.bladeType}
                  onChange={handleEditChange}
                  placeholder="e.g., 3-Blade, 5-Blade"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-notes">Any Other Note</label>
                <textarea
                  id="edit-notes"
                  name="notes"
                  value={editData.notes}
                  onChange={handleEditChange}
                  placeholder="Additional notes or observations..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-photo">Motor Photo (Optional)</label>
                <input
                  type="file"
                  id="edit-photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                {!photoPreview ? (
                  <button
                    type="button"
                    onClick={() => document.getElementById('edit-photo').click()}
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

              <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                  Cancel
                </button>
                <button type="button" onClick={handleSaveEdit} className="submit-btn">
                  Save Changes
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Test Data Form */}
      <div className="motor-test-form-container">
        <h3>Log Test Data Point</h3>
        <form onSubmit={handleSubmit} className="motor-test-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rpm">RPM</label>
              <input
                type="number"
                id="rpm"
                name="rpm"
                value={formData.rpm}
                onChange={handleChange}
                placeholder="Enter RPM"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="current">Current (A)</label>
              <input
                type="number"
                id="current"
                name="current"
                value={formData.current}
                onChange={handleChange}
                placeholder="Amperes"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="powerFactor">Power Factor</label>
              <input
                type="number"
                id="powerFactor"
                name="powerFactor"
                value={formData.powerFactor}
                onChange={handleChange}
                placeholder="0.00 - 1.00"
                step="0.01"
                min="0"
                max="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="wattage">Wattage (W)</label>
              <input
                type="number"
                id="wattage"
                name="wattage"
                value={formData.wattage}
                onChange={handleChange}
                placeholder="Watts"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="airSpeed">Air Speed (m/s)</label>
              <input
                type="number"
                id="airSpeed"
                name="airSpeed"
                value={formData.airSpeed}
                onChange={handleChange}
                placeholder="Meters per second"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            + Add Test Point
          </button>
        </form>
      </div>

      {/* Test Data History */}
      <div className="test-data-history">
        <h3>Test Data ({motor.testData.length} points)</h3>
        {motor.testData.length === 0 ? (
          <div className="empty-state">
            <p>No test data logged yet</p>
            <p className="empty-subtitle">Start by adding your first test point above</p>
          </div>
        ) : (
          <div className="test-data-table-container">
            <table className="test-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>RPM</th>
                  <th>Current (A)</th>
                  <th>Power Factor</th>
                  <th>Wattage (W)</th>
                  <th>Air Speed (m/s)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {motor.testData.map((test, index) => (
                  <tr key={test.id}>
                    <td>{motor.testData.length - index}</td>
                    <td className="time-cell">{formatDate(test.timestamp)}</td>
                    <td>{test.rpm.toFixed(2)}</td>
                    <td>{test.current.toFixed(2)}</td>
                    <td>{test.powerFactor.toFixed(2)}</td>
                    <td>{test.wattage.toFixed(2)}</td>
                    <td>{test.airSpeed ? test.airSpeed.toFixed(2) : '-'}</td>
                    <td>
                      <button
                        onClick={() => onDeleteTest(motor.id, test.id)}
                        className="delete-btn-small"
                        aria-label="Delete test"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MotorTestForm

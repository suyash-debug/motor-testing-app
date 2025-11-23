import { useState } from 'react'
import './MotorDetailsForm.css'

function MotorDetailsForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    partNumber: '',
    windingType: 'AL',
    windingTurns: '',
    magnetType: 'China'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.partNumber || !formData.windingTurns) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      windingTurns: parseInt(formData.windingTurns)
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

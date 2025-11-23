import { useState } from 'react'
import './MotorTestForm.css'

function MotorTestForm({ motor, onSubmit, onDeleteTest }) {
  const [formData, setFormData] = useState({
    rpm: '',
    current: '',
    powerFactor: '',
    wattage: ''
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

    // Validate that all fields are filled
    if (!formData.rpm || !formData.current || !formData.powerFactor || !formData.wattage) {
      alert('Please fill in all fields')
      return
    }

    // Submit the data
    onSubmit({
      rpm: parseFloat(formData.rpm),
      current: parseFloat(formData.current),
      powerFactor: parseFloat(formData.powerFactor),
      wattage: parseFloat(formData.wattage)
    })

    // Reset form
    setFormData({
      rpm: '',
      current: '',
      powerFactor: '',
      wattage: ''
    })
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
        <h2>Motor: {motor.partNumber}</h2>
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
          <div className="spec-item">
            <span className="spec-label">Test Points:</span>
            <span className="spec-value">{motor.testData.length}</span>
          </div>
        </div>
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

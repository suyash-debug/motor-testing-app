import './MotorList.css'

function MotorList({ motors, onSelectMotor, onDeleteMotor }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (motors.length === 0) {
    return (
      <div className="motor-list-container">
        <div className="empty-state-large">
          <h2>No Motors Yet</h2>
          <p>Click "New Motor" to start logging test data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="motor-list-container">
      <h2>All Motors ({motors.length})</h2>
      <div className="motor-grid">
        {motors.map((motor) => (
          <div key={motor.id} className="motor-card">
            <div className="motor-card-header">
              <h3>{motor.partNumber}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete motor ${motor.partNumber}?`)) {
                    onDeleteMotor(motor.id)
                  }
                }}
                className="delete-motor-btn"
                aria-label="Delete motor"
              >
                ×
              </button>
            </div>

            <div className="motor-card-details">
              <div className="detail-row">
                <span className="detail-label">Winding:</span>
                <span className="detail-value">{motor.windingType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Turns:</span>
                <span className="detail-value">{motor.windingTurns}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Magnet:</span>
                <span className="detail-value">{motor.magnetType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDate(motor.createdAt)}</span>
              </div>
            </div>

            <div className="motor-card-footer">
              <div className="test-count">
                <span className="count-number">{motor.testData.length}</span>
                <span className="count-label">test points</span>
              </div>
              <button
                onClick={() => onSelectMotor(motor)}
                className="view-motor-btn"
              >
                View & Test →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MotorList

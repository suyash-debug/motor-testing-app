import './MotorList.css'

const SEARCH_FIELDS = ['partNumber', 'bladeType', 'windingType', 'windingTurns', 'magnetType', 'notes']

function MotorList({ motors, searchQuery, onSearchChange, onSelectMotor, onDeleteMotor }) {
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

  // Every word must appear somewhere in the motor's fields, e.g. "crompton 29"
  const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
  const filteredMotors = motors.filter((motor) => {
    const text = SEARCH_FIELDS.map((field) => motor[field] ?? '').join(' ').toLowerCase()
    return terms.every((term) => text.includes(term))
  })

  return (
    <div className="motor-list-container">
      <h2>
        {terms.length > 0
          ? `Motors (${filteredMotors.length} of ${motors.length})`
          : `All Motors (${motors.length})`}
      </h2>
      <div className="motor-search">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search part number, blade, winding, turns, notes…"
          aria-label="Search motors"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} className="clear-search-btn">
            Clear
          </button>
        )}
      </div>
      {filteredMotors.length === 0 && (
        <p className="no-results">No motors match "{searchQuery}"</p>
      )}
      <div className="motor-grid">
        {filteredMotors.map((motor) => (
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
              {motor.bladeType && (
                <div className="detail-row">
                  <span className="detail-label">Blade:</span>
                  <span className="detail-value">{motor.bladeType}</span>
                </div>
              )}
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

import './MotorTestHistory.css'

function MotorTestHistory({ logs, onDelete }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (logs.length === 0) {
    return (
      <div className="motor-test-history-container">
        <h2>Test History</h2>
        <div className="empty-state">
          <p>No test data logged yet</p>
          <p className="empty-subtitle">Start by logging your first motor test above</p>
        </div>
      </div>
    )
  }

  return (
    <div className="motor-test-history-container">
      <h2>Test History</h2>
      <div className="history-list">
        {logs.map((log) => (
          <div key={log.id} className="history-item">
            <div className="history-header">
              <span className="timestamp">{formatDate(log.timestamp)}</span>
              <button
                onClick={() => onDelete(log.id)}
                className="delete-btn"
                aria-label="Delete log"
              >
                ×
              </button>
            </div>
            <div className="history-data">
              <div className="data-item">
                <span className="data-label">RPM</span>
                <span className="data-value">{log.rpm.toFixed(2)}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Current</span>
                <span className="data-value">{log.current.toFixed(2)} A</span>
              </div>
              <div className="data-item">
                <span className="data-label">Power Factor</span>
                <span className="data-value">{log.powerFactor.toFixed(2)}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Wattage</span>
                <span className="data-value">{log.wattage.toFixed(2)} W</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MotorTestHistory

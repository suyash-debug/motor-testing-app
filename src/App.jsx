import { useState, useEffect } from 'react'
import './App.css'
import MotorDetailsForm from './components/MotorDetailsForm'
import MotorTestForm from './components/MotorTestForm'
import MotorList from './components/MotorList'
import {
  subscribeToMotors,
  createMotor as createMotorInDB,
  addTestData as addTestDataToDB,
  deleteTestData as deleteTestDataFromDB,
  deleteMotor as deleteMotorFromDB
} from './services/motorService'

function App() {
  const [motors, setMotors] = useState([])
  const [currentMotor, setCurrentMotor] = useState(null)
  const [showNewMotorForm, setShowNewMotorForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToMotors((updatedMotors) => {
      setMotors(updatedMotors)
      setLoading(false)

      // Update currentMotor if it's being viewed
      if (currentMotor) {
        const updated = updatedMotors.find(m => m.id === currentMotor.id)
        if (updated) {
          setCurrentMotor(updated)
        }
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [currentMotor])

  const handleCreateMotor = async (motorDetails) => {
    try {
      const newMotor = await createMotorInDB(motorDetails)
      setCurrentMotor(newMotor)
      setShowNewMotorForm(false)
    } catch (error) {
      console.error('Error creating motor:', error)
      alert('Failed to create motor. Please try again.')
    }
  }

  const handleAddTestData = async (testData) => {
    try {
      await addTestDataToDB(currentMotor.id, testData)
      // Firebase real-time listener will update the state automatically
    } catch (error) {
      console.error('Error adding test data:', error)
      alert('Failed to add test data. Please try again.')
    }
  }

  const handleDeleteTestData = async (motorId, testId) => {
    try {
      await deleteTestDataFromDB(motorId, testId)
      // Firebase real-time listener will update the state automatically
    } catch (error) {
      console.error('Error deleting test data:', error)
      alert('Failed to delete test data. Please try again.')
    }
  }

  const handleSelectMotor = (motor) => {
    setCurrentMotor(motor)
  }

  const handleBackToList = () => {
    setCurrentMotor(null)
  }

  const handleDeleteMotor = async (motorId) => {
    try {
      await deleteMotorFromDB(motorId)
      // Firebase real-time listener will update the state automatically

      if (currentMotor && currentMotor.id === motorId) {
        setCurrentMotor(null)
      }
    } catch (error) {
      console.error('Error deleting motor:', error)
      alert('Failed to delete motor. Please try again.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Motor Testing Data Logger</h1>
        <p className="subtitle">Record and track motor performance metrics</p>
      </header>

      <main className="app-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading motors...</p>
          </div>
        ) : !currentMotor ? (
          <>
            <div className="action-section">
              <button
                onClick={() => setShowNewMotorForm(true)}
                className="new-motor-btn"
              >
                + New Motor
              </button>
            </div>
            <MotorList
              motors={motors}
              onSelectMotor={handleSelectMotor}
              onDeleteMotor={handleDeleteMotor}
            />
          </>
        ) : (
          <>
            <div className="testing-section">
              <button onClick={handleBackToList} className="back-btn">
                ← Back to Motors
              </button>
              <MotorTestForm
                motor={currentMotor}
                onSubmit={handleAddTestData}
                onDeleteTest={handleDeleteTestData}
              />
            </div>
          </>
        )}
      </main>

      {showNewMotorForm && (
        <MotorDetailsForm
          onSubmit={handleCreateMotor}
          onCancel={() => setShowNewMotorForm(false)}
        />
      )}
    </div>
  )
}

export default App

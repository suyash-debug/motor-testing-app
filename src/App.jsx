import { useState, useEffect } from 'react'
import './App.css'
import MotorDetailsForm from './components/MotorDetailsForm'
import MotorTestForm from './components/MotorTestForm'
import MotorList from './components/MotorList'

function App() {
  const [motors, setMotors] = useState([])
  const [currentMotor, setCurrentMotor] = useState(null)
  const [showNewMotorForm, setShowNewMotorForm] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMotors = localStorage.getItem('motors')
    if (savedMotors) {
      setMotors(JSON.parse(savedMotors))
    }
  }, [])

  // Save data to localStorage whenever motors changes
  useEffect(() => {
    if (motors.length > 0) {
      localStorage.setItem('motors', JSON.stringify(motors))
    }
  }, [motors])

  const handleCreateMotor = (motorDetails) => {
    const newMotor = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...motorDetails,
      testData: []
    }
    setMotors([newMotor, ...motors])
    setCurrentMotor(newMotor)
    setShowNewMotorForm(false)
  }

  const handleAddTestData = (testData) => {
    const updatedMotors = motors.map(motor => {
      if (motor.id === currentMotor.id) {
        const newTest = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...testData
        }
        return {
          ...motor,
          testData: [...motor.testData, newTest]
        }
      }
      return motor
    })

    setMotors(updatedMotors)

    // Update current motor reference
    const updated = updatedMotors.find(m => m.id === currentMotor.id)
    setCurrentMotor(updated)
  }

  const handleDeleteTestData = (motorId, testId) => {
    const updatedMotors = motors.map(motor => {
      if (motor.id === motorId) {
        return {
          ...motor,
          testData: motor.testData.filter(test => test.id !== testId)
        }
      }
      return motor
    })

    setMotors(updatedMotors)

    if (currentMotor && currentMotor.id === motorId) {
      const updated = updatedMotors.find(m => m.id === motorId)
      setCurrentMotor(updated)
    }
  }

  const handleSelectMotor = (motor) => {
    setCurrentMotor(motor)
  }

  const handleBackToList = () => {
    setCurrentMotor(null)
  }

  const handleDeleteMotor = (motorId) => {
    const updatedMotors = motors.filter(motor => motor.id !== motorId)
    setMotors(updatedMotors)
    localStorage.setItem('motors', JSON.stringify(updatedMotors))

    if (currentMotor && currentMotor.id === motorId) {
      setCurrentMotor(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Motor Testing Data Logger</h1>
        <p className="subtitle">Record and track motor performance metrics</p>
      </header>

      <main className="app-main">
        {!currentMotor ? (
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

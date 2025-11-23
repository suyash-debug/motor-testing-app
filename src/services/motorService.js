import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  arrayUnion,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const MOTORS_COLLECTION = 'motors';

// Create a new motor
export const createMotor = async (motorDetails) => {
  try {
    const motorData = {
      ...motorDetails,
      createdAt: new Date().toISOString(),
      testData: []
    };
    const docRef = await addDoc(collection(db, MOTORS_COLLECTION), motorData);
    return { id: docRef.id, ...motorData };
  } catch (error) {
    console.error('Error creating motor:', error);
    throw error;
  }
};

// Get all motors
export const getMotors = async () => {
  try {
    const q = query(collection(db, MOTORS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting motors:', error);
    throw error;
  }
};

// Subscribe to motors collection (real-time updates)
export const subscribeToMotors = (callback) => {
  try {
    const q = query(collection(db, MOTORS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const motors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(motors);
    }, (error) => {
      console.error('Error subscribing to motors:', error);
      // If there's an error, return empty array so app doesn't hang
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up motors subscription:', error);
    // Return a dummy unsubscribe function and call callback with empty array
    callback([]);
    return () => {};
  }
};

// Add test data to a motor
export const addTestData = async (motorId, testData) => {
  try {
    const motorRef = doc(db, MOTORS_COLLECTION, motorId);

    const newTest = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...testData
    };

    // Use arrayUnion to add the test without reading first
    await updateDoc(motorRef, {
      testData: arrayUnion(newTest)
    });

    return newTest;
  } catch (error) {
    console.error('Error adding test data:', error);
    throw error;
  }
};

// Delete test data from a motor
export const deleteTestData = async (motorId, testId) => {
  try {
    const motorRef = doc(db, MOTORS_COLLECTION, motorId);

    // Get just the specific motor document
    const motorSnap = await getDoc(motorRef);

    if (!motorSnap.exists()) {
      throw new Error('Motor not found');
    }

    const motor = motorSnap.data();
    const updatedTestData = (motor.testData || []).filter(test => test.id !== testId);

    await updateDoc(motorRef, {
      testData: updatedTestData
    });
  } catch (error) {
    console.error('Error deleting test data:', error);
    throw error;
  }
};

// Delete a motor
export const deleteMotor = async (motorId) => {
  try {
    await deleteDoc(doc(db, MOTORS_COLLECTION, motorId));
  } catch (error) {
    console.error('Error deleting motor:', error);
    throw error;
  }
};

// Update motor details
export const updateMotor = async (motorId, updates) => {
  try {
    const motorRef = doc(db, MOTORS_COLLECTION, motorId);
    await updateDoc(motorRef, updates);
  } catch (error) {
    console.error('Error updating motor:', error);
    throw error;
  }
};

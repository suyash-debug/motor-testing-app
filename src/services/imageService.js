import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Compress image before upload
const compressImage = async (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

// Upload motor image to Firebase Storage
export const uploadMotorImage = async (file, motorId) => {
  try {
    if (!file) return null;

    // Compress the image before uploading
    const compressedBlob = await compressImage(file);

    // Create a reference to the storage location
    const timestamp = Date.now();
    const fileName = `motors/${motorId}/${timestamp}_compressed.jpg`;
    const storageRef = ref(storage, fileName);

    // Upload the compressed file
    const snapshot = await uploadBytes(storageRef, compressedBlob);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete motor image from Firebase Storage
export const deleteMotorImage = async (imagePath) => {
  try {
    if (!imagePath) return;

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error if image doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
};

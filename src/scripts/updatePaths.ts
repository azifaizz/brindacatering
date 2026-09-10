import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Fetching menu items...");
  const snapshot = await getDocs(collection(db, 'menuItems'));
  let count = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.image && data.image.startsWith('/src/assets/')) {
      const newImage = data.image.replace('/src/assets/', '/assets/');
      console.log(`Updating ${data.name}: ${data.image} -> ${newImage}`);
      await updateDoc(doc(db, 'menuItems', document.id), {
        image: newImage
      });
      count++;
    }
  }

  console.log(`Updated ${count} items.`);
}

run().catch(console.error);

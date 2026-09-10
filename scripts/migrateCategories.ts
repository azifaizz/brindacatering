import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuCategories = [
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Classic morning favourites and traditional tiffin items.",
    order: 0
  },
  {
    id: "lunch",
    name: "Traditional Lunch",
    description: "Authentic vegetarian rice preparations, curries and vegetable sides.",
    order: 1
  },
  {
    id: "non-veg",
    name: "Non-Veg",
    description: "Premium chicken, mutton and seafood specialties.",
    order: 2
  },
  {
    id: "dinner",
    name: "Dinner",
    description: "Layered parottas, soft kal dosas, and evening specialties.",
    order: 3
  },
  {
    id: "sweets",
    name: "Sweets",
    description: "Traditional South Indian sweets and desserts.",
    order: 4
  },
];

async function migrate() {
  console.log('Migrating categories...');
  for (const category of menuCategories) {
    await setDoc(doc(db, 'menuCategories', category.id), category);
    console.log(`Migrated ${category.name}`);
  }
  console.log('Done!');
}

migrate().catch(console.error);

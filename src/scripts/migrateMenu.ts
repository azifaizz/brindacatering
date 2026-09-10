import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { menuCategories } from '../data/menu';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

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

async function migrate() {
  console.log('Starting migration...');
  
  let totalMigrated = 0;

  for (const category of menuCategories) {
    console.log(`Processing category: ${category.category}`);
    
    // Create items for this category
    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];
      // Set the order field based on its index in the array
      const docRef = doc(db, 'menuItems', item.id);
      
      await setDoc(docRef, {
        id: item.id,
        category: category.category,
        name: item.name,
        description: item.description,
        image: item.image,
        tags: item.tags || [],
        order: i, // To maintain the exact order from the static file
      });
      
      console.log(`Migrated: ${item.name}`);
      totalMigrated++;
    }
  }

  console.log(`Migration complete! Successfully migrated ${totalMigrated} items.`);
  process.exit(0);
}

migrate().catch(console.error);

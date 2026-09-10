import { createFileRoute } from '@tanstack/react-router';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { menuItems } from '@/data/menu';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin/migrate')({
  component: MigrateComponent,
});

function MigrateComponent() {
  const [status, setStatus] = useState('Idle');
  const [progress, setProgress] = useState(0);

  async function handleMigrate() {
    setStatus('Migrating...');
    let migrated = 0;
    try {
      if (!db) {
        setStatus('Error: Firestore not initialized');
        return;
      }
      for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        if (!item) continue;
        const docRef = doc(db, 'menuItems', item.id);
        await setDoc(docRef, {
          id: item.id,
          category: item.category,
          name: item.name,
          description: item.description,
          image: item.image || '',
          tags: item.tags || [],
          order: i,
        });
        migrated++;
        setProgress(migrated);
      }
      setStatus(`Success! Migrated ${migrated} items.`);
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Migrate Menu to Firestore</h1>
      <p className="mb-4">This will push all static menu items from src/data/menu.ts to the 'menuItems' collection in Firestore.</p>
      <Button onClick={handleMigrate}>Run Migration</Button>
      <div className="mt-4">
        <strong>Status:</strong> {status} <br/>
        <strong>Progress:</strong> {progress} items migrated
      </div>
    </div>
  );
}

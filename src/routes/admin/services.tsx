import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { Service, services as defaultServices } from '@/data/services';

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
});

function AdminServices() {
  const [services, setServices] = useState<(Service & { order?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<Partial<Service & { order?: number }>>({
    id: '', slug: '', title: '', short: '', description: '', image: '', alt: '', suitableFor: [], highlights: [], featured: true, order: 0
  });

  const [suitableInput, setSuitableInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'services'), orderBy('order'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Service & { order?: number });
      setServices(dbData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({ id: '', slug: '', title: '', short: '', description: '', image: '', alt: '', suitableFor: [], highlights: [], featured: true, order: services.length });
    setImageFile(null);
    setSuitableInput('');
    setHighlightsInput('');
  };

  const openAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (service: Service & { order?: number }) => {
    setFormData(service);
    setSuitableInput(service.suitableFor.join(', '));
    setHighlightsInput(service.highlights.join('\n'));
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSeed = async () => {
    if (!db) return;
    if (confirm("Import initial services? This will add the hardcoded services to the database.")) {
      try {
        for (let i = 0; i < defaultServices.length; i++) {
          const s = defaultServices[i];
          await setDoc(doc(db, 'services', s.id), { ...s, order: i });
        }
        alert("Services imported successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to import services.");
      }
    }
  };

  const handleDelete = async (service: Service) => {
    if (!db) return;
    if (confirm(`Are you sure you want to delete ${service.title}?`)) {
      try {
        await deleteDoc(doc(db, 'services', service.id));
        if (service.image.includes('firebasestorage.googleapis.com') && storage) {
          const fileRef = ref(storage, service.image);
          await deleteObject(fileRef).catch(e => console.error(e));
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSaving(true);
    try {
      let imageUrl = formData.image;

      if (imageFile && storage) {
        // Delete old image if updating and old image is in firebase storage
        if (formData.id && formData.image?.includes('firebasestorage.googleapis.com')) {
           const oldRef = ref(storage, formData.image);
           await deleteObject(oldRef).catch(e => console.log('Old image cleanup failed or not found', e));
        }

        const storageRef = ref(storage, `services/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const finalId = formData.id || `srv-${Date.now()}`;
      const slug = formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || finalId;
      
      const finalData = {
        ...formData,
        id: finalId,
        slug,
        image: imageUrl || '',
        suitableFor: suitableInput.split(',').map(s => s.trim()).filter(Boolean),
        highlights: highlightsInput.split('\n').map(s => s.trim()).filter(Boolean),
        order: formData.order ?? services.length,
      };

      await setDoc(doc(db, 'services', finalId), finalData);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving service: ", error);
      alert("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (!db) return;
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
    
    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order values
    const currentOrder = newServices[index].order ?? index;
    const targetOrder = newServices[targetIndex].order ?? targetIndex;
    
    newServices[index].order = targetOrder;
    newServices[targetIndex].order = currentOrder;

    // Save to DB
    try {
      await updateDoc(doc(db, 'services', newServices[index].id), { order: newServices[index].order });
      await updateDoc(doc(db, 'services', newServices[targetIndex].id), { order: newServices[targetIndex].order });
    } catch (error) {
      console.error("Failed to reorder", error);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading Services...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card border border-border rounded-lg shadow-sm p-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Services Manager</h1>
            <p className="text-muted-foreground">Manage your main catering services.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            setIsDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <div className="flex gap-2">
                {services.length === 0 && (
                  <Button variant="outline" onClick={(e) => { e.preventDefault(); handleSeed(); }}>
                    <Download className="w-4 h-4 mr-2" /> Seed Data
                  </Button>
                )}
                <Button onClick={openAdd}>
                  <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{formData.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 py-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Wedding Catering" />
                  </div>
                  <div className="space-y-2">
                    <Label>Image File</Label>
                    <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required={!formData.image} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description (For Cards)</Label>
                  <Input required value={formData.short} onChange={e => setFormData({...formData, short: e.target.value})} placeholder="Traditional South Indian hospitality..." />
                </div>

                <div className="space-y-2">
                  <Label>Long Description</Label>
                  <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Complete catering details..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Suitable For (Comma separated)</Label>
                    <Input value={suitableInput} onChange={e => setSuitableInput(e.target.value)} placeholder="Weddings, Receptions, Events" />
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Text (For accessibility)</Label>
                    <Input required value={formData.alt} onChange={e => setFormData({...formData, alt: e.target.value})} placeholder="Serving food..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Highlights (One per line)</Label>
                  <Textarea value={highlightsInput} onChange={e => setHighlightsInput(e.target.value)} rows={4} placeholder="Banana-leaf service&#10;Menu tastings..." />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving || (!imageFile && !formData.image)}>
                    {isSaving ? 'Saving...' : 'Save Service'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => moveItem(index, 'down')} disabled={index === services.length - 1}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="w-24 h-24 rounded overflow-hidden bg-muted shrink-0">
                {service.image && (
                  <img 
                    src={
                      service.image.startsWith('/src/assets/') 
                        ? (import.meta.glob('/src/assets/*.{jpg,png,jpeg,webp}', { eager: true, import: 'default' }) as Record<string, string>)[service.image] || service.image
                        : service.image
                    } 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg text-primary truncate">{service.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{service.short}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(service)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className="p-8 text-center bg-muted/30 border border-dashed rounded-lg text-muted-foreground">
              No services found. Click 'Add Service' to get started.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import { GalleryImage, GalleryCategoryItem, defaultGalleryCategories, galleryImages as defaultImages } from '@/data/gallery';
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute('/admin/gallery')({
  component: AdminGallery,
});

function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategoryItem[]>(defaultGalleryCategories);
  const [loading, setLoading] = useState(true);
  
  // Image Dialog State
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageFormData, setImageFormData] = useState<Partial<GalleryImage>>({
    id: '', category: '', title: '', image: '', alt: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Category Dialog State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<GalleryCategoryItem>>({
    name: ''
  });
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  useEffect(() => {
    if (!db) return;

    // Fetch Categories
    const qCategories = query(collection(db, 'galleryCategories'), orderBy('order'));
    const unsubscribeCategories = onSnapshot(qCategories, async (snapshot) => {
      // FORCE SYNC: Ensure all default categories exist and have an 'order' field
      try {
        const rawDocs = await import('firebase/firestore').then(m => m.getDocs(collection(db, 'galleryCategories')));
        const existingIds = new Set(rawDocs.docs.map(d => d.id));
        
        for (const cat of defaultGalleryCategories) {
          if (!existingIds.has(cat.id)) {
            import('firebase/firestore').then(m => m.setDoc(m.doc(db!, 'galleryCategories', cat.id), cat));
          } else {
            const existingData = rawDocs.docs.find(d => d.id === cat.id)?.data();
            if (existingData && existingData.order === undefined) {
              import('firebase/firestore').then(m => m.updateDoc(m.doc(db!, 'galleryCategories', cat.id), { order: cat.order }));
            }
          }
        }
      } catch (e) {
        console.error("Force sync failed", e);
      }

      if (snapshot.empty) {
        for (const cat of defaultGalleryCategories) {
          await setDoc(doc(db, 'galleryCategories', cat.id), cat);
        }
      } else {
        const dbCategories = snapshot.docs.map(doc => doc.data() as GalleryCategoryItem);
        const existingIds = new Set(dbCategories.map(c => c.id));
        const missingDefaults = defaultGalleryCategories.filter(c => !existingIds.has(c.id));
        const combined = [...dbCategories, ...missingDefaults].sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(combined);
      }
    });

    // Fetch Images
    const qImages = query(collection(db, 'galleryImages'), orderBy('order'));
    const unsubscribeImages = onSnapshot(qImages, async (snapshot) => {
      if (snapshot.empty) {
        for (const img of defaultImages) {
          await setDoc(doc(db, 'galleryImages', img.id), img);
        }
      } else {
        const data = snapshot.docs.map(doc => doc.data() as GalleryImage);
        
        // merge static defaults just like categories so UI never breaks
        const existingIds = new Set(data.map(i => i.id));
        const missingDefaults = defaultImages.filter(i => !existingIds.has(i.id));
        const combined = [...data, ...missingDefaults].sort((a, b) => (a.order || 0) - (b.order || 0));
        setImages(combined);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeImages();
    };
  }, []);

  // --- Category Actions ---
  const resetCategoryForm = () => {
    setCategoryFormData({ name: '' });
  };

  const openAddCategory = () => {
    resetCategoryForm();
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string, categoryName: string) => {
    const categoryImages = getImagesForCategory(id);
    if (categoryImages.length > 0) {
      alert(`Cannot delete category "${categoryName}" because it contains ${categoryImages.length} images. Please delete or move them first.`);
      return;
    }
    if (confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      try {
        await deleteDoc(doc(db!, 'galleryCategories', id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete category.');
      }
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) return;
    
    setIsSavingCategory(true);
    try {
      const newId = categoryFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const finalData = {
        id: newId,
        name: categoryFormData.name,
        order: categories.length
      };

      await setDoc(doc(db!, 'galleryCategories', newId), finalData);
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    } catch (error) {
      console.error("Error adding category: ", error);
      alert("Failed to add category");
    } finally {
      setIsSavingCategory(false);
    }
  };

  // --- Image Actions ---
  const resetImageForm = () => {
    setImageFormData({ id: '', category: categories[0]?.id || '', title: '', image: '', alt: '' });
    setImageFile(null);
  };

  const openAddImage = () => {
    resetImageForm();
    setImageFormData({ ...imageFormData, id: `img-${Date.now()}`, order: images.length, category: categories[0]?.id || '' });
    setIsImageDialogOpen(true);
  };

  const handleDeleteImage = async (img: GalleryImage) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteDoc(doc(db!, 'galleryImages', img.id));
        // Delete from storage if it's a firebase storage url
        if (img.image.includes('firebasestorage.googleapis.com') && storage) {
          const fileRef = ref(storage, img.image);
          await deleteObject(fileRef).catch(e => console.error("Could not delete from storage", e));
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl = imageFormData.image;

      if (imageFile && storage) {
        const storageRef = ref(storage, `gallery-images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const finalData = {
        ...imageFormData,
        image: imageUrl || '',
      };

      await setDoc(doc(db!, 'galleryImages', finalData.id!), finalData);
      setIsImageDialogOpen(false);
      resetImageForm();
    } catch (error) {
      console.error("Error saving image: ", error);
      alert("Failed to save image");
    } finally {
      setIsSaving(false);
    }
  };

  const getImagesForCategory = (categoryId: string) => {
    return images.filter(img => img.category === categoryId);
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading Gallery Data...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card border border-border rounded-lg shadow-sm p-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Gallery Manager</h1>
            <p className="text-muted-foreground">Manage your public gallery photos and categories.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            
            {/* ADD CATEGORY DIALOG */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
              if (!open) resetCategoryForm();
              setIsCategoryDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button variant="secondary" onClick={openAddCategory} className="flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveCategory} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input 
                      required 
                      value={categoryFormData.name} 
                      onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} 
                      placeholder="e.g. Birthdays"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSavingCategory || !categoryFormData.name}>
                      {isSavingCategory ? 'Saving...' : 'Save Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* ADD IMAGE DIALOG */}
            <Dialog open={isImageDialogOpen} onOpenChange={(open) => {
              if (!open) resetImageForm();
              setIsImageDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button onClick={openAddImage} className="flex-1 sm:flex-none">
                  <ImageIcon className="w-4 h-4 mr-2" /> Add Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Photo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveImage} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Photo File</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setImageFile(e.target.files?.[0] || null)}
                      required={!imageFormData.image}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      required 
                      value={imageFormData.title} 
                      onChange={e => setImageFormData({...imageFormData, title: e.target.value})} 
                      placeholder="e.g. Wedding Feast"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={imageFormData.category}
                      onChange={e => setImageFormData({...imageFormData, category: e.target.value})}
                      required
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Alt Text (For accessibility)</Label>
                    <Input 
                      required
                      value={imageFormData.alt} 
                      onChange={e => setImageFormData({...imageFormData, alt: e.target.value})} 
                      placeholder="e.g. Serving food on banana leaf"
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSaving || (!imageFile && !imageFormData.image)}>
                      {isSaving ? 'Uploading...' : 'Save Photo'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        <div className="space-y-16">
          {categories.map((category) => {
            const categoryImages = getImagesForCategory(category.id);
            
            return (
              <section 
                key={category.id} 
                className="scroll-mt-24"
              >
                <Reveal className="mb-8 group/cat relative">
                  <div className="flex items-start justify-between">
                    <h2 className="font-display text-4xl sm:text-5xl">
                      {category.name}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/cat:opacity-100 transition-opacity" 
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      title="Delete Category"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </Reveal>

                {categoryImages.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryImages.map(img => (
                      <div key={img.id} className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-[4/3] relative">
                          <img 
                            src={img.image} 
                            alt={img.alt} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium truncate">{img.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted/30 border border-dashed rounded-lg text-muted-foreground">
                    No photos in this category yet.
                  </div>
                )}
              </section>
            );
          })}
        </div>

      </div>
    </div>
  );
}

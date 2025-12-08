import { useState, useEffect } from 'react';
import { Image, Grid, Eye } from 'lucide-react';
import { getGalleryImages, GalleryImage } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Gallery = () => {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const { dataChanged } = useData();

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const galleryData = await getGalleryImages();
        setPhotos(galleryData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, [dataChanged]);

  return (
    <div className="page-bg-clean">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            Photo Gallery
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Relive the memorable moments from our SABL activities.
          </p>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="clean-card overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-2 sm:p-4">
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mb-8">
            {photos.map((photo, index) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div className="group relative clean-card clean-card-hover overflow-hidden cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"><span>Image not available</span></div>';
                          }
                        }}
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <div className="p-2 sm:p-4">
                      <h3 className="font-semibold text-primary text-xs sm:text-sm mb-1 truncate">
                        {photo.caption}
                      </h3>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] max-w-[95vw] max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>{photo.caption}</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center justify-center max-h-[70vh] overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="max-w-full max-h-full object-contain rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl';
                          errorDiv.innerHTML = '<span>Image could not be loaded</span>';
                          parent.appendChild(errorDiv);
                          errorDiv.className = 'w-full h-full flex items-center justify-center bg-gray-100 text-gray-400';
                          errorDiv.innerHTML = '<span>Image not available</span>';
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">No Photos Found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              The gallery is currently empty. Check back later!
            </p>
          </div>
        )}

        {/* Gallery Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 my-8 sm:my-12">
          <div className="stats-card-navy text-center animate-slide-up">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1">{photos.length}</div>
            <div className="text-white/90 text-xs sm:text-sm">Total Photos</div>
          </div>

          <div className="stats-card-light text-center sm:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Grid className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1 text-primary">A Growing Collection</div>
            <div className="text-primary/80 text-xs sm:text-sm">New photos are added regularly</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
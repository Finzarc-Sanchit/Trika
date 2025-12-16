import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';

// Helper function to check if a file is a video
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// All gallery media (images and videos) from public/assets/gallery
// Add your video files here, e.g., '/assets/gallery/video1.mp4'
const galleryMedia = [
  '/assets/gallery/IMG_7253.webp',
  '/assets/gallery/IMG_7410.webp',
  '/assets/gallery/IMG_7457.webp',
  '/assets/gallery/IMG_7459.webp',
  '/assets/gallery/IMG_7460.webp',
  '/assets/gallery/IMG_7465.webp',
  '/assets/gallery/IMG_7466.webp',
  '/assets/gallery/IMG_7641.webp',
  '/assets/gallery/IMG_7647.webp',
  // Add video files here:
  // '/assets/gallery/video1.mp4',
  // '/assets/gallery/video2.webm',
  'https://res.cloudinary.com/dfvj8gw1g/video/upload/v1765885171/IMG_7254_jljmlx.mp4',
  'https://res.cloudinary.com/dfvj8gw1g/video/upload/v1765885229/IMG_7458_agisgl.mov',
  'https://res.cloudinary.com/dfvj8gw1g/video/upload/v1765885227/IMG_7462_dp99c4.mov',
  'https://res.cloudinary.com/dfvj8gw1g/video/upload/v1765885222/IMG_7409_zzsaz2.mov',
  'https://res.cloudinary.com/dfvj8gw1g/video/upload/v1765885221/IMG_7411_fok5b1.mov'
];

interface GalleryModalProps {
  media: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  media,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentMedia = media[currentIndex];
  const isCurrentVideo = isVideo(currentMedia);

  // Pause video when navigating away
  useEffect(() => {
    if (videoRef.current && !isCurrentVideo) {
      videoRef.current.pause();
    }
  }, [currentIndex, isCurrentVideo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrevious();
    if (e.key === 'ArrowRight') onNext();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/95 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-stone-300 transition-colors z-10 p-2"
        aria-label="Close gallery"
      >
        <X size={32} />
      </button>

      <div
        className="relative max-w-7xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {media.length > 1 && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-stone-900/70 hover:bg-stone-900/90 text-white p-3 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Media Container */}
        <div className="flex items-center justify-center">
          {isCurrentVideo ? (
            <video
              ref={videoRef}
              src={currentMedia}
              controls
              autoPlay
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentMedia}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          )}
        </div>

        {/* Next Button */}
        {media.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-stone-900/70 hover:bg-stone-900/90 text-white p-3 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Media Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Show first 3 media items in the preview
  const previewMedia = galleryMedia.slice(0, 3);

  const openModal = (index: number) => {
    setCurrentMediaIndex(index);
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % galleryMedia.length);
  };

  const previousMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + galleryMedia.length) % galleryMedia.length);
  };

  return (
    <>
      <section id="gallery" className="py-24 bg-[#FDFBF9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">
              Visual Journey
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-8 transition-colors duration-300">
              OUR <span className="text-[#967BB6]">GALLERY</span>
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Explore moments from our sound healing sessions, retreats, and transformative experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewMedia.map((mediaUrl, index) => {
              const isMediaVideo = isVideo(mediaUrl);
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  onClick={() => openModal(index)}
                >
                  {isMediaVideo ? (
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={`Gallery preview ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  {/* Play icon overlay for videos */}
                  {isMediaVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play size={24} className="text-stone-900 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  {/* Hover overlay for images */}
                  {!isMediaVideo && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex items-center gap-2 text-white">
                        <ZoomIn size={20} />
                        <span className="text-sm font-medium">Click to view</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => openModal(0)}
              className="inline-flex items-center gap-2 text-[#967BB6] text-sm font-medium border-b border-[#967BB6] hover:text-[#7A5F9F] hover:border-[#7A5F9F] transition-all duration-300 relative group/btn px-4 py-2"
            >
              <ZoomIn size={18} />
              View All Media
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7A5F9F] transition-all duration-300 group-hover/btn:w-full"></span>
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <GalleryModal
          media={galleryMedia}
          currentIndex={currentMediaIndex}
          onClose={closeModal}
          onNext={nextMedia}
          onPrevious={previousMedia}
        />
      )}
    </>
  );
};

export default Gallery;

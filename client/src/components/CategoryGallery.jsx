const CategoryGallery = ({ images, title }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full overflow-hidden bg-neutral-200"
            style={{ aspectRatio: "3 / 4" }}
          >
            <img
              src={image}
              alt={
                title ? `${title} ${index + 1}` : `Gallery image ${index + 1}`
              }
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGallery;

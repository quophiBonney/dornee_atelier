const CategoryHero = ({ title, description, image }) => {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-neutral-900">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        key={image}
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="font-serif text-4xl uppercase tracking-wide sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default CategoryHero;

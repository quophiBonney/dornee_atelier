import { Link } from "react-router-dom";
import { categories } from "../data/Categories";

const CategoryGrid = () => {
  return (
    <section className="mt-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            to={`/products/${category.slug}`}
            key={category.slug}
            className="group relative block aspect-[3/4] w-full overflow-hidden bg-neutral-200"
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

            <div className="absolute inset-x-0 bottom-16 flex flex-col items-center text-center text-white">
              <h3 className="font-serif text-2xl uppercase tracking-wide sm:text-2xl">
                {category.title}
              </h3>
              <div className="mt-3 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  View Product
                </span>
                <span className="h-px w-16 bg-white/80" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;

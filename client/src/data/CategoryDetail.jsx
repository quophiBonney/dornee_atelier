import { useParams, Navigate } from "react-router-dom";
import { categories } from "../data/categories";
import Hero from "../components/CategoryHero";
import CategoryGallery from "../components/CategoryGallery";

const CategoryDetail = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  console.log("category:", category);
  console.log("gallery:", category?.gallery);
  if (!category) {
    return <Navigate to="/products" replace />;
  }

  return (
    <>
      <Hero
        title={category.title}
        description={category.description}
        image={category.image}
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <CategoryGallery images={category.gallery} title={category.title} />
      </section>
    </>
  );
};

export default CategoryDetail;

import HeroCarousel from "@/components/HeroCarousel";
import ProductsCard from "@/components/ProductsCard";
import Searchbar from "@/components/Searchbar";
import { getAllProducts } from "@/lib/actions";
import { connectToDB } from "@/lib/mongoose";
import Image from "next/image";

export default async function Home() {
  const allProducts = await getAllProducts();
  await connectToDB();
  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart shopping starts here
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the power of
              <span className="text-primary"> Dealio</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product, i) => (
            <ProductsCard key={i} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Container from "../shared/Container";

const Banner = () => {
  return (
    <Container>
      <div className="container py-6 bg-white flex flex-col md:flex-row items-center justify-center">
        {/* Text content */}
        <div className="order-2 md:order-1 w-full md:w-1/2 px-6 py-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 select-none">
            ‘From our hands to yours’
          </h2>
          <p className="select-none text-gray-600 mb-3">
            Ladyish began with two friends who share the same love for
            handcrafting. We pour our hearts into every piece we create, and
            Ladyish holds a very special place in our hearts. Our commitment is
            to deliver the finest quality in every product, so you’ll never need
            to look elsewhere.
          </p>
          <p className="select-none text-gray-600 mb-6">
            Thank you for trusting us and our efforts! If you ever have any
            questions or need assistance, we’re here to help.
          </p>
          <div className="flex justify-center md:justify-start">
            <button
              className="bg-rose-200 hover:bg-rose-300 text-gray-800 font-bold py-2 px-4 rounded-full select-none"
              onClick={() => window.open("/products", "_self")}
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 md:order-2 w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
          <Image
            src="/assets/home/banner/top.png"
            alt="Handmade product"
            width={500}
            height={600}
            quality={100}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </Container>
  );
};


export default Banner;

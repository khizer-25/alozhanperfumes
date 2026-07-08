import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { api } from "../../utils/api";

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const cleanPrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;

    return parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#78532f] hover:text-[#d4af37] mb-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* LEFT */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
              className="w-full rounded-lg shadow-xl object-cover"
            />
          </div>

          {/* RIGHT */}
          <div>

            <p className="uppercase tracking-[0.3em] text-[#b38f44] text-sm mb-2">
              {product.brand}
            </p>

            <h1 className="text-5xl font-light text-[#2b2019] mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}

              <span className="ml-2 text-gray-600">
                ({product.numReviews} Reviews)
              </span>
            </div>

            {/* Price */}
            <h2 className="text-4xl text-[#d4af37] mb-6">
              ₹{cleanPrice(product.price).toLocaleString("en-IN")}
            </h2>

            {/* Stock */}
            <div className="mb-6">
              {product.countInStock > 0 ? (
                <span className="text-green-600 font-semibold">
                  ✓ In Stock ({product.countInStock})
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-[#2b2019]">
                Description
              </h3>

              <p className="text-gray-700 leading-8">
                {product.description}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6 mb-8">

              <div>
                <h4 className="font-semibold mb-2">Category</h4>
                <p>{product.category}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Family</h4>
                <p>{product.family}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Gender</h4>
                <p>{product.gender}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Brand</h4>
                <p>{product.brand}</p>
              </div>

            </div>

            {/* Notes */}
            <div className="space-y-5 mb-10">

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Top Notes
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.topNotes?.map((note) => (
                    <span
                      key={note}
                      className="bg-[#ede4d6] px-3 py-1 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Middle Notes
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.middleNotes?.map((note) => (
                    <span
                      key={note}
                      className="bg-[#ede4d6] px-3 py-1 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Base Notes
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.baseNotes?.map((note) => (
                    <span
                      key={note}
                      className="bg-[#ede4d6] px-3 py-1 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Occasions */}
            <div className="mb-10">
              <h3 className="font-semibold text-lg mb-2">
                Best For
              </h3>

              <div className="flex flex-wrap gap-2">
                {product.occasions?.map((item) => (
                  <span
                    key={item}
                    className="bg-[#d4af37] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              disabled={product.countInStock === 0}
              onClick={() => onAddToCart(product)}
              className={`w-full py-4 rounded-md text-lg font-semibold transition flex justify-center items-center gap-3
                ${
                  product.countInStock > 0
                    ? "bg-[#2b2019] text-white hover:bg-[#d4af37]"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
            >
              <ShoppingBag className="w-5 h-5" />

              {product.countInStock > 0
                ? "Add To Cart"
                : "Out Of Stock"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
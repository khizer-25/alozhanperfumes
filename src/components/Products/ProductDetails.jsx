import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { api } from "../../utils/api";

function ProductDetails({ onAddToCart }) {
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
      <div className="min-h-screen flex justify-center items-center bg-[#fdfcf9]">
        <p className="text-xl text-[#362720]">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fdfcf9]">
        <p className="text-xl text-red-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfcf9] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 text-[#78532f] hover:text-[#d4af37] transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-14">

          {/* Image */}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
              className="w-full h-[650px] object-cover"
            />
          </div>

          {/* Details */}

          <div>

            <p className="uppercase tracking-[0.3em] text-xs text-[#d4af37] font-bold">
              {product.category}
            </p>

            <h1 className="text-5xl font-light mt-3 text-[#362720]">
              {product.name}
            </h1>

            <h2 className="text-lg text-stone-500 mt-2">
              {product.brand}
            </h2>

            {/* Rating */}

            <div className="flex items-center gap-2 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}

              <span className="text-stone-600">
                ({product.numReviews || 0} Reviews)
              </span>
            </div>

            {/* Price */}

            <h2 className="text-4xl mt-6 text-[#78532f] font-light">
              ₹{cleanPrice(product.price).toLocaleString("en-IN")}
            </h2>

            {/* Stock */}

            <div className="mt-6">

              {product.countInStock > 10 && (
                <span className="text-green-600 font-semibold">
                  ● In Stock
                </span>
              )}

              {product.countInStock > 0 &&
                product.countInStock <= 10 && (
                  <span className="text-orange-500 font-semibold">
                    ● Only {product.countInStock} left
                  </span>
                )}

              {product.countInStock === 0 && (
                <span className="text-red-600 font-semibold">
                  ● Out of Stock
                </span>
              )}

            </div>

            {/* Description */}

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-[#362720]">
                Description
              </h3>

              <p className="text-stone-600 leading-8">
                {product.description}
              </p>
            </div>

            {/* Details */}

            <div className="grid grid-cols-2 gap-5 mt-10">

              <div>
                <p className="text-stone-500">Brand</p>
                <p className="font-semibold">{product.brand}</p>
              </div>

              <div>
                <p className="text-stone-500">Family</p>
                <p className="font-semibold">{product.family}</p>
              </div>

              <div>
                <p className="text-stone-500">Gender</p>
                <p className="font-semibold">{product.gender}</p>
              </div>

              <div>
                <p className="text-stone-500">Category</p>
                <p className="font-semibold">{product.category}</p>
              </div>

            </div>

            {/* Top Notes */}

            {product.topNotes?.length > 0 && (
              <div className="mt-10">

                <h3 className="font-semibold text-lg mb-3">
                  Top Notes
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.topNotes.map((note, index) => (
                    <span
                      key={index}
                      className="bg-[#f3ede6] px-4 py-2 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Middle Notes */}

            {product.middleNotes?.length > 0 && (
              <div className="mt-8">

                <h3 className="font-semibold text-lg mb-3">
                  Middle Notes
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.middleNotes.map((note, index) => (
                    <span
                      key={index}
                      className="bg-[#f3ede6] px-4 py-2 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Base Notes */}

            {product.baseNotes?.length > 0 && (
              <div className="mt-8">

                <h3 className="font-semibold text-lg mb-3">
                  Base Notes
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.baseNotes.map((note, index) => (
                    <span
                      key={index}
                      className="bg-[#f3ede6] px-4 py-2 rounded-full text-sm"
                    >
                      {note}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Occasions */}

            {product.occasions?.length > 0 && (
              <div className="mt-8">

                <h3 className="font-semibold text-lg mb-3">
                  Best For
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.occasions.map((occasion, index) => (
                    <span
                      key={index}
                      className="bg-[#d4af37] text-white px-4 py-2 rounded-full text-sm"
                    >
                      {occasion}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Button */}

            <button
              disabled={product.countInStock === 0}
              onClick={() => onAddToCart(product)}
              className={`mt-12 w-full py-4 rounded-md font-semibold text-lg transition flex justify-center items-center gap-3
                ${
                  product.countInStock > 0
                    ? "bg-[#78532f] hover:bg-[#5e4123] text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
            >
              <ShoppingBag size={20} />

              {product.countInStock > 0
                ? "Add To Cart"
                : "Out Of Stock"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
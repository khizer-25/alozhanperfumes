import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ReviewsTab = ({
  products,
  reviewsList,
  reviewSearchQuery,
  setReviewSearchQuery,
  averageReviewRating,
  reviewActionSuccess,
  selectedReviewForReply,
  setSelectedReviewForReply,
  reviewReplyText,
  setReviewReplyText,
  handleReviewStatusUpdate,
  handleReviewReplySubmit
}) => {
  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

    <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">
            Review Management
        </h1>

        <p className="text-xs text-stone-500 font-light mt-1">
            Monitor customer reviews and reply to customer feedback.
        </p>
    </div>

    <div className="flex gap-3 items-center">

        <div className="relative w-64">
            <input
    type="text"
    placeholder="Search by customer, perfume or comment..."
    value={reviewSearchQuery}
    onChange={(e) => setReviewSearchQuery(e.target.value)}
    className="w-full bg-white border border-stone-200 rounded-sm py-1.5 px-3 text-xs focus:outline-none"
/>
        </div>

        <div className="bg-white border border-stone-200 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
            {averageReviewRating.toFixed(1)} / 5
        </div>

    </div>

</div>

      {/* Review metrics: top and low rated perfumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Rated */}
        <div className="bg-green-50/20 border border-green-200/60 p-4 rounded-sm">
          <h4 className="text-[10px] uppercase tracking-widest text-green-800 font-bold mb-2.5">Top-Rated Perfumes (Rating &gt;= 4.5)</h4>
          <div className="space-y-2 h-[120px] overflow-y-auto pr-1">
            {products.filter(p => p.rating >= 4.5).map(p => (
              <div key={p._id} className="flex justify-between items-center text-xs font-semibold text-stone-700">
                <span>{p.name}</span>
                <span className="font-mono text-green-700 font-bold">{p.rating.toFixed(1)} ★</span>
              </div>
            ))}
            {products.filter(p => p.rating >= 4.5).length === 0 && (
              <p className="text-stone-400 text-xs font-light">No top rated products yet.</p>
            )}
          </div>
        </div>

        {/* Low Rated */}
        <div className="bg-red-50/20 border border-red-200/60 p-4 rounded-sm">
          <h4 className="text-[10px] uppercase tracking-widest text-red-800 font-bold mb-2.5">Low-Rated Perfumes (Rating &lt;= 3.0)</h4>
          <div className="space-y-2 h-[120px] overflow-y-auto pr-1">
            {products.filter(p => p.rating > 0 && p.rating <= 3.0).map(p => (
              <div key={p._id} className="flex justify-between items-center text-xs font-semibold text-stone-700">
                <span>{p.name}</span>
                <span className="font-mono text-red-700 font-bold">{p.rating.toFixed(1)} ★</span>
              </div>
            ))}
            {products.filter(p => p.rating > 0 && p.rating <= 3.0).length === 0 && (
              <p className="text-stone-400 text-xs font-light">No low rated products found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Listing */}
      <div className="bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
        <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Customer Reviews Moderation Queue</h3>

        {reviewActionSuccess && <div className="p-2 bg-green-50 text-green-800 text-[10px] rounded-xs font-bold uppercase tracking-wider">Action processed!</div>}

        <div className="divide-y divide-stone-100 space-y-4">
          {reviewsList.map((rev) => (
            <div key={rev._id} className="pt-4 first:pt-0 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-medium">

              <div className="space-y-1.5 max-w-xl">
                <div className="space-y-1">

  <div className="flex items-center justify-between">

    <div>

      <h4 className="font-semibold text-stone-800">
        {rev.name}
      </h4>

      <p className="text-[10px] text-stone-500">
        {rev.productName}
      </p>

    </div>

    <span className={`text-[8px] font-bold px-2 py-1 rounded-xs uppercase tracking-wider border ${
      rev.status === "approved"
        ? "border-green-200 text-green-700 bg-green-50"
        : rev.status === "rejected"
        ? "border-red-200 text-red-700 bg-red-50"
        : "border-stone-200 text-stone-600 bg-stone-50"
    }`}>
      {rev.status}
    </span>

  </div>

  <div className="flex items-center gap-3 text-[10px] text-stone-500">

   <div className="flex">
  {Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`w-3 h-3 ${
        index < rev.rating
          ? "fill-[#d4af37] text-[#d4af37]"
          : "text-stone-300"
      }`}
    />
  ))}
</div>

    <span>
      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </span>

  </div>

</div>

                <p className="text-stone-600 font-light leading-relaxed">{rev.comment}</p>

                {rev.reply && (
                  <div className="p-2 bg-stone-50 border-l-2 border-[#d4af37] text-[10px] font-light text-stone-500">
                    <strong>Official Reply:</strong> {rev.reply}
                  </div>
                )}

                {selectedReviewForReply?._id === rev._id && (
                  <form onSubmit={handleReviewReplySubmit} className="flex gap-2 items-end pt-2">
                    <textarea
                      required placeholder="Write a reply..." rows="2"
                      value={reviewReplyText} onChange={(e) => setReviewReplyText(e.target.value)}
                      className="bg-stone-50 border border-stone-200 rounded-sm p-2 text-[10px] flex-grow focus:outline-none focus:border-[#d4af37]"
                    />
                    <button type="submit" className="bg-[#26201c] hover:bg-black text-[#d4af37] text-[9px] font-bold px-3 py-2 rounded-sm uppercase shadow-xs shrink-0">
                      Submit Reply
                    </button>
                  </form>
                )}
              </div>

              <div className="flex gap-2 shrink-0 md:self-center">
                <button onClick={() => handleReviewStatusUpdate(rev._id, rev.productId, 'approved')} className="text-[8px] font-bold uppercase tracking-wider border border-green-200 text-green-700 px-2 py-1 rounded-xs bg-green-50/30 hover:bg-green-50">
                  Approve
                </button>
                <button onClick={() => handleReviewStatusUpdate(rev._id, rev.productId, 'rejected')} className="text-[8px] font-bold uppercase tracking-wider border border-red-200 text-red-700 px-2 py-1 rounded-xs bg-red-50/30 hover:bg-red-50">
                  Reject
                </button>
                <button onClick={() => handleReviewStatusUpdate(rev._id, rev.productId, 'hidden')} className="text-[8px] font-bold uppercase tracking-wider border border-stone-200 text-stone-500 px-2 py-1 rounded-xs bg-stone-50 hover:bg-stone-100">
                  Hide
                </button>
                <button onClick={() => setSelectedReviewForReply(rev)} className="text-[8px] font-bold uppercase tracking-wider border border-[#d4af37] text-black px-2 py-1 rounded-xs bg-[#d4af37]/15 hover:bg-[#d4af37]/35">
                  {rev.reply ? "Edit Reply" : "Reply"}
                </button>
              </div>

            </div>
          ))}
          {reviewsList.length === 0 && (
            <div className="text-center py-10 text-stone-400 font-light">No reviews found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewsTab;

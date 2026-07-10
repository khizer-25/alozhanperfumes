import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2 } from 'lucide-react';

const QueriesTab = ({ queries, loading, handleDeleteQuery }) => {
  return (
    <motion.div
      key="customer-queries"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-light text-[#261c16] tracking-tight">Customer Queries</h1>
          <p className="text-xs text-stone-500 font-light mt-1">Review contact form submissions, guest emails, and direct queries.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-stone-400">Loading queries...</div>
      ) : queries.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-sm text-center py-20 px-6">
          <MessageSquare size={48} strokeWidth={1} className="mb-3 text-[#d4af37] mx-auto opacity-60" />
          <p className="text-xs tracking-wider uppercase font-semibold text-stone-600">No Queries Discovered</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {queries.map((query) => (
            <div key={query._id} className="bg-white border border-stone-200 hover:border-stone-300 rounded-sm p-5 space-y-3 transition-all shadow-xs text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-stone-850 text-sm">{query.name}</h3>
                  <a href={`mailto:${query.email}`} className="text-xs text-[#b38f44] hover:underline font-semibold block">{query.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-stone-400">{new Date(query.createdAt).toLocaleString()}</span>
                  <button onClick={() => handleDeleteQuery(query._id)} className="p-1 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-full transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 bg-stone-50 border-l-2 border-[#d4af37] text-stone-600 font-light leading-relaxed whitespace-pre-wrap">
                {query.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QueriesTab;

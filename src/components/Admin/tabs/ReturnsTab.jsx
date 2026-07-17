import React from 'react';
import { motion } from 'framer-motion';

const ReturnsTab = ({
  returnsList, returnActionSuccess,
  returnRefundAmount, setReturnRefundAmount,
  handleReturnAction
}) => {
  return (
    <motion.div
      key="returns"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">Returns & Refunds Queue</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Moderate customer return requests, request product image evidence, and issue payments refunds.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
        <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Return Requests Queue</h3>

        {returnActionSuccess && <div className="p-2 bg-green-50 text-green-800 text-[10px] rounded-xs font-bold uppercase tracking-wider">Returns request updated!</div>}

        <div className="divide-y divide-stone-100 space-y-4">
          {returnsList.map((ret) => (
            <div key={ret._id} className="pt-4 first:pt-0 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-medium">

              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-850">{ret.user?.name}</span>
                  <span className="text-stone-400 text-[9px]">- on Order ID {ret.order?._id}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-wider border ${
                    ret.status === 'Refunded' ? 'border-green-200 text-green-700 bg-green-50' : ret.status === 'Rejected' ? 'border-red-200 text-red-700 bg-red-50' : 'border-amber-200 text-amber-700 bg-amber-50'
                  }`}>{ret.status}</span>
                </div>

                <p className="text-stone-600 font-light"><strong className="font-medium text-stone-800">Reason:</strong> {ret.reason}</p>
                <p className="text-stone-600 font-light font-mono text-[10px]"><strong className="font-medium text-stone-800 font-sans">Refund Amount:</strong> ${ret.refundAmount.toFixed(2)}</p>

                {/* Display returns products */}
                <div className="space-y-1 pt-1.5">
                  <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold block">Return Items</span>
                  {ret.items?.map((item, idx) => (
                    <p key={idx} className="text-stone-500 font-mono text-[10px] font-light">
                      {item.name} × {item.qty}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {ret.status === 'Pending' && (
                  <div className="space-y-2">
                    <input
                      type="number" placeholder="Refund amount..."
                      value={returnRefundAmount} onChange={(e) => setReturnRefundAmount(e.target.value)}
                      className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-xs focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleReturnAction(ret._id, 'Approved')} className="text-[8px] font-bold uppercase tracking-wider border border-green-200 text-green-700 px-2 py-1 rounded-xs bg-green-50/50 hover:bg-green-50">
                        Approve
                      </button>
                      <button onClick={() => handleReturnAction(ret._id, 'Rejected')} className="text-[8px] font-bold uppercase tracking-wider border border-red-200 text-red-700 px-2 py-1 rounded-xs bg-red-50/50 hover:bg-red-50">
                        Reject
                      </button>
                      <button onClick={() => handleReturnAction(ret._id, 'ImagesRequested')} className="text-[8px] font-bold uppercase tracking-wider border border-amber-200 text-amber-700 px-2 py-1 rounded-xs bg-amber-50/50 hover:bg-amber-50">
                        Ask Pics
                      </button>
                    </div>
                  </div>
                )}

                {ret.status === 'Approved' && (
                  <button onClick={() => handleReturnAction(ret._id, 'Refunded')} className="text-[8px] font-bold uppercase tracking-wider bg-green-600 text-white py-1 px-3.5 rounded-xs hover:bg-green-700">
                    Issue Refund 
                  </button>
                )}

                {(ret.status === 'Refunded' || ret.status === 'Rejected') && (
                  <span className="text-[9px] text-stone-400 font-mono italic">
                    Closed on {new Date(ret.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

            </div>
          ))}
          {returnsList.length === 0 && (
            <div className="text-center py-10 text-stone-400 font-light">No return requests</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReturnsTab;

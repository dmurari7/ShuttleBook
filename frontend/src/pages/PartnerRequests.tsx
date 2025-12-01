// src/pages/PartnerRequests.tsx
import { useEffect, useState } from "react";
import { getIncomingRequests, getOutgoingRequests, respondToRequest } from "../api/partners";

export default function PartnerRequests() {
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [tab, setTab] = useState<"incoming" | "outgoing">("incoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const [incRes, outRes] = await Promise.all([
        getIncomingRequests(),
        getOutgoingRequests(),
      ]);
      // Filter incoming to only show pending requests
      const incomingRequests = incRes.data.requests || incRes.data || [];
      const pendingIncoming = incomingRequests.filter((r: any) => r.status === "pending");
      
      setIncoming(pendingIncoming);
      setOutgoing(outRes.data.requests || outRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond(requestId: string, action: "accepted" | "rejected") {
    try {
      await respondToRequest(requestId, action);
      // Reload the requests to reflect the changes
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to respond to request");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent pb-2">
          Partner Requests
        </h1>

        {/* Tabs */}
        <div className="flex mb-8 gap-2">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              tab === "incoming" 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setTab("incoming")}
          >
            Incoming Requests
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              tab === "outgoing" 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setTab("outgoing")}
          >
            Outgoing Requests
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
            <p className="text-gray-600 text-lg">Loading requests...</p>
          </div>
        )}

        {/* Incoming requests */}
        {!loading && tab === "incoming" && (
          <div className="space-y-4">
            {incoming.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
                <p className="text-gray-600 text-lg">No incoming requests</p>
              </div>
            )}
            {incoming.map((r) => (
              <div
                key={r._id}
                className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all"
              >
                <div>
                  <p className="font-bold text-xl text-blue-700">{r.fromUser?.username || "Unknown User"}</p>
                  <p className="text-gray-700 text-lg mt-1">
                    {r.booking?.timeSlot} on {new Date(r.booking?.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">Court {r.booking?.courtNumber} - {r.booking?.location}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => handleRespond(r._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => handleRespond(r._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Outgoing requests */}
        {!loading && tab === "outgoing" && (
          <div className="space-y-4">
            {outgoing.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
                <p className="text-gray-600 text-lg">No outgoing requests</p>
              </div>
            )}
            {outgoing.map((r) => (
              <div 
                key={r._id} 
                className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-200"
              >
                <div>
                  <p className="font-bold text-xl text-blue-700">{r.toUser?.username || "Unknown User"}</p>
                  <p className="text-gray-700 text-lg mt-1">
                    {r.booking?.timeSlot} on {new Date(r.booking?.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">Court {r.booking?.courtNumber} - {r.booking?.location}</p>
                  <div className="mt-3 pt-3 border-t-2 border-blue-100">
                    <p className={`font-semibold text-lg ${
                      r.status === 'accepted' ? 'text-green-600' : 
                      r.status === 'rejected' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      Status: {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
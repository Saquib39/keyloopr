'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import KeyForm from '@/components/KeyForm';

export default function AddKeyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      console.warn("🚨 Project ID is missing in the route.");
    }
  }, [id]);

  const handleSuccess = () => {
    router.push(`/dashboard/projects/${id}`);
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Add New Key</h1>
      <KeyForm
        projectId={id}
        onSuccess={handleSuccess}
        loading={loading} // optional, if you want to handle loading state inside
      />
    </div>
    </div>
  );
}

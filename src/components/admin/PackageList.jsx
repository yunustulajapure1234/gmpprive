import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { confirmDelete, toastSuccess } from "../../utils/alert";

const PackageList = ({ onEdit }) => {
  const { packages, deletePackage } = useAdmin();

  const handleDelete = async (id) => {
    const ok = await confirmDelete();
    if (!ok) return;
    await deletePackage(id);
    toastSuccess("Package deleted");
  };

  if (!packages.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-3">🎁</div>
        <p className="text-gray-400">No packages yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {packages.map((pkg) => (
        <div
          key={pkg._id}
          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-amber-300 transition"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {pkg.title}
              </h3>
              {pkg.titleAr && (
                <p className="text-sm text-gray-500">{pkg.titleAr}</p>
              )}
            </div>
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-semibold">
              Package
            </span>
          </div>

          {/* Description */}
          {pkg.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {pkg.description}
            </p>
          )}

          {/* Info Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {pkg.gender && (
              <span className={`text-xs px-2 py-1 rounded ${
                pkg.gender === 'women' 
                  ? 'bg-pink-50 text-pink-600' 
                  : 'bg-blue-50 text-blue-600'
              }`}>
                {pkg.gender === 'women' ? '👩 Women' : '👨 Men'}
              </span>
            )}
            {pkg.services?.length > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {pkg.services.length} services
              </span>
            )}
            {pkg.totalDuration && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                ⏱ {pkg.totalDuration} min
              </span>
            )}
          </div>

          {/* Price */}
          <div className="bg-amber-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Price</p>
            <p className="text-2xl font-bold text-amber-600">
              {pkg.price} <span className="text-sm">AED</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(pkg)}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(pkg._id)}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageList;
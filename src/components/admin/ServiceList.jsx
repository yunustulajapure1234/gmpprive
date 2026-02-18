import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { confirmDelete, toastSuccess } from "../../utils/alert";

const ServiceList = ({ gender, onEdit }) => {
  const { getServicesByGender, deleteService } = useAdmin();
  const services = getServicesByGender(gender);

  const handleDelete = async (id) => {
    const ok = await confirmDelete();
    if (!ok) return;
    await deleteService(id);
    toastSuccess("Service deleted");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => {
        const imageSource = service.imageUrl || service.image;

        return (
          <div
            key={service._id}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {imageSource ? (
                <img
                  src={imageSource}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                {service.nameAr}
              </p>

              {service.category && (
                <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mb-3">
                  {service.category}
                </span>
              )}

              {/* Pricing */}
              <div className="mb-4">
                {service.durations?.length > 0 ? (
                  <div className="space-y-1">
                    {service.durations.map((d, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm bg-gray-50 px-3 py-1.5 rounded"
                      >
                        <span className="text-gray-600">{d.minutes} min</span>
                        <span className="font-semibold text-amber-600">
                          {d.price} AED
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-amber-50 px-3 py-2 rounded">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-lg font-bold text-amber-600">
                      {service.price} AED
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(service)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {services.length === 0 && (
        <div className="col-span-full text-center py-16">
          <svg
            className="w-20 h-20 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-500 font-medium text-lg mb-2">
            No services yet
          </p>
          <p className="text-gray-400 text-sm">
            Click "Add New Service" to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
import React from "react";

const StaffCard = ({ staff, selected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(staff)}
      className={`border rounded-2xl p-4 cursor-pointer transition
        ${
          selected
            ? "border-amber-500 bg-amber-50 shadow-lg"
            : "border-gray-200 hover:shadow-md"
        }`}
    >
      <div className="flex items-center gap-4">
        <img
          src={staff.photo || "https://i.pravatar.cc/100"}
          alt={staff.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="font-bold text-lg">{staff.name}</h3>

          <p className="text-sm text-gray-500">
            ⭐ {staff.rating || 4.8} · {staff.experience || "5+ yrs"}
          </p>

          <p className="text-xs text-green-600 mt-1">
            {staff.available ? "Available" : "Busy"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;

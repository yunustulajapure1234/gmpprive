import Swal from "sweetalert2";

// ✅ SUCCESS
export const toastSuccess = (text) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: 2000,
  });
};

// ✅ ERROR
export const toastError = (text) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: text,
    showConfirmButton: false,
    timer: 2500,
  });
};

// ✅ DELETE CONFIRM
export const confirmDelete = async () => {
  const res = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete",
  });

  return res.isConfirmed;
};

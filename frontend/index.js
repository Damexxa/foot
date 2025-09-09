document.addEventListener("DOMContentLoaded", () => {
  // Toggle payment details
  const payBtn = document.getElementById("payBtn");
  const paymentDetails = document.getElementById("paymentDetails");

  payBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form submit when clicking payment button
    paymentDetails.style.display =
      paymentDetails.style.display === "block" ? "none" : "block";
  });

  // Handle form submission with SweetAlert2
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire({
            title: "✅ Success!",
            text: "Your form has been submitted successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          form.reset();
        } else {
          Swal.fire({
            title: "❌ Error!",
            text: "Something went wrong. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: "⚠️ Network Error!",
          text: "Please check your internet connection.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      });
  });
});

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const formData = new FormData(form);

    try {
      // Use your live Render backend URL here
      const res = await fetch("https://e3footbal.onrender.com/register", {
        method: "POST",
        body: formData,
      });

      const text = await res.text(); // get backend response

      if (res.ok) {
        Swal.fire({
          title: "✅ Success!",
          text: text,
          icon: "success",
          confirmButtonText: "OK",
        });
        form.reset();
      } else {
        Swal.fire({
          title: "❌ Error!",
          text: text || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "⚠️ Network Error!",
        text: "Please check your internet connection.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  });
});

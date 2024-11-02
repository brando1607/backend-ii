const removeOneButtons = document.querySelectorAll(".btn");
const removeAllButtons = document.querySelectorAll(".btn2");

removeOneButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const productElement = button.closest(".product");
    const product = productElement.querySelector("input[name='name']");

    fetch("/api/cart/remove-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: product.value,
      }),
    })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          return response.json();
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});

removeAllButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const productElement = button.closest(".product");
    const product = productElement.querySelector("input[name='name']");
    const amountToRemove = productElement.querySelector("input[name='amount']");

    fetch("/api/cart/remove-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: product.value,
        amount: amountToRemove.value,
      }),
    })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          return response.json();
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});

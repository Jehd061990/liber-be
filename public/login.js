const form = document.getElementById("loginForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      status.textContent = data.message || "Login failed";
      status.classList.add("error");
      return;
    }

    status.textContent = "Login successful. Token copied to clipboard.";
    status.classList.remove("error");

    if (data.token) {
      await navigator.clipboard.writeText(data.token);
    }
  } catch (error) {
    status.textContent = "Login failed. Try again.";
    status.classList.add("error");
  }
});

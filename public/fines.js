document.addEventListener("DOMContentLoaded", () => {
  const finesTable = document
    .getElementById("finesTable")
    .querySelector("tbody");
  const noFines = document.getElementById("noFines");
  const totalFines = document.getElementById("totalFines");
  const unpaidFines = document.getElementById("unpaidFines");
  const amountDue = document.getElementById("amountDue");
  const paidAmount = document.getElementById("paidAmount");
  const search = document.getElementById("search");
  const filterAll = document.getElementById("filterAll");
  const filterUnpaid = document.getElementById("filterUnpaid");
  const filterPaid = document.getElementById("filterPaid");
  const addFineBtn = document.getElementById("addFineBtn");
  const fineModal = document.getElementById("fineModal");
  const closeModal = document.getElementById("closeModal");
  const fineForm = document.getElementById("fineForm");
  const readerSelect = document.getElementById("reader");

  let fines = [];
  let filter = "all";

  async function fetchFines() {
    const res = await fetch(
      `/api/fines?search=${search.value}&status=${filter}`,
    );
    fines = await res.json();
    renderFines();
    updateSummary();
  }

  function renderFines() {
    finesTable.innerHTML = "";
    if (!fines.length) {
      noFines.style.display = "block";
      return;
    }
    noFines.style.display = "none";
    fines.forEach((fine) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${fine.reader?.name || "-"}</td>
        <td>${fine.type}</td>
        <td>${fine.book?.title || fine.reason}</td>
        <td>$${fine.amount.toFixed(2)}</td>
        <td>${fine.createdAt ? new Date(fine.createdAt).toLocaleDateString() : "-"}</td>
        <td>${fine.paidAt ? new Date(fine.paidAt).toLocaleDateString() : "-"}</td>
        <td>${fine.status}</td>
        <td>
          ${fine.status === "unpaid" ? `<button data-id="${fine._id}" class="payBtn">Mark Paid</button>` : ""}
          <button data-id="${fine._id}" class="deleteBtn">Delete</button>
        </td>
      `;
      finesTable.appendChild(tr);
    });
    attachRowEvents();
  }

  function updateSummary() {
    totalFines.textContent = fines.length;
    const unpaid = fines.filter((f) => f.status === "unpaid");
    unpaidFines.textContent = unpaid.length;
    const due = unpaid.reduce((sum, f) => sum + f.amount, 0);
    amountDue.textContent = `$${due.toFixed(2)}`;
    const paid = fines
      .filter((f) => f.status === "paid")
      .reduce((sum, f) => sum + f.amount, 0);
    paidAmount.textContent = `$${paid.toFixed(2)}`;
  }

  function attachRowEvents() {
    document.querySelectorAll(".payBtn").forEach((btn) => {
      btn.onclick = async () => {
        await fetch(`/api/fines/${btn.dataset.id}/pay`, { method: "POST" });
        fetchFines();
      };
    });
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.onclick = async () => {
        if (confirm("Delete this fine?")) {
          await fetch(`/api/fines/${btn.dataset.id}`, { method: "DELETE" });
          fetchFines();
        }
      };
    });
  }

  search.oninput = fetchFines;
  filterAll.onclick = () => {
    filter = "all";
    fetchFines();
  };
  filterUnpaid.onclick = () => {
    filter = "unpaid";
    fetchFines();
  };
  filterPaid.onclick = () => {
    filter = "paid";
    fetchFines();
  };

  addFineBtn.onclick = () => {
    fineModal.style.display = "block";
    loadReaders();
  };
  closeModal.onclick = () => {
    fineModal.style.display = "none";
  };

  async function loadReaders() {
    const res = await fetch("/api/readers");
    const readers = await res.json();
    readerSelect.innerHTML = readers
      .map((r) => `<option value="${r._id}">${r.name}</option>`)
      .join("");
  }

  fineForm.onsubmit = async (e) => {
    e.preventDefault();
    const reader = readerSelect.value;
    const amount = fineForm.amount.value;
    const reason = fineForm.reason.value;
    await fetch("/api/fines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reader, type: "manual", amount, reason }),
    });
    fineModal.style.display = "none";
    fetchFines();
  };

  window.onclick = (event) => {
    if (event.target === fineModal) fineModal.style.display = "none";
  };

  fetchFines();
});

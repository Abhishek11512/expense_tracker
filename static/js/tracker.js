async function LoadExpenseFromBackend() {
  const res = await fetch("/api/expense");
  const data = await res.json();
  const tbody = document.getElementById("expenseTableBody");
  const totalDisplay = document.getElementById("totalDisplay");
  tbody.innerHTML = "";
  totalDisplay.textContent = data.total;

  data.expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.style.borderBottom = "1px solid #ddd";

    const tdId = document.createElement("td");
    tdId.textContent = expense.id;
    tdId.style.padding = "10px";

    const tdItem = document.createElement("td");
    tdItem.textContent = expense.item;
    tdItem.style.padding = "10px";

    const tdAmount = document.createElement("td");
    tdAmount.textContent = expense.amount;
    tdAmount.style.padding = "10px";

    const tdCategory = document.createElement("td");
    tdCategory.textContent = expense.category;
    tdCategory.style.padding = "10px";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "#dc3545";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "6px 12px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = () => deleteExpenseFromBackend(expense.id);

    const tdAction = document.createElement("td");
    tdAction.style.padding = "10px";
    tdAction.appendChild(deleteBtn);

    row.appendChild(tdId);
    row.appendChild(tdItem);
    row.appendChild(tdAmount);
    row.appendChild(tdCategory);
    row.appendChild(tdAction);

    tbody.appendChild(row);
  });
}

async function AddExpenseToBackend() {
  const item = document.getElementById("itemField").value.trim();
  const amount = document.getElementById("amountField").value.trim();
  const category = document.getElementById("categoryField").value.trim();

  if (!item || !category || !amount) {
    return alert("Please Enter the Data First!");
  }

  const res = await fetch("/api/add_expense", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      item: item,
      amount: amount,
      category: category,
    }),
  });

  if (res.ok) {
    alert("Expense Logged Successfully!");
    document.getElementById("itemField").value = "";
    document.getElementById("amountField").value = "";
    document.getElementById("categoryField").value = "";
    LoadExpenseFromBackend();
  } else {
    alert("Failed to log expense!!");
  }
}

async function deleteExpenseFromBackend(expenseId) {
  if (!confirm("Are you sure you want to delete the record?")) return;

  const res = await fetch("/api/delete_expense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: expenseId }),
  });

  if (res.ok) {
    LoadExpenseFromBackend();
  } else {
    alert("Failed to delete expense!!");
  }
}

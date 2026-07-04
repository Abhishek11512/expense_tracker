const MONTHLY_BUDGET_CEILING = 10000;

async function LoadExpenseFromBackend() {
  const res = await fetch("/api/expense");
  const data = await res.json();
  const tbody = document.getElementById("expenseTableBody");
  const totalDisplay = document.getElementById("totalDisplay");
  tbody.innerHTML = "";
  const formattedTotal = Number(data.total).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
  totalDisplay.textContent = formattedTotal;
  let fillPercentage = (data.total / MONTHLY_BUDGET_CEILING) * 100;
  if (fillPercentage > 100) fillPercentage = 100;
  const bar = document.getElementById('progressBar');
  bar.style.width = fillPercentage + "%";
  if (fillPercentage >= 80) {
    bar.style.backgroundColor = "#dc3545"
  } else {
    bar.style.backgroundColor = "#007bff"
  }

  data.expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.style.borderBottom = "1px solid #ddd";

    const formattedAmount = Number(expense.amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    });

    const tdId = createCell(expense.id);
    const tdItem = createCell(expense.item);
    const tdAmount = createCell(formattedAmount);
    const tdCategory = createCell(expense.category);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
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

//DOM factory function to optimise cell creation
function createCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  td.style.padding = '10px';
  return td; // Sends completed cell back to the loop
}
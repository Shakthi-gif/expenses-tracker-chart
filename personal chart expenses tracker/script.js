const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (title && amount && category) {
    const expense = { title, amount, category };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    updateChart();
    form.reset();
  }
});

function renderExpenses() {
  list.innerHTML = "";
  let total = 0;
  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${expense.title} - ₹${expense.amount} [${expense.category}]
      <button onclick="deleteExpense(${index})">❌</button>
    `;
    list.appendChild(li);
    total += expense.amount;
  });
  totalDisplay.textContent = total.toFixed(2);
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateChart();
}

function getCategoryTotals() {
  const categoryMap = {};
  expenses.forEach(({ amount, category }) => {
    if (!categoryMap[category]) categoryMap[category] = 0;
    categoryMap[category] += amount;
  });
  return categoryMap;
}

let chart;
function updateChart() {
  const categoryTotals = getCategoryTotals();
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        label: "Spending by Category",
        data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#A9DFBF"]
      }]
    }
  });
}

// Initial render
renderExpenses();
updateChart();

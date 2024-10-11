const ctx = document.getElementById('myChart').getContext('2d');

// Initialize chart with empty labels and data
let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            label: 'Investment Value',
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let investments = JSON.parse(localStorage.getItem('investments')) || [];
    const investmentListEl = document.getElementById('investmentList');
    const totalInvestmentAmountEl = document.querySelector('h3 span');

    function updateTotalInvestmentAmount() {
        const totalInvestmentAmount = investments.reduce((total, investment) => total + Number(investment.investedAmount), 0);
        totalInvestmentAmountEl.innerText = totalInvestmentAmount.toFixed(2);
    }

    function renderInvestments() {
        investmentListEl.innerHTML = '';
        investments.forEach((investment, index) => {
            const percentageChange = ((investment.currentValue - investment.investedAmount) / investment.investedAmount * 100).toFixed(2);

            // Add a row for each investment
            investmentListEl.innerHTML += `
                <tr>
                    <td>${investment.assetName}</td>
                    <td>$${investment.investedAmount.toFixed(2)}</td>
                    <td>$${investment.currentValue.toFixed(2)}</td>
                    <td>${percentageChange}%</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateInvestment(${index})">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="removeInvestment(${index})">Remove</button>
                    </td>
                </tr>`;
        });

        updateTotalInvestmentAmount();
        updateChart();
    }

    // Update the chart data based on current investments
    function updateChart() {
        myChart.data.labels = investments.map(investment => investment.assetName);
        myChart.data.datasets[0].data = investments.map(investment => investment.currentValue);
        myChart.update();
    }

    function saveInvestments() {
        localStorage.setItem('investments', JSON.stringify(investments));
    }

    document.getElementById('investmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const assetName = document.getElementById('assetName').value;
        const investedAmount = parseFloat(document.getElementById('investedAmount').value);
        const currentValue = parseFloat(document.getElementById('currentValue').value);

        investments.push({ assetName, investedAmount, currentValue });
        saveInvestments();
        renderInvestments();
        this.reset();
    });

    window.removeInvestment = function(index) {
        investments.splice(index, 1);
        saveInvestments();
        renderInvestments();
    };

    window.updateInvestment = function(index) {
        const updateModal = document.getElementById('updateModal');
        updateModal.style.display = 'block';
        const newAmountInput = document.getElementById('newAmount');
        const confirmUpdateBtn = document.getElementById('confirmUpdateBtn');
        const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');

        confirmUpdateBtn.onclick = function() {
            const newValue = parseFloat(newAmountInput.value);
            if (!isNaN(newValue)) {
                investments[index].currentValue = newValue;
                saveInvestments();
                renderInvestments();
            }
            updateModal.style.display = 'none';
            newAmountInput.value = '';
        };

        cancelUpdateBtn.onclick = function() {
            updateModal.style.display = 'none';
            newAmountInput.value = '';
        };
    };

    renderInvestments();
});

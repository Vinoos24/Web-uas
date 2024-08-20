document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    const pieChartCtx = document.getElementById('pieChart').getContext('2d');
    const historyTableBody = document.querySelector('#historyTable tbody');
    const historyContainer = document.getElementById('historyContainer');
    const showHistoryBtn = document.getElementById('showHistoryBtn');

    // Load report data from localStorage or initialize as empty array
    let reportData = JSON.parse(localStorage.getItem('reportData')) || [];

    // Initialize Pie Chart
    const pieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
            labels: ['Peningkatan Mata Kuliah Signifikan', 'Alat yang Rusak', 'Alat yang Hilang'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const dataIndex = tooltipItem.dataIndex;
                            const dataset = tooltipItem.dataset;
                            const label = dataset.label || '';
                            const value = dataset.data[dataIndex];
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });

    // Update the charts and history table with data
    updateCharts();
    updateHistoryTable();

    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const year = document.getElementById('year').value;
        const value = document.getElementById('value').value;
        const assetIncrease = document.getElementById('assetIncrease').value;
        const numBorrower = document.getElementById('numBorrower').value;
        const fundIncrease = document.getElementById('fundIncrease').value;
        const significantImprovements = document.getElementById('significantImprovements').value;
        const damagedItems = document.getElementById('damagedItems').value;
        const lostItems = document.getElementById('lostItems').value;

        const index = reportForm.dataset.index;

        if (index === undefined) {
            // Add new data
            const data = {
                year,
                value,
                assetIncrease,
                numBorrower,
                fundIncrease,
                significantImprovements,
                damagedItems,
                lostItems
            };
            reportData.push(data);
        } else {
            // Update existing data
            reportData[index] = {
                year,
                value,
                assetIncrease,
                numBorrower,
                fundIncrease,
                significantImprovements,
                damagedItems,
                lostItems
            };
            delete reportForm.dataset.index; // Clear index after update
        }

        localStorage.setItem('reportData', JSON.stringify(reportData)); // Save data to localStorage
        updateCharts();
        updateHistoryTable();
        reportForm.reset();
    });

    showHistoryBtn.addEventListener('click', function() {
        historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
    });

    function updateCharts() {
        const improvements = reportData.map(d => d.significantImprovements.split(',').length); // Assuming significant improvements are comma-separated
        const damaged = reportData.map(d => parseInt(d.damagedItems) || 0);
        const lost = reportData.map(d => parseInt(d.lostItems) || 0);

        pieChart.data.datasets[0].data = [
            improvements.reduce((a, b) => a + b, 0),
            damaged.reduce((a, b) => a + b, 0),
            lost.reduce((a, b) => a + b, 0)
        ];
        pieChart.update();
    }

    function updateHistoryTable() {
        historyTableBody.innerHTML = '';
        reportData.forEach((data, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.year}</td>
                <td>${data.value}</td>
                <td>${data.assetIncrease}</td>
                <td>${data.numBorrower}</td>
                <td>${data.fundIncrease}</td>
                <td>${data.significantImprovements}</td>
                <td>${data.damagedItems}</td>
                <td>${data.lostItems}</td>
                <td>
                    <button onclick="editData(${index})">Edit</button>
                    <button onclick="deleteData(${index})">Delete</button>
                </td>
            `;
            historyTableBody.appendChild(row);
        });
    }

    window.editData = function(index) {
        const data = reportData[index];
        document.getElementById('year').value = data.year;
        document.getElementById('value').value = data.value;
        document.getElementById('assetIncrease').value = data.assetIncrease;
        document.getElementById('numBorrower').value = data.numBorrower;
        document.getElementById('fundIncrease').value = data.fundIncrease;
        document.getElementById('significantImprovements').value = data.significantImprovements;
        document.getElementById('damagedItems').value = data.damagedItems;
        document.getElementById('lostItems').value = data.lostItems;
        reportForm.dataset.index = index; // Save the index for later use
    };

    window.deleteData = function(index) {
        reportData.splice(index, 1);
        localStorage.setItem('reportData', JSON.stringify(reportData)); // Save data to localStorage
        updateCharts();
        updateHistoryTable();
    };
});

// Toggle Menu
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};

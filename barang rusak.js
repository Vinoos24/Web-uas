// Mengambil elemen-elemen yang dibutuhkan
const reportForm = document.getElementById("report-form");
const reportTable = document.getElementById("report-table").getElementsByTagName("tbody")[0];
let editingRow = null;

// Fungsi untuk menambahkan laporan ke tabel
function addReportToTable(name, code, lastUsedBy, quantity, type, description, date = null) {
    date = date || new Date().toLocaleDateString();

    const newRow = reportTable.insertRow();

    const cellName = newRow.insertCell(0);
    const cellCode = newRow.insertCell(1);
    const cellLastUsedBy = newRow.insertCell(2);
    const cellQuantity = newRow.insertCell(3);
    const cellType = newRow.insertCell(4);
    const cellDescription = newRow.insertCell(5);
    const cellDate = newRow.insertCell(6);
    const cellActions = newRow.insertCell(7);

    cellName.textContent = name;
    cellCode.textContent = code;
    cellLastUsedBy.textContent = lastUsedBy;
    cellQuantity.textContent = quantity;
    cellType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    cellDescription.textContent = description;
    cellDate.textContent = date;

    // Membuat tombol edit dan hapus
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn-edit";
    editButton.onclick = () => editReport(newRow);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn-delete";
    deleteButton.onclick = () => deleteReport(newRow, name, code, lastUsedBy, quantity, type, description);

    cellActions.appendChild(editButton);
    cellActions.appendChild(deleteButton);
}

// Fungsi untuk menyimpan laporan ke localStorage
function saveReportToLocalStorage(name, code, lastUsedBy, quantity, type, description) {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    const date = new Date().toLocaleDateString();
    reports.push({ name, code, lastUsedBy, quantity, type, description, date });
    localStorage.setItem("reports", JSON.stringify(reports));
}

// Fungsi untuk mengupdate laporan di localStorage
function updateReportInLocalStorage(oldReport, newReport) {
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports = reports.map(report => {
        if (report.name === oldReport.name &&
            report.code === oldReport.code &&
            report.lastUsedBy === oldReport.lastUsedBy &&
            report.quantity === oldReport.quantity &&
            report.type === oldReport.type &&
            report.description === oldReport.description) {
            return newReport;
        }
        return report;
    });
    localStorage.setItem("reports", JSON.stringify(reports));
}

// Fungsi untuk menghapus laporan dari localStorage
function deleteReportFromLocalStorage(report) {
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports = reports.filter(r => !(r.name === report.name &&
                                    r.code === report.code &&
                                    r.lastUsedBy === report.lastUsedBy &&
                                    r.quantity === report.quantity &&
                                    r.type === report.type &&
                                    r.description === report.description));
    localStorage.setItem("reports", JSON.stringify(reports));
}

// Event listener untuk form submission
reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const itemName = document.getElementById("item-name").value;
    const itemCode = document.getElementById("item-code").value;
    const lastUsedBy = document.getElementById("last-used-by").value;
    const quantity = document.getElementById("quantity").value;
    const reportType = document.getElementById("report-type").value;
    const description = document.getElementById("description").value;

    if (editingRow) {
        // Jika sedang dalam mode edit
        const oldReport = {
            name: editingRow.cells[0].textContent,
            code: editingRow.cells[1].textContent,
            lastUsedBy: editingRow.cells[2].textContent,
            quantity: editingRow.cells[3].textContent,
            type: editingRow.cells[4].textContent.toLowerCase(),
            description: editingRow.cells[5].textContent
        };

        // Update data di tabel
        editingRow.cells[0].textContent = itemName;
        editingRow.cells[1].textContent = itemCode;
        editingRow.cells[2].textContent = lastUsedBy;
        editingRow.cells[3].textContent = quantity;
        editingRow.cells[4].textContent = reportType.charAt(0).toUpperCase() + reportType.slice(1);
        editingRow.cells[5].textContent = description;

        // Update data di localStorage
        const newReport = {
            name: itemName,
            code: itemCode,
            lastUsedBy: lastUsedBy,
            quantity: quantity,
            type: reportType,
            description: description,
            date: editingRow.cells[6].textContent
        };
        updateReportInLocalStorage(oldReport, newReport);

        editingRow = null;  // Keluar dari mode edit
    } else {
        // Tambahkan laporan baru
        addReportToTable(itemName, itemCode, lastUsedBy, quantity, reportType, description);
        saveReportToLocalStorage(itemName, itemCode, lastUsedBy, quantity, reportType, description);
    }

    // Mengosongkan form setelah submit
    reportForm.reset();
});

// Fungsi untuk memuat laporan dari localStorage ke tabel saat halaman dimuat
function loadReportsFromLocalStorage() {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.forEach(report => {
        addReportToTable(report.name, report.code, report.lastUsedBy, report.quantity, report.type, report.description, report.date);
    });
}

// Panggil fungsi untuk memuat laporan saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadReportsFromLocalStorage);

// Fungsi untuk mengedit laporan
function editReport(row) {
    document.getElementById("item-name").value = row.cells[0].textContent;
    document.getElementById("item-code").value = row.cells[1].textContent;
    document.getElementById("last-used-by").value = row.cells[2].textContent;
    document.getElementById("quantity").value = row.cells[3].textContent;
    document.getElementById("report-type").value = row.cells[4].textContent.toLowerCase();
    document.getElementById("description").value = row.cells[5].textContent;

    editingRow = row;  // Menyimpan baris yang sedang diedit
}

// Fungsi untuk menghapus laporan
function deleteReport(row, name, code, lastUsedBy, quantity, type, description) {
    // Hapus laporan dari tabel
    reportTable.deleteRow(row.rowIndex - 1);

    // Hapus laporan dari localStorage
    const report = { name, code, lastUsedBy, quantity, type, description };
    deleteReportFromLocalStorage(report);
}

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

if (toggle && navigation && main) {
    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
}

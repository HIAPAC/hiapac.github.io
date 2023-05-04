const form = document.getElementById("fee-calculator");
const totalFee = document.getElementById("total-fee");
const moduleList = document.getElementById("module-list");

const coreModules = [
    { name: "Hyper Island Way Week", cost: 0, funding: "none" },
    { name: "Humans or Customers?", cost: 4500, funding: "all" },
    { name: "Intelligent Machines", cost: 4500, funding: "all" },
    { name: "Leading Teams", cost: 4500, funding: "financial" },
];

const electiveModules = [
    { name: "Radical Perspectives", cost: 4500, funding: "financial" },
    { name: "Future Scenarios", cost: 4500, funding: "all" },
    { name: "Agile Making & Prototyping", cost: 4500, funding: "none" },
    { name: "Business Transformation & Innovation", cost: 4500, funding: "all" },
    { name: "Short Specialisation", cost: 4500, funding: "none" }
];

function addHeader(headerText) {
    const row = document.createElement("tr");
    const header = document.createElement("th");
    header.setAttribute("colspan", "3");
    header.textContent = headerText;
    row.appendChild(header);
    moduleList.appendChild(row);
}

function limitElectiveSelections() {
    const electiveCheckboxes = document.querySelectorAll(".elective-checkbox");
    const selectedCheckboxes = Array.from(electiveCheckboxes).filter(checkbox => checkbox.checked);
    if (selectedCheckboxes.length >= 3) {
        electiveCheckboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.disabled = true;
            }
        });
    } else {
        electiveCheckboxes.forEach(checkbox => checkbox.disabled = false);
    }
}

function updateTable() {
    const residency = document.getElementById("residency").value;
    const age = document.getElementById("age").value;
    const financialSector = document.getElementById("financial-sector").checked;

    moduleList.innerHTML = "";

    addHeader("Core Modules");
    coreModules.forEach(module => {
        let cost = module.cost;
        if (module.funding === "all" || (module.funding === "financial" && financialSector)) {
            if (residency === "citizen") {
                cost *= age === "40andabove" ? 0.3 : 0.5;
            } else if (residency === "permanent") {
                cost *= 0.5;
            }
        }

        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const costCell = document.createElement("td");
        costCell.className = "core-module-cost";
        const selectCell = document.createElement("td");

        nameCell.textContent = module.name;
        costCell.textContent = cost.toFixed(2);

        row.appendChild(nameCell);
        row.appendChild(costCell);
        row.appendChild(selectCell);
        moduleList.appendChild(row);
    });

    addHeader("Elective Modules (Select 3)");
    electiveModules.forEach((module, index) => {
        let cost = module.cost;
        if (module.funding === "all" || (module.funding === "financial" && financialSector)) {
            if (residency === "citizen") {
                cost *= age === "40andabove" ? 0.3 : 0.5;
            } else if (residency === "permanent") {
                cost *= 0.5;
            }
        }

        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const costCell = document.createElement("td");
        const selectCell = document.createElement("td");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "elective-checkbox";
        checkbox.dataset.cost = cost;
        checkbox.addEventListener("change", () => {
            limitElectiveSelections();
            updateTotalCost();
        });

        nameCell.textContent = module.name;
        costCell.textContent = cost.toFixed(2);
        selectCell.appendChild(checkbox);

        row.appendChild(nameCell);
        row.appendChild(costCell);
        row.appendChild(selectCell);
        moduleList.appendChild(row);
    });

    updateTotalCost();
}


function updateTotalCost() {
    const electiveCheckboxes = document.querySelectorAll(".elective-checkbox");
    const selectedElectivesCost = Array.from(electiveCheckboxes)
        .filter(checkbox => checkbox.checked)
        .reduce((total, checkbox) => total + parseFloat(checkbox.dataset.cost), 0);

    const coreModulesCost = Array.from(document.querySelectorAll(".core-module-cost"))
        .reduce((total, costCell) => total + parseFloat(costCell.textContent), 0);

    const totalCost = coreModulesCost + selectedElectivesCost;
    totalFee.textContent = totalCost.toFixed(2);
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateTable();
});

document.getElementById("residency").addEventListener("change", updateTable);
document.getElementById("age").addEventListener("change", updateTable);
document.getElementById("financial-sector").addEventListener("change", updateTable);

updateTable();


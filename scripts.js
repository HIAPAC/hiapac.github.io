const form = document.getElementById("fee-calculator");
const totalCostElement = document.getElementById("totalCost");
const moduleList = document.getElementById("module-list");

const modules = [
    {
        id: 'rf',
        name: 'Registration Fee',
        type: 'admin',
        cost: {
            foreigner: 648,
            citizenPR: 648,
            citizenAbove40: 648,
        },
    },
    
    {
      id: 'hiw',
      name: 'Hyper Island Way Week',
      type: 'core',
      cost: {
        foreigner: 0,
        citizenPR: 0,
        citizenAbove40: 0,
      },
    },
    {
      id: 'hoc',
      name: 'Humans or Customers?',
      type: 'core',
      cost: {
        foreigner: 4542.06,
        citizenPR: 2439.25,
        citizenAbove40: 1598.13,
      },
    },
    {
      id: 'im',
      name: 'Intelligent Machines',
      type: 'core',
      cost: {
        foreigner: 4542.06,
        citizenPR: 2439.25,
        citizenAbove40: 1598.13,
      },
    },
    {
      id: 'lt',
      name: 'Leading Teams',
      type: 'core',
      cost: {
        foreigner: 4542.06,
        citizenPR: 2439.25,
        citizenAbove40: 1598.13,
      },
      financialSector: true,
    },
    {
      id: 'rp',
      name: 'Radical Perspectives',
      type: 'elective',
      cost: {
        foreigner: 4542.06,
        citizenPR: 2439.25,
        citizenAbove40: 1598.13,
      },
      financialSector: true,
    },
    {
      id: 'fs',
      name: 'Future Scenarios',
      type: 'elective',
      cost: {
        foreigner: 4542.06,
        citizenPR: 2439.25,
        citizenAbove40: 1598.13,
      },
    },
    {
      id: 'bti',
      name: 'Business Transformation & Innovation',
      type: 'elective',
      cost: {
        foreigner: 4542.06,
        citizenPR: 2439.25,
        citizenAbove40: 1598.13,
      },
    },
    {
      id: 'amp',
      name: 'Agile Making & Prototyping',
      type: 'elective',
      cost: {
        foreigner: 4542.06,
        citizenPR: 4542.06,
        citizenAbove40: 4542.06,
      },
    },
    {
      id: 'ss',
      name: 'Short Specialisation',
      type: 'elective',
      cost: {
        foreigner: 4542.06,
        citizenPR: 4542.06,
        citizenAbove40: 4542.06,
      },
    },
  ];

function getModuleCost(module, residency, age, financialSector) {
    let costKey = 'foreigner';
  
    if (residency === 'citizen' && age === 'below40' || residency === 'permanent') {
      costKey = 'citizenPR';
    } else if (residency === 'citizen' && age === '40andabove') {
      costKey = 'citizenAbove40';
    }
  
    if (module.financialSector && !financialSector) {
      return module.cost.foreigner;
    }
  
    return module.cost[costKey];
  }

  function updateTable() {
    const residency = document.getElementById("residency").value;
    const age = document.getElementById("age").value;
    const financialSector = document.getElementById("financialSector").checked;
  
    const electiveCheckboxes = Array.from(document.querySelectorAll('input[name="elective"]'));
    const selectedElectives = electiveCheckboxes.filter(checkbox => checkbox.checked);
  
    electiveCheckboxes.forEach((checkbox) => {
      if (selectedElectives.length >= 3) {
        checkbox.disabled = !checkbox.checked;
      } else {
        checkbox.disabled = false;
      }
    });
  
    let totalCost = 0;
  
    modules.forEach((module) => {
      const moduleCost = getModuleCost(module, residency, age, financialSector);
      const moduleCostElement = document.getElementById(module.id + 'Cost');
  
      if (moduleCostElement) {
        moduleCostElement.innerText = moduleCost.toFixed(2);
      }
  
      if (module.type === 'core') {
        totalCost += moduleCost;
      } else if (module.type === 'elective' && selectedElectives.map(checkbox => checkbox.value).includes(module.id)) {
        totalCost += moduleCost;
      }
    });
  
    const registrationFeeModule = modules.find(module => module.type === 'admin');
  if (registrationFeeModule) {
    const registrationFeeCost = getModuleCost(registrationFeeModule, residency, age, financialSector);
    totalCost += registrationFeeCost;
  }

    totalCostElement.innerText = totalCost.toFixed(2);
  }
  
  
  function generateTable() {
    const moduleList = document.getElementById("module-list");
  
    // Create the registration fee row
    const registrationFeeModule = modules.find(module => module.type === 'admin');
    if (registrationFeeModule) {
      const row = document.createElement("tr");
  
      const moduleName = document.createElement("td");
      moduleName.innerText = registrationFeeModule.name;
      row.appendChild(moduleName);
  
      const moduleCost = document.createElement("td");
      moduleCost.id = registrationFeeModule.id + "Cost";
      row.appendChild(moduleCost);
  
      const moduleSelect = document.createElement("td");
      row.appendChild(moduleSelect);
  
      moduleList.appendChild(row);
    }
  
    let coreHeaderAdded = false;
    let electiveHeaderAdded = false;
  
    // Replace the original modules.forEach loop with this filtered version
    modules.filter(module => module.type !== 'admin').forEach((module) => {
      const row = document.createElement("tr");
  
      if (module.type === "core" && !coreHeaderAdded) {
        const headerRow = document.createElement("tr");
        const header = document.createElement("th");
        header.colSpan = 3;
        header.innerText = "Core Modules";
        headerRow.appendChild(header);
        moduleList.appendChild(headerRow);
        coreHeaderAdded = true;
      } else if (module.type === "elective" && !electiveHeaderAdded) {
        const headerRow = document.createElement("tr");
        const header = document.createElement("th");
        header.colSpan = 3;
        header.innerText = "Elective Modules (Select 3)";
        headerRow.appendChild(header);
        moduleList.appendChild(headerRow);
        electiveHeaderAdded = true;
      }
  
      const moduleName = document.createElement("td");
      moduleName.innerText = module.name;
      row.appendChild(moduleName);
  
      const moduleCost = document.createElement("td");
      moduleCost.id = module.id + "Cost";
      row.appendChild(moduleCost);
  
      const moduleSelect = document.createElement("td");
      if (module.type === "elective") {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "elective";
        checkbox.value = module.id;
        checkbox.addEventListener("change", updateTable);
        moduleSelect.appendChild(checkbox);
      }
      row.appendChild(moduleSelect);
  
      moduleList.appendChild(row);
    });
  }
  
  generateTable();
  updateTable();
  
  document.querySelectorAll('#residency, #age, #financialSector, input[name="elective"]').forEach((input) => {
    input.addEventListener('change', updateTable);
  });  
  
  updateTable();


const staffDropdown = document.getElementById('numberdropdown');
const annualSalaryInput = document.getElementById('annualsalary');
const traditionalcostDisplay = document.getElementById('traditionalcost');
const savings = document.getElementById('savings');

const timeframe = 4;

const cost = document.getElementById('ressonatecost');

function updateMath() {
    let count = parseFloat(staffDropdown.value) || 0;
    let salary = parseFloat(annualSalaryInput.value) || 0;

    const totalTraditional = count * salary * timeframe;
    const ressonatePrice = totalTraditional * 0.30;
    const totalSaved = totalTraditional - ressonatePrice;    

    traditionalcostDisplay.innerText = "$" + totalTraditional.toLocaleString();
    cost.innerText = "$" + ressonatePrice.toLocaleString();
    savings.innerText = "$" + totalSaved.toLocaleString();
}

staffDropdown.addEventListener("change", updateMath);
annualSalaryInput.addEventListener("input", updateMath); 


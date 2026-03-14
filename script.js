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

// 1. Grab your elements
const auditForm = document.getElementById('audit-form');
const nameinput = document.getElementById('name');
const emailinput = document.getElementById('email');

// 2. Listen for the SUBMIT event
auditForm.addEventListener('submit', function(event) {
    event.preventDefault(); // CRITICAL: This stops the page from refreshing
    SendtoAdmin();
});

function SendtoAdmin() {
    const namevalue = nameinput.value.trim();
    const emailvalue = emailinput.value.trim();

    // Reset borders
    nameinput.style.border = '';
    emailinput.style.border = '';

    let isFormValid = true;

    if (namevalue === "") {
        nameinput.style.border = '1px solid red';
        isFormValid = false;
    }

    if (emailvalue === "" || !emailvalue.includes('@')) {
        emailinput.style.border = '1px solid red';
        isFormValid = false;
    }

    if (isFormValid) {
        const leadData = {
            "Potential Client Name": namevalue,
            "Client Business Email": emailvalue,
            "Current HR Staff Count": document.getElementById('numberdropdown').value,
            "Projected 4-Year Savings": document.getElementById('savings').innerText,
            "Status": "High Intent Lead"
        };

        fetch("https://formspree.io/f/mdawdqrp", {
            method: "POST",
            body: JSON.stringify(leadData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // document.getElementById('audit-form').style.display = 'none';
                
                // const revealSection = document.getElementById('reveal-section');
                // revealSection.style.display = 'block';
                // revealSection.scrollIntoView({ behavior: 'smooth' });
                
                console.log("Email sent successfully!");
            } else {
                alert("Submission failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was a connection error.");
        });
    }
}
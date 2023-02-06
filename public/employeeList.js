let empList = {};
const editUserModal = document.getElementById('editUserModal');
const backDrop = document.getElementById('modalBackDrop');

async function on_open() {
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	if (user != null){
	    document.getElementById('loginBtn').textContent = "Logout";
	    let userSettings = document.createElement('a');
	    userSettings.setAttribute('href', 'userEdit.html');
	    userSettings.innerHTML = `${user.firstname} ${user.lastname}`;
	    userSettings.setAttribute('class', 'userEdit');
	    document.getElementById('loginArea').appendChild(userSettings);
	}

	let employeeTableRef = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];

	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const getEmps = await fetch('/api/get_all_users', getOptions);
	const getEmpsResults = await getEmps.json();
	empList = getEmpsResults;
	for (let i = 0; i < empList.length; i++){
		let newRow = employeeTableRef.insertRow();

		let nameCell = newRow.insertCell();
		let emailCell = newRow.insertCell();
		let workEmailCell = newRow.insertCell();
		let numberCell = newRow.insertCell();

		let name = document.createTextNode(`${empList[i].firstname} ${empList[i].lastname}`);
		let email = document.createTextNode(`${empList[i].email}`);
		let workEmail = document.createTextNode(`${empList[i].workemail}`);
		let number = document.createTextNode(`${empList[i].number}`);

		nameCell.appendChild(name);
		emailCell.appendChild(email);
		workEmailCell.appendChild(workEmail);
		numberCell.appendChild(number);

		newRow.addEventListener('click', () => openModal(empList[i]._id));

	}

}

function openModal(empID){
	let pickedEmp;
	for (let i = 0; i < empList.length; i++){
		if (empID == empList[i]._id){
			pickedEmp = empList[i]
		}
	}

	if (pickedEmp != null && pickedEmp != undefined) {
		document.getElementById('updateBtn').addEventListener('click', () => updateEmp(pickedEmp));
    	document.getElementById('cancelBtn').addEventListener('click', () => closeModal());
		document.getElementById('modalEmpName').value = `${pickedEmp.firstname} ${pickedEmp.lastname}`
      	document.getElementById('modalEmpEmail').value = pickedEmp.email;
      	document.getElementById('modalEmpWorkEmail').value = pickedEmp.workemail;
      	document.getElementById('modalEmpNumber').value = pickedEmp.number;
      	editUserModal.style.display = 'block';
      	backDrop.style.display = 'block';
	} else {
		alert('ERROR: Something went wrong');
	}
}

function closeModal() {
	editUserModal.style.display = 'none';
    backDrop.style.display = 'none';
    on_open();
}

async function updateEmp(pickedEmp) {
	pickedEmp.workemail = document.getElementById('modalEmpWorkEmail').value;

	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(pickedEmp)
	}

	const updateRes = await fetch('/api/update_user_info', postOptions);
	const updateResults = await updateRes.json();

	if (updateResults.status == 'failure') {
		alert('Failed to update database\nContact administrator if this problem persists.');
	} else {
		console.log(`${pickedEmp.firstname} ${pickedEmp.lastname} was updated.`)
	}

	closeModal();
}
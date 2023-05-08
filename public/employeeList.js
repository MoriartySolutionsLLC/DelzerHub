let empList = {};
let permsList = {};
const editUserModal = document.getElementById('editUserModal');
const backDrop = document.getElementById('modalBackDrop');
let user;

async function on_open() {
	user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
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
		let phoneArray = empList[i].number.split('');
		let phoneStr = "(";
		for (let k = 0; k < phoneArray.length; k++){
			if (k == 3){
				phoneStr += ")-";
			} else if (k == 6) {
				phoneStr += "-";
			}
			phoneStr += phoneArray[k];
		}

		if (phoneStr == "(") phoneStr = "";

		let newRow = employeeTableRef.insertRow();

		let nameCell = newRow.insertCell();
		let emailCell = newRow.insertCell();
		let workEmailCell = newRow.insertCell();
		let numberCell = newRow.insertCell();

		let name = document.createTextNode(`${empList[i].firstname} ${empList[i].lastname}`);
		let email = document.createTextNode(`${empList[i].email}`);
		let workEmail = document.createTextNode(`${empList[i].workemail}`);
		let number = document.createTextNode(`${phoneStr}`);

		nameCell.appendChild(name);
		emailCell.appendChild(email);
		workEmailCell.appendChild(workEmail);
		numberCell.appendChild(number);

		newRow.addEventListener('click', () => openModal(empList[i]._id));

	}

	const getPerms = await fetch('/api/get_allpermissions', getOptions);
	const getPermResults = await getPerms.json();
	permsList = getPermResults;
}

function openModal(empID){
	window.scrollTo(0,0);
	let pickedEmp;
	for (let i = 0; i < empList.length; i++){
		if (empID == empList[i]._id){
			pickedEmp = empList[i]
		}
	}

	document.getElementById('modalHeader').innerHTML = `${pickedEmp.firstname} ${pickedEmp.lastname}`

	if (pickedEmp != null && pickedEmp != undefined) {
		let phoneArray = pickedEmp.number.split('');
		let phoneStr = "(";
		for (let k = 0; k < phoneArray.length; k++){
			if (k == 3){
				phoneStr += ")-";
			} else if (k == 6) {
				phoneStr += "-";
			}
			phoneStr += phoneArray[k];
		}
		if (phoneStr == "(") phoneStr = "";

		let updateButton = document.getElementById('updateBtn');
		btnRemoveEventListeners(updateButton);
		document.getElementById('modalBackDrop').addEventListener('click', closeModal);
		document.getElementById('permTab').addEventListener('click', () => permTabClicked(pickedEmp));
    	document.getElementById('cancelBtn').addEventListener('click', () => closeModal());
		document.getElementById('modalEmpName').value = `${pickedEmp.firstname} ${pickedEmp.lastname}`
      	document.getElementById('modalEmpEmail').value = pickedEmp.email;
      	document.getElementById('modalEmpWorkEmail').value = pickedEmp.workemail;
      	document.getElementById('modalEmpNumber').value = phoneStr;
		document.getElementById('updateBtn').addEventListener('click', () => updateEmp(pickedEmp));
      	editUserModal.style.display = 'block';
      	backDrop.style.display = 'block';
	} else {
		alert('ERROR: Something went wrong');
	}
}

function permTabClicked(pickedEmp) {
	let updateButton = document.getElementById('updateBtn');
	btnRemoveEventListeners(updateButton);
	let pickedEmpPermList;
	btnRemoveEventListeners(document.getElementById('permTab'));
	document.getElementById('edit_employee_form').style.display = 'none';
	document.getElementById('selectedTab').setAttribute('id', 'infoTab');
	document.getElementById('infoTab').addEventListener('click', () => infoTabClicker(pickedEmp));
	document.getElementById('permTab').setAttribute('id', 'selectedTab');
	document.getElementById('permissions_form').style.display = 'block';

	for (let i = 0; i < permsList.length; i++){
		if (pickedEmp._id == permsList[i]._id){
			pickedEmpPermList = permsList[i];
		}
	}

	if (pickedEmpPermList != null && pickedEmpPermList != undefined) {
		document.getElementById('approveTimeOffPermCheckBox').checked = pickedEmpPermList.approveTimeOff;
		document.getElementById('jobSchedulingCalendarViewPermCheckBox').checked = pickedEmpPermList.jobSchedulingCalendarView;
		document.getElementById('dispatchCallInFormPermCheckBox').checked = pickedEmpPermList.dispatchCallInFormView;
		document.getElementById('callInHubViewPermCheckBox').checked = pickedEmpPermList.callInHubView;
		document.getElementById('transportingEquipmentFormPermCheckBox').checked = pickedEmpPermList.transportingEquipmentForm;
		document.getElementById('cafeSchedulingHubViewPermCheckBox').checked = pickedEmpPermList.cafeSchedulingHubView;
		document.getElementById('cafeSchedulingHubEditPermCheckBox').checked = pickedEmpPermList.cafeSchedulingHubEdit;
		document.getElementById('employeeListViewPermCheckBox').checked = pickedEmpPermList.employeeListView;
		document.getElementById('updateBtn').addEventListener('click', () => updatePerms(pickedEmp));			
	} else {
		let addPermButton = document.getElementById('updateBtn');
		addPermButton.innerHTML = 'Add Permissions';
		addPermButton.addEventListener('click', () => addPerms(pickedEmp));
	}
}

function infoTabClicker(pickedEmp) {
	let updateButton = document.getElementById('updateBtn');
	updateBtn.innerHTML = 'Update';
	btnRemoveEventListeners(updateButton);
	btnRemoveEventListeners(document.getElementById('infoTab'));
	document.getElementById('permissions_form').style.display = 'none';
	document.getElementById('selectedTab').setAttribute('id', 'permTab');
	document.getElementById('permTab').addEventListener('click', () => permTabClicked(pickedEmp));
	document.getElementById('infoTab').setAttribute('id', 'selectedTab');
	document.getElementById('edit_employee_form').style.display = 'block';
	document.getElementById('updateBtn').addEventListener('click', () => updateEmp(pickedEmp));
}

function closeModal() {
	editUserModal.style.display = 'none';
    backDrop.style.display = 'none';
    window.open('employeeList.html', '_self');
}

async function updatePerms(pickedEmp){
	let userID = user.tsheetsid;
	let userFirstname = user.firstname;
	let userLastname = user.lastname;
	let approveTimeOff = document.getElementById('approveTimeOffPermCheckBox').checked;
	let jobSchedulingCalendarView = document.getElementById('jobSchedulingCalendarViewPermCheckBox').checked;
	let dispatchCallInFormView = document.getElementById('dispatchCallInFormPermCheckBox').checked;
	let callInHubView = document.getElementById('callInHubViewPermCheckBox').checked;
	let transportingEquipmentForm = document.getElementById('transportingEquipmentFormPermCheckBox').checked;
	let cafeSchedulingHubView = document.getElementById('cafeSchedulingHubViewPermCheckBox').checked;
	let cafeSchedulingHubEdit = document.getElementById('cafeSchedulingHubEditPermCheckBox').checked;
	let employeeListView = document.getElementById('employeeListViewPermCheckBox').checked;
	let _id = pickedEmp._id;
	let empFirstname = pickedEmp.firstname;
	let empLastname = pickedEmp.lastname;
	let data = {_id, userID, userFirstname, userLastname, empFirstname, empLastname, approveTimeOff, jobSchedulingCalendarView, dispatchCallInFormView, callInHubView, transportingEquipmentForm, cafeSchedulingHubView, cafeSchedulingHubEdit, employeeListView};

	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	const addPerms = await fetch('/api/update_permissionsList', postOptions);
	const addPermsResult = await addPerms.json();
	if (addPermsResult.status == 'failure') {
		alert('ERROR: An error has occured');
		closeModal();
	} else {
		alert(`SUCCESS: You have successfully updated ${pickedEmp.firstname} ${pickedEmp.lastname}'s permissions.`);
		closeModal();
	}
}

async function addPerms(pickedEmp) {
	let userID = user.tsheetsid;
	let userFirstname = user.firstname;
	let userLastname = user.lastname;
	let empFirstname = pickedEmp.firstname;
	let empLastname = pickedEmp.lastname;
	let approveTimeOff = document.getElementById('approveTimeOffPermCheckBox').checked;
	let jobSchedulingCalendarView = document.getElementById('jobSchedulingCalendarViewPermCheckBox').checked;
	let dispatchCallInFormView = document.getElementById('dispatchCallInFormPermCheckBox').checked;
	let callInHubView = document.getElementById('callInHubViewPermCheckBox').checked;
	let transportingEquipmentForm = document.getElementById('transportingEquipmentFormPermCheckBox').checked;
	let cafeSchedulingHubView = document.getElementById('cafeSchedulingHubViewPermCheckBox').checked;
	let cafeSchedulingHubEdit = document.getElementById('cafeSchedulingHubEditPermCheckBox').checked;
	let employeeListView = document.getElementById('employeeListViewPermCheckBox').checked;
	let _id = pickedEmp._id;
	let data = {_id, userID, userFirstname, userLastname, empFirstname, empLastname, approveTimeOff, jobSchedulingCalendarView, dispatchCallInFormView, callInHubView, transportingEquipmentForm, cafeSchedulingHubView, cafeSchedulingHubEdit, employeeListView};

	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	const addPerms = await fetch('/api/add_permissionsList', postOptions);
	const addPermsResult = await addPerms.json();
	if (addPermsResult == null || addPermsResult == undefined || addPermsResult.status == 'failure') {
		alert('ERROR: An error has occured');
		closeModal();
	} else {
		alert(`SUCCESS: You have successfully added ${pickedEmp.firstname} ${pickedEmp.lastname}'s permissions.`);
		closeModal();
	}
}

async function updateEmp(pickedEmp) {
	let userID = user.tsheetsid;
	let userFirstname = user.firstname;
	let userLastname = user.lastname;
	let empFirstname = pickedEmp.firstname;
	let empLastname = pickedEmp.lastname;
	let _id = pickedEmp._id;
	let workemail = document.getElementById('modalEmpWorkEmail').value;
	let data = {userID, userFirstname, userLastname, empFirstname, empLastname, _id, workemail};

	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
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

function btnRemoveEventListeners(button){
	const clone = button.cloneNode(true);
	button.parentNode.replaceChild(clone, button);
}
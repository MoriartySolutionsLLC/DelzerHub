let user;
let admins = {};

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

	document.getElementById('submitBtn').addEventListener('click', submitBtnHandler);
	document.getElementById('submitFormCancelBtn').addEventListener('click', submitFormCancelBtnHandler);

	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const getAdmin = await fetch('/api/get_admin', getOptions);
	const getAdminResults = await getAdmin.json();
	admins = getAdminResults;

	let primSelect = document.getElementById('primaryEmp');
	let secSelect = document.getElementById('secondaryEmp');

	admins.map((admin, i) => {
		let primOption = document.createElement("option");
		primOption.value = admin._id;
		primOption.innerHTML = `${admin.firstname} ${admin.lastname}`;
		let secOption = document.createElement("option");
		secOption.value = admin._id;
		secOption.innerHTML = `${admin.firstname} ${admin.lastname}`;

		primSelect.append(primOption);
		secSelect.append(secOption);
	})	
}

async function submitBtnHandler() {
	let empName = `${user.firstname} ${user.lastname}`;
	let jobClass = document.getElementById('jobClass').value;
	let contactName = document.getElementById('contactName').value;
	let contactPhone = document.getElementById('contactPhone').value;
	let contactEmail = document.getElementById('contactEmail').value;
	let reasonForCall = document.getElementById('reasonForCall').value;
	let ownerName = document.getElementById('ownerName').value;
	let jobAddress = document.getElementById('jobAddress').value;
	let mailingAddress = document.getElementById('mailingAddress').value;
	let comments = document.getElementById('comments').value;
	let primaryEmpID = document.getElementById('primaryEmp').value;
	let primaryEmp = "";
	let primaryEmail = "";
	let secondaryEmpID = document.getElementById('secondaryEmp').value;
	let secondaryEmp="";
	let secondaryEmail = "";
	let handled = "false";
	let notes = "";
	let tsheetsid = user.tsheetsid;

	if(secondaryEmpID != "") {
		for (let i = 0; i < admins.length; i++){
			if (secondaryEmpID == `${admins[i]._id}`) {
				secondaryEmp = `${admins[i].firstname} ${admins[i].lastname}`;
				secondaryEmail = admins[i].workemail;
			}
		}
	}

	if (jobClass == "" || contactName == "" || contactPhone == "" || reasonForCall == "" || primaryEmpID =="") {
		alert("ERROR: Please fill in all required fields.");
	} else {
		for (let i = 0; i < admins.length; i++){
			if (primaryEmpID == `${admins[i]._id}`) {
				primaryEmp = `${admins[i].firstname} ${admins[i].lastname}`;
				primaryEmail = admins[i].workemail;
			}
		}

		let data = {tsheetsid, empName, jobClass, contactName, contactPhone, contactEmail, reasonForCall, ownerName, jobAddress, mailingAddress, comments, primaryEmp, primaryEmail, secondaryEmp, secondaryEmail, handled, notes};

		const postOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}

		const postRes = await fetch('/api/submit_dispatch_callin', postOptions);
		const postResult = await postRes.json();

		if (postResult.status == 'failure') {
			alert('ERROR: An error has occured. Contact the administrator if this problem persists.')
		} else {
			alert('SUCCESS: You have successfully submitted the call in information.');
		}
		window.open('dispatchCallIn.html', '_self');
	}
}

function submitFormCancelBtnHandler() {
	window.open('dispatchCallIn.html', '_self');
}
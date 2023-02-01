let admins = {};

async function on_open() {
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
	console.log(admins);

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
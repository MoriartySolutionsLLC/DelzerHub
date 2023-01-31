function op_open() {
	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const getAdmin = await fetch('/api/get_admin', getOptions);
	const getAdminResults = await getAdmin.json();
	console.log(getAdminResults);
}
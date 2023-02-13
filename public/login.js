async function on_open() {
	localStorage.removeItem("currentlyLoggedIn");
	localStorage.removeItem("userPermissions");
	document.getElementById('loginBtn').addEventListener('click', () => handle_login());

	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}
	const getRes = await fetch('/api/update_users', getOptions);
	const getResult = await getRes;
}

async function handle_login() {
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;

	if (username == "" || password == "" ) {
		alert("Please enter username and password.");		
	} else {
		const data = {username, password};

		const postOptions = {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}

		const getRes = await fetch('/api/validate_user', postOptions);
		const getResult = await getRes.json();
		if (getResult != null && getResult != undefined) {
			let getPermsResults = await getUserPermissions(getResult);
			if (getPermsResults != null && getPermsResults != undefined && !getPermsResults.hasOwnProperty('status')) {
				localStorage.setItem('userPermissions', JSON.stringify(getPermsResults));
			}
			localStorage.setItem("currentlyLoggedIn", JSON.stringify(getResult));
			window.open('index.html', '_self');
		} else {
			alert('Invalid Username or Password');
		}
	}
}

async function getUserPermissions(user) {
	const postOptions = {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	};

	const getPerms = await fetch('/api/get_userPermissions', postOptions);
	const getPermsResults = await getPerms.json();
	return getPermsResults;
}
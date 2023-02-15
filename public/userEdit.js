function on_open(){
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	if (user != null) {
		document.getElementById('username').setAttribute('placeholder', user.username);
	}
	document.getElementById('updateUsernameBtn').addEventListener('click', () => updateUsername());
	document.getElementById('updatePasswordBtn').addEventListener('click', () => updatePassword());
}

async function updateUsername() {
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	let username = document.getElementById('username').value;
	let validate = {'username': user.username, 'password': document.getElementById('password').value};
	user.username = username;
	const postOptions = {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validate)
	}

	const getVal = await fetch('/api/validate_user', postOptions);
	const getValid = await getVal.json();
	if (getValid != null || getValid != undefined){
		const postOptions = {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		}

		const postUser = await fetch('/api/update_username', postOptions);
		const postUsername = await postUser.json();

		if (postUsername.status == "success"){
			alert('Username successfully changed.')
			validate.username = username;
			const postOptions = {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(validate)
			}

			const getUser = await fetch('/api/validate_user', postOptions);
			const getUserInfo = await getUser.json();
			localStorage.removeItem("currentlyLoggedIn");
			localStorage.setItem("currentlyLoggedIn", JSON.stringify(getUserInfo));
			location.reload();
		} else {
			alert('Username already exists.\nPlease pick a different one.');
		}

	} else {
		alert('Invalid Password!');
	}

	
}

async function updatePassword() {
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	let oldPassword = document.getElementById('oldPassword').value;
	let newPassword = document.getElementById('newPassword').value;
	let coNewPassword = document.getElementById('coNewPassword').value;

	if (newPassword === coNewPassword) {
		let validate = {'username': user.username, 'password': oldPassword};
		const postOptions = {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(validate)
		}
		const getVal = await fetch('/api/validate_user', postOptions);
		const getValid = await getVal.json();

		if (getValid != null || getValid != undefined){
			let data = {'tsheetsid': user.tsheetsid, 'firstname': user.firstname, 'lastname': user.lastname,'password': newPassword};
			const postOptions = {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}
			const postPass = await fetch('/api/update_password', postOptions);
			const postPassword = await postPass.json();

			if (postPassword.status === "success"){
				alert('Password successfully changed!');
				location.reload();
			} else {
				alert('Error: something went wrong.');
				location.reload();
			}

		} else {
			alert('The old password you entered is incorrect');
		}

	} else {
		alert('The new password does not match');
	}
}

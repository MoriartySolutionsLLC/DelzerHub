function on_open(){
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	if (user != null) {
		document.getElementById('username').setAttribute('placeholder', user.username);
	}
}
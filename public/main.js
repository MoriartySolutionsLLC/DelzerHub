function on_open() {
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
    if (user != null){
      document.getElementById('loginBtn').textContent = "Logout";
      let userSettings = document.createElement('a');
      userSettings.setAttribute('href', 'userEdit.html');
      userSettings.innerHTML = `${user.firstname} ${user.lastname}`;
      userSettings.setAttribute('class', 'userEdit');
      document.getElementById('loginArea').appendChild(userSettings);
    }
}
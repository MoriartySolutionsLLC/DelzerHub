let administrationView;
let employeeListView;

function checkPerm() {
	let user = JSON.parse(localStorage.getItem('currentlyLoggedIn'));

	if (user != null && user != undefined) {
		if (user.firstname == 'Kian'){
			employeeListView = true;
			administrationView = true;
		} else {
			employeeListView = false;
			administrationView = false;
		}
	} else {
		employeeListView = false;
		administrationView = false;
	}

	administrationDropDownPerm()
	employeeListPerm();
}

function administrationDropDownPerm() {
	let administrationDropDown = document.getElementById('adminstrationDropDown');
	if (administrationView != true){
		administrationDropDown.parentNode.removeChild(administrationDropDown);
	} else {
		administrationDropDown.style.visibility = 'visible';
	}
}

function employeeListPerm(){
	let employeeListLink = document.getElementById('employeeListLink');
	if (employeeListView == true){
		employeeListLink.href = 'employeeList.html';
	} else {
		employeeListLink.addEventListener('click', () => {
			alert('ALERT: Cannot access this page.\nContact your administrator to get the appropriate permissions.')
		});
	}
}
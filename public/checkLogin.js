function checkLogin() {
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	if (user == null || user == undefined) {
		let timeOffCalendarLink = document.getElementById("timeOffCalendarLink");
		timeOffCalendarLink.setAttribute("href", "login.html");
		let jobSchedulingCalendarLink = document.getElementById("jobSchedulingCalendarLink");
		jobSchedulingCalendarLink.setAttribute("href", "login.html");
		let dispatchCallInLink = document.getElementById("dispatchCallInLink");
		dispatchCallInLink.setAttribute("href", "login.html");
	}
}
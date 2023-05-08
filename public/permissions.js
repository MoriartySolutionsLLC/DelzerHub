let jobSchedulingCalendarView;
let dispatchCallInFormView;
let callInHubView; 
let transportingEquipmentForm;
let employeeListView; 
let userPerms;

function checkPerm() {
	userPerms = JSON.parse(localStorage.getItem('userPermissions'));
	if (userPerms == null || userPerms == undefined) {
		document.getElementById("timeOffCalendarLink").setAttribute("href", "login.html");
		document.getElementById("jobSchedulingCalendarLink").setAttribute("href", "login.html");
		document.getElementById("dispatchCallInLink").setAttribute("href", "login.html");
		document.getElementById("purchaseOrdersLink").setAttribute("href", "login.html");
		document.getElementById("callInListLink").setAttribute("href", "login.html");
		document.getElementById("transportingEquipmentLink").setAttribute("href", "login.html");
		document.getElementById("cafeSchedulingHubLink").setAttribute("href", "login.html");
		document.getElementById("employeeListLink").setAttribute("href", "login.html");
		document.getElementById("repairOrdersLink").setAttribute("href", "login.html");
	} else {
		jobSchedulingCalendarPermFunc();
		dispatchCallInFormPermFunc();
		callInHubPermFunc();
		transportingEquipmentPermFunc();
		cafeSchedulingHubPermFunc();
		employeeListPermFunc();
	}
}

function jobSchedulingCalendarPermFunc() {
	if (!userPerms.jobSchedulingCalendarView) {
		let jobSchedulingCalendarLink = document.getElementById('jobSchedulingCalendarLink');
		jobSchedulingCalendarLink.setAttribute('href', '');
		jobSchedulingCalendarLink.addEventListener('click', permAlert);
	}
}

function dispatchCallInFormPermFunc() {
	if (!userPerms.dispatchCallInFormView) {
		let dispatchCallInLink = document.getElementById('dispatchCallInLink');
		dispatchCallInLink.setAttribute('href', '');
		dispatchCallInLink.addEventListener('click', permAlert);
	}
}

function callInHubPermFunc() {
	if (!userPerms.callInHubView) {
		let callInListLink = document.getElementById('callInListLink');
		callInListLink.setAttribute('href', '');
		callInListLink.addEventListener('click', permAlert);
	}
}

function transportingEquipmentPermFunc() {
	if (!userPerms.transportingEquipmentForm) {
		let transportingEquipmentLink = document.getElementById('transportingEquipmentLink');
		transportingEquipmentLink.setAttribute('href', '');
		transportingEquipmentLink.addEventListener('click', permAlert);
	}
}

function cafeSchedulingHubPermFunc() {
	if (!userPerms.cafeSchedulingHubEdit) {

	}

	if (!userPerms.cafeSchedulingHubView) {
		let cafeSchedulingHubLink = document.getElementById('cafeSchedulingHubLink');
		cafeSchedulingHubLink.setAttribute('href', '');
		cafeSchedulingHubLink.addEventListener('click', permAlert);
	}
}

function employeeListPermFunc() {
	if (!userPerms.employeeListView) {
		let employeeListLink = document.getElementById('employeeListLink');
		employeeListLink.setAttribute('href', '');
		employeeListLink.addEventListener('click', permAlert);
	}
}

function permAlert() {
	alert("ALERT: You do not have permission to access this content, contact your administrator for a further inquiry.");
}
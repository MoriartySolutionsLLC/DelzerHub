let jobSchedulingCalendarView;
let dispatchCallInFormView;
let callInHubView; 
let transportingEquipmentForm;
let employeeListView; 

function checkPerm() {
	let userPerms = JSON.parse(localStorage.getItem('userPermissions'));

	if (userPerms == null || userPerms == undefined) {
		document.getElementById("timeOffCalendarLink").setAttribute("href", "login.html");
		document.getElementById("jobSchedulingCalendarLink").setAttribute("href", "login.html");
		document.getElementById("dispatchCallInLink").setAttribute("href", "login.html");
		document.getElementById("purchaseOrdersLink").setAttribute("href", "login.html");
		document.getElementById("callInListLink").setAttribute("href", "login.html");
		document.getElementById("transportingEquipmentLink").setAttribute("href", "login.html");
		document.getElementById("employeeListLink").setAttribute("href", "login.html");
	} else {
		jobSchedulingCalendarView = userPerms.jobSchedulingCalendarView;
		dispatchCallInFormView = userPerms.dispatchCallInFormView;
		callInHubView = userPerms.callInHubView;
		transportingEquipmentForm = userPerms.transportingEquipmentForm;
		employeeListView = userPerms.employeeListView;
		jobSchedulingCalendarViewPermFunc();
		dispatchCallInFormViewPermFunc();
		callInHubViewPermFunc();
		transportingEquipmentFormPermFunc();
		employeeListViewPermFunc();
	}
}

function jobSchedulingCalendarViewPermFunc() {
	if (!jobSchedulingCalendarView) {
		let jobSchedulingCalendarLink = document.getElementById('jobSchedulingCalendarLink');
		jobSchedulingCalendarLink.setAttribute('href', '');
		jobSchedulingCalendarLink.addEventListener('click', permAlert);
	}
}

function dispatchCallInFormViewPermFunc() {
	if (!dispatchCallInFormView) {
		let dispatchCallInLink = document.getElementById('dispatchCallInLink');
		dispatchCallInLink.setAttribute('href', '');
		dispatchCallInLink.addEventListener('click', permAlert);
	}
}

function callInHubViewPermFunc() {
	if (!callInHubView) {
		let callInListLink = document.getElementById('callInListLink');
		callInListLink.setAttribute('href', '');
		callInListLink.addEventListener('click', permAlert);
	}
}

function transportingEquipmentFormPermFunc() {
	if (!transportingEquipmentForm) {
		let transportingEquipmentLink = document.getElementById('transportingEquipmentLink');
		transportingEquipmentLink.setAttribute('href', '');
		transportingEquipmentLink.addEventListener('click', permAlert);
	}
}

function employeeListViewPermFunc() {
	if (!employeeListView) {
		let employeeListLink = document.getElementById('employeeListLink');
		employeeListLink.setAttribute('href', '');
		employeeListLink.addEventListener('click', permAlert);
	}
}

function permAlert() {
	alert("ALERT: You do not have permission to access this content, contact your administrator for a further inquiry.");
}
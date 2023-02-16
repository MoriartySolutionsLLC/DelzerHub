const user = JSON.parse(localStorage.getItem('currentlyLoggedIn'))
let callIns = {};
const callInModal = document.getElementById('viewCallInModal');
const backDrop = document.getElementById('modalBackDrop');

async function on_open() {
	let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
	if (user != null){
	    document.getElementById('loginBtn').textContent = "Logout";
	    let userSettings = document.createElement('a');
	    userSettings.setAttribute('href', 'userEdit.html');
	    userSettings.innerHTML = `${user.firstname} ${user.lastname}`;
	    userSettings.setAttribute('class', 'userEdit');
	    document.getElementById('loginArea').appendChild(userSettings);
	}

	let openCallInColumn = document.getElementById('openCallInColumn');
	let closedCallInColumn = document.getElementById('closedCallInColumn');
	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const getCall = await fetch('/api/get_callins', getOptions);
	const getCallIns = await getCall.json();

	if (!getCallIns.hasOwnProperty('status')){
		for (let i = 0; i < getCallIns.length; i++){
			let callInBlock = document.createElement('div');
			let callInTopBlock = document.createElement('div');
			let callInDivBlock = document.createElement('div');
			let callInBottomBlock = document.createElement('div');
			let callInContactName = document.createElement('div');
			let callInContactNameText = document.createElement('p');
			let callInContactNumber = document.createElement('div');
			let callInContactNumberText = document.createElement('p');
			let callInReason = document.createElement('div');
			let callInReasonText = document.createElement('p');
			let callInDate = document.createElement('div');
			let callInDateText = document.createElement('p');
			let callInComment = document.createElement('div');
			let callInCommentText = document.createElement('p');

			callInBlock.setAttribute('class', 'callInBlock');
			callInTopBlock.setAttribute('class', 'callInTopBlock');
			callInDivBlock.setAttribute('class', 'callInDivBlock');
			callInBottomBlock.setAttribute('class', 'callInBottomBlock');

			callInContactName.setAttribute('class', 'callInCell');
			callInContactNumber.setAttribute('class', 'callInCell');
			callInReason.setAttribute('class', 'callInCell');
			callInDate.setAttribute('class', 'callInCell');
			callInComment.setAttribute('class', 'callInBottomCell');

			let reasonStr = '';
			if (getCallIns[i].reasonForCall.split('').length > 15) {
				reasonStr = getCallIns[i].reasonForCall.substring(0,15) + '...';
			} else {
				reasonStr = getCallIns[i].reasonForCall;
			}

			let commentStr = '';
			if (getCallIns[i].comments.split('').length > 50) {
				commentStr = getCallIns[i].comments.substring(0,50) + '...';
			} else {
				commentStr = getCallIns[i].comments;
			}

			let subDate = new Date(getCallIns[i].submissionDate);
			let month = subDate.getMonth() + 1;
			let day = subDate.getDate();
			let year = subDate.getFullYear();
			if (day < 10) day = '0' + day;
			if (month < 10) month = '0' + month;
			let date = `${month}/${day}/${year}`;
			getCallIns[i].submissionDate = date;

			let phoneArray = getCallIns[i].contactPhone.split('');
			let phoneStr = "(";
			for (let k = 0; k < phoneArray.length; k++){
				if (k == 3){
					phoneStr += ")-";
				} else if (k == 6) {
					phoneStr += "-";
				}
				phoneStr += phoneArray[k];
			}

			getCallIns[i].contactPhone = phoneStr;

			getCallIns[i].jobClass = getCallIns[i].jobClass.charAt(0).toUpperCase() + getCallIns[i].jobClass.slice(1);

			callInContactNameText.innerHTML = getCallIns[i].contactName;
			callInContactNumberText.innerHTML = getCallIns[i].contactPhone;
			callInReasonText.innerHTML = reasonStr;
			callInDateText.innerHTML = date;
			callInCommentText.innerHTML = commentStr;

			callInContactName.appendChild(callInContactNameText);
			callInContactNumber.appendChild(callInContactNumberText);
			callInReason.appendChild(callInReasonText);
			callInDate.appendChild(callInDateText);
			callInComment.appendChild(callInCommentText);

			callInTopBlock.appendChild(callInContactName);
			callInTopBlock.appendChild(callInContactNumber);
			callInTopBlock.appendChild(callInReason);
			callInTopBlock.appendChild(callInDate);

			callInBottomBlock.appendChild(callInComment);

			callInBlock.appendChild(callInTopBlock);
			callInBlock.appendChild(callInDivBlock);
			callInBlock.appendChild(callInBottomBlock);

			callInBlock.addEventListener('click', () => callInBlockBtnHandler(getCallIns[i]));

			if (getCallIns[i].handled == 'false'){
				openCallInColumn.appendChild(callInBlock);
			} else {
				closedCallInColumn.appendChild(callInBlock);
			}
		}
	} else {
		alert('ERROR: An error has occured. Notify the administrator if this problem persists.');
	}
}

function callInBlockBtnHandler(callIn) {
	console.log(callIn)
	if (callIn != null && callIn != undefined){
		//document.body.style.overflow = 'hidden';
		document.getElementById('noteBtn').addEventListener('click', () => addNote(callIn));
		document.getElementById('cancelBtn').addEventListener('click', () => closeModal());
		document.getElementById('modalHeader').innerHTML = `${callIn.contactName} - ${callIn.submissionDate}`;
		document.getElementById('modalJobClass').innerHTML = `Job Class: ${callIn.jobClass}`;
		document.getElementById('modalJobContact').innerHTML = `Job Contact: ${callIn.contactName}`;
		document.getElementById('modalPhone').innerHTML = `Contact Phone: ${callIn.contactPhone}`;
		document.getElementById('modalContactEmail').innerHTML = `Contact Email: ${callIn.contactEmail}`;
		document.getElementById('modalOwnerName').innerHTML = `Owner Name: ${callIn.ownerName}`;
		document.getElementById('modalMailingAddress').innerHTML = `Mailing Address: ${callIn.mailingAddress}`;

		document.getElementById('modalReason').innerHTML = `Reason For Call: ${callIn.reasonForCall}`;
		document.getElementById('modalComments').innerHTML = `Comments: ${callIn.comments}`;
		if (callIn.notes != null && callIn.notes != undefined && callIn.notes != "") {
			let notesString = "<u>Notes:</u><br><br>";
			let notesSplit = callIn.notes.split('::');

			for (let i = 0; i < notesSplit.length; i++){
				if (i < notesSplit.length - 1) {
					notesString += `${notesSplit[i]}<br><hr><br>`;
				} else {
					notesString += `${notesSplit[i]}<br>`
				}
			}

			document.getElementById('modalNotes').innerHTML = notesString;
		}

		callInModal.style.display = "block";
		backDrop.style.display = "block";
		if (callIn.handled == 'false') {
			document.getElementById('closeBtn').addEventListener('click', () => closeCallIn(callIn));
		} else {
			let reOpenBtn = document.getElementById('closeBtn');
			reOpenBtn.innerHTML = 'Reopen Call In';
			reOpenBtn.addEventListener('click', () => reopenCallIn(callIn));
		}
	} else {
		alert('ERROR: Something went wrong');
	}
}

async function closeCallIn(callIn){
	let _id = callIn._id;
	let contactName = callIn.contactName;
	let tsheetsid = user.tsheetsid
	let empName = `${user.firstname} ${user.lastname}`;
	let date = callIn.submissionDate;
	let data = {_id, empName, tsheetsid, contactName, date};
	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	const closeCallInRes = await fetch('/api/close_callin', postOptions);
	const closeCallInResults = await closeCallInRes.json();

	if (closeCallInResults.status == 'failure'){
		alert('ERROR: An error has occured.');
	}
	closeModal();
}

async function reopenCallIn(callIn){
	let _id = callIn._id;
	let contactName = callIn.contactName;
	let tsheetsid = user.tsheetsid
	let empName = `${user.firstname} ${user.lastname}`;
	let date = callIn.submissionDate;
	let data = {_id, empName, tsheetsid, contactName, date};
	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	const reopenCallInRes = await fetch('/api/reopen_callin', postOptions);
	const reopenCallInResults = await reopenCallInRes.json();

	if (reopenCallInResults.status == 'failure'){
		alert('ERROR: An error has occured.');
	}
	closeModal();
}

async function addNote(callIn){
	let empName = `${user.firstname} ${user.lastname}`;
	let notes = document.getElementById('addNotesField').value;
	let submissionDate = new Date();
	let date = submissionDate.toLocaleDateString();
	let notesString;
	if (callIn.notes == null || callIn.notes == undefined || callIn.notes == ""){
		notesString = "";
	} else {
		notesString = "::";
	}
	notesString += `${empName} - ${date} - ${notes}`;

	callIn.notes += notesString;
	notes = callIn.notes;
	let _id = callIn._id;
	let tsheetsid = user.tsheetsid;
	let contactName = callIn.contactName;
	const data = {notes, _id, tsheetsid, empName, date, contactName};

	const postOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	const closeCallInRes = await fetch('/api/add_callinnotes', postOptions);
	const closeCallInResults = await closeCallInRes.json();

	if (closeCallInResults.status == 'failure'){
		alert('ERROR: An error has occured.');
	}
	closeModal();
}

function closeModal() {
	callInModal.style.display = 'none';
	backDrop.style.display = 'none';
	window.open('callInHub.html', '_self');
}
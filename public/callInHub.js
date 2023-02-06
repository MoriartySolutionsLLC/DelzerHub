let callIns = {};

async function on_open() {
	let openCallInColumn = document.getElementById('openCallInColumn');
	let closedCallInColumn = document.getElementById('closedCallInColumn')
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

			let subDate = new Date(getCallIns[i].submissionDate);
			let month = subDate.getMonth() + 1;
			let day = subDate.getDate();
			let year = subDate.getFullYear();
			if (day < 10) day = '0' + day;
			if (month < 10) month = '0' + month;
			let date = `${month}/${day}/${year}`;


			callInContactNameText.innerHTML = getCallIns[i].contactName;
			callInContactNumberText.innerHTML = getCallIns[i].contactPhone;
			callInReasonText.innerHTML = getCallIns[i].reasonForCall;
			callInDateText.innerHTML = date;
			callInCommentText.innerHTML = getCallIns[i].comments;

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
}
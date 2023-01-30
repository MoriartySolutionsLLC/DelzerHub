/* 
This is the client side javascript code for the DDI-TimeOff-Website
url: TBD
The code below requests employee information from web server to validate form entries
It handles the submission of the time off request
It also sends the form information to the web server to be processed and handled accordingly
Lastly it sets the date boxes to todays date upon the opening of the web page
Read the ReadMe.md file for more information on the website and its uses for our Company
*/

// for calendar
let nav = 0;
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const calendar = document.getElementById('calendar');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
let events = {};

// asynchronous function to get employee information on the open of the webpage
async function on_open(){
  let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
  if (user != null){
    document.getElementById('loginBtn').textContent = "Logout";
    let userSettings = document.createElement('a');
    userSettings.setAttribute('href', 'userEdit.html');
    userSettings.innerHTML = `${user.firstname} ${user.lastname}`;
    userSettings.setAttribute('class', 'userEdit');
    document.getElementById('loginArea').appendChild(userSettings);
  }
	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const getEvDRes = await fetch('/api/eventData_time_off_calendar', getOptions);
	const getEvDResult = await getEvDRes.json();
	events = getEvDResult;
  for (let i = 0; i < events.length; i++){
    console.log(events[i])
  }
	load();
}

// asynchronous function to validate the form submission and send the information to the webserver
async function handle_submission(){	

  let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
  if (user == null) {
    alert("Please login before submitting a request");
    window.open('login.html', '_self');
  } 

  let firstname = user.firstname;
  let lastname = user.lastname;
  let tsheetsid = user.tsheetsid;

  // gets the form entries and assigns them to the appropriate variables
	let startDate = document.getElementById("start date").value;
	let endDate = document.getElementById("end date").value;
	let reason = document.getElementById("reason").value;
  let approved = "false";

	if (reason == ""){
		alert("Must fill out a reason for leaving"); // alerts user to enter all information
	} else { 
		
		// creates an object with the form fields
		const data = {firstname, lastname, tsheetsid, startDate, endDate, reason, approved};
		// creates post options for the api request
		const postOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		// requests to post form data to the web server and reads the result as json
		const postRes = await fetch('/api/add_time_off_request', postOptions);
		const postResult = await postRes.json();
  }
  // alerts users that time off was requested
    alert("Time off Requested");
  // reloads the page
  location.reload();
}

// function to get the current date and enter it into the forms date fields
function todays_date() {

	// initializes date with the built in Date class
	const date = new Date();

	// this code formats the date to YYYY-MM-DD
	let day = date.getDate(); // gets the day
	let month = date.getMonth() + 1; // gets the month
	let year = date.getFullYear(); // gets the year
	if (month < 10) month = "0" + month; // adds a 0 if the month is less than 10 ex 9 becomes 09
	if (day < 10) day = "0" + day; // adds a 0 if the is less than 10 ex 6 becomes 06
	let currentDate = year + '-' + month + '-' + day; // formats the current date to YYYY-MM-DD

	document.getElementById('start date').value = currentDate; // puts the current date into the start date form option
	document.getElementById('end date').value = currentDate; // puts the current date into the end date form option
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

function load() {
    const dt = new Date();

  	if (nav != 0) {
    	dt.setMonth(new Date().getMonth() + nav);
  	}

  	const day = dt.getDate();
  	const month = dt.getMonth();
  	const year = dt.getFullYear();

  	const firstDayOfMonth = new Date(year, month, 1);
  	const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  	const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    	weekday: 'long',
    	year: 'numeric',
    	month: 'numeric',
    	day: 'numeric',
  	});
  	const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  	document.getElementById('monthDisplay').innerText = 
    	`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  	calendar.innerHTML = '';

  	for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    	const daySquare = document.createElement('div');
    	daySquare.classList.add('day');

    	let fixMonth;
    	let fixDay;

    	if (month+1 < 10){
    		fixMonth = `0${month + 1}`;
    	} else {
    		fixMonth = `${month + 1}`;
    	}

    	if (i - paddingDays < 10){
    		fixDay = `0${i - paddingDays}`;
    	} else {
    		fixDay = `${i - paddingDays}`;
    	}
      
    	const dayString = `${year}-${fixMonth}-${fixDay}`;

    	if (i > paddingDays) {
      		daySquare.innerText = i - paddingDays;

      		if (i - paddingDays === day && nav === 0) {
        		daySquare.id = 'currentDay';
      		}
    	} else {
      		daySquare.classList.add('padding');
    	}

    calendar.appendChild(daySquare);    

  	}

  	const days = document.querySelectorAll('.day');

  	for (let i = 1; i <= days.length; i++){
  		
  		let fixMonth;
    	let fixDay;

    	if (month+1 < 10){
    		fixMonth = `0${month + 1}`;
    	} else {
    		fixMonth = `${month + 1}`;
    	}

    	if (i - paddingDays < 10){
    		fixDay = `0${i - paddingDays}`;
    	} else {
    		fixDay = `${i - paddingDays}`;
    	}

    	const dayString = `${year}-${fixMonth}-${fixDay}`;
      
      let dayMonth = parseInt(fixMonth)
      let dayB = parseInt(fixDay)
      
  		for (let k = 0; k < Object.keys(events).length; k++){
        let startDay = new Date(events[k].startDate);
        let startMonth = startDay.getMonth() + 1;
        let startD = startDay.getDate() + 1;
        let endDay = new Date(events[k].endDate + "T00:00:00");
        let endMonth = endDay.getMonth() + 1;
        let endD = endDay.getDate();
        let hclass = 'event';
        if (endMonth == dayMonth && startMonth < dayMonth && dayB == 1){
        
              let j = i - 1;
              let endDate = false;
              let hclass = "";
              switch (events[k].approved){
                case "false":
                  hclass = "unapproved";
                  break;
                case "true":
                  hclass = "approved";
                  break;
              }

              while(!endDate){

                if (i - paddingDays < 10){
                    fixDay = `0${j - paddingDays + 1}`;
                  } else {
                    fixDay = `${j - paddingDays + 1}`;
                  }
                  const tempDayStr = `${year}-${fixMonth}-${fixDay}`;
                  const eventDiv = document.createElement('div');
                  eventDiv.classList.add('event');
                  eventDiv.className = hclass;
                  eventDiv.innerText = `${events[k].firstname} ${events[k].lastname}`;
                  days[j].appendChild(eventDiv);
                  eventDiv.addEventListener('click', () => openModal(`${events[k].startDate}`, `${events[k].endDate}`, `${events[k].tsheetsid}`));
                  if (parseInt(fixDay) == endD){
                    endDate = true;
                  }
                  j++;
              }
        }
        
  			if (dayString == events[k].startDate){
  				let j = i - 1;
  				let endDate = false;
          switch (events[k].approved){
            case "false":
              hclass = "unapproved";
              break;
            case "true":
              hclass = "approved";
              break;
          }
  				while(!endDate){

					if (i - paddingDays < 10){
			    		fixDay = `0${j - paddingDays + 1}`;
			    	} else {
			    		fixDay = `${j - paddingDays + 1}`;
			    	}
			    	const tempDayStr = `${year}-${fixMonth}-${fixDay}`;
					  const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.className = hclass;
            eventDiv.innerText = `${events[k].firstname} ${events[k].lastname}`;
            days[j].appendChild(eventDiv);
            eventDiv.addEventListener('click', () => openModal(`${events[k].startDate}`, `${events[k].endDate}`, `${events[k].tsheetsid}`));
            if (parseInt(startD) == parseInt(endD) || parseInt(fixDay) == endD){
                if (parseInt(startMonth) == parseInt(endMonth)){
                  endDate = true;
                }
              } else if (j == days.length - 1){
                endDate = true;
              }
  				j++;
  				}
  			}
  		}
  	}
}

function openModal(startDate, endDate, tsheetsid){
    let user = JSON.parse(localStorage.getItem("currentlyLoggedIn")); 
  	const eventForDay = events.find(e => e.tsheetsid === tsheetsid && e.endDate === endDate && e.startDate === startDate);
    document.getElementById('deleteButton').addEventListener('click', () => deleteEntry(eventForDay.tsheetsid, eventForDay.ID));
    document.getElementById('updateButton').addEventListener('click', () => updateEntry(eventForDay.tsheetsid, eventForDay.ID));
  	if (eventForDay) {
      let approvalBtn = document.getElementById('approvalBtn');
      if (eventForDay.approved == 'true'){
        approvalBtn.innerHTML = 'Approved';
      }
      if (user.firstname == "John" && user.lastname == "Delzer" || user.firstname == "Kian"  && user.lastname == "Moriarty"){
        approvalBtn.addEventListener('click', () => approveEntry(eventForDay.approved, eventForDay.ID));
      } else {
        console.log('disabled')
        approvalBtn.disabled = true;
      }

      document.getElementById('fn').value = eventForDay.firstname;
      document.getElementById('ln').value = eventForDay.lastname;
      document.getElementById('sd').value = eventForDay.startDate;
      document.getElementById('ed').value = eventForDay.endDate;
      document.getElementById('re').value = eventForDay.reason;
    	deleteEventModal.style.display = 'block';

  	  backDrop.style.display = 'block';
	}
}

function closeModal() {
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  let clicked = null;
  load();
}

async function updateEntry(tsheetsid, dbId){
  const user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
  const startDate = document.getElementById('sd').value;
  const endDate = document.getElementById('ed').value;
  const reason = document.getElementById('re').value;
  
  if (tsheetsid == user.tsheetsid){
    let confirmation = confirm('Are you sure you want to update this entry?');
    if (confirmation){
      // creates an object with field information to update
      const data = {dbId, tsheetsid, startDate, endDate, reason};
      // creates post options for the api request
      const postOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      // requests to post form data to the web server and reads the result as json
      const postRes = await fetch('/api/update_time_off_request', postOptions);
      const postResult = await postRes.json();
    }
    location.reload();
  } else {
    alert('ALERT: Current user not allowed to edit this request');
    window.open('login.html', '_self');
  }
}

async function deleteEntry(tsheetsid, dbId){
  const user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
  if (tsheetsid == user.tsheetsid){
    let confirmation = confirm('Are you sure you want to delete this entry?');
    if (confirmation){
      // creates an object with the id to delete 
      const data = {tsheetsid, dbId};
      // creates post options for the api request
      const postOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      // requests to post form data to the web server and reads the result as json
      const postRes = await fetch('/api/delete_time_off_request', postOptions);
      const postResult = await postRes.json();
    }
    location.reload();
  } else {
    alert('Incorrect Entry ID')
  }
}

async function approveEntry(approved, dbId) {
  const user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
  let newApproved;
  let confirmation;
  if (approved == 'false') {
    confirmation = confirm('Are you sure you want to approve this entry?');
    newApproved = 'true';
  } else {
    confirmation = confirm('Are you sure you want to unapprove this entry?');
    newApproved = 'false';
  }

  let firstname = user.firstname;
  let lastname = user.lastname;

  if (confirmation){
    // creates an object with the id to delete 
    const data = {firstname, lastname, newApproved, dbId};
    // creates post options for the api request
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    // requests to post form data to the web server and reads the result as json
    const postRes = await fetch('/api/approve_time_off_request', postOptions);
    const postResult = await postRes.json();
  }
  location.reload();
}
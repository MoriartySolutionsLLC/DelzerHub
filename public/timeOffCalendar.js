/* 
This is the client side javascript code for the DDI-TimeOff-Website
url: TBD
The code below requests employee information from web server to validate form entries
It handles the submission of the time off request
It also sends the form information to the web server to be processed and handled accordingly
Lastly it sets the date boxes to todays date upon the opening of the web page
Read the ReadMe.md file for more information on the website and its uses for our Company
*/

// initializes form entry variables
let firstName;
let lastName;
let inputEmail;
let startDate;
let endDate;
let reason;
let toEmail;
// initializes employee list
let employeeList = {};
// for calendar
let nav = 0;
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const calendar = document.getElementById('calendar');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
let events = {};

// asynchronous function to get employee information on the open of the webpage
async function on_open(){
	// creates the options for the get api request
	const getOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}
	// requests employee information from the web server and reads the response as json
	const getEmpDRes = await fetch('/api/userData', getOptions);
	const getEmpDResult = await getEmpDRes.json();
	// sets the employee list with the result
	employeeList = getEmpDResult;

	const getEvDRes = await fetch('/api/eventData_time_off_calendar', getOptions);
	const getEvDResult = await getEvDRes.json();
	events = getEvDResult;
	load();
}

// asynchronous function to validate the form submission and send the information to the webserver
async function handle_submission(){

	// gets the form entries and assigns them to the appropriate variables
	firstName = fixName(document.getElementById("first name").value);
	lastName = fixName(document.getElementById("last name").value);
	inputEmail = document.getElementById("user email").value;
	startDate = document.getElementById("start date").value;
	endDate = document.getElementById("end date").value;
	reason = document.getElementById("reason").value;

	// if a required field is not filled out sends an alert
	if (firstName == "" || lastName == "" || reason == "" || inputEmail == ""){

		alert("Must fill out all required fields"); // alerts user to enter all information

	} else if (employeeList.hasOwnProperty(`${firstName} ${lastName}`)) { // if the name entered matches a name from the employee list runs the api post request

		// alerts users that time off was requested
		alert("Time off Requested");

		// reloads the page
		location.reload();

		// creates an object with the form fields
		const data = {firstName, lastName, inputEmail, startDate, endDate, reason};
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

	} else { // if the name entered doesn't match a name from the employee list it alerts the user

		alert("Employee not found in database.\nCheck spelling or contact manager."); // alerts the user that the name was not found in the database

	}
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
        if (endMonth == dayMonth && startMonth < dayMonth && dayB == 1){
        
              let j = i - 1;
              let endDate = false;
              while(!endDate){

                if (i - paddingDays < 10){
                    fixDay = `0${j - paddingDays + 1}`;
                  } else {
                    fixDay = `${j - paddingDays + 1}`;
                  }
                  const tempDayStr = `${year}-${fixMonth}-${fixDay}`;
                  const eventDiv = document.createElement('div');
                  eventDiv.classList.add('event');
                  eventDiv.innerText = `${events[k].firstName} ${events[k].lastName}`;
                  days[j].appendChild(eventDiv);
                  eventDiv.addEventListener('click', () => openModal(`${events[k].startDate}`, `${events[k].endDate}`, `${events[k].firstName}`, `${events[k].lastName}`));
                  if (parseInt(fixDay) == endD){
                    endDate = true;
                  }
                  j++;
              }
        }
        
  			if (dayString == events[k].startDate){
  				let j = i - 1;
  				let endDate = false;
  				while(!endDate){

					if (i - paddingDays < 10){
			    		fixDay = `0${j - paddingDays + 1}`;
			    	} else {
			    		fixDay = `${j - paddingDays + 1}`;
			    	}
			    	const tempDayStr = `${year}-${fixMonth}-${fixDay}`;
					  const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = `${events[k].firstName} ${events[k].lastName}`;
            days[j].appendChild(eventDiv);
            eventDiv.addEventListener('click', () => openModal(`${events[k].startDate}`, `${events[k].endDate}`, `${events[k].firstName}`, `${events[k].lastName}`));
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


function openModal(startDate, endDate, firstName, lastName){

  	const eventForDay = events.find(e => e.firstName === firstName && e.lastName === lastName && e.endDate === endDate && e.startDate === startDate);
    console.log(eventForDay.ID);
    document.getElementById('deleteButton').addEventListener('click', () => deleteEntry(eventForDay.ID));
    document.getElementById('updateButton').addEventListener('click', () => updateEntry(eventForDay.ID));
    console.log(eventForDay.ID)
  	if (eventForDay) {
      document.getElementById('fn').value = eventForDay.firstName;
      document.getElementById('ln').value = eventForDay.lastName;
      document.getElementById('email').value = eventForDay.inputEmail;
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

async function updateEntry(dbId){
  const startDate = document.getElementById('sd').value;
  const endDate = document.getElementById('ed').value;
  const reason = document.getElementById('re').value;
  
  if (dbId == document.getElementById('dbId').value){
    let confirmation = confirm('Are you sure you want to update this entry?');
    if (confirmation){
      // creates an object with field information to update
      const data = {dbId, startDate, endDate, reason};
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
    alert('Incorrect Entry ID')
  }
}

async function deleteEntry(dbId){
  if (dbId == document.getElementById('dbId').value){
    let confirmation = confirm('Are you sure you want to delete this entry?');
    if (confirmation){
      // creates an object with the id to delete 
      const data = {dbId};
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

function fixName(name){
  name = name.toLowerCase();
  const fixed = name.charAt(0).toUpperCase() + name.slice(1);
  return fixed;
}
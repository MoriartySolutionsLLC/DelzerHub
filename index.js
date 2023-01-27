
// Initialize employee list object
let employeeList = {};
// Initialize eventData list object
let eventData = {};

main();

function main(){

	const Datastore = require('nedb'); // database requirement
	// creating database
	const timeOffDB = new Datastore('timeOff.db');
	timeOffDB.loadDatabase();
	const jobSchedulingDB = new Datastore('jobScheduling.db');
	jobSchedulingDB.loadDatabase();

	const express = require('express');
	const app = express();
	require('dotenv').config();
	const port = process.env.PORT || 3000;

	app.listen(port, () => console.log(`app listening at ${port}`));
	app.use(express.static('public'));
	app.use(express.json({limit: '100mb'}));

	/*THESE API REQUESTS ARE FOR TIME OFF CALENDAR*/
	app.get('/api/employeeData', (req, res) => {
		employeeNames(data => {
			res.end(JSON.stringify(data));
		});
	});

	app.get('/api/eventData_time_off_calendar', (req, res) =>{
		getEventData(data =>{
			res.end(JSON.stringify(data));
		})
	});

	app.post('/api/add_time_off_request', (req, res) => {
		// the data from the request
		const data = req.body; 
		const timestamp = Date.now();
		data.timestamp = timestamp;

		// this gets the tsheets employee id associated with the entry
		let id = employeeList[`${data.firstName} ${data.lastName}`];
		// this creates the title of the event
		let title = `${data.firstName} ${data.lastName} requests this time off`;

		// saves request to database
		timeOffDB.insert(data);
		timeOffDB.find({}, function (err, docs){
			if (err) throw new Error(err);

			for (let i = 0; i < Object.keys(docs).length; i++) {
				if (i == Object.keys(docs).length - 1) {
					let dbID = docs[i]._id;
					
					// creates the content for the email to managers
					let content1 = `${data.firstName} ${data.lastName} has submitted a request to take time off from ${data.startDate} to ${data.endDate}\nHis reason is: ${data.reason}\nThe entry ID is ${dbID}`;

					// Runs the function to send an email to the managers
					sendEmail('kian.moriarty@delzerbiz.com, john@delzerbiz.com, jim@delzerbiz.com', content1);

					// creates the content for the user response
					let content2 = `Thank you ${data.firstName} ${data.lastName}, your request has successfully been submitted.\nYour entry ID is ${dbID}`;

					// Runs the function to send an email to the user
					sendEmail(data.inputEmail, content2);
				}
			}
		});

		// Runs the tsheets request function to send request to tsheets
		sendTsheetsRequest(id, data.startDate, data.endDate, data.reason);

		res.json({
			status: 'success',
			timestamp: timestamp,
		});

	});
  
  	app.post('/api/delete_time_off_request', (req, res) => {
    	const data = req.body;
    	const timestamp = Date.now();
    
    	timeOffDB.remove({ _id: `${data.dbId}` }, {}, function (err, numRemoved) {
      		console.log(`${data.dbId} was deleted`);
    	});
    
    	res.json({
      		status:'success',
    		timestamp: timestamp
    	});
  	});
  
	app.post('/api/update_time_off_request', (req, res) => {
	    const data = req.body;
	    const timestamp = Date.now();
	    
	    timeOffDB.update({ _id: `${data.dbId}` }, { $set: { startDate: `${data.startDate}`, endDate: `${data.endDate}`, reason: `${data.reason}`}}, {}, function(err, numReplaced){
	      console.log(`${data.dbId} was updated.`)
	    })
    
	    res.json({
	      status:'success',
	      timestamp: timestamp
    	});
  	});

	/*THESE API REQUESTS ARE FOR JOB SCHEDULING WEB PAGE*/
}

/*THESE FUNCTIONS ARE FOR TIME OFF CALENDAR*/
// Function to send email
function sendEmail(to, content){

	// requires built nodemailer module
	let nodemailer = require('nodemailer');

	// initializes transporter to send email
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'DDI.TimeOff.Request@gmail.com',
			pass: 'vszefhnvbqkcoyuz'
		}
	});

	// creates the mail options to send the email
	let mailOptions = {
		from: 'DDI.TimeOff.Request@gmail.com', // from address
		to: to, // main manager address
		subject: 'DDI Time Off Request', // subject line
		text: content // content of email
	}

	// sends the email
	transporter.sendMail(mailOptions, function(err, info){
		if (err) throw new Error(err);
	
		console.log('Email sent: ' + info.response); // if successful logs email info
	});
}

// function to get tsheets api token
function getToken(){

	// requires built in fyle system module
	const fs = require('fs');

	// reads token file
	const buffer = fs.readFileSync('token.txt');
	const fileContent = buffer.toString();

	// returns token
	return fileContent;
}

async function getEventData(_callback){

  const Datastore = require('nedb'); // database requirement
  // creating database
  const database = new Datastore('timeOff.db');
  database.loadDatabase();
  
	console.log("Sending Event Data---->");
	const result = new Promise((resolve, reject) => {
		database.find({}, function(err, docs){
			if (err) throw new Error(err);
			let eventList = [];
			for (let i = 0; i < Object.keys(docs).length; i++){
				let objectValue = {};
				objectValue['ID'] = docs[i]._id;
				objectValue['firstName'] = docs[i].firstName;
				objectValue['lastName'] = docs[i].lastName;
        		objectValue['inputEmail'] = docs[i].inputEmail;
				objectValue['startDate'] = docs[i].startDate;
				objectValue['endDate'] = docs[i].endDate;
				objectValue['reason'] = docs[i].reason;
				eventList.push(objectValue);
			}
			let events = eventList;
			return resolve(events);
		});
	});

	let data = await result;
	_callback(data);
}

// asynchronous function to request employee info from tsheets
async function employeeNames(_callback){

	// requires built in request module 
	const request = require("request");
	// gets token
	const token = getToken();
	// creates options for get api request page 1
	const options1 = { 
		method: 'GET',
  		url: 'https://rest.tsheets.com/api/v1/users',
  		headers: {
   	  		'Authorization': token
   		},	
   		qs: {
   			page: '1'
   		}
   	};
   	// creates options for get api request page 2
   	const options2 = {
   		method: 'GET',
   		url: 'https://rest.tsheets.com/api/v1/users',
   		headers: {
   			'Authorization': token
   		},
   		qs: {
   			page: '2'
   		}
   	};

   	// promises result from tsheets api
   	const result1 = new Promise((resolve, reject) => {

   		// requests employee info from tsheets api
		request(options1, function (err, response, body){
			if (err) throw new Error(err); // throws error if request fails

			let res = JSON.stringify(body); // creates string from json content return
 
 			// replaces unnecessary characters in the result
			res = res.replaceAll("\\\"", ""); 
			res = res.replaceAll(",\\n", "");
			res = res.split(" ");

			// returns the result
			return resolve(res);

		});

	});

	// promises result from tsheets api
   	const result2 = new Promise((resolve, reject) => {

   		// requests employee info from tsheets api
		request(options2, function (err, response, body){
			if (err) throw new Error(err); // throws error if request fails

			let res = JSON.stringify(body); // creates string from json content return
 
 			// replaces unnecessary characters in the result
			res = res.replaceAll("\\\"", ""); 
			res = res.replaceAll(",\\n", "");
			res = res.split(" ");

			// returns the result
			return resolve(res);

		});

	});

   	// gets the result
   	let data1 = await result1;
   	let data2 = await result2;
   	let data = data1.concat(data2);

   	// runs pullEmployeeData function to grab firstnames, lastnames, and ids from the employee info
   	const employees = await pullEmployeeData(data);
   	// puts the employee data into the employeeList object
   	employeeList = employees;

   	// returns the employee data to be used in a callback function
   	_callback(employees);
}

// function to pull employee's firstnames, lastnames, and ids from data received
function pullEmployeeData(data){

	// initializes id variable
	let id;
	// initializes employee map
	let employees = new Map();
	// initializes name variables
	let first_name;
	let last_name;
	let name;

	// for loop to pull the proper information from the data receieved
	for (let i = 0; i < data.length; i++){
		if (data[i] == "first_name:") {
			id = data[i-4]; // id is 4 values back from the "first_name:" value

			if (data[i+6] == "last_name:"){
				name = `${data[i+1]} ${data[i+7]}`;
			} else {
				name = `${data[i+1]} ${data[i+6]}`;
			}

			employees.set(name, id); // sets the key as the first and last name of employee and the value as the id of the employees
		}
	}

	// turns the map into an object
	let results = Object.fromEntries(employees);

	// returns the resulting object
	return results;

	
}

// function to send a time off request to tsheets
function sendTsheetsRequest(id, sDate, eDate, reason){

	// initializes the start and end dates with the built in date class 
	const startDate = new Date(sDate);
	const endDate = new Date(eDate);

	// requires the built in request module
	const request = require('request');
	// gets the token
	const token = getToken();
	// runs the createRequest body function to create the body of the api request
	const requestBody = createRequestBody(id, startDate, endDate, reason);
	// creates the options for the tsheets api post request
	const options = {
		method: 'POST',
		url: 'https://rest.tsheets.com/api/v1/time_off_requests',
		headers: {
			'Authorization': token,
			'Content-Type': 'application/json'
		},
		body: requestBody
	};

	// sends the request to the tsheets api
	request(options, function (err, response, body){
		if (err) throw new Error(err); // throws error if request fails

	});
}

// function to create the request body for the time off request
function createRequestBody(id, startDate, endDate, reason){

	// initializes date with the built in date class as the start date
	const date = new Date(startDate.getTime());
	// initializes the dates array to hold all of the given dates between the start and the end
	const dates = [];
	// initializes empty requestBody string this was done to allow concatenation when iterating with the while loop
	let requestBody = '';

	// while loop to get every date in between/including the start and end dates and put them in the dates array
	while (date <= endDate) {
		// this code sets the format of the dates to YYYY-MM-DD
		let day = date.getDate(); // gets the day
		let month = date.getMonth() + 1; // gets the month
		let year = date.getFullYear(); // gets the year
		if (month < 10) month = "0" + month; // adds a 0 if the month is less than 10 ex. 9 becomes 09
		if (day < 10) day = "0" + day; // adds a 0 if the day is less than 10 ex. 6 becomes 06

		let formattedDate = year + '-' + month + '-' + day; // formats to YYYY-MM-DD
		dates.push(formattedDate); // pushes the formatted date into the dates array
    date.setDate(date.getDate() + 1); // sets the date 
	}

	// for loop to create the individual request entries (every date needs a separate entry)
	for (let i = 0; i < dates.length; i++){
		
		// determines if this is the last entry
		if (i < dates.length - 1){
			requestBody +=`{
						"time_off_request_id": 621501856,
						"status": "pending",
						"entry_method": "manual",
						"duration": 28800,
						"date": "${dates[i]}",
						"jobcode_id": 61004502
					}, `
		} else { 
			requestBody +=`{
						"time_off_request_id": 621501856,
						"status": "pending",
						"entry_method": "manual",
						"duration": 28800,
						"date": "${dates[i]}",
						"jobcode_id": 61004502
					}]
				}]
			}`
		}
	}

	// creates the header for the request body
	let body = `	{
		"data": [{
			"time_off_request_notes": [{
				"note": "${reason}"
			}],
			"user_id": ${id},
			"time_off_request_entries": [`

	// concatenates the individual requests to the header
	body += requestBody;

	// returns the complete request body
	return body;
}


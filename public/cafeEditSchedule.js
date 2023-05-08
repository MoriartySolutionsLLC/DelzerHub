let dates;
let range = document.getElementById("range");
let schedPckts;

let sunday = document.getElementById("sunday");
let monday = document.getElementById("monday");
let tuesday = document.getElementById("tuesday");
let wednesday = document.getElementById("wednesday");
let thursday = document.getElementById("thursday");
let friday = document.getElementById("friday");
let saturday = document.getElementById("saturday");

let sundayBtn = document.getElementById("sundayBtn");
let mondayBtn = document.getElementById("mondayBtn");
let tuesdayBtn = document.getElementById("tuesdayBtn");
let wednesdayBtn = document.getElementById("wednesdayBtn");
let thursdayBtn = document.getElementById("thursdayBtn");
let fridayBtn = document.getElementById("fridayBtn");
let saturdayBtn = document.getElementById("saturdayBtn");

let editSundayBtn = document.getElementById("editSundayBtn");
let editMondayBtn = document.getElementById("editMondayBtn");
let editTuesdayBtn = document.getElementById("editTuesdayBtn");
let editWednesdayBtn = document.getElementById("editWednesdayBtn");
let editThursdayBtn = document.getElementById("editThursdayBtn");
let editFridayBtn = document.getElementById("editFridayBtn");
let editSaturdayBtn = document.getElementById("editSaturdayBtn");

const editModal = document.getElementById("editModal");
const modalBackDrop = document.getElementById("modalBackDrop");

let employees;
let empList;

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

  // creates the options for the get api request
  const getOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const getEmps = await fetch('/api/get_all_users', getOptions);
  const getEmpsResults = await getEmps.json();
  empList = getEmpsResults;
  employees = new Array(empList.length);

  for (let i = 0; i < empList.length; i++){
    employees[i] = empList[i].firstname + " " + empList[i].lastname;
  }
  autoComplete(document.getElementById("empName"), employees);

  const jobType = ["Dishwasher", "Head Server", "Line Cook", "Manager", "Server", "Sous Chef"];
  autoComplete(document.getElementById("jobType"), jobType);

  const dOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  autoComplete(document.getElementById("dOW"), dOW);

  let today = new Date();
  dates = dateRangeFinder(today);
  setRange();
  getSchedPcktsDR();
  setTableClmnNames(new Date(dates[0]));

  let previousWeekBtn = document.getElementById("previousWeekBtn");
  previousWeekBtn.addEventListener('click', () => {
    let prevDate = new Date(dates[0]);
    prevDate.setDate(prevDate.getDate() - 1);
    dates = dateRangeFinder(prevDate);
    setRange();
    getSchedPcktsDR();
    setTableClmnNames(new Date(dates[0]));
  });

  let nextWeekBtn = document.getElementById("nextWeekBtn");
  nextWeekBtn.addEventListener('click', () => {
    let nextDate = new Date(dates[1]);
    nextDate.setDate(nextDate.getDate() + 1);
    dates = dateRangeFinder(nextDate);
    setRange();
    getSchedPcktsDR();
    setTableClmnNames(new Date(dates[0]));
  });

  repeatBtnEvent(sundayBtn);
  repeatBtnEvent(mondayBtn);
  repeatBtnEvent(tuesdayBtn);
  repeatBtnEvent(wednesdayBtn);
  repeatBtnEvent(thursdayBtn);
  repeatBtnEvent(fridayBtn);
  repeatBtnEvent(saturdayBtn);

  editRepeatBtnEvent(editSundayBtn);
  editRepeatBtnEvent(editMondayBtn);
  editRepeatBtnEvent(editTuesdayBtn);
  editRepeatBtnEvent(editWednesdayBtn);
  editRepeatBtnEvent(editThursdayBtn);
  editRepeatBtnEvent(editFridayBtn);
  editRepeatBtnEvent(editSaturdayBtn);

  document.getElementById("formSubmitEdit").addEventListener('click', () => submitEdit(id));
  document.getElementById("formDeleteShift").addEventListener('click', () => deleteShift(id))
  modalBackDrop.addEventListener('click', () => closeModal());
  document.getElementById("closeModal").addEventListener('click', () => closeModal());

  document.getElementById("addToScheduleBtn").addEventListener('click', () => {
    addToSchedule();
  })

  document.getElementById("clearFormBtn").addEventListener('click', () => {
    clearForm();
  })
}

async function addToSchedule() {
  let confirmation = confirm("Are you sure you wish to add this time to the schedule?");
  if (confirmation) {

    let empName = document.getElementById("empName");
    let jobType = document.getElementById("jobType");
    let dOW = document.getElementById("dOW");
    let startTime = document.getElementById("startTime");
    let endTime = document.getElementById("endTime");

    let onSunday = false;
    let onMonday = false;
    let onTuesday = false;
    let onWednesday = false;
    let onThursday = false;
    let onFriday = false;
    let onSaturday = false;

    switch (dOW.value) {
    case "Sunday":
      onSunday = true;
      break;
    case "Monday":
      onMonday = true;
      break;
    case "Tuesday":
      onTuesday = true;
      break;
    case "Wednesday":
      onWednesday = true;
      break;
    case "Thursday":
      onThursday = true;
      break;
    case "Friday":
      onFriday = true;
      break;
    case "Saturday":
      onSaturday = true
      break;
    }

    if (sundayBtn.className == "activeRepeatBtn") { onSunday = true; }
    if (mondayBtn.className == "activeRepeatBtn") { onMonday = true; }
    if (tuesdayBtn.className == "activeRepeatBtn") { onTuesday = true; }
    if (wednesdayBtn.className == "activeRepeatBtn") { onWednesday = true; }
    if (thursdayBtn.className == "activeRepeatBtn") { onThursday = true; }
    if (fridayBtn.className == "activeRepeatBtn") { onFriday = true; }
    if (saturdayBtn.className == "activeRepeatBtn") { onSaturday = true; }

    const schedPckt = {
      empName: empName.value,
      jobType: jobType.value,
      sunday: onSunday,
      monday: onMonday,
      tuesday: onTuesday,
      wednesday: onWednesday,
      thursday: onThursday, 
      friday: onFriday,
      saturday: onSaturday,
      startTime: startTime.value,
      endTime: endTime.value,
      fDOW: dates[0],
      lDOW: dates[1]
    }

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schedPckt)
    }
    // requests to post form data to the web server and reads the result as json
    const postRes = await fetch('/api/add_schedPckt', postOptions);
    const postResult = await postRes.json();
    alert("Employee was scheduled");
    location.reload();
  }
}

async function clearForm() {
  let confirmation = confirm("Are you sure you do not want to save this to the schedule?");
  if (confirmation) {
    location.reload();
  }
}

function dateRangeFinder(date) {
  let dOW = date.getDay();
  let startDate = new Date(date);
  let endDate = new Date(date);

  switch (dOW) {
  case 0:
    startDate.setDate(date.getDate());
    endDate.setDate(date.getDate() + 6);
    break;
  case 1:
    startDate.setDate(date.getDate() - 1);
    endDate.setDate(date.getDate() + 5);
    break;
  case 2:
    startDate.setDate(date.getDate() - 2);
    endDate.setDate(date.getDate() + 4);
    break;
  case 3:
    startDate.setDate(date.getDate() - 3);
    endDate.setDate(date.getDate() + 3);
    break;
  case 4:
    startDate.setDate(date.getDate() - 4);
    endDate.setDate(date.getDate() + 2);
    break;
  case 5:
    startDate.setDate(date.getDate() - 5);
    endDate.setDate(date.getDate() + 1);
    break;
  case 6:
    startDate.setDate(date.getDate() - 6);
    endDate.setDate(date.getDate());
    break;
  }
  startDate.setHours(0,0,0,0)
  endDate.setHours(0,0,0,0)
  return [startDate, endDate];
}

function setTableClmnNames(start) {
  dateFrmt = start.toLocaleDateString();
  sunday.innerHTML = "Sunday " + dateFrmt.substr(0, dateFrmt.length - 5);
  start.setDate(start.getDate() + 1);
  dateFrmt = start.toLocaleDateString();
  monday.innerHTML = "Monday " + dateFrmt.substr(0, dateFrmt.length - 5);
  start.setDate(start.getDate() + 1);
  dateFrmt = start.toLocaleDateString();
  tuesday.innerHTML = "Tuesday " + dateFrmt.substr(0, dateFrmt.length - 5);
  start.setDate(start.getDate() + 1);
  dateFrmt = start.toLocaleDateString();
  wednesday.innerHTML = "Wednesday " + dateFrmt.substr(0, dateFrmt.length - 5);
  start.setDate(start.getDate() + 1);
  dateFrmt = start.toLocaleDateString();
  thursday.innerHTML = "Thursday " + dateFrmt.substr(0, dateFrmt.length - 5);
  start.setDate(start.getDate() + 1);
  dateFrmt = start.toLocaleDateString();
  friday.innerHTML = "Friday " + dateFrmt.substr(0, dateFrmt.length - 5);
  start.setDate(start.getDate() + 1);
  dateFrmt = start.toLocaleDateString();
  saturday.innerHTML = "Saturday " + dateFrmt.substr(0, dateFrmt.length - 5);
}

function setRange(start, end) {
  let startFrmt = dates[0].toLocaleDateString();
  let endFrmt = dates[1].toLocaleDateString();
  let formattedDate = startFrmt + " - " + endFrmt;
  range.innerHTML = formattedDate;
  return formattedDate;
}

function repeatBtnEvent(btn) {
  btn.addEventListener('click', () => {
    if(btn.className == "repeatBtn") {
      btn.setAttribute("class", "activeRepeatBtn");
    } else {
      btn.setAttribute("class", "repeatBtn");
    }
  });
}

function editRepeatBtnEvent(btn) {
  btn.addEventListener('click', () => {
    if(btn.className == "editRepeatBtn") {
      btn.setAttribute("class", "editActiveRepeatBtn");
    } else {
      btn.setAttribute("class", "editRepeatBtn");
    }
  });
}

async function getSchedPcktsDR() {
  let schedAreas = document.getElementsByClassName("schedArea");
  let numSched = schedAreas.length;
  for (let i = numSched-1; i >= 0; i--) {
    schedAreas[i].remove();
  }

  const data = {fDOW: dates[0], lDOW: dates[1]}
  const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    // requests to post form data to the web server and reads the result as json
    const postRes = await fetch('/api/get_schedPckt_dr', postOptions);
    const postResult = await postRes.json();
    schedPckts = postResult
    for (let i = 0; i < schedPckts.length; i++) {
      if (schedPckts[i].sunday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "sundayBlock", schedPckts[i]) }
      if (schedPckts[i].monday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "mondayBlock", schedPckts[i]) }
      if (schedPckts[i].tuesday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "tuesdayBlock", schedPckts[i]) }
      if (schedPckts[i].wednesday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "wednesdayBlock", schedPckts[i]) }
      if (schedPckts[i].thursday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "thursdayBlock", schedPckts[i]) }
      if (schedPckts[i].friday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "fridayBlock", schedPckts[i]) }
      if (schedPckts[i].saturday) { addSchedBlock(schedPckts[i]._id, schedPckts[i].empName, schedPckts[i].jobType, schedPckts[i].startTime, schedPckts[i].endTime, "saturdayBlock", schedPckts[i]) }
    }
}

function addSchedBlock(id, empName, jobType, startTime, endTime, divName, schedPckt) {
  let schedArea = document.createElement('div');
  schedArea.setAttribute("class", "schedArea");
  let schedBlock = document.createElement('div');
  schedBlock.innerHTML = empName + "<br>" + jobType + "<br>" + startTime + " - " + endTime;
  schedBlock.addEventListener('click', () => {
    openModal(id, empName, jobType, startTime, endTime, divName, schedPckt);
  });
  schedBlock.setAttribute("class", "schedBlock");
  schedArea.appendChild(schedBlock);
  document.getElementById(divName).appendChild(schedArea);
}

function openModal(id, empName, jobType, startTime, endTime, divName, schedPckt) {
  editModal.style.display = 'block';
  modalBackDrop.style.display = 'block';

  for (let i = 0; i < empList.length; i++){
    employees[i] = empList[i].firstname + " " + empList[i].lastname;
  }
  autoComplete(document.getElementById("formEmpName"), employees);
  document.getElementById("formEmpName").value = empName;

  const jobTypes = ["Dishwasher", "Head Server", "Line Cook", "Manager", "Server", "Sous Chef"];
  autoComplete(document.getElementById("formJobType"), jobTypes);
  document.getElementById("formJobType").value = jobType;

  document.getElementById("formStartTime").value = startTime;
  document.getElementById("formEndTime").value = endTime;

  if (schedPckt.sunday) {
    editSundayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  if (schedPckt.monday) {
    editMondayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  if (schedPckt.tuesday) {
    editTuesdayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  if (schedPckt.wednesday) {
    editWednesdayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  if (schedPckt.thursday) {
    editThursdayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  if (schedPckt.friday) {
    editFridayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  if (schedPckt.saturday) {
    editSaturdayBtn.setAttribute('class', 'editActiveRepeatBtn');
  }
  window.scrollTo({top: 0});
}

function submitEdit(id) {
  console.log("submit")
  editModal.style.display = 'none';
  modalBackDrop.style.display = 'none';
  getSchedPcktsDR();
  setTableClmnNames(new Date(dates[0]));
}

function deleteShift(id) {
  console.log("delete");
  editModal.style.display = 'none';
  modalBackDrop.style.display = 'none';
  getSchedPcktsDR();
  setTableClmnNames(new Date(dates[0]));
}

function closeModal() {
  editModal.style.display = 'none';
  modalBackDrop.style.display = 'none';
  editSundayBtn.setAttribute('class', 'editRepeatBtn');
  editMondayBtn.setAttribute('class', 'editRepeatBtn');
  editTuesdayBtn.setAttribute('class', 'editRepeatBtn');
  editWednesdayBtn.setAttribute('class', 'editRepeatBtn');
  editThursdayBtn.setAttribute('class', 'editRepeatBtn');
  editFridayBtn.setAttribute('class', 'editRepeatBtn');
  editSaturdayBtn.setAttribute('class', 'editRepeatBtn');
  getSchedPcktsDR();
  setTableClmnNames(new Date(dates[0]));

}

function findDOW(divName) {
  let str = divName.replace("Block", "");
  let result = str.charAt(0).toUpperCase() + str.slice(1);
  return result;
}
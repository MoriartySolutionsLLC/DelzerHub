let dates;
let range = document.getElementById("range");

function on_open() {  
  let user = JSON.parse(localStorage.getItem("currentlyLoggedIn"));
  if (user != null){
    document.getElementById('loginBtn').textContent = "Logout";
    let userSettings = document.createElement('a');
    userSettings.setAttribute('href', 'userEdit.html');
    userSettings.innerHTML = `${user.firstname} ${user.lastname}`;
    userSettings.setAttribute('class', 'userEdit');
    document.getElementById('loginArea').appendChild(userSettings);
  }

  let today = new Date();
  dates = dateRangeFinder(today);
  setRange();
  setTableClmnNames(new Date(dates[0]));

  let previousWeekBtn = document.getElementById("previousWeekBtn");
  previousWeekBtn.addEventListener('click', () => {
    let prevDate = new Date(dates[0]);
    prevDate.setDate(prevDate.getDate() - 1);
    dates = dateRangeFinder(prevDate);
    setRange();
    setTableClmnNames(new Date(dates[0]));
  });

  let nextWeekBtn = document.getElementById("nextWeekBtn");
  nextWeekBtn.addEventListener('click', () => {
    let nextDate = new Date(dates[1]);
    nextDate.setDate(nextDate.getDate() + 1);
    dates = dateRangeFinder(nextDate);
    setRange();
    setTableClmnNames(new Date(dates[0]));
  });

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
  range.innerHTML = startFrmt + " - " + endFrmt;
}
// set to defalut values for date when page is loaded

// Take to date of today
const today = new Date().toISOString().split('T')[0]; // translate to format YYYY-MM-DD
const todayDate = new Date(today);

// create oneMonthLaterDate variable and set the value one month later
const oneMonthLaterDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());

// set the values for input area
document.getElementById('startDate').value = today;
document.getElementById('endDate').value = oneMonthLaterDate.toISOString().split('T')[0];
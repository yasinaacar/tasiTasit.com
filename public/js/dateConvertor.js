function formatDateToCustomFormat(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString()}`;
}           
const startDates=document.querySelectorAll(".startDate");
const endDates=document.querySelectorAll(".endDate");


startDates.forEach(element => {
    const originalStartDate = element.textContent;
    const formattedStartDate = formatDateToCustomFormat(originalStartDate);
    element.textContent = formattedStartDate;
});

endDates.forEach(element => {
    const originalEndDate = element.textContent;
    const formattedEndDate = formatDateToCustomFormat(originalEndDate);
    element.textContent = formattedEndDate;
});


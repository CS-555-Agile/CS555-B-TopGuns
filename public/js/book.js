

    // Add an onChange event listener to the dropdown.
const dropdown = document.getElementById('gender');
dropdown.addEventListener('change', async () => {
  // Get the value of the dropdown.
  const selectedValue = dropdown.value;
 
if(selectedValue==='professionalstaff'){
    // Call the data function.
  const professionalstaff = await fetchData();
   // Populate the other dropdown with the results.
   const otherDropdown = document.getElementById('genderDropdown');
   otherDropdown.innerHTML = '';
   for (const item of professionalstaff) {
     const option = document.createElement('option');
    //  console.log(item._id.toString())
     option.value = item._id.toString();
     option.textContent = item.firstName + "(" +item.subcategory + ")";
     otherDropdown.appendChild(option);
   }

}
else{
    const consultant = await another();
     // Populate the other dropdown with the results.
  const otherDropdown = document.getElementById('genderDropdown');
  otherDropdown.innerHTML = '';
  for (const item of consultant) {
    const option = document.createElement('option');
 
    option.value = item._id.toString();
    option.textContent = item.firstName + "(" +item.subcategory + ")";
    otherDropdown.appendChild(option);
  }
}  

 
});

function scrollToContent() {
  var contentElement = document.querySelector('.content');
  var contentOffset = contentElement.offsetTop;

  window.scrollTo({
      top: contentOffset,
      behavior: 'smooth'
  });
}

document.body.addEventListener('click', function(event) {
  // Check if the clicked element is inside a dropdown
  let isDropdownClick = event.target.closest('.dropdown');

  // If not, close any open dropdowns
  if (!isDropdownClick) {
      closeAllDropdowns();
  }
});

function closeAllDropdowns() {
  // Close upcoming appointments dropdown
  document.getElementById('upcomingDropdown').classList.remove('open');

  // Close past appointments dropdown
  document.getElementById('pastDropdown').classList.remove('open');
}

// Add click event listeners to dropdown buttons to toggle the dropdowns
document.getElementById('upcomingDropdown').addEventListener('click', function() {
  closeAllDropdowns();
  this.classList.toggle('open');
});

document.getElementById('pastDropdown').addEventListener('click', function() {
  closeAllDropdowns();
  this.classList.toggle('open');
});
// Fetch data from a remote server.
async function fetchData() {
  const response = await fetch('http://localhost:3000/appointment/getConsultant');
  const data = await response.json();
  return data;
}
async function another() {
    const response = await fetch('http://localhost:3000/appointment/getProfessioanl');
    const data = await response.json();
    return data;
  }
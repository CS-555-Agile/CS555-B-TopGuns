

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

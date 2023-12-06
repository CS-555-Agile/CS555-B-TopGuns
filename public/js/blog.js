
  function redirectToPage() {
      // Change the URL to the target page
      window.location.href = './blogdisplay.html';
  }



  function redirectToAnotherPage(element) {
      // Get the target URL from the data-target attribute
      var targetUrl = element.getAttribute('data-target');
      
      // Check if a target URL is defined
      if (targetUrl) {
          // Navigate to the specified page
          window.location.href = targetUrl;
      }
  }

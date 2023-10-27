// This function checks if the necessary permissions have been granted.
async function checkPermissions() {
    // Define the permissions we need to check.
    const permissionsToCheck = {
      origins: ["https://9gag.com/*"]
    };
  
    // Use the Permissions API to check if the permissions are already granted.
    const hasPermission = await browser.permissions.contains(permissionsToCheck);
    return hasPermission;
}

// Once the DOM content is fully loaded, we check for permissions.
document.addEventListener('DOMContentLoaded', async () => {
    // If permissions are already granted, update the popup message and hide the grant button.
    if (await checkPermissions()) {
      document.getElementById('message').textContent = "Permissions have already been granted!";
      document.getElementById('requestPermission').style.display = 'none';
    }
});

// Add an event listener to the 'Grant' button.
document.getElementById('requestPermission').addEventListener('click', async () => {
    // Define the permissions we want to request.
    const permissionsToRequest = {
      origins: ["https://9gag.com/*"]
    };
    
    // Request permissions using the Permissions API.
    browser.permissions.request(permissionsToRequest);

    // Close the popup window after making the request.
    window.close();
});

document.getElementById('flightForm').addEventListener('submit', function(event) {

  // Override default event actions
  event.preventDefault();

  // Get the input values
  const csvFile = document.getElementById('csvFile').files[0];
  const departureAirport = document.getElementById('departureAirport').value;
  const arrivalAirport = document.getElementById('arrivalAirport').value;
  const flightNumber = document.getElementById('flightNumber').value;

  // Read the CSV file
  const fileReader = new FileReader();

  fileReader.onload = function(e) {

    // Parse the CSV File to get the data as a string
    const csvData = e.target.result;

    // Process the flight route and return it as a string
    const flightRoute = processFlightRoute(csvData, departureAirport, arrivalAirport, flightNumber);

    // Pass the Flight Route to the HTML File
    document.getElementById("output").innerHTML = flightRoute;

  };

  fileReader.readAsText(csvFile);

});

function processFlightRoute(csvData, departureAirport, arrivalAirport, flightNumber) {

  /************************************************************************************
  Description:
    This function converts CSV Data from Google MyMaps into an FMC Route for GeoFS

  Arguments:
    csvData (string)          : Information about waypoint name, latitude, longitude
    departureAirport (string) : The ICAO code of the departure airport
    arrivalAirport (string)   : The ICAO code of the arrival airport
    flightNumber (string)     : The flight number

  Returns:
    flightRoute (string)      : The FMC Route for GeoFS
  *************************************************************************************/

  // Splits the CSV file into a list of lines
  const lines = csvData.split('\n');

  // Splits the header line into the columns
  const header = lines[0].split(',');

  // Variable to store the route
  const route = [];

  // Iterate over all the lines in the CSV file
  for (let i = 1; i < lines.length; i++) {

    // Separate them by the header columns
    const values = lines[i].split(',');

    // Skip any invalid waypoints
    if (values.length !== header.length) { continue; }

    // Get the waypoint as the tuple of latitude and longitude
    const wpt = values[0].replace(/'/g, '');

    // Set the waypoint name to be the 2nd column value
    const name = values[1];

    // Parse the waypoint tuple into latitude and longitude
    const [, lat, lon] = wpt.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

    // If latitude or longitude == 0, then change it to 0.00001
    const p_lat = parseFloat(lat) === 0. ? 0.00001 : parseFloat(lat);
    const p_lon = parseFloat(lon) === 0. ? 0.00001 : parseFloat(lon);

    // Set the decimal precision to 5 and covert to float data type
    const latitude = parseFloat(parseFloat(p_lat).toFixed(5));
    const longitude = parseFloat(parseFloat(p_lon).toFixed(5));

    // Push the waypoint with name, latitude, and longitude onto the list
    route.push([name, longitude, latitude, null, false, null]);
  }

  // Print the output object array in the format of the FMC Route
  var output = [departureAirport, arrivalAirport, flightNumber, route];

  // Convert the object array to the string
  const flightRoute = JSON.stringify(output)

  // Return the flight route
  return flightRoute;

}

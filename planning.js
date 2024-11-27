const fs = require('fs');

// function to read the csv file and return an array representing the data
function readCsv(filename, delimiter = ',') {
    try {
      const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' }); // read the file content 
      const rows = fileContent.split('\n'); // split the content into rows based on new lines
      const data = []; // create an empty array to store the data
      for (let i = 1; i < rows.length; i++) { // iterate over each row, skipping the header 
        const row = rows[i].trim(); // remove whitespace 
        if (row) { // checks if a row is not empty
          const columns = row.split(delimiter); // split the row into columns based on delimiter
          data.push(columns); // add the array of columns to the data array
        }
      }
      return data; // return the parsed data
    } catch (err) {
      console.error("Error reading file:", err.message); // log any errors that occur while reading the file
      return null; // return null to indicate an error
    }
  }
// function to calculate profit and loss of a flight
function calculateProfitLoss(flight, airports, aeroplanes) {
 const airport = airports.find(a => a[1] === flight[1]); // find the airport data for the flight's destination airport
  if (!airport) {
    console.error(`Airport Not Found For Flight: ${flight}`); // log an error if airport data is not found
    return null;
  }

  // find aeroplane data 
  const aeroplane = aeroplanes.find(a => a[0] === flight[2]); 
  if (!aeroplane) {
    console.error(`Aeroplane Not Found For Flight ${flight}`); // log an error if aeroplane data is not found
    return null;
  }

  // calculate distance based on UK airport
  const distance = flight[0] === 'MAN' ? parseFloat(airport[2]) : parseFloat(airport[3]);

  // extract data from the flight array
  const passengersFirstClass = parseInt(flight[5], 10);
  const passengersBusiness = parseInt(flight[4], 10);
  const passengersEconomy = parseInt(flight[3], 10);
  const priceFirstClass = parseFloat(flight[8]);
  const priceBusiness = parseFloat(flight[7]);
  const priceEconomy = parseFloat(flight[6]);
  const fuelEconomy = parseFloat(aeroplane[2]);
  const runningCostPerSeatPer100km = parseFloat(aeroplane[1]); 

  // calculate costs (added seat cost calculation)
  const fuelCost = (distance / fuelEconomy) * 1.50; // calculate fuel cost based on distance and fuel economy 
  const airportCost = (passengersBusiness + passengersEconomy + passengersFirstClass) * 30; // calculate cost based on number of passengers
  const economySeatCost = (distance / fuelEconomy) * runningCostPerSeatPer100km * passengersEconomy;
  const businessSeatCost = (distance / fuelEconomy) * runningCostPerSeatPer100km * passengersBusiness;
  const firstClassSeatCost = (distance / fuelEconomy) * runningCostPerSeatPer100km * passengersFirstClass;
  const totalCost = airportCost + fuelCost + economySeatCost + businessSeatCost + firstClassSeatCost; // calculate the total cost of the flight

  // calculate revenue
  const firstClassRevenue = passengersFirstClass * priceFirstClass;
  const businessRevenue = passengersBusiness * priceBusiness;
  const economyRevenue = passengersEconomy * priceEconomy;
  const totalRevenue = firstClassRevenue + businessRevenue + economyRevenue; // calculate total revenue from ticket sales

  const profitLoss = totalRevenue - totalCost; // calculate the profit or loss

  return { // return an object containing flight details and calculated values
    flight: flight.join(', '),
    distance,
    fuelCost,
    airportCost,
    totalRevenue,
    profitLoss,
  };
}

function main() {
  try { // read data from csv file 
    const airports = readCsv('airports.csv');
    const aeroplanes = readCsv('aeroplanes.csv');
    const flights = readCsv('valid_flight_data.csv');

    // process each flight and calculate profit/loss
    const results = flights.map(flight => calculateProfitLoss(flight, airports, aeroplanes)); 

    console.table(results); // output the results in a table format 

  } catch (error) {
    console.error('An Error Occured:', error); // log any errors that occur.
  }

}
// call the main function to start the program execution.
main();
  
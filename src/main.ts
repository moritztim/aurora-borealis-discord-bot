import moment from "moment";

const API_URL =
	"https://services.swpc.noaa.gov/json/ovation_aurora_latest.json";
const THRESHOLD = 0; // TODO: change to 1; 0 is just for testing

// Seattle coordinates
const LONGITUDE = -122.3321;
const LATITUDE = 47.6062;

fetch(API_URL)
	.then((data) => data.json())
	.then((response) => {
		const location = to360({ longitude: LONGITUDE, latitude: LATITUDE });
		const forecast = response.coordinates.find(
			(entry) => entry[0] === location[0] && entry[1] === location[1],
		)[2];
		if (forecast >= THRESHOLD) notify(forecast, response["Forecast Time"]);
	});

/*
	Convert to 0-360 Coordinates
	The API uses a 0-360 coordinate system, whereas humans typically use -180 - 180 for long & lat.
	This function converts them.
	It also rounds them since the API doesn't support floats.
	Formula from: http://www.idlcoyote.com/map_tips/lonconvert.html
*/
function to360(coords180: { longitude; latitude }) {
	const coords360 = {
		longitude: (coords180.longitude + 360) % 360,
		latitude: (coords180.latitude + 360) % 360,
	};
	return [Math.round(coords360.longitude), Math.round(coords360.latitude)];
}

/** Convert to Pacific Standard Time */
function toPstTime(/** Coordinated Universal Time */ utcTime) {
	return moment.parseZone(utcTime).local().format("hh:mm:ss a");
}

function notify(
	/** Aurora Borealis Forecast */ forecast,
	/** Coordinated Universal Time */ utcTime,
) {
	const pstTime = toPstTime(utcTime);
	const subject = "AURORA ALERT";
	const message = `There is an Aurora forecast of ${forecast}% for ${pstTime}`;
	// TODO: send email to process.env.PHONE_NUMBER + "@txt.att.net";
}

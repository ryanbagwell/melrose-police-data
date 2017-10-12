import 'fetch-polyfill';
import qs from 'query-string';

const directionsService = new google.maps.DirectionsService();

export default (origin, destination, cb = () => {}) => {

  var request = {
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING'
  };

  directionsService.route(request, function(result, status) {

    if (status == 'OK') {

      let {distance, duration} = result.routes[0].legs[0];

      let miles = distance.value / 1609.34, //returned distance is in meters;
        hour = duration.value / 60 / 60;

      let mph = miles / hour;

      cb(mph);

    }

  });


}
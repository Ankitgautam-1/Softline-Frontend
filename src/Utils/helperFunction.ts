import moment, { Moment } from 'moment';

export function dateDiff(startdate: Moment, enddate: Moment) {
	var startdateMoment = moment(startdate);
	var enddateMoment = moment(enddate);

	var years = enddateMoment.diff(startdateMoment, 'years');
	var months = enddateMoment.diff(startdateMoment, 'months') - years * 12;
	startdateMoment.add(years, 'years').add(months, 'months');
	var days = enddateMoment.diff(startdateMoment, 'days');
	return {
		years: years,
		months: months,
		days: days,
	};
}

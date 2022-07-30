import moment from 'moment';

export const displayDate = (value, format = 'DD MMM YYYY') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayDateTime = (value, format = 'DD MMM YYYY HH:mm') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayActive = (val: boolean): string => {
	return val ? 'Active' : 'Not Active';
};
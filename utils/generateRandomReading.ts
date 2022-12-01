import { generateRandomInRange } from "./generateRandomNumber";

const readingsTypes = ["pulse","temp","bp","o2sat"];

export const generateRandomReading = () => {
	const r_type = readingsTypes[Math.floor(Math.random()*readingsTypes.length)];
	let value = null;
	if(r_type === "pulse"){
		value = parseInt(generateRandomInRange(60,100).toFixed(0));
	} else if(r_type === "temp"){
		value = parseInt(generateRandomInRange(97,99.1).toFixed(1))
	} else if(r_type === "o2sat"){
		value = parseInt(generateRandomInRange(95,100).toFixed(2));
	} else {
		value = {
			s: parseInt(generateRandomInRange(90,120).toFixed(0)),
			d: parseInt(generateRandomInRange(60,80).toFixed(0))
		}
	}
	return {
		n: r_type,
		v: value 
	}
}
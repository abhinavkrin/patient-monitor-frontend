export function makeId(len){
	var result = String(Math.random() * (new Date().getTime())).replace('.','');
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < 16; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	const resultArray = Array.from(result);
	const id = []
	for (var i = 0, j, l = result.length; i < (len || l); i++) {
		j = Math.floor(Math.random() * l);
		id.push(resultArray[j])
	}
	return id.join('');
}
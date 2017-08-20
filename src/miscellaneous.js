export function generateRandomNumber(min, max) 
{
	return Math.ceil(Math.random() * (max-min) + min);
}

export function shuffle(array)
{
	array.sort(() => (Math.random() - 0.5));
}
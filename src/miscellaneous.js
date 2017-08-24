/**
 * Generates a random number in the given range
 * @param  {integer} min
 * @param  {integer} max
 * 
 * @return {integer} 
 */
export function generateRandomNumber(min, max) 
{
	return Math.ceil(Math.random() * (max-min) + min);
}

/**
 * Shuffles array
 *
 * @param  {array}
 * 
 * @return void
 */
export function shuffle(array)
{
	array.sort(() => (Math.random() - 0.5));
}
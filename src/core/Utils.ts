export function random(min: number, max: number) {
	return min + love.math.random() * (max - min);
}
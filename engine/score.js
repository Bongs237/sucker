/**
* If there's no scores, what's the POINT of the game (no pun intended)?
*/

class Score {
	constructor(id, value) {
		this.id = id;
		this.value = value;
		this.score = value;
		this.points = value;
		document.getElementById(this.id).innerHTML = value;
	}
	
	setValue(newValue) {
		this.value = newValue;
		this.score = newValue;
		this.points = newValue;
		document.getElementById(this.id).innerHTML = this.value;
	}
	
	setScore(n) {
		this.setValue(n);
	}
	
	setPoints(n) {
		this.setValue(n);
	}
	
	changeValue(newValue) {
		this.value += newValue;
		this.score += newValue;
		this.points += newValue;
		document.getElementById(this.id).innerHTML = this.value;
	}
	
	addScore(n) {
		this.changeValue(n);
	}
	
	addPoints(n) {
		this.changeValue(n);
	}
	
	add(n) {
		this.changeValue(n);
	}
}
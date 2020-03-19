/*
 *  Created by Jeff Colgan, March 14, 2020.
 *  
 *  Javascript code for the sign-up page of Link webpage.
 */
function onSignUp(){
    var password = document.getElementById("firstPassword");
    var confirmPassword = document.getElementById("confirmPassword");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");
    var match = document.getElementById("match");
    
    var lowerCase = /[a-z]+/g;
    var upperCase = /[A-Z]+/g;
    var numbers = /[0-9]+/g;
    var minimumLength = 12;

    password.onkeyup = function(){
	if(password.value.match(lowerCase)){
	    letter.classList.remove("invalid");
	    letter.classList.add("valid");
	}
	else{
	    letter.classList.remove("valid");
	    letter.classList.add("invalid");
	}

	if(password.value.match(upperCase)){
	    capital.classList.remove("invalid");
	    capital.classList.add("valid");
	}
	else{
	    capital.classList.remove("valid");
	    capital.classList.add("invalid");
	}

	if(password.value.match(numbers)){
	    number.classList.remove("invalid");
	    number.classList.add("valid");
	}
	else{
	    number.classList.remove("valid");
	    number.classList.add("invalid");
	}
	if(password.value.length >= minimumLength){
	    length.classList.remove("invalid");
	    length.classList.add("valid");
	}
	else{
	    length.classList.remove("valid");
	    length.classList.add("invalid");
	}
    }

    confirmPassword.onkeyup = function(){
	if(password.toString() == confirmPassword.toString()){
	    match.classList.remove("invalid");
	    match.classList.add("valid");
	}
	else{
	    match.classList.remove("valid");
	    match.classList.add("invalid");
	}
    }

    enableButton(letter, capital, number, length, match);
}

function enableButton(letter, capital, number, length, match){
    var button = document.getElementById("submitButton");
    var condition = true;
    
    if(letter.classList.contains("invalid")){
	condition = false;
    }
    if(capital.classList.contains("invalid")){
	condition = false;
    }
    if(number.classList.contains("invalid")){
	condition = false;
    }
    if(length.classList.contains("invalid")){
	condition = false;
    }
    if(match.classList.contains("invalid")){
	condition = false;
    }

    if(condition == true){
	button.disabled = false;
    }
    else{
	button.disabled = true;
    }
}

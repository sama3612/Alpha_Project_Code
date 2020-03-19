/*
 *  Created by Jeffrey Colgan, March 18, 2020.
 *  Script to validate email addresses for the group project CSCI 3308 Software Development
 *  methods and tools
 */

/*
 *  Function for validating email addresses.  Email address should contain a valid address (string)
 *  with at least one capital letter, lower case letter, or number, followed by the @ symbol, followed
 *  by a valid domain (string followed by either .net, .com, or .edu).
 */
function openInput(){
    var emailInput = document.getElementById("input_email");
    var symbol = document.getElementById("containsAt");
    var domain = document.getElementById("validDomain");

    emailInput.onkeyup = function() {
	var atSymbol = /[A-Za-z0-9]+[@]+/g;
	var validDomain = /[A-Za-z0-9]+((.net)|(.com)|(.edu))$/g;

	if(emailInput.value.match(atSymbol)){
	    symbol.classList.remove("invalid");
	    symbol.classList.add("valid");
	}
	else{
	    symbol.classList.remove("valid");
	    symbol.classList.add("invalid");
	}

	if(emailInput.value.match(validDomain)){
	    domain.classList.remove("invalid");
	    domain.classList.add("valid");
	}
	else{
	    domain.classList.remove("valid");
	    domain.classList.add("invalid");
	}

	enableRequest(symbol, domain);
    }
}

/*
 *  Function to enable the freind_request button once the email address has been validated.
 */
function enableRequest(symbol, domain){
    var button = document.getElementById("freind_request");
    
    if(!symbol.classList.contains("invalid") && !domain.classList.contains("invalid")){
	button.disabled = false;
    }
}

/*
 *  Function to alert user that a friend request has been sent.
 */
function alertMessage(){
    
    alert("Your friend request has been sent.  Once confirmed, you can start coordinating your schedules!");
}

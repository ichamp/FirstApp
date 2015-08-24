function validateForm() {
 	// One-Liner version to loop through each input element and check the first checkbox element
 	var obj = document.getElementsByTagName('input');
 	var flag = true;
	// loop through each input element and output the value of any checkbox elements
	var counter = 0;
	for (x = 0; x < obj.length; x++) 
	{ 
 			var e = obj.item(x);
 			if (e.type == 'text' || e.type == 'password')//&& obj.item(x).length < 6) 
 			{
 				//alert(document.getElementsByTagName('input').item(x).value);
 				counter++;

 				var letters = /^[0-9a-zA-Z]+$/;  
				if(e.value.match(letters) && e.value.length >= 6 && e.value.length <= 32)
				{
					//return true;
				}
				else
				{
					flag = false;
				}	

 			}
	}
	if(flag == false)
		alert("Username and password should be greater than or equal to 6 characters, less than 32 chars and contain only A-Z, a-z, 0-9");
	return flag;
}


function confirmpass() {
	//alert("Hello");
 	// One-Liner version to loop through each input element and check the first checkbox element
 	var obj = document.getElementsByTagName('input');
	// loop through each input element and output the value of any checkbox elements
	var counter = 0;
	var once = 0;
	for (x = 0; x < obj.length; x++) 
	{ 
 			var e = obj.item(x);
 			
 			var pass;
 			if (e.type == 'password')
 			{
 				//alert(e.value);
 				if(once == 0)
 				{
 					once = 1;
 					pass = e.value;
 				}
 				else
 				{
 					if(pass != e.value)
 					{
 						alert("password and confirm password do not match");
 						return false;
 					}

 				}	

 			}
	}
	return true;
}

function combine_validate(){
	if(validateForm() && confirmpass())
		return true;
	else
		return false;
}
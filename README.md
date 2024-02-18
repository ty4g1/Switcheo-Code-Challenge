# Switcheo-Code-Challenge
 My answers to the Switcheo Code Challenge, for my application to the Frontend Engineer Intern role

 Submission for problem 1: See file in problem1 folder for the code.

 Implemented using the following 3 different approaches:
 1. Using formula for Arithmetic Progression.
 2. Using a loop
 3. Using recursion

 Submission for problem 2: https://exchange-form.netlify.app

 Form made using **HTML, CSS, JS and React**.
 No external UI libraries were used.
 All styles in the CSS files were created by me.
 

 Submission for problem 3: See file in problem3 folder for the refactored code.

 **Summary of changes for problem 3**
 
 **Datasource Class**: 	
 
    	Completed the class Datasource to handle fetching data from an API. 
	This encapsulates the logic for fetching prices from the specified URL.

**PriorityTable Object**: 	

    	Replaced switch-case statements with an object (priorityTable) to store 
 	blockchain priorities. This provides a more efficient, extensible and 
	concise way to handle priorities.

**sorting filtered balances**: 

    	Used arithemtic subtraction instead of if-else staements to provide a more
	concise solution to sorting. This also handles the case of equal priority
	which was earlier left unaddressed.

**Fixed other bugs**:

    	Replaced the undeclared lhsPriority with the correct balancePriority.
	Replaced sortedBalances with formattedBalances when computing rows, 
	as we need the formatted version.


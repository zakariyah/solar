function isOneChecked(elementsName)
	{
		var elems = document.getElementsByName(elementsName);
		for(var i in elems)
		{
			if(elems[i].checked)
			{
				return true;
			}
		}
		return false;
	}

function checkFormInput()
{
	var names = ['gender', 'age', 'cooperative1', 'forgiving1', 'vengeful1', 'selfish1', 'predictable1'];
	for(var i in  names)
	{
		if(!isOneChecked(names[i]))
		{	
			alert('Please answer all the questions before submitting');
			return false;
		}
	}

	window.onbeforeunload = function() {
        return "";
    }

	return true;
}

function postQuizQuestions(hasRecommenders, cummulativeScore, numberOfRounds)
{
	var htmlString = "<form name='postquizsurvey' method='post' action='./postquizsurvey' class='form-horizontal' role='form' onsubmit='return checkFormInput();'>";
	
	htmlString += "<input type='hidden' name='cummulativeScore' value='" +cummulativeScore +"'>";
  	htmlString += "<input type='hidden' name='numberOfRounds' value='" + numberOfRounds +"'>";
	

	htmlString += "<div id='page1' style='display:block'>";
	  // htmlString += "Page 1";
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>1. How often did you ask for advice?</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='accessSkills'  value='1'>  Not at all";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='2'>  A little ";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='3'>  Average";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='4'>  A lot";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='5'>  Very";
	htmlString += "</label></div></div></div>";


	htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>2. How useful was the advice given to you by the Bot?</label>";
	htmlString += "</div><div class='form-group'>";
	htmlString += "<div class='col-sm-10'><div class='checkbox'>";
    htmlString += "<label><input type='radio' name='enjoy'  value='1'>  Not at all";
    htmlString += "</label><label><input type='radio' name='enjoy' value='2'>  A little";
    htmlString += "</label><label><input type='radio' name='enjoy' value='3'>  Average";
    htmlString += "</label><label><input type='radio' name='enjoy' value='4'>  A lot";
    htmlString += "</label><label><input type='radio' name='enjoy' value='5'>  Very";
    htmlString += "</label></div></div></div>";


htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>3. How would you assess the skills of the Bot giving you advice?</label>";
htmlString += "</div><div class='form-group'><div class='col-sm-10'>";
      htmlString += "<div class='checkbox'><label><input type='radio' name='familiarity' value='1'>  Not Skilled";
        htmlString += "</label><label><input type='radio' name='familiarity' value='2'> Average ";
        htmlString += "</label><label><input type='radio' name='familiarity' value='3'>  Very skilled";
        htmlString += "</label></div></div>";
htmlString += "</div>";


htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>4. To what extent have you previously participated in a matrix game like this one?</label></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><div class='checkbox'>";
        htmlString += "<label> <input type='radio' name='risk' value='1'>  Nothing like this scenario";
        htmlString += "</label><label><input type='radio' name='risk' value='2'>  Something like this scenario";
        htmlString += "</label><label><input type='radio' name='risk' value='3'>  Exactly this scenario";
        htmlString += "</label></div></div></div>";
       	htmlString += "</div>";
      
      htmlString += "<div id='page2' style='display:none'>";
      
      	htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>1. Are you male or female?</label>";
		htmlString += "</div><div class='form-group'><div class='col-sm-10'>";
      	htmlString += "<div class='checkbox'><label><input type='radio' name='gender' value='1'>  Male";
        htmlString += "</label><label><input type='radio' name='gender' value='2'> Female";
        htmlString += "</label></div></div>";

	
		htmlString += "</div>";

		htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>2. Age (range) ?</label>";
		htmlString += "</div><div class='form-group'><div class='col-sm-10'>";
     	htmlString += "<div class='checkbox'><label><input type='radio' name='age' value='1'>  18-30 ";
        htmlString += "</label><label><input type='radio' name='age' value='2'> 31-40";
        htmlString += "</label><label><input type='radio' name='age' value='3'>  41-50";
        htmlString += "</label><label><input type='radio' name='age' value='4'> 51-60";
        htmlString += "</label><label><input type='radio' name='age' value='5'>  Above 60";
        htmlString += "</label></div></div>";
htmlString += "</div>";

// htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>1. To what extent do the following terms describe your associate's behavior in the game?</label></div>";

// htmlString += "<div class='form-group'><div class='col-sm-offset-3 col-sm-6'><table class='table'>";
// htmlString += "<tr><td></td><td>Low</td><td  colspan='2' align='right'>Medium</td><td></td><td>High</td></tr>";
// htmlString += "<tr><td>Cooperative</td><td><input type='radio' name='cooperative' value='1'/> 1</td>";
// htmlString += "<td> <input type='radio' name='cooperative' value='2'/> 2</td>";
// htmlString += "<td><input type='radio' name='cooperative' value='3'/> 3</td>";
// htmlString += "<td><input type='radio' name='cooperative' value='4'/> 4</td>";
// htmlString += "<td><input type='radio' name='cooperative' value='5'/> 5</td></tr>";

// htmlString += "<tr><td>Forgiving</td><td><input type='radio' name='forgiving' value='1'/> 1</td>";
// htmlString += "<td> <input type='radio' name='forgiving' value='2'/> 2</td>";
// htmlString += "<td><input type='radio' name='forgiving' value='3'/> 3</td>";
// htmlString += "<td><input type='radio' name='forgiving' value='4'/> 4</td>";
// htmlString += "<td><input type='radio' name='forgiving' value='5'/> 5</td></tr>";

// htmlString += "<tr><td>Predictable</td><td><input type='radio' name='predictable' value='1'/> 1</td>";
// htmlString += "<td> <input type='radio' name='predictable' value='2'/> 2</td>";
// htmlString += "<td><input type='radio' name='predictable' value='3'/> 3</td>";
// htmlString += "<td><input type='radio' name='predictable' value='4'/> 4</td>";
// htmlString += "<td><input type='radio' name='predictable' value='5'/> 5</td></tr>";

// htmlString += "<tr><td>Vengeful</td><td><input type='radio' name='vengeful' value='1'/> 1</td>";
// htmlString += "<td> <input type='radio' name='vengeful' value='2'/> 2</td>";
// htmlString += "<td><input type='radio' name='vengeful' value='3'/> 3</td>";
// htmlString += "<td><input type='radio' name='vengeful' value='4'/> 4</td>";
// htmlString += "<td><input type='radio' name='vengeful' value='5'/> 5</td></tr>";

// htmlString += "<tr><td>Selfish</td><td><input type='radio' name='selfish'  value='1'/> 1</td>";
// htmlString += "<td> <input type='radio' name='selfish' value='2'/> 2</td>";
// htmlString += "<td><input type='radio' name='selfish'  value='3'/> 3</td>";
// htmlString += "<td><input type='radio' name='selfish' value='4'/> 4</td>";
// htmlString += "<td><input type='radio' name='selfish' value='5'/> 5</td></tr>";

// htmlString += "</table></div></div>";



htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>3. To what extent do the following terms describe your experience in the game? </label></div>";

htmlString += "<div class='form-group'><div class='col-sm-offset-3 col-sm-6'>";

htmlString += "<table class='table'><tr><th></th><th>Low</th><th colspan='2' align='right'>Medium</th><th></th><th>High</th></tr>";
htmlString += "<tr><td>How satisfied are you with the decisions your made?</td><td><input type='radio' name='cooperative1'  value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='cooperative1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='cooperative1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='cooperative1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='cooperative1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>How satisifed are you with your final score? </td><td><input type='radio' name='forgiving1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='forgiving1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='forgiving1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='forgiving1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='forgiving1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Predictable</td>";
htmlString += "<td><input type='radio' name='predictable1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='predictable1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='predictable1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='predictable1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='predictable1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Vengeful</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='vengeful1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Selfish</td>";
htmlString += "<td><input type='radio' name='selfish1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='selfish1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='selfish1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='selfish1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='selfish1' value='5'/> 5</td></tr>";
htmlString += "</table></div></div>";

htmlString += " <div class='form-group'><div class='col-sm-offset-6 col-sm-6'>";
htmlString += "<input name='proceed' type='submit' class='btn btn-primary' value='Go To Payment'/></div></div>";
htmlString += "</div>";

// htmlString += "<div id='page3'  style='display:none'>";
// htmlString += "<div class='form-group'><b>Associate Identity:</b><p>1. At the beginning of the game, you were told that you would be playing against another person. Given your actual experience playing the game, who do you think you played with?</p></div>";

// htmlString += "<div class='form-group'><div class='col-sm-10'><div class='checkbox'><label><input type='radio' name='thought' value='1'>  Yes, a HUMAN associate as said</label><label><input type='radio' name='thought' value='2'>  No, a BOT</label></div></div></div>";

// htmlString += "<div class='form-group'><div class='col-sm-10'><label for='inputEmail3' class='control-label col-sm-6'>Please explain briefly the reason for your choice above.</label>";
// htmlString += "<div class=' col-sm-6'><textarea name='reason1' class='form-control' rows='3'></textarea></div></div></div>";


// htmlString += "<div class='form-group'><b>Associate Preference:</b><p>2. Considering your experience in the just concluded game, who would you rather play the same game with?\94 </p></div>";

// htmlString += "<div class='form-group'> <div class='col-sm-10'><div class='checkbox'><label><input type='radio' name='preference' value='1'>  BOT</label><label> <input type='radio' name='preference' value='2'>  HUMAN</label></div></div></div>";

// htmlString += "<div class='form-group'><div class='col-sm-10'><label for='inputEmail3' class='control-label col-sm-6'>Please explain briefly the reason for your choice above.</label>";
// htmlString += "<div class=' col-sm-6'><textarea name='reason2' class='form-control' rows='3'></textarea></div></div></div>";

// htmlString += "</div>";
// htmlString += "</div>";
htmlString += '</form>';

return htmlString;
}
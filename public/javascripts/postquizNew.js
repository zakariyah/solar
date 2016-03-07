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
	var names = ['preference', 'thought'];
	for(var i in  names)
	{
		if(!isOneChecked(names[i]))
		{	
			alert('Please answer all the questions before submitting');
			return false;
		}
	}
	return true;
}

function postQuizQuestions(hasRecommenders, cummulativeScore, numberOfRounds)
{
  var htmlString = "<form name='postquizsurvey' method='post' action='./postquizsurvey' class='form-horizontal' role='form' onsubmit='return checkFormInput();'>";
  htmlString += "<div id='page1' style='display:block'>";
  // htmlString += "Page 1";
htmlString += "<div class='form-group'>";
htmlString += "<label for='inputEmail3' class='control-label'>1. How would you assess the skills of the associate compared to your own?</label></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
htmlString += "<label><input type='radio' name='accessSkills'>  Much less skilled";
htmlString += "</label><label><input type='radio' name='accessSkills'>  A little worse";
htmlString += "</label><label><input type='radio' name='accessSkills'>  Same as mine";
htmlString += "</label><label><input type='radio' name='accessSkills'>  A bit better";
htmlString += "</label><label><input type='radio' name='accessSkills'>  Much better skilled";
htmlString += "</label></div></div></div>";


	htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>2. How much did you enjoy playing the game with your associate?</label>";
	htmlString += "</div><div class='form-group'>";
	htmlString += "<div class='col-sm-10'><div class='checkbox'>";
    htmlString += "<label><input type='radio' name='enjoy'>  Not at all";
    htmlString += "</label><label><input type='radio' name='enjoy'>  A little";
    htmlString += "</label><label><input type='radio' name='enjoy'>  Average";
    htmlString += "</label><label><input type='radio' name='enjoy'>  A lot";
    htmlString += "</label><label><input type='radio' name='enjoy'>  Very much";
    htmlString += "</label></div></div></div>";


htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>3. To what extent have you previously participated in other studies like this one?</label>";
htmlString += "</div><div class='form-group'><div class='col-sm-10'>";
      htmlString += "<div class='checkbox'><label><input type='radio' name='familiarity'>  Nothing like this scenario";
        htmlString += "</label><label><input type='radio' name='familiarity'>  Something like this scenario";
        htmlString += "</label><label><input type='radio' name='familiarity'>  Exactly this scenario";
        htmlString += "</label></div></div>";
htmlString += "</div>";


htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>4. Are you generally a person who is fully prepared to take risks or do you try to avoid taking risks?</label></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><div class='checkbox'>";
        htmlString += "<label> <input type='radio' name='risk'>  Unwilling to take risks";
        htmlString += "</label><label><input type='radio' name='risk'>  Sometimes takes risks";
        htmlString += "</label><label><input type='radio' name='risk'>  Fully prepared to take risks";
        htmlString += "</label></div></div></div>";
       	htmlString += "</div>";
      htmlString += "<div id='page2' style='display:none'>";
      

htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>1. To what extent do the following terms describe your associate's behavior in the game?</label></div>";

htmlString += "<div class='form-group'><div class='col-sm-offset-3 col-sm-6'><table class='table'>";
htmlString += "<tr><td></td><td colspan='2'>Low</td><td>Medium</td><td colspan='2'>High</td></tr>";
htmlString += "<tr><td>Cooperative</td><td><input type='radio' name='cooperative'/> 1</td>";
htmlString += "<td> <input type='radio' name='cooperative'/> 2</td>";
htmlString += "<td><input type='radio' name='cooperative'/> 3</td>";
htmlString += "<td><input type='radio' name='cooperative'/> 4</td>";
htmlString += "<td><input type='radio' name='cooperative'/> 5</td></tr>";

htmlString += "<tr><td>Forgiving</td><td><input type='radio' name='forgiving'/> 1</td>";
htmlString += "<td> <input type='radio' name='forgiving'/> 2</td>";
htmlString += "<td><input type='radio' name='forgiving'/> 3</td>";
htmlString += "<td><input type='radio' name='forgiving'/> 4</td>";
htmlString += "<td><input type='radio' name='forgiving'/> 5</td></tr>";

htmlString += "<tr><td>Predictable</td><td><input type='radio' name='predictable'/> 1</td>";
htmlString += "<td> <input type='radio' name='predictable'/> 2</td>";
htmlString += "<td><input type='radio' name='predictable'/> 3</td>";
htmlString += "<td><input type='radio' name='predictable'/> 4</td>";
htmlString += "<td><input type='radio' name='predictable'/> 5</td></tr>";

htmlString += "<tr><td>Vengeful</td><td><input type='radio' name='vengeful'/> 1</td>";
htmlString += "<td> <input type='radio' name='vengeful'/> 2</td>";
htmlString += "<td><input type='radio' name='vengeful'/> 3</td>";
htmlString += "<td><input type='radio' name='vengeful'/> 4</td>";
htmlString += "<td><input type='radio' name='vengeful'/> 5</td></tr>";

htmlString += "<tr><td>Selfish</td><td><input type='radio' name='selfish'/> 1</td>";
htmlString += "<td> <input type='radio' name='selfish'/> 2</td>";
htmlString += "<td><input type='radio' name='selfish'/> 3</td>";
htmlString += "<td><input type='radio' name='selfish'/> 4</td>";
htmlString += "<td><input type='radio' name='selfish'/> 5</td></tr>";

htmlString += "</table></div></div>";

htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>2. To what extent do the following terms describe your behavior in the game? </label></div>";

htmlString += "<div class='form-group'><div class='col-sm-offset-3 col-sm-6'>";

htmlString += "<table class='table'><tr><th></th><th colspan='2'>Low</th><th>Medium</th><th colspan='2'>High</th></tr>";
htmlString += "<tr><td>Cooperative</td><td><input type='radio' name='cooperative1'/> 1</td>";
htmlString += "<td> <input type='radio' name='cooperative1'/> 2</td>";
htmlString += "<td><input type='radio' name='cooperative1'/> 3</td>";
htmlString += "<td><input type='radio' name='cooperative1'/> 4</td>";
htmlString += "<td><input type='radio' name='cooperative1'/> 5</td></tr>";

htmlString += "<tr><td>Forgiving</td><td><input type='radio' name='forgiving1'/> 1</td>";
htmlString += "<td> <input type='radio' name='forgiving1'/> 2</td>";
htmlString += "<td><input type='radio' name='forgiving1'/> 3</td>";
htmlString += "<td><input type='radio' name='forgiving1'/> 4</td>";
htmlString += "<td><input type='radio' name='forgiving1'/> 5</td></tr>";

htmlString += "<tr><td>Predictable</td>";
htmlString += "<td><input type='radio' name='predictable1'/> 1</td>";
htmlString += "<td> <input type='radio' name='predictable1'/> 2</td>";
htmlString += "<td><input type='radio' name='predictable1'/> 3</td>";
htmlString += "<td><input type='radio' name='predictable1'/> 4</td>";
htmlString += "<td><input type='radio' name='predictable1'/> 5</td></tr>";

htmlString += "<tr><td>Vengeful</td>";
htmlString += "<td><input type='radio' name='vengeful1'/> 1</td>";
htmlString += "<td> <input type='radio' name='vengeful1'/> 2</td>";
htmlString += "<td><input type='radio' name='vengeful1'/> 3</td>";
htmlString += "<td><input type='radio' name='vengeful1'/> 4</td>";
htmlString += "<td><input type='radio' name='vengeful1'/> 5</td></tr>";

htmlString += "<tr><td>Selfish</td>";
htmlString += "<td><input type='radio' name='selfish1'/> 1</td>";
htmlString += "<td> <input type='radio' name='selfish1'/> 2</td>";
htmlString += "<td><input type='radio' name='selfish1'/> 3</td>";
htmlString += "<td><input type='radio' name='selfish1'/> 4</td>";
htmlString += "<td><input type='radio' name='selfish1'/> 5</td></tr>";
htmlString += "</table></div></div>";
htmlString += "</div>";

htmlString += "<div id='page3'  style='display:none'>";
htmlString += "<div class='form-group'><b>Associate Identity:</b><p>1. At the beginning of the game, you were told that you would be playing the game with a BOT. Given your actual experience playing the game, who do you think you played with?</p></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><div class='checkbox'><label><input type='radio' name='thought'>  Yes, a BOT as said</label><label><input type='radio' name='thought'>  No, a HUMAN associate</label></div></div></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><label for='inputEmail3' class='control-label col-sm-6'>Please explain briefly the reason for your choice above.</label>";
htmlString += "<div class=' col-sm-6'><textarea class='form-control' rows='3'></textarea></div></div></div>";


htmlString += "<div class='form-group'><b>Associate Preference:</b><p>2. Considering your experience in the just concluded game, who would you rather play the same game with?” </p></div>";

htmlString += "<div class='form-group'> <div class='col-sm-10'><div class='checkbox'><label><input type='radio' name='preference'>  BOT</label><label> <input type='radio' name='preference'>  HUMAN</label></div></div></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><label for='inputEmail3' class='control-label col-sm-6'>Please explain briefly the reason for your choice above.</label>";
htmlString += "<div class=' col-sm-6'><textarea class='form-control' rows='3'></textarea></div></div></div>";
htmlString += " <div class='form-group'><div class='col-sm-offset-6 col-sm-6'>";
htmlString += "<input name='proceed' type='submit' class='btn btn-primary' value='Go To Payment'/></div></div>";
htmlString += "</div>";
htmlString += "</div>";
htmlString += '</form>';

return htmlString;
}
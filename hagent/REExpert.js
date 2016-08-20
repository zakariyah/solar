var FSM = require('./FSM');

var Leader1 = require('../sScript/leader2');
var Leader2 = require('../sScript/leader2');
var Leader3 = require('../sScript/leader3');
var Leader4 = require('../sScript/leader4');
var Leader5 = require('../sScript/leader5');
var Leader6 = require('../sScript/leader5');

var Follower1 = require('../sScript/follower1');
var Follower2 = require('../sScript/follower2');
var Follower3 = require('../sScript/follower3');
var Follower4 = require('../sScript/follower4');
var Follower5 = require('../sScript/follower5');
var Follower6 = require('../sScript/follower5');


var REExpert = function(_me, _M, _A, _s1, _s2, _attack0, _attack1, num)
{
	this.expertName = 'REExpert';
	this.M = _M;
	this.A = [];
	this.A[0] = _A[0];
	this.A[1] = _A[1];
	this.me = _me;
	this.omega = 1;
	this.s1 = _s1;
	this.s2 = _s2;
	var weird = false;
	this.num = num;
	this.numberOfTimesCalled = 0;
	var beenCalled = 0;

	// console.log("s1 and s2 " + this.s1 + " " + this.s2);
	this.payoffDifference = ''; //  bully, generous, fair
	this.sameActions = false;

	var strategyPair  = require('./strategyPair');

	this.MAXLENGTH = 2;
	this.NUM_PLAYERS = 2;

	this.attack = [];
	this.attack[0] = _attack0;
	this.attack[1] = _attack1;

	this.acts = [];
	this.acts[0] = [Math.floor(this.s1 / this.A[1]), Math.floor(this.s2/ this.A[1])];

	this.acts[1] = [this.s1 % this.A[1], this.s2 % this.A[1]];

	this.typeOfExpert = -10; // default for problems
	var sumOfValsInArray = function(arrayVals)
	{
		return arrayVals.reduce(function(a, b) { return a + b; }, 0);
	}

	var stateMachine = false;

	// this is hardcoded for two player prisoners dilema
	if(this.s1 == 0 && this.s2 == 0)
	{
		this.sameActions = true;
		this.typeOfExpert = 1; // cc, cc
		var agentType;
		if(this.num % 2 == 0)
		{

		 	agentType = new Leader1();
		}
		else
		{
			// it is a follower
			agentType = new Follower1();
		}
		stateMachine = new FSM('S0', agentType.getTransitionMap(), agentType.getEvents(), agentType.getMessages(), agentType.CATCH_ALL_EVENT);
	}
	else if(this.s1 == 0 && this.s2 == 1)
	{
		this.sameActions = true;
		this.typeOfExpert = 2; // dd, dd
		var agentType;
		if(this.num % 2 == 0)
		{

		 	agentType = new Leader5();
		}
		else
		{
			// it is a follower
			agentType = new Follower5();
		}
		stateMachine = new FSM('S0', agentType.getTransitionMap(), agentType.getEvents(), agentType.getMessages(), agentType.CATCH_ALL_EVENT);
	}

	else if(this.s1 == 0 && this.s2 == 2)
	{
			this.typeOfExpert = 3; // dc, cd	 or cd, dc
			this.sameActions = false;
			var agentType;
			if(this.num % 2 == 0)
			{

			 	agentType = new Leader6();
			}
			else
			{
				// it is a follower
				agentType = new Follower6();
			}
			stateMachine = new FSM('S0', agentType.getTransitionMap(), agentType.getEvents(), agentType.getMessages(), agentType.CATCH_ALL_EVENT);
	}
	
	else if(this.s1 == 0 && this.s2 == 3)
	{
		this.sameActions = false;
		this.typeOfExpert = 4; // cc, dd  We both play cc and also play dd
				var agentType;
		if(this.num % 2 == 0)
		{

		 	agentType = new Leader4();
		}
		else
		{
			// it is a follower
			agentType = new Follower4();
		}
		stateMachine = new FSM('S0', agentType.getTransitionMap(), agentType.getEvents(), agentType.getMessages(), agentType.CATCH_ALL_EVENT);
	}
	
	else if(this.s1 == 1 && this.s2 == 2)
	{
		this.sameActions = false;
		this.typeOfExpert = 5; // cc, dc
				var agentType;
		if(this.num % 2 == 0)
		{

		 	agentType = new Leader3();
		}
		else
		{
			// it is a follower
			agentType = new Follower3();
		}
		stateMachine = new FSM('S0', agentType.getTransitionMap(), agentType.getEvents(), agentType.getMessages(), agentType.CATCH_ALL_EVENT);
	}
	else if(this.s1 == 3 && this.s2 == 3)
	{
		weird = true;
				var agentType;
		if(this.num % 2 == 0)
		{

		 	agentType = new Leader2();
		}
		else
		{
			// it is a follower
			agentType = new Follower2();
		}
		stateMachine = new FSM('S0', agentType.getTransitionMap(), agentType.getEvents(), agentType.getMessages(), agentType.CATCH_ALL_EVENT);
	}

	this.barR = [];
	// expected payoff target
	// console.log(this.acts);

	this.barRLittle = [];
	this.barRLittle[0] = [this.M[0][this.acts[0][0]][this.acts[1][0]] , this.M[0][this.acts[0][1]][this.acts[1][1]]];
	this.barRLittle[1] = [this.M[1][this.acts[0][0]][this.acts[1][0]] , this.M[1][this.acts[0][1]][this.acts[1][1]]];

	this.getMyAspirationForARound = function()
	{
		return this.barRLittle[this.me];
	}

	this.barR[0] = ( this.barRLittle[0][0] + this.barRLittle[0][1])/ 2.0;
	this.barR[1] = ( this.barRLittle[1][0] + this.barRLittle[1][1])/ 2.0;

	if(this.barR[0] > this.barR[1])
	{
		this.payoffDifference = 'bully';
	}
	else if(this.barR[0] > this.barR[1])
	{
		this.payoffDifference = 'generous';
	}
	else
	{
		this.payoffDifference = 'fair';	
	}

	this.penalty = 0.1;

	this.numStates = this.A[0] * this.A[1];

	this.assessment = [];
	this.guilt;
	this.guilty;
	this.lastAction = 0;

	for(var i = 0; i < this.numStates; i++)
	{
		this.assessment[i] = [];
	}

	this.encodeJointAction = function(_actions)
	{
		return this.A[1] * _actions[0] + _actions[1];
	}

	this.state = function(hist)
	{
		var newState = 0;
		var tier = 1;
		for(var i = this.omega - 1; i >= 0; i--)
		{
			if(hist[i][0] == -1)
				return -1;

			newState += tier * this.encodeJointAction(hist[i]);
			tier *= (this.A[0] * this.A[1]);
		}
		// console.log("newState = " + newState);
		return newState;
	}


	this.updateHist = function(hist, acciones)
	{
		// console.log(this.NUM_PLAYERS + " NUM_PLAYERS");
		for(var i = this.omega - 1; i > 0; i--)
		{
			for(var j = 0; j < this.NUM_PLAYERS; j++)
			{
				hist[i][j] = hist[i - 1][j];
			}
		}
		hist[0][0] = acciones[0];
		hist[0][1] = acciones[1];
	}

	this.generateAction = function(index, pt)
	{
		var highestNumber = 37572;
		var num = Math.floor(Math.random() * highestNumber) % highestNumber ;
		var sum = 0.0;

		for(var i = 0; i < this.A[index]; i++)
		{
			sum += pt[i] * highestNumber;
			if(num <= sum)
			{
				return i;
			}
		}

		return this.A[index] - 1;

		// some code here, quite ridiculous. 

	}

	this.update = function(index, acciones)
	{
		if(this.guilty)
		{
			this.guilt += this.M[1 - index][acciones[0]][acciones[1]] - this.barR[1 - index];
			if(this.guilt < 0)
			{
				this.guilty = false;
				this.guilt = 0.0;
				if((acciones[0] == this.acts[0][0]) && (acciones[1] == this.acts[1][0]))
				{
					this.lastAction = 1;
				}
				else if((acciones[0] == this.acts[0][1]) && (acciones[1] == this.acts[1][1]))
				{
					this.lastAction = 0;
				}
			}
		}

		else
		{
			if(acciones[1 - index] != this.acts[1 - index][this.lastAction])
			{
				this.guilt = (this.M[1 - index][acciones[0]][acciones[1]] - this.barR[1 - index]) + this.penalty;
				if(this.guilt <= 0)
				{
					this.guilt = 0.0;
				}
				else
					{
					this.guilty = true;
				}
			}
			else
			{
				this.lastAction = 1 - this.lastAction;
			}
		}	
	}



	this.act = function(index)
	{
		beenCalled += 1;
		if(this.guilty)
		{
			return this.generateAction(index, this.attack[index].ms);
		}

		return this.acts[index][this.lastAction];
	}


	this.reset = function(acciones)
	{
		this.lastAction = Math.floor(Math.random() + 0.5);
		this.guilt = 0;
		this.guilty = false;
		if(acciones != undefined)
		{
			this.update(this.me, acciones);
		}		
	}

	// console.log("making assessment");

	this.makeAssessment = function(index)
	{
		var i, j;
		for(i = 0; i < this.numStates; i++)
		{
			for(j = 0; j < this.A[index]; j++)
			{
				this.assessment[i][j] = 0;
				if(((i == this.s1) && (j == this.acts[index][1])) || ((i == this.s2) && (j == this.acts[index][0])))
				{
					this.assessment[i][j] += 20;
				}
				else if(( i != this.s1) && (i != this.s2))
				{
					this.assessment[i][j] += this.attack[index].ms[j] * 20;
				}
			} 
		}
		// console.log("making assessment");
		var hist = [];
		for(var i = 0; i < this.MAXLENGTH; i++)
		{
			hist[i] = [];
			for(var j = 0; j < this.NUM_PLAYERS; j++)
			{
				hist[i][j] = 0;
			}
		}

		this.reset();
		var estado = -1;
		var sum;
		var acciones = [];
		while(true)
		{
			var highestNumber = 37572;
			var num = Math.floor(Math.random() * highestNumber);
			acciones[index] = this.act(index);
			acciones[1 - index] = num % this.A[1 - index];
			this.update(index, acciones);
			// console.log("making assessment1 " + estado);
			if(estado >= 0)
			{
				this.assessment[estado][acciones[index]] ++;
				sum = 0;
				for(var i = 0; i < this.A[index]; i++)
				{
					sum += this.assessment[estado][i];
				}
				if(sum >= 1000)
				{
					break;
				}

			}


			this.updateHist(hist, acciones);
			estado = this.state(hist);
		}


		for(var i = 0; i < this.numStates; i++)
		{
			sum = 0;
			for(var j = 0; j < this.A[index]; j++)
			{
				sum += this.assessment[i][j];
			}

			if(sum > (20 + this.A[index]))
			{
				for(var j = 0; j < this.A[index]; j++)
				{
					if((( i == this.s1) && (j == this.acts[index][1])) || ((i == this.s2) && (j == this.acts[index][0] )))
					{
						this.assessment[i][j] -= 20;
					}
					else if(( i != this.s1) && (i != this.s2))
					{
						this.assessment[i][j] -= this.attack[index].ms[j] * 20;
					}
				}
			}
		}


		var v = false;
		if(v)
		{
			// console.log("empirical distribution: ");
			for(var i = 0; i < this.numStates; i++)
			{
				// console.log("");
				for(var j = 0; j < this.A[index]; j++)
				{
					// console.log(" ");
				}
			}
		}
		

	}

	this.checkBR = function()
	{
		var rmax  = require('./Rmax');
		var br = new rmax(1- this.me, this.A, this.M, 1, 0, 0.95);
		// console.log(this.asTheTeacher.teacher);

		br.bestResponse(this.M, this.asTheTeacher.teacher);

		var val = 0.0;
		var s = this.s1;
		this.reset();
		var a = [];

		for(var i = 0; i < 100; i++)
		{
			a[this.me] = this.act(this.me);
			a[1 - this.me] = br.argmax(s);
			this.update(this.me, a);

			val += this.M[this.me][a[0]][a[1]];
			s = this.encodeJointAction(a);
			// console.log(" " + s + "  " + this.guilt);
		}

		val /= 100.0;
		return val;
	}


	
	this.makeAssessment(this.me);

	this.asTheTeacher = new strategyPair(this.me, this.M, this.A, this.acts, this.s1, this.s2, this.assessment);

	this.expectedValue = this.checkBR();

	this.enforceable = false;
	if(((this.expectedValue + 0.04) > this.barR[this.me]) && (this.barR[1 - this.me] > 0))
	{
		this.enforceable = true;
	}

	this.makeAssessment(1 - this.me);
	this.asTheFollower = new strategyPair(1-this.me, this.M, this.A, this.acts, this.s1, this.s2, this.assessment);
	this.reset();

	

	this.printExpert = function(index, _vu)
	{
		var a;
		// console.log("as");
		if((index % 2) == 0)
		{
			// console.log("teach ");
			for(var i = 0; i < this.numStates; i++)
			{
				a = this.whichAction(this.asTheTeacher.teacher[i], this.me);
				if(a < 0)
					console.log("m");
				else
					console.log("a");
			}
			console.log(" vs ");
			for(var i = 0; i < this.numStates; i++)
			{
				a = this.whichAction(this.asTheTeacher.follower[i], 1 -this.me);
				if( a < 0)
					console.log(" m ");
				else
					console.log(" a ");
			}

			// console.log(" projected ");
		}
		else
		{
			console.log("follow");
			for(var i = 0; i < this.numStates; i++)
			{
				a = this.whichAction(this.asTheFollower.follower[i], this.me);
				if(a < 0)
				{
					// console.log("m");
				}
				else
				{
					// console.log("a");
				}
			}
			// console.log(" vs ");
			for(var i = 0; i < this.numStates; i++)
			{
				a = this.whichAction(this.asTheFollower.teacher[i], 1 - this.me);
				// if(a < 0)
				// 	// console.log("m");
				// else
					// console.log(a);
			}
			// console.log(" projected ");
		}
		// console.log("/n");
	}

	this.printTeacherFollower = function()
	{
		console.log("As the teacher " + this.s1 + ", " + this.s2);
		for(var j = 0; j < this.numStates; j++)
		{
			console.log("j");
			for(var k = 0; k < this.A[this.me]; k++)
				console.log(this.asTheTeacher.teacher[j][k]);
			console.log(" vs ");
			for(var k = 0; k < this.A[1 - this.me]; k++)
				console.log(this.asTheTeacher.follower[j][k]);
			console.log("\n");
		}
	}


	this.printFollowerTeacher = function()
	{
		console.log(" As the follower" + this.s1 + ", " + this.s2);
		for(var j = 0; j < this.numStates; j++)
		{
			console.log(j);
			for(var k = 0; k < this.A[this.me]; k++)
				console.log(this.asTheFollower.follower[j][k]);
			console.log(" vs ");
			for(var k = 0; k < this.A[1 - this.me]; k++)
				console.log(this.asTheFollower.teacher[j][k]);
			console.log("\n");
		}

	}

	this.whichAction = function(pi, ind)
	{
		for(var i = 0; i < this.A[ind]; i++)
		{
			if(pi[i] > 0.99)
				return i;
		}
		return -1;
	}

	this.getStateMachine = function()
	{
		if(weird)
		{
			console.log('unknown type of leader '  + this.acts + ' si and s2 ' + this.s1 + ' ' + this.s2);
		}
		return stateMachine;
	}

	this.printExpertInformation = function()
	{
		console.log('Expert information ' + i + ' bar : ' + this.barR + ' acts ' + this.acts[0] + ' acs ' + this.acts[1] + ' s1 ' + this.s1 + ' s2 : ' + this.s2);
	}

}

module.exports = REExpert;
function   jefe_plus(nombre, _me, _A, _M, _lambda ) //, _game[1024])
{
	this.A = [];
	this.A[0] = _A[0];
	this.A[1] = _A[1];
	this.me = _me;
	this.game = [];
	this.M = _M;
	// this.strcpy(this.game, _game); check

	this.numStates = this.A[0] * this.A[1];
	this.t = 0;

	this.beenThere = [];
	this.experto = -1;
	this.estado = -1;
	this.cycled = false;

	var a  = require('./a');
	var Rmax  = require('./Rmax');
	var Exp3  = require('./Exp3');
	var eee  = require('./eee');
	var ucb  = require('./ucb');
	var iModel  = require('./iModel');
	var SolutionPair  = require('./SolutionPair');
	var REExpert  = require('./REExpert');
	var minimaxLog  = require('./minmax');


	this.REcount = 0;
	this.br ; // placeholder for br
	this.satisficingExperts = [];
	
	this.attack0;
	this.attack1;
	this.re = [];

	this.mnmx = [];

	this.computeMaximin = function(index)
	{
		var i, j;

		var payoff = [];
		var count = 0;
		for( i = 0; i < this.A[0]; i++)
		{
			for(j = 0; j < this.A[1]; j++)
			{
				payoff[count] = this.M[index][i][j];
				count ++;
			}
		}

		var mm = new minimaxLog(this.A[index]);
		mm.getMinimax(this.A, index, payoff);

		return mm;
	}

	this.computeAttack = function(index)
	{
		var i, j;
		var payoff = [];

		var count = 0;
		for( i = 0; i < this.A[0]; i++)
		{
			for(j = 0; j < this.A[1]; j++)
			{
				payoff[count] = -(this.M[1 - index][i][j]);
				count ++;
			}
		}

		var mm = new minimaxLog(this.A[index]);
		mm.getMinimax(this.A, index, payoff);

		return mm;
	}


	this.pay = function(_meh, _sol)
	{
		var a0, a1;
		a0 = Math.floor(_sol / this.A[1]);
		a1 = Math.floor(_sol % this.A[1]);
		// console.log(this.me + ' me is ');
		return this.M[_meh][a0][a1];
	}

	this.createSolutionPairs = function(Theta)
	{
		var c = 0;
		for(var i = 0; i < this.numStates; i++)
		{
			for(var j = i; j < this.numStates; j++)
			{
				Theta[c] = new SolutionPair();
				Theta[c].s1 = i;
				Theta[c].s2 = j;
				Theta[c].one = (this.pay(0, Theta[c].s1) + this.pay(0, Theta[c].s2)) / 2.0;
				Theta[c].two = (this.pay(1, Theta[c].s1) + this.pay(1, Theta[c].s2)) / 2.0;

				Theta[c].min = Theta[c].one;
				if(Theta[c].one > Theta[c].two)
				{
					Theta[c].min = Theta[c].two;
				}
				c++;
			}
		}
	}

	this.tau = 0;
	this.R = 0.0;

	this.resetCycle = function()
	{
		this.tau = 0;
		this.R = 0.0;
		for(var i = 0; i < this.numStates; i++)
			this.beenThere[i] = false;

		if(this.estado >= 0)
			this.beenThere[this.estado] = true;
	}

	this.determineStrategyPairs = function()
	{
		var numSolutionPairs = 0;
		for(var i = 0; i < this.numStates; i++)
		{
			numSolutionPairs += (i + 1);
		}

		var Theta = [];
		this.createSolutionPairs(Theta);

		this.mnmx[0]= this.computeMaximin(0);
		this.mnmx[1]= this.computeMaximin(1);
		this.attack0 = this.computeAttack(0);
		this.attack1 = this.computeAttack(1);

		// console.log("maximins: " + this.mnmx[0].mv +" " + this.mnmx[1].mv);
		this.REcount = 0;
		this.re = [];
		// console.log("solution pairs " + numSolutionPairs);
		for( var i = 0; i < numSolutionPairs; i++)
		{
			// console.log("Theta.one:" + Theta[i].one + " mnmx.mv:" + this.mnmx[0].mv + " Theta[i].two:" + Theta[i].two + " mnmx[1].mv:" + this.mnmx[1].mv);
			if((Theta[i].one >= this.mnmx[0].mv) && (Theta[i].one > 0) && (Theta[i].two >= this.mnmx[1].mv) && (Theta[i].two > 0))
			{
				// console.log("creating something");
				this.re[this.REcount] = new REExpert(this.me, this.M, this.A, Theta[i].s1, Theta[i].s2, this.attack0, this.attack1);
				this.REcount ++;
			}
		}
	}

	this.determineExperts = function()
	{
		this.resetCycle();
		this.determineStrategyPairs();
		var numEs = this.REcount * 2 + 2;
		this.br = new Rmax(this.me, this.A, this.M, 1, 0, 0.95);
		this.satisficingExperts =  [];
		for(var i = 0; i< numEs; i++)
		{
			this.satisficingExperts[i] = true;
		}
		return numEs;
	}

	

	this.numExperts = this.determineExperts();
	// console.log("numExperts " + this.numExperts);

	this.cycleFull = true;

	this.numSatExperts = 1;
	this.lambda = 1 - (( 1.0/ this.numSatExperts) * 0.04);

	if( nombre == "S++")
	{
		this.learner = new a(_me, _A, _M, _lambda, this.numExperts);
		this.cycleFull = false; 
	}
	else if ((nombre == "exp3w++") || (nombre == "exp3"))
	{
		this.learner = new Exp3(this.me, Math.floor(_lambda), 0.99, this.numExperts);
	}
	else if(nombre == "eeew++")
	{
		this.learner = new eee(_me, _lambda, this.numExperts);
	}
	else if( nombre == "ucbw++")
	{
		this.learner = new ucb(_me, _lambda, this.numExperts);
	}
	else
	{
		// console.log("expert learner not found");
		return;
	}

	this.im = new iModel(this.me, this.A, 1);
	
	this.setAspirationFolkEgal = function()
	{
		// console.log("I was caled");
		if(this.REcount == 0)
		{
			this.learner.aspiration = this.mnmx[this.me].mv;
			console.log(" no good expert ");
			// console.log();
			return;
		}

		var i, j, index = -1;
		var high = 0.0;
		var theMin;
		var s;
		for(i = 0; i < this.REcount; i++)
		{
			theMin = this.re[i].barR[this.me];
			if(theMin > this.re[i].barR[1 - this.me])
				theMin = this.re[i].barR[1 - this.me];

			if(theMin > high)
			{
				high = theMin;
				index = i;
			}
		}

		this.learner.aspiration = this.re[index].barR[this.me];
		if(this.learner.aspiration < this.mnmx[this.me].mv)
			this.learner.aspiration = this.mnmx[this.me].mv;
		console.log(" initial aspiration levele = " + this.me + ", " + this.learner.aspiration);
	}

	this.setAspirationFolkEgal();
	this.mu = 0.0;

	this.vu = [];
	this.usage = [];
	for(var i = 0; i < this.numExperts; i++)
	{
		this.vu[i] = 1.0;
		this.usage[i] = 0.0;
	}

	this.alwaysMM = false;
	this.permissibleLoss = 3.0;

	// this.lowAspiration = 1.0;

	this.previousActs = [];
	
	

	// this.determineStrategyPairs = function()
	// {
	// 	var numSolutionPairs = 0;
	// 	for(var i = 0; i < this.numStates; i++)
	// 	{
	// 		numSolutionPairs += (i + 1);
	// 	}

	// 	var Theta = [];
	// 	this.createSolutionPairs(Theta);

	// 	this.mnmx[0]= this.computeMaximin(0);
	// 	this.mnmx[1]= this.computeMaximin(1);
	// 	this.attack0 = this.computeAttack(0);
	// 	this.attack1 = this.computeAttack(1);

	// 	// console.log("maximins: " + this.mnmx[0].mv +" " + this.mnmx[1].mv);
	// 	this.REcount = 0;
	// 	this.re = [];
	// 	for( var i = 0; i < this.numSolutionPairs; i++)
	// 	{
	// 		if((Theta[i].one >= this.mnmx[0].mv) && (Theta[i].one > 0) && (Theta[i].two >= this.mnmx[1].mv) && (Theta[i].two > 0))
	// 		{
	// 			// console.log("creating something");
	// 			this.re[this.REcount] = new REExpert(this.me, this.M, this.A, Theta[i].s1, Theta[i].s2, this.attack0, this.attack1);
	// 			this.REcount ++;
	// 		}
	// 	}
	// }

	// this.createSolutionPairs = function(Theta)
	// {
	// 	var c = 0;
	// 	for(var i = 0; i < this.numStates; i++)
	// 	{
	// 		for(var j = i; j < this.numStates; j++)
	// 		{
	// 			Theta[c] = new SolutionPair();
	// 			Theta[c].s1 = i;
	// 			Theta[c].s2 = j;
	// 			Theta[c].one = (this.pay(0, Theta[c].s1) + this.pay(0, Theta[c].s2)) / 2.0;
	// 			Theta[c].two = (this.pay(1, Theta[c].s1) + this.pay(1, Theta[c].s2)) / 2.0;

	// 			Theta[c].min = Theta[c].one;
	// 			if(Theta[c].one > Theta[c].two)
	// 			{
	// 				Theta[c].min = Theta[c].two;
	// 			}
	// 			c++;
	// 		}
	// 	}
	// }


	this.move = function()
	{
		var highestNumber = 37542;
		if(this.estado < 0)
		{
			return Math.floor(Math.random() * highestNumber) % this.A[this.me];
		}
		if(this.cycled)
		{
			var oldExperto = this.experto;
			this.resetCycle();
			this.determineSatisficingExperts();
			this.numSatExperts = 0;
			for(var i = 0; i < this.numExperts; i++)
			{
				if(this.satisficingExperts[i])
					this.numSatExperts ++;
			}

			this.experto = this.learner.select(this.satisficingExperts);
			if((this.experto > 1) && (this.experto != oldExperto))
			{
				var ind = this.experto - 2;
				if(ind >= this.REcount)
					ind -= this.REcount;
				// console.log("previousActs " + this.previousActs);
				this.re[ind].reset(this.previousActs);
			}
			this.cycled = false;
		}

		var a;
		// console.log(this.br.estado);
		// this.experto = 1;
		if(this.experto == 0)
			a = this.generateAction(this.me, this.mnmx[this.me].ms);
		else if(this.experto == 1)
			a = this.br.moveGreedy();
		else if((this.experto % 2) == 0)
			a = this.re[(this.experto - 2) / 2].act(this.me);
		else
			a = this.generateAction(this.me, this.re[Math.floor((this.experto - 2)/ 2)].asTheFollower.follower[this.estado]);

		return a;
	}

	this.update = function(acts)
	{
		this.previousActs[0] = acts[0];
		this.previousActs[1] = acts[1];
		this.R += this.M[this.me][acts[0]][acts[1]];
		this.mu += this.M[this.me][acts[0]][acts[1]];

		this.br.update(acts);
		if(this.estado >= 0)
		{
			this.im.update(acts, this.estado, this.t);
		}

		this.estado = this.encodeJointAction(acts);

		if(this.experto < 0)
		{
			this.cycled = true;
			this.t ++;
			return;
		}

		if(this.experto > 1)
		{
			var ind = Math.floor((this.experto - 2)/ 2);
			this.re[ind].update(this.me, acts);
		}

		this.usage[this.experto]++;
		var betita = 1.0 / this.usage[this.experto];
		if(betita <= (2.0 * (1.0 - this.lambda)))
			betita = 2.0 * (1.0 - this.lambda);

		this.vu[this.experto] = betita * this.M[this.me][acts[0]][acts[1]] + (1.0 - betita) * this.vu[this.experto];

		if(this.cycleFull)
		{
			if(this.tau == (this.numStates - 1))
				this.cycled = true;
		}
		else
		{
			if(this.beenThere[this.estado])
				this.cycled = true;
		}

		this.beenThere[this.estado] = true;
		this.t++;
		this.tau ++;

		if(this.cycled)
		{
			this.lambda = 1 - ((1.0 / this.numSatExperts)  * 0.04);
			this.learner.lambda = this.lambda;
			this.learner.update(this.R / this.tau, this.tau);
			if(((this.mnmx[this.me].mv * this.t) - this.mu) > this.permissibleLoss )
				this.alwaysMM = true;
		}

		// if(this.learner.aspiration < this.lowAspiration)
		// 	this.lowAspiration = this.learner.aspiration;
	}

	this.override = function()
	{
		if(this.alwaysMM)
		{
			this.satisficingExperts[0] = true;
			return true;
		}

		var brVal = this.br.maxV(this.estado) * (1.0 - 0.95);
		if(brVal >= this.learner.aspiration)
		{
			var highVal = -99999;
			var ind;
			for(var i = 2; i < this.numExperts; i+=2)
			{
				ind = (i - 2) / 2;
				if(this.re[ind].barR[this.me] >= this.learner.aspiration)
				{
					if(this.re[ind].enforceable)
					{
						if(highVal < this.vu[i])
							highVal = this.vu[i];
					}

					if(this.im.match(this.re[ind].asTheFollower.teacher))
					{
						if(highVal < this.vu[i + 1])
							highVal = this.vu[i + 1];
					}
				}
			}

			if(this.vu[1] >= highVal)
			{
				this.satisficingExperts[1] = true;
				return true;
			}
		}
		return false;
	}

	this.determineSatisficingExperts = function()
	{
		var ind;
		for(var i = 0; i < this.numExperts; i++)
			this.satisficingExperts[i] = false;

		var verbose = false;
		if(this.verbose)
		{
			console.log("Satisficing Experts for " + this.me + " alpha = " + this.learner.aspiration);
			this.im.print();
		}

		if(this.override())
			return;

		var c = 0;
		if(this.mnmx[this.me].mv >= this.learner.aspiration)
		{
			this.satisficingExperts[0] = true;
			c ++;

			if(this.verbose)
				console.log("minimax");
		}

		for(var i = 2; i < this.numExperts; i+=2)
		{
			ind = (i - 2) / 2;
			if(this.re[ind].barR[this.me] >= this.learner.aspiration)
			{
				if(this.re[ind].enforceable)
				{
					this.satisficingExperts[i] = true;
					c++;

					if(this.verbose)
						this.re[ind].printExpert(i, this.vu[i]);
				}

				if(this.im.match(this.re[ind].asTheFollower.teacher))
				{
					this.satisficingExperts[i + 1] = true;
					c ++;

					if(this.verbose)
						this.re[ind].printExpert( i + 1, this.vu[ i + 1]);
				}
			}
		}

		var brVal = this.br.maxV(this.estado) * (1.0 - 0.95);

		if((c == 0) || (brVal >= this.learner.aspiration))
		{
			this.satisficingExperts[1] = true;
			c ++;

			if(this.verbose)
			{
				console.log(" \t1  :");
				for(var i = 0; i < this.numStates; i++)
				{
					console.log(this.br.argmax(i));
				}
				console.log(" projected = " + brVal + ", actual = " + this.vu[i]);
			}
		}
	}


	

	


	this.setAspirationHigh = function()
	{
		if(this.REcount == 0)
		{
			this.learner.aspiration = this.mnmx[this.me].mv;
			console.log("no good expert ");
			return;
		}

		var i, j, index = -1;
		var high = this.mnmx[this.me].mv;
		var s;

		for(i = 0; i < this.REcount; i++)
		{
			if(this.re[i].barR[this.me] > high)
			{
				high = this.re[i].barR[this.me];
				index = i;
			}
		}

		this.learner.aspiration = high;
		// console.log(" initial aspiration level = " + this.me + " " + this.learner.aspiration);
	}

	

	this.setAspirationHighestEnforceable = function()
	{
		if(this.REcount == 0)
		{
			this.learner.aspiration = this.mnmx[this.me].mv;
			console.log(" no good expert ");
			return;
		}

		var i, j, index = -1;
		var high = 0.0;
		var val, s;

		for(i = 0; i < this.REcount; i++)
		{
			if(this.re[i].enforceable && (this.re[i].barR[this.me] > high))
			{
				high = this.re[i].barR[this.me];
				index = i;
			}
		}

		if(index == -1)
		{
			console.log(" nothing is enforceable");
			this.setAspirationFolkEgal();
		}
		else
		{
			this.learner.aspiration = this.re[index].barR[this.me];
			if(this.learner.aspiration < this.mnmx[this.me].mv)
				this.learner.aspiration = this.mnmx[this.me].mv;
			console.log(" initial aspiration level " + this.me + ", " + this.aspiration);
		}
	}


	this.printStrat = function(strat)
	{
		console.log("<");
		var i, j;
		if(strat == 0)
		{
			for(i = 0; i < this.numStates; i++)
				console.log("x");
		}
		else if(strat == 1)
		{
			for( i = 0; i< this.numStates; i++)
				console.log(this.br.argmax(i));
		}
		else
		{
			var ind = Math.floor((strat - 2) / 2);
			var a;
			var agente = this.re[ind].asTheTeacher.teacher;
			if(strat% 2 == 1)
				agente = this.re[ind].asTheFollower.follower;
			var agent;
			for(i = 0; i < this.numStates; i++)
			{
				a = -1;
				for(j = 0; j < this.A[this.me]; j++)
				{
					if(agente[i][j] > 0.99)
						a = j;
				}
				if( a < 0)
					console.log("m");
				else
					console.log(a);
			}
		}
		console.log(">");	
	}

	this.generateAction = function(index, pt)
	{
		var highestNumber = 37972;
		var num = Math.floor(Math.random() * highestNumber) % highestNumber;
		var i;

		var sum = 0.0;
		for( i = 0; i < this.A[index]; i++)
		{
			sum += pt[i] * highestNumber;
			if(num <= sum)
			{
				return i;
			}
		}

		console.log(" never selected an action : " + this.me + ", " + num );
		console.log(this.pt[0] + " " + this.pt[1]);
		return -1;
	}

	this.encodeJointAction = function(_actions)
	{
		return this.A[1] * _actions[0] + _actions[1];
	}
}

module.exports = jefe_plus;

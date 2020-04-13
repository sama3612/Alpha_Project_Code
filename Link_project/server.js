/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();
var user_id = '';

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'link',
	user: 'postgres',
	password: '123'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

 Web Page Requests:

  Login Page:        Provided For your (can ignore this page)
  Registration Page: Provided For your (can ignore this page)
  Home Page:
  		/home - get request (no parameters)
  				This route will make a single query to the favorite_colors table to retrieve all of the rows of colors
  				This data will be passed to the home view (pages/home)

  		/home/pick_color - post request (color_message)
  				This route will be used for reading in a post request from the user which provides the color message for the default color.
  				We'll be "hard-coding" this to only work with the Default Color Button, which will pass in a color of #FFFFFF (white).
  				The parameter, color_message, will tell us what message to display for our default color selection.
  				This route will then render the home page's view (pages/home)

  		/home/pick_color - get request (color)
  				This route will read in a get request which provides the color (in hex) that the user has selected from the home page.
  				Next, it will need to handle multiple postgres queries which will:
  					1. Retrieve all of the color options from the favorite_colors table (same as /home)
  					2. Retrieve the specific color message for the chosen color
  				The results for these combined queries will then be passed to the home view (pages/home)

  		/team_stats - get request (no parameters)
  			This route will require no parameters.  It will require 3 postgres queries which will:
  				1. Retrieve all of the football games in the Fall 2018 Season
  				2. Count the number of winning games in the Fall 2018 Season
  				3. Count the number of lossing games in the Fall 2018 Season
  			The three query results will then be passed onto the team_stats view (pages/team_stats).
  			The team_stats view will display all fo the football games for the season, show who won each game,
  			and show the total number of wins/losses for the season.

  		/player_info - get request (no parameters)
  			This route will handle a single query to the football_players table which will retrieve the id & name for all of the football players.
  			Next it will pass this result to the player_info view (pages/player_info), which will use the ids & names to populate the select tag for a form
************************************/

// registration page
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

//Friends page
app.get('/friends', function(req, res) {
	var friends = 'select friends from users where user_id=' + parseInt(user_id) + ';';
	var fn=[];
	var ln=[];
	//console.log(friends);
	db.any(friends)
   	.then(function (rows) {
		//	console.log(rows);
			for (var i=0; i < rows[0].friends.length; i++)
			{
				// console.log('select * from users where user_id=' + parseInt(rows[0].friends[i]) + ';');
				db.any('select * from users where user_id=' + parseInt(rows[0].friends[i]) + ';')
					.then(function (rows1) {
						if (typeof rows1[0] !== 'undefined')
						{

							//console.log(rows1[0].first_name + rows1[0].last_name);
							fn.push(rows1[0].first_name);
							ln.push(rows1[0].last_name);
						}
					})

			}

			res.render('pages/friends',{
		      local_css:"boilerplate.css",
		      my_title:"Friends Page",
				data: fn
			})
		})
});

app.get('/addfriends', function(req, res) {
	res.render('pages/addfriends',{
		my_title:"Add Friends"
	});
});

// login page
app.get('/login', function(req, res) {
	res.render('pages/login',{
		local_css:"signin.css",
	    my_title:"Login Page",
	    big_failure: 0
	});
});

function validUser() {
  return true;
}

// signup
app.post('/login/signin', function(req, res) {
  var inputEmail = req.body.inputEmail;
  var inputPassword =  req.body.inputPassword;
  var query = 'select * from users where email=\''+inputEmail+'\';';
  db.any(query)
  		.then(function (rows) {
			console.log(rows);
          if(rows[0]){
            if(rows[0].password==inputPassword) {
				 	user_id = rows[0].user_id;
              console.log("Authenticated..");
              res.render('pages/home',{
                my_title: 'Home Page',
                data: '',
                color: '',
                color_msg: '',
                data:rows
              })
            }
				else {
              console.log("Failed, got:" + inputPassword + ", expected:" + rows[0].password);
              res.render('pages/login',{
                local_css:"signin.css",
                my_title:"Login Page",
                big_failure: 1
              });
            }
          }
			 else {
            console.log("No user with those credentials");
              res.render('pages/login',{
                local_css:"signin.css",
                my_title:"Login Page",
                big_failure: 2,
              });
          }
      })
      .catch(function (err) {
          // display error message in case an error
          console.log('error', err);
          res.render('pages/home',{
            my_title: "error",
            data: '',
            color: '',
            color_msg: ''
      	 })
  		})
});

//get Home
app.get('/home', function(req, res) {
  res.render('pages/home',{
    my_title: "Home Page"
  })
});


app.listen(3000);
console.log('3000 is the magic port');
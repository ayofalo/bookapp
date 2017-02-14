#!/usr/bin/env node

var color = require('bash-color');
var fs = require('fs');
var prompt = require('prompt');
const readline = require('readline'); //Provides an interface for reading data from a Readable stream one line at a time.

const rl = readline.createInterface({ // Creates Instances of the readline.Interface.
  input: process.stdin,
  output: process.stdout,
  prompt: '>>',

});

function Person(name, role, wantsaccomodation, room) { // Class Person with arguements name, role, accommodation and room. 
  this.name = name; // The name of the person
  this.role = role; // The role of the person. There are only two options - Fellow or Staff.
  this.wantsaccomodation = wantsaccomodation; // Used to indicate whether or not the person is interested in getting allocated an accomodation.
  this.room = room; // The name of the room the person is allocated.
  this.allocate = function() { // This method allocates a room to a person. A person can be allocated a room.
    this.room = roomsList[Math.floor((Math.random() * roomsList.length))]; //To select a random room.

  };
  this.allocateOffice = function() { // This method allocates an office to a Staff or Fellow. 
    var n = Math.floor((Math.random() * officearray.length)); // Used to generate a random number.
    if (officearray[n].residentnumber < 6) { // Used to limit the number of people that can be allocated a certain room.
      this.room = officearray[n].name; //Used to allocate a room to a person.
      officearray[n].resident.push(this.name) // Adding the name into the property resident.
      officearray[n].residentnumber = officearray[n].residentnumber + 1 // Increases the number of people in a room after a person is allocated a room. 


    } else {
      console.log("Maximum number of persons reached please reallocate the person"); //Used to notify the allocator that the a specific room is filled up.
    }
  }
  this.allocateLivingSpace = function() { // This method allocates a Livingspace to a Fellow.
    var n = Math.floor((Math.random() * livingspacearray.length)); // Used to generate a random number.
    if (livingspacearray[n].residentnumber < 4) { // Used to limit the number of people that can be allocated a certain room.
      this.room = livingspacearray[n].name; //Used to allocate a room to a person.
      livingspacearray[n].resident.push(this.name); // Adding the name of the resident into the property resident.
      livingspacearray[n].residentnumber = livingspacearray[n].residentnumber + 1; // Increases the number of people in a room after a person is allocated a room.
    } else {
      console.log("Maximum number of persons reached please reallocate the person"); //Used to notify the allocator that the a specific room is filled up.
    }
  }
}

var reallocate = function(name, room) { // This is used to reallocate a staff from a room to another room

  for (i = 0; i < officearray.length; i++) { //For loop used to find the name of the office that a person would be reallocated to
    if (room == officearray[i].name) {
      officearray[i].resident.push(name); //Used to add the person to a specific room 
      officearray[i].residentnumber = officearray[i].residentnumber + 1 // Increases the number of people in a room 
      console.log(`${name}` + " has been reallocated the Office called  " + `${room}`);
      console.log(`${room}` + " has resident " + `${officearray[i].resident}`)


    }
  }
  for (i = 0; i < livingspacearray.length; i++) { //For loop used to find the name of the livingspace that a person would be reallocated to
    if (room == livingspacearray[i].name) {
      livingspacearray[i].resident.push(name); //Used to add the person to a specific room 
      livingspacearray[i].residentnumber = livingspacearray[i].residentnumber + 1; // Increases the number of people in a room
      console.log(`${name}` + " has been reallocated the livingspace called  " + `${room}`);
      console.log(`${room}` + " has resident " + `${livingspacearray[i].resident}`)

    }
  }
};



function Room(name, resident) { // Class Room was created with property name and resident.
  this.name = name;
  this.resident = resident;

};

function Office(name) { // Class Office was created with properrty name, type, resident and residentnumber.
  this.name = name; // The Class Office didnt inherit from the Room because the properties are unique to this class and are flexible. If all the rooms were given a property like colour 'red'office would have inherited from it.
  this.resident = [];
  this.residentnumber = 0;

};

function LivingSpace(name) { // Class Office was created with properrty name, type, resident and residentnumber.
  this.name = name;
  this.resident = [];
  this.residentnumber = 0;
};

var rooms_list = []; //  Initialization and Contains all the rooms.
var personList = []; //Initialization and Contains an array of the person objects.
var param = []; //Initialization and used in loading data as a variable to temporary store each string  that was splitted from a sentence in the text file.
var sparam = []; // Takes in all the rooms
var officearray = []; //Used to store a list of offices.
var livingspacearray = []; //Used to store a list of livingspaces.




rl.prompt() // resets it and resumes input stream

rl.on('line', function(line) { // on entering a line an array args would be created and the line would be splited by a space to produce individual arguments.
    var args = line.split(' ')
    switch (args[0]) {

      // create_room <room_name>
      case 'create_room':



        var i = 1;
        while (i < 11) {
          //Created a Room object for each room. The name of the room is the object.

          var n = Math.floor(Math.random() * 2);
          if (n == 1) {
            args[i] = new Office(args[i]);
            // officeroomsList.push(args[i].name)
            officearray.push(args[i]); //Creating a new room object for each 
            console.log("Room " + color.purple(args[i].name) +" is an Office!");

          } else {
            args[i] = new LivingSpace(args[i]);
            livingspacearray.push(args[i]);
            console.log("Room " + color.green(args[i].name) + " is a LivingSpace!")
          }
          i++
        };

        sparam.push(officearray);
        sparam.push(livingspacearray);
        break

        // list_rooms
      case 'list_rooms':
        if (args[1].toLowerCase() == "office") {
          console.log('\n');
          console.log(color.purple('List of Offices'));
          console.log('------------------');
          officearray.forEach(function(room, idx) {
            console.log(`${idx} - ${room.name}`)
          })
        } else if (args[1].toLowerCase() == "livingSpace") {
          console.log('\n');
          console.log(color.green('List of LivingSpaces'));
          console.log('------------------');
          livingspacearray.forEach(function(room, idx) {
            console.log(`${idx} - ${room.name}`)
          })
        }

        break

        //add_person
      case 'add_person':

        if (args[1] != null && args[2] != null && args[3] != null) {

          switch (args[3]) {
            case 'Y':

              room = "Default";
              var personObject = new Person(args[1], args[2], args[3], room);
              personList.push(personObject)

              if (args[2].toLowerCase() === "fellow") {
                personObject.allocateOffice();
                rl.question('Are you interested in a LivingSpace : \n', function(answer) { // Experiencing challenges here. The query is printed twice instead of once.
                  if (answer.toLowerCase() === "y") {
                    console.log('\n');
                    console.log('Livingspace owner\n');
                    console.log('------------------');
                    personObject.allocateLivingSpace();
                    console.log(`${personObject.name}` + " has been allocated the Livingspace called  " + `${personObject.room}`)
                  } else {
                    console.log("Thank you for your time.");
                  }
                });

              }
              break;
            case 'N':
              console.log(" You have selected No, therefore you are not going to be allocated any room. Goodluck");
              break;
            default:
              console.log('You must enter a valid command');
              break
          }
        };

        if (args[1] == null || args[2] == null && args[3] == null) {
          console.log("Kindly follow the input format : <person_identifier> <new_room_name> [wants accomodation[Y or N]]");
        };

        if (args[1] != null && args[2] != null && args[3] == null) {
          if (args[2].toLowerCase() === "fellow") {
            room = "Default";
            var personObject = new Person(args[1], args[2], args[3], room);
            personList.push(personObject)
            personObject.allocateOffice();
            console.log(`${personObject.name}` + " has been allocated the office called  " + `${personObject.room}`)
          }
          if (args[2].toLowerCase() === "staff") {
            room = "Default";
            var personObject = new Person(args[1], args[2], args[3], room);
            personList.push(personObject)
            personObject.allocateOffice();
            console.log(`${personObject.name}` + " has been allocated the office called  " + `${personObject.room}`)
            
          }
        };

        break
      case 'reallocate_person':

        for (i = 0; i < officearray.length; i++) { // The purpose of this loop is to reduce the number of residents in an office that its resident has been reallocated to another office 
          if (args[1] == officearray[i].resident) {
            officearray[i].resident = [];
            officearray[i].residentnumber = officearray[i].residentnumber - 1;

          }
        }
        for (i = 0; i < livingspacearray.length; i++) { // The purpose of this loop is to reduce the number of residents in a livingspace that its resident has been reallocated to another livingspace
          if (args[2] == livingspacearray[i].resident) {
            livingspacearray[i].resident = [];
            livingspacearray[i].residentnumber = livingspacearray[i].residentnumber - 1;
          }
        }

        reallocate(args[1], args[2]);

        break
      case 'load_people':
        var content = fs.readFileSync('sample.txt', 'utf8');
        var contentlines = content.split("\n");

        for (i = 0; i < 10; i++) {


          param = contentlines[i].split(" ");
          //param [i] = sparam.split(" ");
          console.log(param)

          if (param[0] != null && param[1] != null && param[2] != null) {

            switch (param[2]) {
              case 'Y':

                room = "Default";
                var personObject = new Person(param[0], param[1], param[2], room);
                personList.push(personObject)
                if (param[1].toLowerCase() === "staff") {
                  personObject.allocateOffice();
                  console.log("Office " + `${personObject.room}` + " has been allocated the person above ");

                }


                if (param[1].toLowerCase() === "fellow") {
                  var r = Math.floor(Math.random() * 2);
                  if (r == 1) {
                    personObject.allocateOffice();
                    console.log("Office " + `${personObject.room}` + " has been allocated the person above ");
                  } else {
                    personObject.allocateLivingSpace();
                    console.log("Livingspace " + `${personObject.room}` + " has been allocated the person above ");
                  }

                }

            }
          }
        }

        break
      case 'print_allocations':
        if (args[1] == null)
          for (i = 0; i < officearray.length; i++) {
            if (officearray[i].residentnumber > 0) {
              console.log('Office');
              console.log('------------------');
              console.log(officearray[i].name);
              console.log('------------------');
              console.log("Member " + officearray[i].resident.toString());

            }

          }
        for (i = 0; i < livingspacearray.length; i++) {
          if (livingspacearray[i].residentnumber > 0) {
            console.log('Livingspace');
            console.log('------------------');
            console.log(livingspacearray[i].name);
            console.log('------------------');
            console.log("Member " + livingspacearray[i].resident.toString())

          }
        }
        if (args[1] != null) {
          if (args[1].toLowerCase() == 'o') {
            var prt_allo = []
            prt_allo.push(JSON.stringify(officearray));
            prt_allo.push(JSON.stringify(livingspacearray));
            require('fs').writeFile(

              './allocations',

              prt_allo,

              function(err) {
                if (err) {
                  console.error('Crap happens');
                }
              }
            );
          };
          if (args[1].toLowerCase() != 'o') {
            console.log("Wrong input");
          }

        };

        break
      case 'print_unallocated':
        if (args[1] == null) {
          for (i = 0; i < officearray.length; i++) {
            if (officearray[i].residentnumber == 0) {
              console.log('unallocated room');
              console.log('------------------');
              console.log(officearray[i].name);
            }
          }
          for (i = 0; i < livingspacearray.length; i++) {
            if (livingspacearray[i].residentnumber == 0) {
              console.log('unallocated room');
              console.log('------------------');
              console.log(livingspacearray[i].name);
            }
          }
        }
        if (args[1] != null) {
          if (args[1].toLowerCase() == 'o') {
            var unallocated = []
            for (i = 0; i < officearray.length; i++) {
              if (officearray[i].residentnumber == 0) {
                unallocated.push(officearray[i].name)
              }
            }
            for (i = 0; i < livingspacearray.length; i++) {
              if (livingspacearray[i].residentnumber == 0) {
                unallocated.push(livingspacearray[i].name)
              }
            }

            ;
            require('fs').writeFile(

              './unallocations',

              unallocated,

              function(err) {
                if (err) {
                  console.error('Crap happens');
                }
              }
            );
          }
        }
        break
      case 'print_room': //prints the name of all the people in a particular room 

        for (i = 0; i < officearray.length; i++) {
          if (officearray[i].name == args[1]) {
            console.log(args[1]);
            console.log('------------------');
            console.log("Member " + officearray[i].resident.toString());
          }
        }
        for (i = 0; i < livingspacearray.length; i++) {
          if (livingspacearray[i].name == args[1]) {
            console.log(args[1]);
            console.log('------------------');
            console.log("Member " + livingspacearray[i].resident.toString())
          }
        }
        break
      case 'save_state':
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(args[1]);

        db.serialize(function() {
          db.run("CREATE TABLE Operson (id TEXT, dt TEXT)");
          db.run("CREATE TABLE Lperson (id TEXT, dt TEXT)");
          var stmt = db.prepare("INSERT INTO    Operson VALUES (?,?)");
          var liv = db.prepare("INSERT INTO Lperson VALUES (?,?)");
          for (var i = 0; i < officearray.length; i++) {

            var d = officearray[i].name
            var r = officearray[i].resident.toString();
            stmt.run(d, r);
          }
          stmt.finalize();
          for (var i = 0; i < livingspacearray.length; i++) {

            var d = livingspacearray[i].name
            var r = livingspacearray[i].resident.toString();
            liv.run(d, r);
          }
          liv.finalize();
          db.each("SELECT id, dt FROM Operson", function(err, row) {
            console.log("Operson id : " + row.id, row.dt);
          });
          db.each("SELECT id, dt FROM Lperson", function(err, row) {
            console.log("Lperson id : " + row.id, row.dt);
          });
        });

        db.close();
        break
      case 'load_state':
        var sqlite3 = require('sqlite3').verbose();
        var file = args[1];
        var db = new sqlite3.Database(file);
        db.all("SELECT id,dt FROM Operson", function(err, rows) {
          rows.forEach(function(row) {
            console.log(row.id, row.dt);
            row.id = new Office(row.id);
            officearray.push(row.id);
          })

        });


        db.all("SELECT id,dt FROM Lperson", function(err, rows) {
          rows.forEach(function(row) {
            console.log(row.id, row.dt);
            row.id = new LivingSpace(row.id);
            livingspacearray.push(row.id);
          })

        });
        db.close();
        break
      default:
        console.log('You must enter a valid command')
    }

    rl.prompt()
  })
  .on('close', function() {
    console.log('Thank you for using Room Allocator')
  });

#!/usr/bin/env node

var color = require('bash-color');
var fs = require('fs');
var prompt = require('prompt');
const readline = require('readline'); 

const rl = readline.createInterface({ 
  input: process.stdin,
  output: process.stdout,
  prompt: '>>',

});

function Book(title, author, category, year) {
  this.title = title;
  this.author = author;
  this.category = category;
  this.year = year;

  this.allocateShelf = function(name) {
    if (name == "literature") {
      literature.push(this.title)
      console.log(literature)
    }

    if (name == "engineering") {
      engineering.push(this.title)
      console.log(literature)
    }
    if (name == "politics") {
      politics.push(this.title)
      console.log(literature)
    }
    if (name == "medicine") {
      medicine.push(this.title)
      console.log(literature)
    }

  }
}


var literature = [];
var engineering = [];
var politics = [];
var medicine = [];

var bookList = []; 
var param = []; 
var sparam = []; 


rl.prompt() 

rl.on('line', function(line) { 
    var args = line.split(',')
    switch (args[0]) {


      // list_books
      case 'list_books':
        if (args[1].toLowerCase() == "literature") { 
          console.log('\n');
          console.log(color.purple('List of literature books'));
          console.log('------------------');
          for (i = 0; i < literature.length; i++) {
            console.log(literature[i]);
          }

        }
        if (args[1].toLowerCase() == "engineering") {
          console.log('\n');
          console.log(color.green('List of engineering'));
          console.log('------------------');
          for (i = 0; i < engineering.length; i++) {
            console.log(engineering[i]);
          }
        }
        if (args[1].toLowerCase() == "politics") {
          console.log('\n');
          console.log(color.red('List of politics'));
          console.log('------------------');
          for (i = 0; i < politics.length; i++) {
            console.log(politics[i]);
          }
        }
        if (args[1].toLowerCase() == "medicine") {
          console.log('\n');
          console.log(color.blue('List of medicine'));
          console.log('------------------');
          for (i = 0; i < medicine.length; i++) {
            console.log(medicine[i]);
          }
        }

        break

        //add_book
      case 'add_book':

        if (args[1] == null || args[2] == null && args[3] == null) {
          console.log("Kindly follow the input format : <person_identifier> <new_room_name> [wants accomodation[Y or N]]");
        };

        if (args[1] != null && args[2] != null && args[3] != null && args[4] != null) {

          var bookObject = new Book(args[1], args[2], args[3], args[4]);
          bookObject.allocateShelf(args[3]);
          bookList.push(bookObject)
          console.log(bookList);
        };

        break

        //load_books from sample.txt
      case 'load_books':
        var content = fs.readFileSync('sample.txt', 'utf8');
        var contentlines = content.split("\n");

        for (i = 0; i < 10; i++) {


          param = contentlines[i].split(",");
          console.log(param)

          if (param[0] != null && param[1] != null && param[2] != null && param[3] != null) {
            var bookObject = new Book(param[0], param[1], param[2], param[3]);
            bookObject.allocateShelf(param[2]);
            bookList.push(bookObject)
            console.log(bookList);

          }
        }

        break

        //allocations
      case 'allocations': // To print info on bookshelf for inventory keeping purposes

        var prt_allo = []
        prt_allo.push("literature shelf - " + JSON.stringify(literature));
        prt_allo.push("engineering shelf - " + JSON.stringify(engineering));
        prt_allo.push("medicine shelf - " + JSON.stringify(medicine));
        prt_allo.push("politics shelf - " + JSON.stringify(politics));

        require('fs').writeFile(

          './allocations',

          prt_allo,

          function(err) {
            if (err) {
              console.error('Crap happens');
            }
          }
        );


        break

        //save_state into database

      case 'save_state':
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(args[1]);

        db.serialize(function() {
          db.run("CREATE TABLE literature (id int, dt TEXT)");
          db.run("CREATE TABLE engineering (id int, dt TEXT)");
          db.run("CREATE TABLE politics (id int, dt TEXT)");
          db.run("CREATE TABLE medicine (id int, dt TEXT)");
          var stmt = db.prepare("INSERT INTO literature VALUES (?,?)");
          var livone = db.prepare("INSERT INTO engineering VALUES (?,?)");
          var livtwo = db.prepare("INSERT INTO medicine VALUES (?,?)");
          var livthree = db.prepare("INSERT INTO politics VALUES (?,?)");

          for (var i = 0; i < literature.length; i++) {

            var d = i
            var r = literature[i].toString();
            stmt.run(d, r);
          }
          stmt.finalize();
          for (var i = 0; i < engineering.length; i++) {

            var d = i
            var r = engineering[i].toString();
            livone.run(d, r);
          }
          livone.finalize();
          for (var i = 0; i < medicine.length; i++) {

            var d = i
            var r = medicine[i].toString();
            livtwo.run(d, r);
          }
          livtwo.finalize();
          for (var i = 0; i < politics.length; i++) {

            var d = i
            var r = politics[i].toString();
            livthree.run(d, r);
          }
          livthree.finalize();

          db.each("SELECT id, dt FROM literature", function(err, row) {
            console.log("Literature tray id : " + row.id, row.dt);
          });
          db.each("SELECT id, dt FROM engineering", function(err, row) {
            console.log("engineering tray id : " + row.id, row.dt);
          });
          db.each("SELECT id, dt FROM medicine", function(err, row) {
            console.log("medicine tray id : " + row.id, row.dt);
          });
          db.each("SELECT id, dt FROM politics", function(err, row) {
            console.log("politics tray id : " + row.id, row.dt);
          });
        });

        db.close();
        break

        //update_book

      case 'update_book':

        var sqlite3 = require('sqlite3').verbose();
        var file = args[1];
        var db = new sqlite3.Database(file);
        var inputData = [args[2], args[4]];
        db.all("UPDATE literature SET dt = ? WHERE id = ?", inputData,
          function(err, rows) {

          }
        );
        break

        //load_state
        
      case 'load_state':
        var sqlite3 = require('sqlite3').verbose();
        var file = args[1];
        var db = new sqlite3.Database(file);
        db.all("SELECT id,dt FROM literature", function(err, rows) {
          rows.forEach(function(row) {
            console.log("Literature tray id : " + row.id, row.dt);
            literature.push(row.dt);
          })

        });


        db.all("SELECT id,dt FROM engineering", function(err, rows) {
          rows.forEach(function(row) {
            console.log("engineering tray id : " + row.id, row.dt);
            engineering.push(row.id);
          })
        });

        db.all("SELECT id,dt FROM politics", function(err, rows) {
          rows.forEach(function(row) {
            console.log("politics tray id : " + row.id, row.dt);
            politics.push(row.id);
          })
        });

        db.all("SELECT id,dt FROM medicine", function(err, rows) {
          rows.forEach(function(row) {
            console.log("medicine tray id : " + row.id, row.dt);
            medicine.push(row.id);
          });


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

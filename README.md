# bookapp
Library Management System.

This Commandline application is used to manage a libraries inventory.
There are four shelfs in this library.
1. Literature
2. Medicine
3. Politics
4. Engineering

How to use this application.

NB use "," to seperate arguments

Sample input 

list_books,literature 

Commands.

1. List_books,<name of category> - used to list the books stored in a particular category/shelf
   example
   list_books,literature
2. add_book,<title>,<author>,<category>,<year>, - used to add books to the library and respective shelf.
   example 
   add_book,In Search of Lost Time, Marcel Proust,literature,1913,
3. load_books - used to load books from a text file into the application

4. allocations - used to write out the title of the books in each section to a text file 

5. save_state,<name of library> - used to save the title of each book and its respective shelf to the sqlite database

6. update_book,<name of library>,<title of book>,<name of shelf>,<position in shelf>, - used to update books in the sqlite database.
   example
   update_book,<library003>,<In Search of Lost Time>,<literature>,<0>,
7. load_state,<name of library> - used to load the contents of a database into the application.
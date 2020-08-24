---
layout: default
course_number: CS420
title: "Lab 1: File Copy"
---



<br>

### About this Lab

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Before starting this lab, you should read Section 2.3 of your text book.

This lab is a 'warm-up' lab. Through this lab I hope to get a good feeling for your ability to write programs in **C** and your ability to make use of the **POSIX API** and system calls. For this lab, and the rest of the labs that follow this semester, you are required to develop in a **POSIX-compliant environment**. This includes Linux and UNIX systems. If you have your own Linux or UNIX based system feel free to develop in those environments.  Otherwise, you can use the lab compueters in KEC119.

You can use any code editor you wish, but you can only use C system calls for reading/writing to the terminal screen and/or to the disk when copying your file. You may find the list of C system calls located [here](http://codewiki.wikidot.com/system-calls) useful. Specifically, you will need the following systems calls: **```open```**, **```close```**, **```read```**, **```write```**, and **```stat```**.  You may also find the functions **```strlen```** and **```exit```** useful.  In addition to the website linked above, you can also read about these functions using Linux's built in **man pages** by typing any of the following in your terminal:

<pre>
<b>man 2 open
man 2 close
man 2 read
man 2 write
man 2 stat
man 3 strlen
man 3 exit</b>
</pre>

Searching for any of the above on Google will typically result in a nicely formatted HTML version of the man page you desire.



<br>

### Your Task

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Download the lab files [here](lab01_filecopy.zip).

Write a C program that uses system calls to copy one file to another. Your program needs to accept two arguments, the first is the source file to be copied, the second is the name of the destination file. Your program should then copy the file, one (or more) character(s) at a time, from the source to the destination. 

 - You MUST use C system calls to read/write to the terminal and disk
 
 - When copying the source file to the destination file, use the buffer provided. You should attempt to read BUFFER_SIZE bytes at a time when copying (not a single byte).
 
 - Use the sources provided above to read about the various systems calls that you'll need before getting started.  A **_BIG_** **_BIG_** **_BIG_** part of this lab is learning how to read documentation.  **If you do not read the documentation carefully, you will not be able to complete this lab.**

 - You **CANNOT** use **```fopen```**, **```fclose```**, **```printf```**, **```fprintf```**, **```scanf```**, etc.

 - As mentioned above, you will likely want to use the **```strlen```** function

 - **Be sure to include the appropriate error checking (e.g. source file does not exist)**.  Every one of the systems calls will return an error if something goes wrong. **ALWAYS CHECK THE RETURN VALUE OF YOUR SYSTEM CALLS ... ALL OF THEM!**.  If there is a problem, gracefully exit your program by calling **```exit(1)```**.

 - Don't worry about handling filenames with special characters in them (e.g. spaces).

 - Your code **MUST** compile with supplied Makefile. Simply type **```make```** at the command line to compile your code

 - The supplied Makefile also includes a simple test, type **```make test```** to see if your program runs correctly.


Below is an example run of the program.
User input is in **bold**.

<pre>
<b>./filecopy example.txt example_copy.txt</b>
Copying example.txt to example_copy.txt
DONE
</pre>



<br>

### Running test cases

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The **```Makefile```** distributed with the lab has several test cases built-in

* **TEST#1** - attempts to copy the text file named **```test1_input.txt```** that is distributed with the lab

* **TEST#2** - attempts to copy the text file named **```test2_input.txt```** that is distributed with the lab. In this case, the file is overwriting an existing, larger file.

* **TEST#3** - attempts to copy a binary file, your compiled **```filecopy```** program

* **TEST#4** - This test attempts to copy a binary file again. However, this time instead of running **```filecopy```** to copy a file, **```filecopy_copy```** from **TEST #3** is used to copy a file.  This test will check to see that you correctly copied not just the contents of **```filecopy```**, but also that you copied 


To run the supplied test cases, type the following:

<pre>
<b>make test</b>
</pre>


Below is an example run of **```make test```**.
User input is in **bold**.

<pre>
<b>make test</b>

=================================
TEST #1
Running filecopy on test1_input.txt
=================================
./filecopy test1_input.txt test1_output.txt
  Copying test1_input.txt to test1_output.txt
  DONE

=================================
Checking to see if files differ
=================================

Files test1_input.txt and test1_output.txt are identical

=================================


=================================
TEST #2
Running filecopy on test2_input.txt
 -- overwriting a long file with a shorter file
=================================
cp test1_input.txt test2_output.txt
./filecopy test2_input.txt test2_output.txt
  Copying test2_input.txt to test2_output.txt
  DONE

=================================
Checking to see if files differ
=================================

Files test2_input.txt and test2_output.txt are identical

=================================


=================================
TEST #3
Running filecopy on filecopy
=================================
./filecopy filecopy filecopy_copy
  Copying filecopy to filecopy_copy
  DONE

=================================
Checking to see if files differ
=================================

Files filecopy and filecopy_copy are identical

=================================


=================================
TEST #4
Running filecopy_copy on filecopy
=================================
./filecopy_copy filecopy filecopy_copy_2
  Copying filecopy to filecopy_copy_2
  DONE

=================================
Checking to see if files differ
=================================

Files filecopy and filecopy_copy_2 are identical

=================================
</pre>



<br>

### Grading

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This lab will be graded on a 100 point scale. To receive full credit, your program must successfully compile and copy files. See below for more details:

 - **20 points** : Successfully compiles **WITH NO WARNINGS!**
 - **20 points** : Correct use of system calls
 - **20 points** : Successfully copies text files (e.g. TEST #1 and TEST #2)
 - **20 points** : Successfully copies binary files (e.g. TEST #3 and TEST #4)
 - **10 points** : Checks **ALL** necessary error conditions
 - **10 points** : Properly closes files when done



<br>

### Submission

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Before submitting your assignment:

 1. run **```make clean```** from the terminal
 2. run **```make```** to compile your code from scratch
 3. **ADDRESS ANY AND ALL WARNINGS**
 4. goto #1 until no more warnings exist

There are **NO** acceptable warnings on this assignment or any other assigning in this course. All warnings are an indication that you've done something incorrectly.


When you are done, run the following command from your terminal in the source directory for the project:

<pre>
<b>make submit</b>
</pre>

You will be prompted for your Marmoset username and password,
which you should have received by email.  Note that your password will
not appear on the screen.

**DO NOT MANUALLY ZIP YOUR PROJECT AND SUBMIT IT TO MARMOSET.  
YOU MUST USE THE ```make submit``` COMMAND**.


---
layout: default
course_number: CS420
title: "Lab 3: Semaphore Fun"
---



<br>

### About this Lab

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The goal of this lab is to get you working with semaphores/mutexes.
To get started download the lab files [here](lab03_semaphores.zip).

In this lab, you will write a C program in **```main.c```** that creates multiple processes (each of which will eventually creates multiple threads) that all attempt to access, read, and write a common file. 



<br>

### Running your Program

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The Makefile provided contains a command that will run and test your code. Your submission **MUST** run correctly when the following Makefile command is run:

<pre>
make runTest
</pre>

If your program does not run with the above Makefile command, I will not run your program and you will receive 0 credit for your submission. If you program runs and produces the correct output file, it will print out **```--SUCCESS--```**. The code to verify your output file and print this message is already written for you and is included in the **```main.c```** file. **DO NOT MODIFY THE CODE THAT TESTS YOUR OUTPUT FILE.** Modifying the test code will result in 0 credit for this lab assignment. 



<br>

### Parsing Arguments

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Your program **MUST** take three command line arguments **EXACTLY** as shown below. The usage statement for your program, with an explanation of each of the command line arguments is below:

<pre>
USAGE : ./main -p &lt;num_procs&gt; -t &lt;num_threads&gt; -f &lt;filename&gt;
    -p : the number of processes to create
    -t : the number of threads to create per process
    -f : the name of the shared file in which to write output
</pre>

I highly recommend reading about and using the **```getopt```** function that is included in the **```unistd.h```** C library to parse your command line options. The man page for the **```getopt```** function can be found [here](http://pubs.opengroup.org/onlinepubs/009696899/functions/getopt.html#tag_03_234).



<br>

### Writing the First Value

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

When your program is run from the command line, your main process should create a new file and write the integer value '0' (without the quotes) into the first line of the file. It will be the only line in the file for now.  After writing the '0', the main process should close the file. It will be reopened again later. **NOTE:** a utility function called **```open_file```** is provided for you in the **```utils.c```** file. Use it to make your lives easier.  The **```open_file```** function accepts the same arguments as **```fopen```** but does all of the necessary error checking for you.



<br>

### Creating a Named Semaphore

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Next, your main process will need to create a **named semaphore**. A named semaphore is maintained by the operating system and is very easy to share between unrelated processes. There is no need to manually created a shared memory space that would be required of other types of semaphores and mutexes (in other words, you're getting off easy here). You can read everything you need to know about semaphores and named semaphores [here](https://web.archive.org/web/20161208112748/http://www.linuxdevcenter.com:80/pub/a/linux/2007/05/24/semaphores-in-linux.html). Please read ALL six pages of the linked semaphore documentation before proceeding. When you're ready to create your named semaphore, **use your YCP login name as the name for your semaphore**.

Be sure that you also destroy the named semaphore prior to terminating your program.  You need to destroy the semaphore if your program exits normally.  You will also need to destroy the semaphore if you've created it and your program exits with an error.

**NOTE:** While debugging your code, you may end up in a situation where you've created and locked the named semaphore and neglected to unlock or delete the semaphore prior to exiting.  For a named semaphore that is managed by the operating system, this means that the next time you attempt to run your program you won't be able to acquire the semaphore.  Before each time you run your program, be sure to verify that you don't have an existing semaphore from a previous run.

To check for existing named semaphores, type the following in your terminal:

    ls /dev/shm/sem.*

If you see a semaphore that includes your username, then you failed to delete it properly.  You can manually delete the semaphore now by typing the following in your terminal:

    rm /dev/shm/sem.$username
    
where **```$username```** represents your username.



<br>

### Process Creation

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Now the fun begins. Your main process should create **```P```** new child processes (number specified via the **```-p```** option on the command line) that **run concurrently** (i.e. fork off ALL processes before calling **```wait(NULL)```** and waiting for any to finish). **DO NOT WAIT FOR A PROCESS TO FINISH BEFORE FORKING THE NEXT PROCESS!** 

Each child process should replace its process contents with a call to **```execlp```** and run the code in the **```fileWriter.c```** file.  You will need to fill in the code in **```fileWriter.c```** later. However, **BEFORE** proceeding with the code for **```fileWriter.c```**, you should simply have **```fileWriter.c```** print out a ```"Hello World"``` message. This will allow you to test that your **```main.c```** is properly creating each of the required processes. 



<br>

### Thread Creation / Completion

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Once you're confident that your **```main```** process can create the required child processes and terminate properly you can move onto writing the **```fileWriter.c```**. Each child processes (i.e. each **```fileWriter```**) should first create **```T```** new threads (the number of threads is specified by the **```-t```** option on the command line). Each of those **```T```** threads **MUST** also run concurrently.

When creating your threads, don't attempt to make them do any work just yet.  Simply get the creation and termination of the threads working properly.  At this point, the function that your threads execute should simply print something simple to the terminal.

Here are a few links that should help you along the way:

 * [Pthread tutorial](https://computing.llnl.gov/tutorials/pthreads/)
 * [More on Pthreads](http://en.wikipedia.org/wiki/POSIX_Threads)
 * [pthread.h](http://pubs.opengroup.org/onlinepubs/007908799/xsh/pthread.h.html)



<br>

### Thread Work

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

If you're reading this, your program should be successfully creating processes, creating threads, terminating threads, and terminating processes.  **IF YOUR LAB DOES NOT DO THESE THINGS DO NOT CONTINUE. YOU MUST GET THOSE PIECES WORKING FIRST.**

It's time to make the worker routine of your thread actually do some work.  Each of your threads should attempt to read from and write to the same file that was originally created by the **```main```** process. Each thread should: 

 * Attempt to open the shared file
 * Read the **LAST** numeric value in the file (the first thread to access the file will read the 0 written by the **```main```** process)
 * Increment the value read from the file and **append** the newly incremented value to the file. Each newly appended value should be appended on its own line in the shared file


Use **semaphores/mutexes** as you see necessary. When all of the threads complete and all of the processes terminate the shared file should contain the numeric values **```0```** through **```(P * T)```**,  *IN ASCENDING ORDER*.  If your values are not in ascending order, or if some of the values are repeated/missing then you should re-evaluate how you are using semaphores because you've made a mistake somewhere.

**Hints:** 

 * There are many different ways to read/write files.  Consider using the following functions **``fseek``**, **``ftell``**, **``getc``**, and **``fscanf``**.
 * Do NOT read the entire file with each new thread as that will give you O(n^2) behavior.  Instead, consider **jumping** to the end of the file and then walking backwards to find the last line.


<br>

### Verifying the Output

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

After all of the threads finish writing to the file, your main process will check the file to see if the contents of the file are correct.  If the contents are correct, then the main process will print **```--SUCCESS--```** to the terminal. If the contents are incorrect, then the main process will print **```--EPIC FAIL--```** to the terminal.  **This code has already been provided for you . . . DO NOT CHANGE IT.** Whatever code you write, must pass the test that has been provided. Any modifications to the provided code will result in a 0 for this assignment.


#### Sample Output File

If your program is run with **```-p 5```** and **```-t 3```**, you should create a total of 5 processes, each with 3 threads. That's a total of 15 threads that are trying to access and write to the shared file. If successful, the contents of the shared file should look **EXACTLY** like the following when all 15 threads get done with it. The very first line of the file should contain the **0** written by the original processes, followed by each additional value on a newline.

<pre>
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
</pre>


<br>

### Grading Criteria
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This lab will be graded on a 100 point scale as follows: 

 - **5 points** : correctly parse and error check command line arguments
 - **10 points** : main process successfully writes the initial '0' to the file
 - **5 points** : main process correctly creates a named semaphore
 - **10 points** : main process correctly forks off P new processe
 - **10 points** : main process correctly closes named semaphore
 - **10 points** : fileWriter process correctly receives arguments passed from main process
 - **10 points** : fileWriter process correctly attaches to named semaphore
 - **10 points** : fileWriter process correctly spawns T new threads
 - **10 points** : fileWriter threads correctly read from, and update the shared file
 - **15 points** : all data is written correctly to the shared data file

You may lose additional points for writing bad code (e.g. not checking error conditions, not closing files when you're done with them, etc.).


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

	make submit

You will be prompted for your Marmoset username and password,
which you should have received by email.  Note that your password will
not appear on the screen.

**DO NOT MANUALLY ZIP YOUR PROJECT AND SUBMIT IT TO MARMOSET.  
YOU MUST USE THE ```make submit``` COMMAND.**


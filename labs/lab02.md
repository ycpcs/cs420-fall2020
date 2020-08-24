---
layout: default
course_number: CS420
title: "Lab 2: Interprocess Communication"
---



<br>

### About this Lab

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

In this lab you will learn about and use the following POSIX system calls: **```fork()```**, **```exec()```**, **```shmget()```**, **```shmat()```**, **```shmdt()```**, **```shmctl()```**.  If you do not use each of these system calls at least once, then you've probably done something wrong. You should also familiarize yourself with the **man pages** for each of these system calls. 

For example, to read about the shmget function, run the following command from your terminal:

	man shmget

Doing a **```man```** query via [Google](http://lmgtfy.com/?q=man+shmget) will also produce the appropriate documentation.


Once again, you should be using a **POSIX-compliant environment**, such as Linux, to write your programs. 

For this lab, you are permitted to use **```printf```** and other functions in the **POSIX API** for your I/O.



<br>

### Your Task

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

First download the [lab](lab02_shared_memory.zip). I have provided a few files as a starting point. 

Your task is to write two programs (**```mainProc```** and **```childProc```**) that communicate with each other through shared memory. Your main program should accept a single command line argument (an integer) that it will eventually pass to a child process through shared memory. However, before forking off the child process, the main process should use the **```shmget()```** system call to request a chunk of shared memory from the operating system. The amount of memory requested should be **```sizeof(struct ipc_struct)```**. The definition of the **```ipc_struct```** is in the **```ipcEx.h```** header file. Note that the command line argument received by **```mainProc```** will eventually be passed to the child process by storing it in the **```repeat_val```** field of the **```ipc_struct```**.

After requesting the shared memory from the operating system, the main process should attach to the shared memory using the **```shmat()```** system call. As mentioned in class, the block of shared memory has no structure. To give the shared memory some structure (from the perspective of the main process), you can map an **```ipc_struct```** onto the shared memory as follows:

```c
/* cast the memory pointer returned by shmat as a (struct ipc_struct *),
 * then assign that to a variable defined as a (struct ipc_struct *) */
struct ipc_struct* shared_memory = (struct ipc_struct*) shmat( /* INSERT ARGS HERE */ );

/* access the members of the struct in typical C/C++ fashion */
shared_memory->repeat_val =  ...
```

Note that the above code **DOES NOT ALLOCATE ANY NEW MEMORY**. It simply attaches to and creates a pointer to the memory that was already allocated as shared memory by a call to **```shmget()```**. 

Now that the shared memory has been created, your **```mainProc```** program should fork off a child process using the **```fork()```** system call. Remember, that when you fork off a child process, both the parent and the child process continue running code from the **```fork()```** call forward. To have the child process run your childProc program, you will need to use the **```execlp()```** system call to replace the memory contents of the child process. The  **```execlp()```** system call allows you to pass arguments to the program that you want to run. For this lab, you will need to pass the **```segment_id```** as an argument to the child process so that the child process knows where to find the shared memory. 

When your **```childProc```** program runs, it should request access to the shared memory using the **```shmat()```** system call. Just as in your main program, the child process should also map an **```ipc_struct```** to the shared memory. The **```childProc```** program must then retrieve the **```repeat_val```** integer from the shared memory, replicate a the **```data_string```** **```repeat_val```** number of times into the shared memory space data buffer (use **```sprintf()```** for this), detach from the shared memory using the **```shmdt()```**, system call, and exit. 

While the **```childProc```** is running, the parent process can simply wait for the child to complete using the **```wait```** system call. When the child exits, the parent must retrieve the string data that was written to the shared memory by the child process and print it to the terminal. Finally, the **```mainProc```** program should detach from the shared memory using the **```shmdt()```** system call and cleanup the shared memory using the **```shmctl()```** system call. 

Use print statements to output the progress of the program. Each print statement should start with the either **```PARENT:```** or **```CHILD:```** to clearly indicate which process is printing the information. As an example, below is the output of my solution when run with an input argument of **```5```**. Yours should look very similar.

<pre>
> ./mainProc 5

PARENT: Created shared memory with a segment ID of 1048576
PARENT: The child process should store its string in shared
        memory a total of 5 times.

CHILD: Received 2 arguments
CHILD: Attempting to access segment ID 1048576...
CHILD: Parent requested that I store my data 5 times
CHILD: Done copying data, exiting.


PARENT: Child with PID=26233 complete
PARENT: Child left the following in the data buffer:
============= Buffer start =============
Hello Shared Memory!
Hello Shared Memory!
Hello Shared Memory!
Hello Shared Memory!
Hello Shared Memory!
============= Buffer end ===============

PARENT: Done
</pre>



<br>

### Grading

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

This lab will be graded on a 100 point scale as follows: 

 - **10 points** : successfully compile (both the parent and child programs)
 - **10 points** : create a shared memory segmen 
 - **20 points** : allow both a parent and child process to write to that shared memory space
 - **10 points** : have the parent successfully read a command line argument and pass it to the child process through shared memory
 - **10 points** : have the child successfully retrieve the information from the parent process through shared memory
 - **20 points** : have the child successfully fill the shared memory buffer with the information requested by the parent
 - **20 points** : have the parent successfully retrieve and print out the information that was sent back by the child process

You may lose points for writing bad code (e.g. not checking error conditions, not closing files when you're done with them).



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


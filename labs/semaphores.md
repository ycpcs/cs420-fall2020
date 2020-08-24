---
layout: default
course_number: CS420
title: "Semaphores"
---



<br>

### Semaphores in Linux

by Vikram Shukla <br>
05/24/2007

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Multithreaded applications are part and parcel of day-to-day commercial application. It would be 
difficult to imagine any full fledged application running commercially that is not multithreaded. 
Applications must use the multithreaded approach to improve on the performance of the application or 
systems. However, most beautiful things in life do not come without a price. Likewise, if the 
multithreaded feature needs to be used by the application, then it comes with a set of issues, such 
as deadlocks, race conditions, incorrect behavior of threads, etc. To overcome these issues, the OS 
provides a set of tools like Mutex, semaphores, signals and barriers that are handy in solving 
multithreaded multiprocessed issues. This article discusses one of these tool, semaphores, and 
provides some insight about them.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
#### Introduction to Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Semaphores can be thought of as simple counters that indicate the status of a resource. This counter 
is a protected variable and cannot be accessed by the user directly. The shield to this variable is 
provided by none other than the kernel. The usage of this semaphore variable is simple. If counter is 
greater that 0, then the resource is available, and if the counter is 0 or less, then that resource 
is busy or being used by someone else. This simple mechanism helps in synchronizing multithreaded and 
multiprocess based applications. Semaphores were invented and proposed by Edsger Dijkstra, and still 
used in operating systems today for synchronization purposes. The same mechanism is now available for 
application developers too. Its one of the most important aspects of interprocess communication.

Semaphores can be either binary or counting, depending on the number of shared resources. If a single 
shared resource is used, then we would require just one semaphore for synchronization purposes. In that 
case, the semaphore is referred as a binary semaphore. In all other cases, where the number of resources 
shared across users are greater than one, you would use multiple semaphores, in which case they are referred 
as counting semaphores.

Semaphores basically implement two kinds of operations. One to wait on the semaphore variable and another 
that signals the semaphore variable. Since semaphores are nothing but a counter, the following algorithm depicts 
these two semaphore operations:

Assume:<br>
s is the semaphore variable<br>
W(s) denotes waiting on the semaphore<br>
P(s) means signaling the availability of semaphore<br>

Algorithm: <br>

```
W(s) 
 while  (s<=0)    {
   //do  nothing 
}
s=s-1;
P(s)
s=s+1;
```

From the above algorithm, it could be easily understood that waiting on a semaphore does nothing more than decreasing 
the semaphore counter by 1. Signaling the semaphore is exactly the opposite, increasing the semaphore counter by 1.

Let's see some of the structures and functions that are used internally by the Linux kernel to implement the 
functionality of semaphores. Semaphores use the following two structures internally:

```
struct semaphore
{ 
    atomic_t count;
    int sleepers;
    wait_queue_head_t  wait;
}
struct rw_semaphore
{
    _s32 activity
    spinlock_t wait_lock;
    struct list_head  wait_list;
};
```

This structure, however has undergone some change in the latest kernels. It has been included with additional member 
variables as shown below:

```
struct rw_semaphore {
    signed  long count;
    #define RWSEM_UNLOCKED_VALUE 0x00000000
    #define RWSEM_ACTIVE_BIAS 0x00000001
    #define RWSEM_ACTIVE_MASK 0x0000ffff
    #define RWSEM_WAITING_BIAS (-0x00010000)
    #define RWSEM_ACTIVE_READ_BIAS RWSEM_ACTIVE_BIAS
    #define RWSEM_ACTIVE_WRITE_BIAS (RWSEM_WAITING_BIAS +  RWSEM_ACTIVE_BIAS) spinlock_t wait_lock;
     struct  list_head wait_list;
    #if RWSEM_DEBUG
     int debug;
    #endif
};
```

The basic functions that implement the semaphore operation at the kernel level can be found under 
the `````/asm/semaphore.h````` and `````/asm/rwsem.h````` header files:

* ```__down(struct semaphore *)```: This function checks to see if the semaphore is greater than zero. If so, it decrements the semaphore count and returns. If not, it sleeps and tries again later.
* ```__up(struct semaphore *)```: This function increments the semaphore count, thus awakening any process waiting on the semaphore.
* ```__down_trylock(struct semaphore *)```: This function checks to see if the semaphore is available. If not, then the function would return and is thus categorized as a non-blocking function.
* ```__down_interruptible(struct semaphore *)```: The action of this function is similar to ```__down``` with a difference, it can be interrupted by a signal. Should it be interrupted by a signal, it would return ```-EINTR```. The ```__down``` version blocks signals while running.
* The other functions such as ```__down_read``` (locks the semaphore for reading), ```__down_write``` (locks the semaphore for writing) , ```__up_read``` (frees the semaphore after reading), and ```__up_write``` (frees the semaphore after writing) permit more that one reader to access a protected resource, but only one writer to update.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
#### Distributions of Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The current Unix environment comes with two types of semaphores: System V and POSIX. In general, the older Unix-based systems uses the System V version and the current Linux-based systems use the POSIX version. However, the general behavior and technology of semaphores does not change irrespective of the version used. Let's look at the interfaces, and how they work on these two different versions of semaphores.

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
##### System V Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The interface and usage of System V semaphores is cluttered with unnecessary complications. For example, the semaphore created is not just a single counter (value) but rather a set of semaphore counters (values). This introduces the concept that the semaphore object created consists of 0 to n semaphores in a set with an identical semaphore ID. The function that achieves this is:

```
int semget(key_t key, int nsems, int semflg);
```

**key**<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Used for identifying the semaphore.<br>
**nsems**<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Number of semaphores needed in the set.<br>
**semflg**<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Indicates the how semaphore needs to be created. It could be one of the following types:<br>
* ```IPC_CREAT```: Creates a new semaphore if the key does not already exist.
* ```IPC_EXCL```: If the key exists, it will cause the function to fail.

The key, of type ```key_t```, could have any meaningful value as provided by the user or programmer or generated by the ```ftok()``` call. However, System V semaphores provide a different key, which is identified by ```IPC_PRIVATE```. When this key is used, every time a ```semget()``` call is made, it creates a new set of semaphores identified by the semaphore ID. The following code snippet shows how to create a new semaphore at every call of the ```semget``` function.

```
{
    int semid;
    semid=semget(IPC_PRIVATE,  1,IPC_CREAT);
    if  (semid<0) 
    {
        perror("Semaphore creation failed  Reason:");
    }
}

```

NOTE: Actually ```IPC_PRIVATE``` is defined as ```((__key_t) 0)```. This can be found under the header file ```ipc.h```




<!-- SKIP PAGE 2 , SKIP PAGE 3, SKIP FIRST HALF OF PAGE 4 -->




--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
##### POSIX Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The potential learning curve of System V semaphores is much higher when compared to POSIX semaphores. This will be 
more understandable after you go through this section and compare it to what you learned in the previous section.

To start with, POSIX comes with simple semantics for creating, initializing, and performing operations on semaphores. 
They provide an efficient way to handle interprocess communication. POSIX comes with two kinds of semaphores: named 
and unnamed semaphores.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
###### Named Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

If you look in the man pages, you'll see that a named semaphore is identified by a name, like a System V semaphore, and, similarly, the semaphores have kernel persistence. This implies that these semaphores, like System V, are system-wide and limited to the number that can be active at any one time. The advantage of named semaphores is that they provide synchronization between unrelated process and related process as well as between threads.

A named semaphore is created by calling following function:

sem_t *sem_open(const char *name,  int oflag, mode_t mode , int value);
name
Name of the semaphore to be identified.
oflag
Is set to O_CREAT for creating a semaphore (or with O_EXCL if you want the call to fail if it already exists).
mode_t
Controls the permission setting for new semaphores.
value
Specifies the initial value of the semaphore.
A single call creates the semaphore, initializes it, and sets permissions on it, which is quite different from the way System V semaphores act. It is much cleaner and more atomic in nature. Another difference is that the System V semaphore identifies itself by means of type int (similar to a fd returned from open()), whereas the sem_open function returns type sem_t, which acts as an identifier for the POSIX semaphores.

From here on, operations will only be performed on semaphores. The semantics for locking semaphores is:

int  sem_wait(sem_t *sem);
This call locks the semaphore if the semaphore count is greater than zero. After locking the semaphore, the count is reduced by 1. If the semaphore count is zero, the call blocks.

The semantics for unlocking a semaphore is:

int  sem_post(sem_t *sem);
This call increases the semaphore count by 1 and then returns.

Once you're done using a semaphore, it is important to destroy it. To do this, make sure that all the references to the named semaphore are closed by calling the sem_close() function, then just before the exit or within the exit handler call sem_unlink() to remove the semaphore from the system. Note that sem_unlink() would not have any effect if any of the processes or threads reference the semaphore.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
###### Unnamed Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Again, according to the man pages, an unnamed semaphore is placed in a region of memory that is shared between multiple threads (a thread-shared semaphore) or processes (a process-shared semaphore). A thread-shared semaphore is placed in a region where only threads of an process share them, for example a global variable. A process-shared semaphore is placed in a region where different processes can share them, for example something like a shared memory region. An unnamed semaphore provides synchronization between threads and between related processes and are process-based semaphores.

The unnamed semaphore does not need to use the sem_open call. Instead this one call is replaced by the following two instructions:

{
  sem_t semid;
  int sem_init(sem_t *sem, int pshared, unsigned  value);
}
pshared
This argument indicates whether this semaphore is to be shared between the threads of a process or between processes. If pshared has value 0, then the semaphore is shared between the threads of a process. If pshared is non-zero, then the semaphore is shared between processes.
value
The value with which the semaphore is to be initialized.
Once the semaphore is initialized, the programmer is ready to operate on the semaphore, which is of type sem_t. The operations to lock and unlock the semaphore remains as shown previously: sem_wait(sem_t *sem) and sem_post(sem_t *sem). To delete a unnamed semaphore, just call the sem_destroy function.

The last section of this article has a simple worker-consumer demo that has been developed by using a POSIX semaphore.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
#### System V Semaphores versus POSIX Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

There are a number of differences between System V and POSIX semaphores.

* One marked difference between the System V and POSIX semaphore implementations is that in System V you can control how much the semaphore count can be increased or decreased; whereas in POSIX, the semaphore count is increased and decreased by 1.
* POSIX semaphores do not allow manipulation of semaphore permissions, whereas System V semaphores allow you to change the permissions of semaphores to a subset of the original permission.
* Initialization and creation of semaphores is atomic (from the user's perspective) in POSIX semaphores.
* From a usage perspective, System V semaphores are clumsy, while POSIX semaphores are straight-forward
* The scalability of POSIX semaphores (using unnamed semaphores) is much higher than System V semaphores. In a user/client scenario, where each user creates her own instances of a server, it would be better to use POSIX semaphores.
* System V semaphores, when creating a semaphore object, creates an array of semaphores whereas POSIX semaphores create just one. Because of this feature, semaphore creation (memory footprint-wise) is costlier in System V semaphores when compared to POSIX semaphores.
* It has been said that POSIX semaphore performance is better than System V-based semaphores.
* POSIX semaphores provide a mechanism for process-wide semaphores rather than system-wide semaphores. So, if a developer forgets to close the semaphore, on process exit the semaphore is cleaned up. In simple terms, POSIX semaphores provide a mechanism for non-persistent semaphores.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
#### Understanding the Utility of Semaphores
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The advantage of semaphores over other synchronization mechanisms is that they can be used to synchronize two related or unrelated processes trying to access the same resource.

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
##### Related Process
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The processes are said to be related if the new process is created from within an existing process, which ends up in duplicating the resources of the creating process. Such processes are called related processes. The following example shows how the related processes are synchronized.

```
#include <semaphore.h>
#include <stdio.h>
#include <errno.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/mman.h>

int main(int argc, char **argv)
{
  int fd, i,count=0,nloop=10,zero=0,*ptr;
  sem_t mutex;

  //open a file and map it into memory

  fd = open("log.txt",O_RDWR|O_CREAT,S_IRWXU);
  write(fd,&zero,sizeof(int));
  ptr = mmap(NULL,sizeof(int),PROT_READ |PROT_WRITE,MAP_SHARED,fd,0);
  close(fd);

  /* create, initialize semaphore */
  if( sem_init(&mutex,1,1) < 0)
    {
      perror("semaphore initilization");
      exit(0);
    }
  if (fork() == 0) { /* child process*/
    for (i = 0; i < nloop; i++) {
      sem_wait(&mutex);
      printf("child: %d\n", (*ptr)++);
      sem_post(&mutex);
    }
    exit(0);
  }
  /* back to parent process */
  for (i = 0; i < nloop; i++) {
    sem_wait(&mutex);
    printf("parent: %d\n", (*ptr)++);
    sem_post(&mutex);
  }
  exit(0);
}
```

In this example, the related process access a common piece of memory, which is synchronized.


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
##### Unrelated Process
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

Processes are said to be unrelated if the two processes are unknown to each other and no relationship exists between them. For example, instances of two different programs are unrelated process. If such programs try to access a shared resource, a semaphore could be used to synchronize their access. The following source code demonstrates this:

```
<u>File1: server.c </u>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <semaphore.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define SHMSZ 27
char SEM_NAME[]= "vik";

int main()
{
  char ch;
  int shmid;
  key_t key;
  char *shm,*s;
  sem_t *mutex;

  //name the shared memory segment
  key = 1000;

  //create & initialize semaphore
  mutex = sem_open(SEM_NAME,O_CREAT,0644,1);
  if(mutex == SEM_FAILED)
    {
      perror("unable to create semaphore");
      sem_unlink(SEM_NAME);
      exit(-1);
    }

  //create the shared memory segment with this key
  shmid = shmget(key,SHMSZ,IPC_CREAT|0666);
  if(shmid<0)
    {
      perror("failure in shmget");
      exit(-1);
    }

  //attach this segment to virtual memory
  shm = shmat(shmid,NULL,0);

  //start writing into memory
  s = shm;
  for(ch='A';ch<='Z';ch++)
    {
      sem_wait(mutex);
      *s++ = ch;
      sem_post(mutex);
    }

  //the below loop could be replaced by binary semaphore
  while(*shm != '*')
    {
      sleep(1);
    }
  sem_close(mutex);
  sem_unlink(SEM_NAME);
  shmctl(shmid, IPC_RMID, 0);
  _exit(0);
}
```

```
<u>File 2: client.c</u>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <semaphore.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define SHMSZ 27
char SEM_NAME[]= "vik";

int main()
{
  char ch;
  int shmid;
  key_t key;
  char *shm,*s;
  sem_t *mutex;

  //name the shared memory segment
  key = 1000;

  //create & initialize existing semaphore
  mutex = sem_open(SEM_NAME,0,0644,0);
  if(mutex == SEM_FAILED)
    {
      perror("reader:unable to execute semaphore");
      sem_close(mutex);
      exit(-1);
    }

  //create the shared memory segment with this key
  shmid = shmget(key,SHMSZ,0666);
  if(shmid<0)
    {
      perror("reader:failure in shmget");
      exit(-1);
    }

  //attach this segment to virtual memory
  shm = shmat(shmid,NULL,0);

  //start reading
  s = shm;
  for(s=shm;*s!=NULL;s++)
    {
      sem_wait(mutex);
      putchar(*s);
      sem_post(mutex);
    }

  //once done signal exiting of reader:This can be replaced by another semaphore
  *shm = '*';
  sem_close(mutex);
  shmctl(shmid, IPC_RMID, 0);
  exit(0);
}
```

The above executables (client and server) demonstrate how semaphore could be used between completely different processes.

In addition to the applications shown above, semaphores can be used cooperatively to access a resource. Please note that a semaphore is not a Mutex. A Mutex allows serial access to a resource, whereas semaphores, in addition to allowing serial access, could also be used to access resources in parallel. For example, consider resource R being accessed by n number of users. When using a Mutex, we would need a Mutex "m" to lock and unlock the resource, thus allowing only one user at a time to use the resource R. In contrast, semaphores can allow n number of users to synchronously access the resource R. The best common example could be the Toilet Example.

Another advantage of semaphores is in situations where the developer would need to restrict the number of times an executable can execute or be mapped in memory. Let's see a simple example:

```
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <stdio.h>
#include <errno.h>

#define KEY 0x100

typedef union semun
{
  int val;
  struct semid_ds *st;
  ushort * array;
}semun_t;
int main()
{
  int semid,count;
  struct sembuf op;

  semid = semget((key_t)KEY,10,0666|IPC_CREAT);
  if(semid==-1)
    {
      perror("error in creating semaphore, Reason:");
      exit(-1);
    }
  count = semctl(semid,0,GETVAL);
  if(count>2)
    {
      printf("Cannot execute Process anymore\n");
      _exit(1);
    }
  //get the semaphore and proceed ahead
  op.sem_num = 0; //signifies 0th semaphore
  op.sem_op = 1; //reduce the semaphore count to lock
  op.sem_flg = 0; //wait till we get lock on semaphore
  if( semop(semid,&op,1)==-1)
    {
      perror("semop failed : Reason");
      if(errno==EAGAIN)
    printf("Max allowed process exceeded\n");
    }
  //start the actual work here
  sleep(10);
  return 1;
}
```


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
##### Difference Between Semaphores and Mutex
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

After reading though the material above, some pretty clear distinctions should have emerged. However, I'd like to reiterate those differences again here, along with some other noticeable differences between semaphore and Mutex.

1. A semaphore can be a Mutex but a Mutex can never be semaphore. This simply means that a binary semaphore can be used as Mutex, but a Mutex can never exhibit the functionality of semaphore.
2. Both semaphores and Mutex (at least the on latest kernel) are non-recursive in nature.
3. No one owns semaphores, whereas Mutex are owned and the owner is held responsible for them. This is an important distinction from a debugging perspective.
4. In case the of Mutex, the thread that owns the Mutex is responsible for freeing it. However, in the case of semaphores, this condition is not required. Any other thread can signal to free the semaphore by using the sem_post() function.
5. A Mutex, by definition, is used to serialize access to a section of re-entrant code that cannot be executed concurrently by more than one thread. A semaphore, by definition, restricts the number of simultaneous users of a shared resource up to a maximum number
6. Another difference that would matter to developers is that semaphores are system-wide and remain in the form of files on the filesystem, unless otherwise cleaned up. Mutex are process-wide and get cleaned up automatically when a process exits.
7. The nature of semaphores makes it possible to use them in synchronizing related and unrelated process, as well as between threads. Mutex can be used only in synchronizing between threads and at most between related processes (the pthread implementation of the latest kernel comes with a feature that allows Mutex to be used between related process).
8. According to the kernel documentation, Mutex are lighter when compared to semaphores. What this means is that a program with semaphore usage has a higher memory footprint when compared to a program having Mutex.
9. From a usage perspective, Mutex has simpler semantics when compared to semaphores.

--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
##### A Worker-Consumer Problem
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

The worker-consumer problem is an age old scenario that has been used to justify the importance of semaphores. Let's see a traditional worker-consumer problem and its simple solution. The scenario presented here is not too complex.

There are two processes: Producer and Consumer. The Producer inserts information into the data area; while the Consumer removes information from the same area. There must be enough space for the Producer to insert information into the data area. The Producer's sole function is to insert data into the data area. Similarly, the Consumer's sole function is to remove information from the data area. In short, the Producer relies on the Consumer to make space in the data-area so that it may insert more information, while the Consumer relies on the Producer to insert information into the data area so that it may remove that information.

To develop this scenario, a mechanism is required to allow the Producer and Consumer to communicate, so they know when it is safe to attempt to write or read information from the data area. The mechanism that is used to do this is a semaphore.

In the below sample code , the data area is defined as char buffer[BUFF_SIZE] and buffer size is #define BUFF_SIZE 4. Both Producer and Consumer access this data area. The data area's limit size is 4. POSIX semaphores are being used for signaling.

```
#include <pthread.h>
#include <stdio.h>
#include <semaphore.h>

#define BUFF_SIZE 4
#define FULL 0
#define EMPTY 0
char buffer[BUFF_SIZE];
int nextIn = 0;
int nextOut = 0;

sem_t empty_sem_mutex; //producer semaphore
sem_t full_sem_mutex; //consumer semaphore

void Put(char item)
{
  int value;
  sem_wait(&empty_sem_mutex); //get the mutex to fill the buffer

  buffer[nextIn] = item;
  nextIn = (nextIn + 1) % BUFF_SIZE;
  printf("Producing %c ...nextIn %d..Ascii=%d\n",item,nextIn,item);
  if(nextIn==FULL)
    {
      sem_post(&full_sem_mutex);
      sleep(1);
    }
  sem_post(&empty_sem_mutex);

}

void * Producer()
{
  int i;
  for(i = 0; i < 10; i++)
    {
      Put((char)('A'+ i % 26));
    }
}

void Get()
{
  int item;

  sem_wait(&full_sem_mutex); // gain the mutex to consume from buffer

  item = buffer[nextOut];
  nextOut = (nextOut + 1) % BUFF_SIZE;
  printf("\t...Consuming %c ...nextOut %d..Ascii=%d\n",item,nextOut,item);
  if(nextOut==EMPTY) //its empty
    {
      sleep(1);
    }

  sem_post(&full_sem_mutex);
}

void * Consumer()
{
  int i;
  for(i = 0; i < 10; i++)
    {
      Get();
    }
}

int main()
{
  pthread_t ptid,ctid;
  //initialize the semaphores

  sem_init(&empty_sem_mutex,0,1);
  sem_init(&full_sem_mutex,0,0);

  //creating producer and consumer threads

  if(pthread_create(&ptid, NULL,Producer, NULL))
    {
      printf("\n ERROR creating thread 1");
      exit(1);
    }

  if(pthread_create(&ctid, NULL,Consumer, NULL))
    {
      printf("\n ERROR creating thread 2");
      exit(1);
    }

  if(pthread_join(ptid, NULL)) /* wait for the producer to finish */
    {
      printf("\n ERROR joining thread");
      exit(1);
    }

  if(pthread_join(ctid, NULL)) /* wait for consumer to finish */
    {
      printf("\n ERROR joining thread");
      exit(1);
    }

  sem_destroy(&empty_sem_mutex);
  sem_destroy(&full_sem_mutex);

  //exit the main thread

  pthread_exit(NULL);
  return 1;
}
```


--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
#### Conclusions
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

We've explored the possibilities of different varieties of semaphores, as well as the differences between semaphores and Mutex. This specific knowledge could be helpful to developers in migration between System V and POSIX semaphores and when deciding whether to use Mutex or semaphores. For further details on the APIs used in the above example, refer to relevant the man pages.


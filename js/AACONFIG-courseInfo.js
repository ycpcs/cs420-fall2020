
var PREPOPULATE = false;

var courseInfo = {
    courseName: "CS420: Operating Systems",
    classDays: ["Mon", "Wed", "Fri"],


    // The following is true if final exam is on the LAST day of class;
    // false if final exam is during exam week."
    inClassFinalExam: true,
    // The following is for the college-scheduled final exam.
    // It is not used if final is on last day of class"
    finalExamDates: [
        new FinalExamDay("101", new Date("12/2/2020 12:45:00")),
        new FinalExamDay("102", new Date("12/4/2020 15:00:00"))
    ],


    classPeriods: [
        {
            topic: new Topic( "Introduction", "lectures/lecture1_introduction.pdf" ),
            reading: new Reading("OSC9 § 1.1 - 1.2")
        },
        {
            topic: new Topic( "OS Overview", "lectures/lecture2_os_overview.pdf" ),
            reading: new Reading("OSC9 § 1.3 - 1.13")
        },
        {
            topic: new Topic( "Operating System Services & System Calls", "lectures/lecture3_services_and_system_calls.pdf" ),
            reading: new Reading("OSC9 § 2.1 - 2.5"),
            assign: new Homework("Homework #1", "homework/Homework_Assignment_1.txt", 7)
        },
        {
            topic: new Topic( "Operating System Structure", "lectures/lecture4_operating_system_structure.pdf" ),
            reading: new Reading("OSC9 § 2.6 - 2.11"),
            assign: new Assignment("Lab #1", "labs/lab01.html", 7)
        },
        {
            topic: new Topic( "Processes", "lectures/lecture5_processes.pdf" ),
            reading: new Reading("OSC9 § 3.1 - 3.3")
        },
        {
            topic: new Topic( "Interprocess Communication", "lectures/lecture6a_interprocess_communication.pdf" ),
            reading: new Reading("OSC9 § 3.4 - 3.7"),
            assign: new Homework("Homework #2", "homework/Homework_Assignment_2.txt", 4)
        },
        {
            topic: new Topic( "Interprocess Communication (continued)", "lectures/lecture6b_client_server_communication.pdf" ),
            assign: new Assignment("Lab #2", "labs/lab02.html", 20)
        },
        {
            topic: new Topic( "Threads", "lectures/lecture7_threads.pdf" ),
            reading: new Reading("OSC9 § 4.1 - 4.5"),
            assign: new Homework("Homework #3", "homework/Homework_Assignment_3.txt", 5)
        },
        {
            topic: new Topic( "Multithreading & Threading Issues", "lectures/lecture8_threading_issues.pdf" ),
            reading: new Reading("OSC9 § 4.6 - 4.8")
        },
//         {
//             topic: new Topic( "More on Threading", "" ),
//         },
        {
            topic: new Topic( "CPU Scheduling", "lectures/lecture9_cpu_scheduling.pdf" ),
            reading: new Reading("OSC9 § 6.1 - 6.4"),
            assign: new Homework("Homework #4", "homework/Homework_Assignment_4.txt", 7)
        },
        {
            topic: new Topic( "CPU Scheduling (continued)", "lectures/lecture9_cpu_scheduling.pdf" ),
        },
        {
            topic: new Topic( "Multiple-Processor Scheduling", "lectures/lecture10_multiprocessor_scheduling.pdf" ),
            reading: new Reading("OSC9 § 6.5 - 6.9")
        },
        {
            topic: new Topic( "Review for Exam #1", "" ),
        },
        {
            topic: new Topic( "** Exam #1", "" ),
        },
        {
            topic: new Topic( "Process Synchronization", "lectures/lecture11_process_synchronization.pdf" ),
            reading: new Reading("OSC9 § 5.1 - 5.6")
        },
        {
            topic: new Topic( "Semaphores", "lectures/lecture11_process_synchronization.pdf" ),
            reading: new Reading("OSC9 § 5.1 - 5.6"),
            assign: new Assignment("Lab #3", "labs/lab03.html", 18)
        },
        {
            topic: new Topic( "Classic Problems of Synchronization", "lectures/lecture12_classic_synchronization_problems.pdf" ),
            reading: new Reading("OSC9 § 5.7 - 5.11")
        },
        {
            topic: new Topic( "More on Semaphores and Synchronization", "" ),
        },
        {
            topic: new Topic( "Deadlocks & Deadlock Prevention", "lectures/lecture13+14+15_deadlock.pdf" ),
            reading: new Reading("OSC9 § 7.1 - 7.4"),
            assign: new Homework("Homework #5", "homework/Homework_Assignment_5.txt", 7)
        },
        {
            topic: new Topic( "Deadlock Avoidance", "lectures/lecture13+14+15_deadlock.pdf" ),
            reading: new Reading("OSC9 § 7.5")
        },
        {
            topic: new Topic( "Deadlock Detection, and Recovery", "lectures/lecture13+14+15_deadlock.pdf" ),
            reading: new Reading("OSC9 § 7.6 - 7.8")
        },
        {
            topic: new Topic( "Main Memory - Swapping and Allocation", "lectures/lecture16_main_memory.pdf" ),
            reading: new Reading("OSC9 § 8.1 - 8.4")
        },
        {
            topic: new Topic( "Paging & Paging Tables", "lectures/lecture17_paging_and_page_tables.pdf" ),
            reading: new Reading("OSC9 § 8.5 - 8.6"),
            assign: new Homework("Homework #6", "homework/Homework_Assignment_6.txt", 5)
        },
        {
            topic: new Topic( "Virtual Memory", "lectures/lecture18_virtual_memory.pdf" ),
            reading: new Reading("OSC9 § 9.2 - 9.6")
        },
        {
            topic: new Topic( "Virtual Memory (continued)", "lectures/lecture18_virtual_memory.pdf" ),
            assign: new Homework("Homework #7", "homework/Homework_Assignment_7.txt", 5)
        },
        {
            topic: new Topic( "Virtual Memory (continued)", "lectures/lecture18_virtual_memory.pdf" ),
        },
        {
            topic: new Topic( "Review for Exam #2", "" ),
        },
        {
            topic: new Topic( "** Exam #2", "" ),
        },
        {
            topic: new Topic( "File System Interface", "lectures/lecture19+20_file_system_interface.pdf" ),
            reading: new Reading("OSC9 § 11.1 - 11.7")
        },
        {
            topic: new Topic( "File-System Implementation", "lectures/lecture20+21_file_system_implementation.pdf" ),
            reading: new Reading("OSC9 § 12.1 - 12.10")
        },
        {
            topic: new Topic( "File-System Implementation (continued)", "lectures/lecture20+21_file_system_implementation.pdf" ),
        },
        {
            topic: new Topic( "Mass Storage Structure", "lectures/lecture22_mass_storage_structure.pdf" ),
            reading: new Reading("OSC9 § 10.1 - 10.6"),
            assign: new Homework("Homework #8", "homework/Homework_Assignment_8.txt", 7)
        },
        {
            topic: new Topic( "RAID Structure", "lectures/lecture23_RAID.pdf" ),
            reading: new Reading("OSC9 § 10.7 - 10.9")
        },
        {
            topic: new Topic( "Security Issues - Trojan Horses, Viruses, etc.", "lectures/lecture26_security_issues.pdf" ),
            reading: new Reading("OSC9 § 15.1 - 15.3")
        },
        {
            topic: new Topic( "Security Issues (continued)", "lectures/lecture26_security_issues.pdf" ),
        },
        {
            topic: new Topic( "Security Issues (continued)", "lectures/lecture26_security_issues.pdf" ),
        },
        {
            topic: new Topic( "Security Issues (continued)", "lectures/lecture26_security_issues.pdf" ),
        },
//         {
//             topic: new Topic( "Cryptography", "lectures/lecture27_cryptography.pdf" ),
//         },
        {
            topic: new Topic( "Review for Final Exam", "" ),
        },
        {
            topic: new Topic( "** Final Exam (cumulative)", "" )
        }
    ]
};

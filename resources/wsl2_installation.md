---
layout: default
course_number: CS420
title: WSL2 Installation
---

This page contains a step-by-step guide through the installation of WSL2 on Windows 10.

<hr><br><!-- =============================================================== -->

### Checking for Compatibility

<hr><br><!-- =============================================================== -->

Prior to following this guide, be sure to verify that you have the most recent version
of Windows 10 installed.  You can check your Windows version by first selecting the 
**Windows logo key + R** to open the **Run** dialog box. In the **Run** dialog box 
type **winver**, and select **OK**. 

At minimum, you must have version **1903** installed prior to following this guide. If you
are running a version number lower than **1903** run Windows update before continuing with 
this guide.


### Install the Windows Subsystem for Linux

<hr><br><!-- =============================================================== -->

You can follow Microsoft's office documentation [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10) 
or you can follow along with this abridged version.

**Step 1:** Open **Powershell** as an Administrator by typing **Powershell** into the 
search box in the Windows 10 taskbar.  You should see the option to **Run as Administrator**.
Click on the **Run as Administrator** to run **Powershell**.  At this point, you will 
likely need to click on the Windows 10 User Account Control System icon blinking in your
taskbar.  Click on the icon and select **Yes** to allow the program to make changes to your system.
<br><br>

**Step 2:** 
Copy and paste the following command into **Powershell** window.  To paste into a Powershell 
windows, right click on the titlebar of the **Powershell** window, select **Edit** and then **Paste**.

```dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart```

Wait for the operation to complete.


### Update WSL to WSL 2

<hr><br><!-- =============================================================== -->

**Step 1:** While still in **Powershell**, copy and paste the command below.  If you've
already closed your **Powershell** window, start it back up again as an Administrator.

```dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart```

Wait for the operation to complete.


**Step 2:** Reboot your machine.


**Step 3:** To set your WSL environment to always run as a WSL2 virtual machine, once 
again open **Powershell** as an Administrator and copy/paste the following command:

```wsl --set-default-version 2```

When the command completes, you can close your **Powershell** window.


### Install Linux Distribution of Your Choice

<hr><br><!-- =============================================================== -->

**Step 1:** Open the **Microsoft Store** application on your Windows 10 machine and 
search for Linux.  You'll see several options including Ubuntu, Debian, SUSE, and Kali.
Select a distribution and install.

**Step 2:** After installing, your new Linux distro should be available in your **Start Menu**.
Run your distro from the start menu.

**Step 3:** On the first run, you will need to create a username and password for this 
virtual machine.  Create your username/password to finalize the installation.


### Install Build Tools 
<hr><br><!-- =============================================================== -->

**Step 1:** Copy and paste the following command into your new **Linux shell** to 
update the package manager. You will be prompted for the password that you recently 
created for this Linux VM.
```sudo apt-get -y update```


**Step 2:** Copy and paste the following block of commands into your new **Linux shell**
to install all of the typical build tools.

```
sudo apt-get -y install build-essential ; 
sudo apt-get -y install make ; 
sudo apt-get -y install clang ; 
sudo apt-get -y install valgrind ; 
sudo apt-get -y install curl ; 
sudo apt-get -y install wget ; 
sudo apt-get -y install git ; 
sudo apt-get -y install perl ; 
sudo apt-get -y install zip ; 
```


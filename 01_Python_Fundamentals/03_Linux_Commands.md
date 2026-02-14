# Linux Commands

Linux commands are essential tools for navigating and managing files, directories, processes, and system configurations in a Linux-based operating system.

## File and Directory Management

### 1. `ls` (List)
The `ls` command is used to list directory contents. It displays the files and directories in the current working directory.
```bash
ls          # List files
ls -l       # List with details
ls -a       # Show hidden files
```

### 2. `cd` (Change Directory)
The `cd` command is used to change the current working directory.
```bash
cd directory_name  # Move to a specific folder
cd ..              # Move one level up
cd /path/to/folder # Go to a specific path
```

### 3. `pwd` (Print Working Directory)
The `pwd` command displays the full path of the current working directory.
```bash
pwd
```

### 4. `mkdir` (Make Directory)
The `mkdir` command is used to create a new directory.
```bash
mkdir directory_name
```

### 5. `rm` (Remove)
The `rm` command is used to remove files or directories. **Be cautious**: deletions are permanent.
```bash
rm file_name        # Delete a file
rm -r folder_name   # Delete a folder (recursive)
```

### 6. `cp` (Copy)
The `cp` command is used to copy files or directories.
```bash
cp source_file destination_file
cp -r source_directory destination_directory
```

### 7. `mv` (Move/Rename)
The `mv` command is used to move files or directories, or to rename them.
```bash
mv old_file_name new_file_name
mv directory_name new_directory_name
```

### 8. `touch`
The `touch` command is used to create an empty file or update the timestamp of existing files.
```bash
touch file_name
```

### 9. `cat` (Concatenate)
The `cat` command is used to display the contents of files.
```bash
cat file_name
```

### 10. `grep`
The `grep` command screens files for specific patterns of text.
```bash
grep pattern file_name
```

## Permissions and Ownership

### 11. `chmod` (Change Mode)
The `chmod` command changes the permissions of files and directories.
```bash
chmod 755 file_name
```

### 12. `chown` (Change Owner)
The `chown` command changes the owner and group of files and directories.
```bash
chown user:group file_name
```

## System Administration

### 13. `sudo`
Allows users to execute commands with superuser (administrator) privileges.
```bash
sudo command
```

### 14. `apt-get` / `apt`
Used to manage packages on Debian-based systems (like Ubuntu).
```bash
sudo apt-get install package_name
```

### 15. `yum` / `dnf`
Used to manage packages on Red Hat-based systems.
```bash
sudo yum install package_name
```

### 16. `man` (Manual)
Displays the manual pages for other commands.
```bash
man ls
```

### 17. `top` / `htop`
Monitor system processes and resource usage (CPU, Memory).

### 18. `df` (Disk Free)
Display disk space usage on the filesystem.
```bash
df -h
```

### 19. `du` (Disk Usage)
Estimate file and directory space usage.
```bash
du -h directory_name
```

## Network and Other

### 20. `wget`
Download files from the internet.
```bash
wget file_url
```

### 21. `tar`
Manipulate compressed archive files.
```bash
tar -xvf archive.tar.gz
```

### 22. `ping`
Test the reachability of a host on a network.
```bash
ping google.com
```

### 23. `ifconfig` / `ip`
Display or configure network interfaces.
```bash
ifconfig
# or
ip address
```

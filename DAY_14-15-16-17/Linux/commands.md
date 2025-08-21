# Top 100 Linux Commands 

| No. | Command | One-liner Description | Example Usage |
|-----|----------|------------------------|---------------|
| 1   | `ls` | List files and directories | `ls -l` |
| 2   | `cd` | Change directory | `cd /var/log` |
| 3   | `pwd` | Print working directory | `pwd` |
| 4   | `touch` | Create an empty file | `touch file.txt` |
| 5   | `mkdir` | Create a new directory | `mkdir project` |
| 6   | `rmdir` | Remove an empty directory | `rmdir olddir` |
| 7   | `rm` | Remove files or directories | `rm -rf temp/` |
| 8   | `cp` | Copy files or directories | `cp file.txt /tmp/` |
| 9   | `mv` | Move or rename files | `mv old.txt new.txt` |
| 10  | `cat` | Display file contents | `cat config.yaml` |
| 11  | `less` | View file content page by page | `less /etc/passwd` |
| 12  | `head` | Show first lines of a file | `head -n 20 log.txt` |
| 13  | `tail` | Show last lines of a file | `tail -f app.log` |
| 14  | `nano` | Open text editor | `nano file.txt` |
| 15  | `vi` | Open file in vi editor | `vi main.c` |
| 16  | `chmod` | Change file permissions | `chmod 755 script.sh` |
| 17  | `chown` | Change file ownership | `chown user:group file.txt` |
| 18  | `whoami` | Show current user | `whoami` |
| 19  | `id` | Show user/group IDs | `id` |
| 20  | `ps` | Show running processes | `ps aux` |
| 21  | `top` | Display real-time processes | `top` |
| 22  | `htop` | Interactive process viewer | `htop` |
| 23  | `kill` | Kill a process by PID | `kill 1234` |
| 24  | `killall` | Kill process by name | `killall nginx` |
| 25  | `service` | Manage system services | `service ssh restart` |
| 26  | `systemctl` | Control systemd services | `systemctl status nginx` |
| 27  | `journalctl` | View system logs | `journalctl -u nginx` |
| 28  | `df` | Show disk usage | `df -h` |
| 29  | `du` | Show directory/file size | `du -sh *` |
| 30  | `free` | Show memory usage | `free -m` |
| 31  | `uptime` | Show system uptime | `uptime` |
| 32  | `uname` | Show system info | `uname -a` |
| 33  | `hostname` | Show/set hostname | `hostname` |
| 34  | `ping` | Check network connectivity | `ping google.com` |
| 35  | `curl` | Fetch data from URL | `curl http://example.com` |
| 36  | `wget` | Download files | `wget http://file.com/app.tar.gz` |
| 37  | `scp` | Secure copy between hosts | `scp file.txt user@host:/tmp/` |
| 38  | `rsync` | Sync files/directories | `rsync -avz src/ user@host:/backup/` |
| 39  | `ssh` | Remote login via SSH | `ssh user@host` |
| 40  | `ss` | Show network sockets | `ss -tuln` |
| 41  | `netstat` | Show network stats | `netstat -tulnp` |
| 42  | `ifconfig` | Show network interfaces | `ifconfig` |
| 43  | `ip` | Manage IP addresses | `ip addr show` |
| 44  | `traceroute` | Trace network hops | `traceroute google.com` |
| 45  | `nslookup` | DNS lookup | `nslookup example.com` |
| 46  | `dig` | Advanced DNS lookup | `dig example.com ANY` |
| 47  | `iptables` | Configure firewall rules | `iptables -L` |
| 48  | `ufw` | Simple firewall | `ufw allow 22` |
| 49  | `firewalld` | Manage firewall rules | `firewall-cmd --list-all` |
| 50  | `docker` | Manage Docker containers | `docker ps` |
| 51  | `docker-compose` | Manage multi-container apps | `docker-compose up` |
| 52  | `kubectl` | Manage Kubernetes cluster | `kubectl get pods` |
| 53  | `minikube` | Run Kubernetes locally | `minikube start` |
| 54  | `helm` | Kubernetes package manager | `helm install myapp chart/` |
| 55  | `git` | Version control system | `git clone repo.git` |
| 56  | `grep` | Search text in files | `grep "error" log.txt` |
| 57  | `egrep` | Extended grep | `egrep "error|fail" log.txt` |
| 58  | `fgrep` | Fixed string grep | `fgrep "error" log.txt` |
| 59  | `find` | Search for files | `find / -name "*.log"` |
| 60  | `locate` | Locate files quickly | `locate nginx.conf` |
| 61  | `which` | Show command location | `which python3` |
| 62  | `whereis` | Locate binary/source/docs | `whereis ls` |
| 63  | `alias` | Create command shortcut | `alias ll="ls -la"` |
| 64  | `unalias` | Remove alias | `unalias ll` |
| 65  | `history` | Show command history | `history` |
| 66  | `echo` | Print message | `echo "Hello DevOps"` |
| 67  | `env` | Show environment variables | `env` |
| 68  | `export` | Set environment variable | `export PATH=$PATH:/opt/bin` |
| 69  | `cron` | Schedule tasks | `crontab -e` |
| 70  | `at` | Run command at specific time | `echo "reboot" | at now + 5 min` |
| 71  | `uptime` | Show load averages | `uptime` |
| 72  | `lsof` | Show open files | `lsof -i :80` |
| 73  | `strace` | Trace system calls | `strace -p 1234` |
| 74  | `dmesg` | Show kernel logs | `dmesg | tail` |
| 75  | `mount` | Mount filesystem | `mount /dev/sdb1 /mnt` |
| 76  | `umount` | Unmount filesystem | `umount /mnt` |
| 77  | `blkid` | Show block device UUIDs | `blkid` |
| 78  | `fdisk` | Partition management | `fdisk -l` |
| 79  | `parted` | Manage partitions | `parted /dev/sda` |
| 80  | `mkfs` | Create filesystem | `mkfs.ext4 /dev/sdb1` |
| 81  | `tar` | Archive files | `tar -czf backup.tar.gz /data/` |
| 82  | `zip` | Compress files | `zip archive.zip file1 file2` |
| 83  | `unzip` | Extract zip files | `unzip archive.zip` |
| 84  | `gzip` | Compress with gzip | `gzip file.txt` |
| 85  | `gunzip` | Decompress gzip | `gunzip file.txt.gz` |
| 86  | `xz` | Compress with xz | `xz file.txt` |
| 87  | `unxz` | Decompress xz | `unxz file.txt.xz` |
| 88  | `bzip2` | Compress with bzip2 | `bzip2 file.txt` |
| 89  | `bunzip2` | Decompress bzip2 | `bunzip2 file.txt.bz2` |
| 90  | `screen` | Start terminal multiplexer | `screen -S session1` |
| 91  | `tmux` | Terminal multiplexer | `tmux new -s mysession` |
| 92  | `uptime` | Show system uptime | `uptime` |
| 93  | `time` | Measure command runtime | `time ls -l` |
| 94  | `yes` | Output repeated strings | `yes test` |
| 95  | `watch` | Run command repeatedly | `watch df -h` |
| 96  | `uptime` | Show uptime stats | `uptime` |
| 97  | `hostnamectl` | Show/set hostname | `hostnamectl set-hostname server1` |
| 98  | `reboot` | Reboot system | `reboot` |
| 99  | `shutdown` | Shutdown system | `shutdown -h now` |
| 100 | `exit` | Exit shell session | `exit` |



# 🐧 Top 100 Linux Commands for Backend & DevOps

| #   | Command       | One-liner                       | Usage Example                      |                  |
| --- | ------------- | ------------------------------- | ---------------------------------- | ---------------- |
| 1   | `pwd`         | Print current working directory | `pwd`                              |                  |
| 2   | `ls`          | List files in directory         | `ls -la`                           |                  |
| 3   | `cd`          | Change directory                | `cd /var/log`                      |                  |
| 4   | `touch`       | Create empty file               | `touch file.txt`                   |                  |
| 5   | `cat`         | View file content               | `cat file.txt`                     |                  |
| 6   | `less`        | View file (scrollable)          | `less /var/log/syslog`             |                  |
| 7   | `head`        | Show first lines of file        | `head -n 10 file.txt`              |                  |
| 8   | `tail`        | Show last lines of file         | `tail -f log.txt`                  |                  |
| 9   | `echo`        | Print text to screen            | `echo "Hello DevOps"`              |                  |
| 10  | `whoami`      | Show current user               | `whoami`                           |                  |
| 11  | `id`          | Display user/group info         | `id ubuntu`                        |                  |
| 12  | `hostname`    | Show system hostname            | `hostname -I`                      |                  |
| 13  | `uptime`      | Show system uptime              | `uptime`                           |                  |
| 14  | `date`        | Show current date/time          | `date "+%Y-%m-%d %H:%M:%S"`        |                  |
| 15  | `cal`         | Show calendar                   | `cal 2025`                         |                  |
| 16  | `clear`       | Clear terminal                  | `clear`                            |                  |
| 17  | `history`     | Show command history            | \`history                          | grep ssh\`       |
| 18  | `alias`       | Create command shortcut         | `alias ll='ls -la'`                |                  |
| 19  | `unalias`     | Remove alias                    | `unalias ll`                       |                  |
| 20  | `man`         | Show command manual             | `man grep`                         |                  |
| 21  | `which`       | Show command path               | `which python3`                    |                  |
| 22  | `whereis`     | Locate binaries, man files      | `whereis nginx`                    |                  |
| 23  | `whatis`      | Show short command info         | `whatis grep`                      |                  |
| 24  | `find`        | Search files in directory       | `find / -name file.txt`            |                  |
| 25  | `locate`      | Quickly find files              | `locate nginx.conf`                |                  |
| 26  | `grep`        | Search text in files            | `grep "error" log.txt`             |                  |
| 27  | `egrep`       | Extended grep search            | \`egrep "error                     | fail" log.txt\`  |
| 28  | `awk`         | Process text data               | `awk '{print $1}' file.txt`        |                  |
| 29  | `sed`         | Stream editor for text          | `sed 's/error/success/g' file.txt` |                  |
| 30  | `cut`         | Cut specific text fields        | `cut -d':' -f1 /etc/passwd`        |                  |
| 31  | `sort`        | Sort text                       | `sort users.txt`                   |                  |
| 32  | `uniq`        | Remove duplicates               | `uniq sorted.txt`                  |                  |
| 33  | `wc`          | Word/line/char count            | `wc -l file.txt`                   |                  |
| 34  | `diff`        | Compare files                   | `diff file1.txt file2.txt`         |                  |
| 35  | `cmp`         | Compare binary files            | `cmp file1.bin file2.bin`          |                  |
| 36  | `comm`        | Compare sorted files            | `comm file1 file2`                 |                  |
| 37  | `tee`         | Output to file + stdout         | \`echo "log"                       | tee log.txt\`    |
| 38  | `xargs`       | Build command from input        | \`cat urls.txt                     | xargs curl -O\`  |
| 39  | `tr`          | Translate/replace characters    | \`echo "abc"                       | tr 'a-z' 'A-Z'\` |
| 40  | `basename`    | Extract filename                | `basename /home/user/file.txt`     |                  |
| 41  | `dirname`     | Extract directory name          | `dirname /home/user/file.txt`      |                  |
| 42  | `file`        | Detect file type                | `file app.bin`                     |                  |
| 43  | `stat`        | Show file info                  | `stat file.txt`                    |                  |
| 44  | `du`          | Show disk usage                 | `du -sh /var/log`                  |                  |
| 45  | `df`          | Show free disk space            | `df -h`                            |                  |
| 46  | `mount`       | Mount storage device            | `mount /dev/sdb1 /mnt`             |                  |
| 47  | `umount`      | Unmount device                  | `umount /mnt`                      |                  |
| 48  | `lsblk`       | List block devices              | `lsblk`                            |                  |
| 49  | `blkid`       | Show block device UUIDs         | `blkid`                            |                  |
| 50  | `fdisk`       | Manage partitions               | `fdisk -l`                         |                  |
| 51  | `mkfs`        | Format partition                | `mkfs.ext4 /dev/sdb1`              |                  |
| 52  | `df`          | Check mounted FS space          | `df -h /home`                      |                  |
| 53  | `free`        | Show memory usage               | `free -m`                          |                  |
| 54  | `top`         | Show running processes          | `top`                              |                  |
| 55  | `htop`        | Interactive process monitor     | `htop`                             |                  |
| 56  | `ps`          | Show running processes          | \`ps aux                           | grep nginx\`     |
| 57  | `kill`        | Kill process by PID             | `kill -9 1234`                     |                  |
| 58  | `pkill`       | Kill process by name            | `pkill nginx`                      |                  |
| 59  | `jobs`        | Show background jobs            | `jobs`                             |                  |
| 60  | `fg`          | Bring job to foreground         | `fg %1`                            |                  |
| 61  | `bg`          | Resume job in background        | `bg %1`                            |                  |
| 62  | `systemctl`   | Manage systemd services         | `systemctl restart nginx`          |                  |
| 63  | `service`     | Manage services (older)         | `service apache2 status`           |                  |
| 64  | `journalctl`  | View system logs                | `journalctl -u nginx`              |                  |
| 65  | `dmesg`       | Kernel ring buffer logs         | \`dmesg                            | tail\`           |
| 66  | `uname`       | Show system info                | `uname -a`                         |                  |
| 67  | `lsb_release` | Show distro info                | `lsb_release -a`                   |                  |
| 68  | `arch`        | Show CPU architecture           | `arch`                             |                  |
| 69  | `lscpu`       | Show CPU details                | `lscpu`                            |                  |
| 70  | `vmstat`      | Show memory, CPU stats          | `vmstat 5`                         |                  |
| 71  | `iostat`      | Show disk IO stats              | `iostat -x 5`                      |                  |
| 72  | `netstat`     | Show network connections        | `netstat -tulnp`                   |                  |
| 73  | `ss`          | Show socket stats               | `ss -tulwn`                        |                  |
| 74  | `ping`        | Check connectivity              | `ping google.com`                  |                  |
| 75  | `traceroute`  | Trace network hops              | `traceroute google.com`            |                  |
| 76  | `curl`        | Transfer data from URL          | `curl -I https://google.com`       |                  |
| 77  | `wget`        | Download files                  | `wget http://file.com/file.zip`    |                  |
| 78  | `scp`         | Secure copy between hosts       | `scp file.txt user@server:/tmp`    |                  |
| 79  | `sftp`        | Secure file transfer            | `sftp user@server`                 |                  |
| 80  | `rsync`       | Sync files between hosts        | `rsync -av /src /dest`             |                  |
| 81  | `ssh`         | Remote login to server          | `ssh user@server`                  |                  |
| 82  | `ssh-keygen`  | Generate SSH keys               | `ssh-keygen -t rsa`                |                  |
| 83  | `ssh-copy-id` | Copy SSH key to server          | `ssh-copy-id user@server`          |                  |
| 84  | `iptables`    | Manage firewall rules           | `iptables -L -n`                   |                  |
| 85  | `ufw`         | Simple firewall config          | `ufw allow 22`                     |                  |
| 86  | `firewalld`   | FirewallD management            | `firewall-cmd --list-all`          |                  |
| 87  | `crontab`     | Manage scheduled jobs           | `crontab -e`                       |                  |
| 88  | `at`          | Schedule one-time task          | \`echo "echo Hello"                | at now +1 min\`  |
| 89  | `shutdown`    | Shutdown system                 | `shutdown -h now`                  |                  |
| 90  | `reboot`      | Reboot system                   | `reboot`                           |                  |
| 91  | `halt`        | Halt system                     | `halt`                             |                  |
| 92  | `init`        | Change runlevel                 | `init 0`                           |                  |
| 93  | `chmod`       | Change file permissions         | `chmod 755 script.sh`              |                  |
| 94  | `chown`       | Change file ownership           | `chown user:group file.txt`        |                  |
| 95  | `umask`       | Default file permissions        | `umask 022`                        |                  |
| 96  | `useradd`     | Add new user                    | `useradd devuser`                  |                  |
| 97  | `usermod`     | Modify user                     | `usermod -aG sudo devuser`         |                  |
| 98  | `passwd`      | Change user password            | `passwd devuser`                   |                  |
| 99  | `groupadd`    | Add new group                   | `groupadd devops`                  |                  |
| 100 | `groups`      | Show user groups                | `groups devuser`                   |                  |


imp concepts
- what is linux-os
- what is kernel
- what is virtualization 
    - hypervisors(XEN,WSL,Vmware)
- containerization vs virtualization
- ec2 

method to install linux 
    - set as only os
    - using virtualization
        - iso images 
    - using cloud 
        - ec2 

linux file system
    manages the directory organizations
    like if we 
        add user it aotometically add in /home/new-user
        install software it add in /etc/nginx

linux file hierarcy
    /
    ├── bin      # Essential user binaries (commands)
    ├── boot     # Boot loader files
    ├── dev      # Device files
    ├── etc      # System configuration files
    ├── home     # User home directories
    ├── lib      # Essential shared libraries
    ├── media    # Removable media (USB, CD)
    ├── mnt      # Temporary mount points
    ├── opt      # Optional application software packages
    ├── proc     # Kernel and process information (virtual)
    ├── root     # Home directory for root user
    ├── run      # Runtime variable data
    ├── sbin     # System binaries
    ├── srv      # Data for services provided by the system
    ├── tmp      # Temporary files
    ├── usr      # User programs and data
    ├── var      # Variable files (logs, spool, cache) 

linux commands 

sudo > super user do 

sudo -i

ls > list show
    ls 
    ls -l > detail of file 
    ls -a > hidden file 
.before name make file hidden  ls -la 

ll  > list long 
    ll > equilent to ls -la 
    ll -tch > sort by recent touch 

clear > clear the terminal 

pwd > present working directory

w > give detail of machine who logined cpu performance and more
who > list all user 
whoami > show your privilages

uptime > similar to w

last > system boot details 

nano file-name.extention > to edit the file for hte first time it also create it 
--> nano is the editor other are vim vi ...

cat file-name > show content of that file 

touch file > file-name.extention

networking

ip 
ping doaminname
nslookup doaminname
dig doaminname


public ip of machine 

curl ifconfig.me


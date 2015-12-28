#! /bin/sh
# /etc/init.d/radioapp.sh

### BEGIN INIT INFO
# Provides:            radioapp.sh
# Requires-Start:      $remote_fs $syslog
# Required-Stop:       $remote_fs $syslog
# Default-Start:       2 3 4 5 
# Default-Stop:        0 1 6
# Short-Description:   Starts Radioapp on boot
# Description:         This file is used to start nodejs application
#                      /home/pi/radioapp/index.js using default system
#                      node version in /usr/bin/nodejs on Linux raspberrypi 4.1
### END INIT INFO

# Carry out specific functions when asked to be the system
case "$1" in
   start)
    echo "Starting radiaoapp index.js"
    cd /home/pi/radioapp
    /usr/bin/nodejs /home/pi/radioapp/index.js >> /home/pi/radioapp/radioapp.log
   ;; 
   stop)
    echo "Stopping radioapp index.js"
    # do something smart here 
   ;;
 *)
   echo "Usage: /etc/init.d/radioapp {start|stop}"
   exit 1
   ;;
esac

exit 0

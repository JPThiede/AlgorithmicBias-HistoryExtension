import sys
import struct
import os
import msvcrt
import socket


msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
try:
    
    inp = sys.stdin.read(4)

    # if len(inp) == 0:
    #     sys.exit(0)

    text = sys.stdin.read()

    text = text.split(',')
    output = open(".\\testResults\\test.txt", 'w')
    for url in text:
        output.writelines(str(url + "\n"))
    # output.flush()
    # os.fsync(output.fileno())
    output.close()
    # message = "DONE"
    
    # sys.stdout.buffer.write(struct.pack('I', len(message)))
    # sys.stdout.write(message)
    # sys.stdout.flush()

    sys.exit(0)
        
except Exception as e:
    output = open(".\\testResults\\error.txt", 'w')
    output.write("ERROR: " + str(e))
    # output.flush()
    # os.fsync(output.fileno())
    output.close()

# try:

# except Exception as e:
  
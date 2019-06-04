import sys
import struct
import os
import msvcrt


msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
try:
    
    inp = sys.stdin.read(4)

    if len(inp) == 0:
        sys.exit(0)
        

    output = open(".\\testResults\\test.txt", 'w')
    output.write(inp)

    text = sys.stdin.read()

    text = text.split(',')
    output2 = open(".\\testResults\\test2.txt", 'w')
    for url in text:
        output2.writelines(str(url + "\n"))
        
        
except Exception as e:
    output = open(".\\testResults\\error.txt", 'w')
    output.write("ERROR: " + str(e))

# try:

# except Exception as e:
  
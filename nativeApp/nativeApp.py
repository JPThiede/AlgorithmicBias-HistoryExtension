import sys
import struct
import os
import msvcrt


msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)


output = open(".\\test.txt", 'w')

output.write("TEST")


# while True:
#     inp = sys.stdin.read(4)
#     output2 = open(".\\test2.txt", 'w')
#     output2.write(inp)
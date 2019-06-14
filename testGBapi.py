
import http.client
import sys
import json

# Take as input a path to a file with the API key given
inp = sys.argv[1]
inFile = open(inp, 'r')
key = inFile.read()
key = key.strip()

auth = 'Bearer %s' % key
print(auth)
ping = http.client.HTTPSConnection("api-testbed.giftbit.com")
ping.request('GET', '/papi/v1/ping', headers={'Authorization' : auth})

resp = ping.getresponse()
content = resp.read().decode('utf-8')

print(content)

brand = http.client.HTTPSConnection("api-testbed.giftbit.com")
brand.request('GET', '/papi/v1/brands/amazonus', headers={'Authorization' : auth})

resp = brand.getresponse()
content = resp.read().decode('utf-8')

print(content)

#IMPORTANT: The id has to be UNIQUE for each request
#When we move this to the server, we can set the id to something virtually impossible to be a duplicate like: <uid><timestamp>
bod = json.dumps({'brand_code' : 'amazonus', 'price_in_cents' : 1000, 'id' : 'Test5'})

print(bod)

gift = http.client.HTTPSConnection("api-testbed.giftbit.com")
gift.request('POST', '/papi/v1/embedded', bod, {'Authorization' : auth, 'Content-Type' : 'application/json'})


resp = gift.getresponse()
content = resp.read().decode('utf-8')
jsonObj = json.loads(content)

print(type(jsonObj))

print(jsonObj["gift_link"])



#amazonus = brand_code

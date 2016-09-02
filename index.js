var crypto = require('crypto')
var logger = require('winston')

var encryptedPrivateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKIRxHEN/1xPRCiRWGJwAikRZ4VAb5dOnE3JZASRq6j479cwaigBhlNmyYGea6EOeTq/6pHr6b8SeN+AuzLZtmP8KxCnvYK5ySgtwerzYe+x6jeXOZ5lEHq1+cw9+yBuIoMnRlv5SL4lMqgwNWek+KzaVM39f456xODgAT5VMe/BAgMBAAECgYB12SOV7c69Kepu8VlqovX/NOeornU2efQQYBv5co93XCTSviLDGnC5nqlyNmcfAu5GOR1xpDEhPmZkZzA4RrVnjuNUHO1eDI2plJg8rchys1YN9gYB2QCuPGQIb4CMkCB6/FXs+VpewrDYGHw39ritmryjfMT+UY+Z+Ecd3+smQQJBAORG05GyMkWMQCyjpPTDtqkAHNhTh8NvOxgi9BCQVUd8IPEzQx4OOyo7kSj4Rcp4Q+nfmQJ4WEO2kNSuvN+XfPkCQQC1wIrDVy1PrDI0pZzafFV/HVtKCEVRoiezRZfnk5v3LuZ2z/e1wIUBVqRRwxhqU5ss7FK/7GfB7Sz4sSG1rKMJAkAo4q6eF8Z9QmN0G1M+K5eZqVWBQWS9kjyJVClWliNQDGFyEfZhebcLF2QmbGFDpEq1psCm+psEdbx2+10ExwMxAkAZjY501EbckrskR7x7w0tJ6dix2ePVDFVEkR5AQrKE2CUywx5ygTSx8Xp8vE8sc8C3WipwLU6RJ0VRWaYBotnxAkEA0PCJyi/k48fZ0rzbLFDMUEDGU2ib2vOsWBm/Krcu3Xb8/0UPGcepIdGvOw8HovZnC35asHLljT5fdk+bn/yLUQ=='
	var a = 1470227500748
var input = ['345c59b3-705e-4073-b5a5-7ee6aec45402', 'https://marketplace.walmartapis.com/v2/orders/released?limit=10', 'GET', a].join('\n')


  var private_key_buffer = new Buffer(encryptedPrivateKey)
  var private_key = '-----BEGIN PRIVATE KEY-----\r\n' + private_key_buffer.toString() + '\r\n-----END PRIVATE KEY-----'
  var res

  try {
    var sign = crypto.createSign('RSA-SHA256')
    sign.write(input)
    sign.end()
    logger.info('walmartUtil, signRequest, private_key : ' + private_key)
    var signature = sign.sign(private_key, 'base64')
    logger.info('walmartUtil, signRequest, signature : ' + signature)
    res = signature

  } catch(e) {
    logger.info('walmartUtil, signRequest, exception while generating signature : ' + e.code  + ', ' + e.message)
    logger.info('walmartUtil, signRequest, exception while generating signature, switching to key generation for windows ')

    //private_key = getKeyForWindows(private_key_buffer)
	key = private_key_buffer
	var a = key.slice(0,64)
	  for(var i=64; i <=784 ; i+=64){
		a = a + '\n' + key.slice(i, i+64)
	  }
	  a = a + '\n' + key.slice(832)
  private_key =  '-----BEGIN EC PRIVATE KEY-----\r\n' + a.toString() + '\r\n-----END EC PRIVATE KEY-----'
    var signWin = crypto.createSign('RSA-SHA256')
    signWin.write(input)
    signWin.end()
	logger.info('walmartUtil, signRequest, private_key from getKeyForWindows : ' + private_key)
    var signatureWin = signWin.sign(private_key, 'base64')
    logger.info('walmartUtil, signRequest, signatureWin : ' + signatureWin)
    res = signatureWin
  }

  logger.info('res', res)

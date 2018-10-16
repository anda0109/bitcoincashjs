const bch = require('./bitcoincash-min.js');
const bchaddr = require('./bchaddrjs.js');

/***************************************************************************
*功能：签名原生交易
*参数：
	utxos:未花费的交易，json字符串
	output:转账地址及金额，json字符串
	change_address:找零地址，字符串
	private_key:私钥，字符串
	rate:整数类型 费率 单位satoshi/byte，默认20
*返回：原生交易十六进制
*****************************************************************************/
function signBchTransaction(utxos, output, change_address, private_key, rate)
{
	var utxos = JSON.parse(utxos);
	
	//将bch新地址全部转化为遗留地址
	for ( var i = 0; i <utxos.length; i++)
	{
		utxos[i].address = bchaddr.toLegacyAddress(utxos[i].address)
	}
	var output = JSON.parse(output);
	for ( var i = 0; i <output.length; i++)
	{
		output[i].address = bchaddr.toLegacyAddress(output[i].address)
		console.log('output address:' + output[i].address)
	}	
	
	change_address = bchaddr.toLegacyAddress(change_address)
	console.log('change_address:' + change_address)
	
	//计算交易费
	var s = 148 *(utxos.length)  + 34 * (output.length+1) + 10;
	var fee = rate*s;	
	console.log('fee:' + fee);
	
	//构造和签名交易
	const privateKey = new bch.PrivateKey(private_key)//私钥
	const transaction = new bch.Transaction()
	  .from(utxos) 			  //输入
	  .to(output[0].address, output[0].amount) //输出
	  .fee(fee)			      //矿工费
	  .change(change_address) //找零地址
	  .sign(privateKey);      //签名私钥

	console.log(transaction.toString())
	return transaction.toString();
}


//////////////////////////////////////////////////////////////////////
//调用示例
const utxo = '[{\
	"txId" : "c21676d59caa4cc3532c8edee4678d2c34785c98383b08a54c87863913bf9c2b",\
	"outputIndex" : 1,\
	"address" : "bchtest:qqgpyajjf5rhudpwcuz2gw3jvqumxk7hcykw8qc938",\
	"script" : "76a914101276524d077e342ec704a43a326039b35bd7c188ac",\
	"satoshis" : 49979500\
}]';
const output = '[{"address" : "bchtest:qq7ddemh4slq9kffy8zz9zvlm4r2z2j0mq7mcxjges","amount" : 15000}]'//输出
const change_address = 'bchtest:qqgpyajjf5rhudpwcuz2gw3jvqumxk7hcykw8qc938'		//找零地址
const privateKeyWif = 'KzNzUk9WWnq15sp5HYhapRohohkWy6coqRPGvLsyfQLBA2jhByqG'    //私钥wif

signBchTransaction(utxo, output, change_address, privateKeyWif, 20)





import { Address6 } from 'ip-address'

export default function convertToIpv4(ip: string = '255:255:255:255') {
	let ipv6
	let ipv4

	try {
		ipv6 = new Address6(ip)
	} catch (err) {
		ipv6 = Address6.fromAddress4(ip)
	}

	if (ipv6.isLoopback()) {
		ipv4 = '127.0.0.1'
	} else {
		ipv4 = ipv6.to4().correctForm()
	}
	return ipv4
}

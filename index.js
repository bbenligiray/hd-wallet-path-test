const ethersv5 = require('ethersv5');

const airnodeMnemonic = 'early vocal solid danger obscure dance pear kiss eight worry slow wool';
const sponsorAddress = ethersv5.utils.getAddress(ethersv5.utils.hexlify(ethersv5.utils.randomBytes(20)));
const protocolId = '5';
const rootPath = "m/44'/60'/0'";

console.log('Using ethers v5');

function deriveWalletPathFromSponsorAddressV5(sponsorAddress, protocolId) {
    const sponsorAddressBN = ethersv5.BigNumber.from(sponsorAddress);
    const paths = [];
    for (let i = 0; i < 6; i++) {
        const shiftedSponsorAddressBN = sponsorAddressBN.shr(31 * i);
        paths.push(shiftedSponsorAddressBN.mask(31).toString());
    }
    return `${protocolId}/${paths.join('/')}`;
}

const xpubV5 = ethersv5.utils.HDNode.fromMnemonic(airnodeMnemonic).derivePath(rootPath).neuter().extendedKey;
console.log(`xpub: ${xpubV5}`);
const derivationPathV5 = deriveWalletPathFromSponsorAddressV5(sponsorAddress, protocolId);
const sponsorWalletAddressV5 = ethersv5.utils.HDNode.fromExtendedKey(xpubV5).derivePath(`${derivationPathV5}`).address;
console.log(`Sponsor wallet address derived from xpub: ${sponsorWalletAddressV5}`);
const sponsorWalletV5 = ethersv5.Wallet.fromMnemonic(airnodeMnemonic, `${rootPath}/${derivationPathV5}`);
console.log(`Sponsor wallet address derived from mnemonic: ${sponsorWalletV5.address}`);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log('Using ethers v6');

const ethersv6 = require('ethersv6');

const BIT_MASK_FOR_LEAST_SIGNIFICANT_31_BITS = BigInt(2 ** 31 - 1);

function deriveWalletPathFromSponsorAddressV6(sponsorAddress, protocolId) {
    const sponsorAddressBN = BigInt(sponsorAddress);
    const paths = [];
    for (let i = 0; i < 6; i++) {
        const shiftedSponsorAddressBN = sponsorAddressBN >> BigInt(31 * i);
        paths.push((shiftedSponsorAddressBN & BIT_MASK_FOR_LEAST_SIGNIFICANT_31_BITS).toString());
    }
    return `${protocolId}/${paths.join('/')}`;
}

// Note the undefined password
// Note that we don't derive the root path as a separate step because this behavior has changed (https://github.com/ethers-io/ethers.js/issues/4551)
const xpubV6 = ethersv6.HDNodeWallet.fromPhrase(airnodeMnemonic, undefined, rootPath).neuter().extendedKey;
console.log(`xpub: ${xpubV6}`);
const derivationPathV6 = deriveWalletPathFromSponsorAddressV6(sponsorAddress, protocolId);
const sponsorWalletAddressV6 = ethersv6.HDNodeWallet.fromExtendedKey(xpubV6).derivePath(derivationPathV6).address;
console.log(`Sponsor wallet address derived from xpub: ${sponsorWalletAddressV6}`);
// Note the undefined password
const sponsorWalletV6 = ethersv6.HDNodeWallet.fromPhrase(airnodeMnemonic, undefined, `${rootPath}/${derivationPathV6}`);
console.log(`Sponsor wallet address derived from mnemonic: ${sponsorWalletV6.address}`);

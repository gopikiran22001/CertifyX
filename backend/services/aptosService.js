const { Aptos, AptosConfig, Network, Ed25519PrivateKey, Account } = require('@aptos-labs/ts-sdk');

class AptosService {
  constructor() {
    this.config = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(this.config);
    this.moduleAddress = process.env.MODULE_ADDRESS;
    this.adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    this.adminAccount = null;
    this.initializeAdmin();
  }

  initializeAdmin() {
    if (this.adminPrivateKey) {
      const privateKey = new Ed25519PrivateKey(this.adminPrivateKey);
      this.adminAccount = Account.fromPrivateKey({ privateKey });
    }
  }

  async issueCertificate(learnerAddress, learnerName, qualification, institution) {
    if (!this.adminAccount) throw new Error('Admin account not initialized');

    const transaction = await this.aptos.transaction.build.simple({
      sender: this.adminAccount.accountAddress,
      data: {
        function: `${this.moduleAddress}::certificate::issue_certificate`,
        functionArguments: [learnerAddress, learnerName, qualification, institution],
      },
    });

    const committedTxn = await this.aptos.signAndSubmitTransaction({
      signer: this.adminAccount,
      transaction,
    });

    return await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
  }

  async verifyCertificate(adminAddress, certificateId) {
    const result = await this.aptos.view({
      payload: {
        function: `${this.moduleAddress}::certificate::verify_certificate`,
        functionArguments: [adminAddress, certificateId],
      },
    });
    return result;
  }

  async getLearnerCertificates(adminAddress, learnerAddress) {
    const result = await this.aptos.view({
      payload: {
        function: `${this.moduleAddress}::certificate::get_learner_certificates`,
        functionArguments: [adminAddress, learnerAddress],
      },
    });
    return result[0] || [];
  }

  async getAccountBalance(address) {
    const resources = await this.aptos.getAccountResources({ accountAddress: address });
    const coinResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
    return coinResource ? parseInt(coinResource.data.coin.value) : 0;
  }
}

module.exports = new AptosService();
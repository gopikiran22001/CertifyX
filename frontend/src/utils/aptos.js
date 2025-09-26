import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const MODULE_ADDRESS = "0x99f9ffaaa037851fa145a6eea15bd4572019848daa7559b3a47f0e409ca2866a";

export const issueCertificate = async (adminAccount, learnerAddress, learnerName, qualification, institution) => {
  const transaction = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${MODULE_ADDRESS}::certificate::issue_certificate`,
      functionArguments: [learnerAddress, learnerName, qualification, institution],
    },
  });

  const committedTxn = await aptos.signAndSubmitTransaction({
    signer: adminAccount,
    transaction,
  });

  return await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
};

export const verifyCertificate = async (adminAddress, certificateId) => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::certificate::verify_certificate`,
        functionArguments: [adminAddress, certificateId],
      },
    });
    return result;
  } catch (error) {
    console.error("Verification failed:", error);
    return [false, "", "", "", 0];
  }
};

export const getLearnerCertificates = async (adminAddress, learnerAddress) => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::certificate::get_learner_certificates`,
        functionArguments: [adminAddress, learnerAddress],
      },
    });
    return result[0] || [];
  } catch (error) {
    console.error("Failed to get certificates:", error);
    return [];
  }
};
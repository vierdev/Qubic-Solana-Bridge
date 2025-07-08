// backend/relayer.js

export const confirmQubicTx = async (txHash) => {
  const url = `https://rpc.qubic.org/v2/transactions/${txHash}`;
  console.log("url:", url);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await sleep(10000);
    const res = await fetch(url);
    if (!res) {
      console.error(`Qubic RPC error: ${res.status}`);
      return false;
    }

    const data = await res.json();

    console.log("data:", data);
    // Basic structural validation
    if (!data.transaction || !data.transaction.txId) {
      console.warn("Transaction not found or incomplete");
      return false;
    }

    const tx = data.transaction;

    // Bridge Contract Address
    const expectedDestId =
      "MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWLWD";
    if (tx.destId !== expectedDestId) {
      console.warn("Unexpected destination ID");
      return false;
    }

    return true; // Valid
  } catch (err) {
    console.error("Failed to confirm Qubic transaction:", err);
    return false;
  }
};

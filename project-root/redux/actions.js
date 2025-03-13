import { ethers } from 'ethers';

/* -------------------------------------------
   Action Types
-------------------------------------------- */
// Signer action types
export const SET_SIGNER_CONNECTION = "SET_SIGNER_CONNECTION";
export const SET_SIGNER_INSTANCE = "SET_SIGNER_INSTANCE";
export const SET_SIGNER_CHAIN_ID = "SET_SIGNER_CHAIN_ID";

// Wallet action types
export const SET_WALLET_CONNECTION = "SET_WALLET_CONNECTION";
export const SET_WALLET_ADDRESS = "SET_WALLET_ADDRESS";
export const SET_CHAIN_ID = "SET_CHAIN_ID";

/* -------------------------------------------
   Signer Action Creators
-------------------------------------------- */
export const setSignerConnection = (isConnected) => ({
  type: SET_SIGNER_CONNECTION,
  payload: isConnected
});

export const setSignerInstance = (signer) => ({
  type: SET_SIGNER_INSTANCE,
  payload: signer
});

export const setSignerChainId = (chainId) => ({
  type: SET_SIGNER_CHAIN_ID,
  payload: chainId
});

/* -------------------------------------------
   Wallet Action Creators
-------------------------------------------- */
export const setWalletConnection = (isConnected) => ({
  type: SET_WALLET_CONNECTION,
  payload: isConnected
});

export const setWalletAddress = (address) => ({
  type: SET_WALLET_ADDRESS,
  payload: address
});

export const setChainId = (chainId) => ({
  type: SET_CHAIN_ID,
  payload: chainId
});

/* -------------------------------------------
   Thunk Action Creators
-------------------------------------------- */
/**
 * Connects to the user's wallet using window.ethereum.
 * Ensures the user is connected to the Avalanche Fuji Testnet (chainId 43113).
 * If the chain is not present, it attempts to add it to the wallet.
 * Updates both the wallet and signer parts of the Redux state.
 */
export const connectWalletAction = () => async (dispatch) => {
  if (!window.ethereum) {
    console.error('No Ethereum provider found');
    return;
  }

  try {
    // Create an ethers provider and request account access
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    let network = await provider.getNetwork();

    console.log(`Current network chainId: ${network.chainId}`);

    // Check if network is Avalanche Fuji Testnet (chainId 43113)
    if (network.chainId !== 43113) {
      console.log("Not on Fuji, attempting to switch networks...");

      try {
        // Attempt to switch to Avalanche Fuji
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(43113) }],
        });
        console.log("Switch request sent; re-fetching network...");

        // After switching, re-fetch network details
        network = await provider.getNetwork();
        console.log(`After switch, network chainId: ${network.chainId}`);

        if (network.chainId !== 43113) {
          throw new Error("Failed to switch to Avalanche Fuji Testnet");
        }
      } catch (switchError) {
        console.error("Switch error details:", switchError);

        // If error code indicates the chain hasn't been added, add it.
        if (switchError.code === 4902) {
          console.log("Chain not found in wallet; attempting to add Fuji...");
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: ethers.utils.hexValue(43113), // "0xa869"
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: {
                  name: "Avalanche",
                  symbol: "AVAX",
                  decimals: 18,
                },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                blockExplorerUrls: ["https://testnet.snowtrace.io/"],
              }],
            });
            console.log("Successfully added Fuji; now switching...");

            // After adding, try switching again
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(43113) }],
            });
            network = await provider.getNetwork();
            console.log(`After adding & switching, network chainId: ${network.chainId}`);

            if (network.chainId !== 43113) {
              throw new Error("Failed to switch to Avalanche Fuji Testnet");
            }
          } catch (addError) {
            console.error("Failed to add Avalanche Fuji Testnet:", addError);
            throw new Error("Please add Avalanche Fuji Testnet to your wallet");
          }
        } else if (switchError.code === 4001) {
          // The user rejected the request
          console.error("User rejected the chain switch request.");
          throw new Error("User rejected request to switch networks.");
        }  else if (switchError.code === -32002) {
          // Already pending request
          console.error("A chain switch request is already pending in MetaMask.");
          // You can show a UI message to the user to check MetaMask
          throw new Error("Please open MetaMask and complete the pending request.");
        } else {
          console.error("Failed to switch network:", switchError);
          throw new Error("Please switch to the Avalanche Fuji Testnet");
        }
      }
    } else {
      console.log("Already on Avalanche Fuji Testnet.");
    }

    // Re-confirm final network
    network = await provider.getNetwork();
    if (network.chainId !== 43113) {
      throw new Error("Not on Avalanche Fuji even after attempting switch.");
    }

    // Update wallet state in Redux
    dispatch(setWalletConnection(true));
    dispatch(setWalletAddress(address));
    dispatch(setChainId(network.chainId));

    // Update signer state in Redux
    dispatch(setSignerInstance(signer));
    dispatch(setSignerConnection(true));
    dispatch(setSignerChainId(network.chainId));

    console.log("Wallet successfully connected on Avalanche Fuji Testnet.");
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
};

/**
 * Disconnects the wallet by clearing both wallet and signer state.
 */
export const disconnectWalletAction = () => (dispatch) => {
  // Clear wallet state
  dispatch(setWalletConnection(false));
  dispatch(setWalletAddress(''));
  dispatch(setChainId(null));

  // Clear signer state using the disconnectSignerAction
  dispatch(disconnectSignerAction());
};

/**
 * Disconnects the signer by clearing its state.
 */
export const disconnectSignerAction = () => (dispatch) => {
  dispatch(setSignerInstance(null));
  dispatch(setSignerConnection(false));
  dispatch(setSignerChainId(null));
};

/**
 * Updates the signer chain ID.
 */
export const updateSignerChainIdAction = (chainId) => (dispatch) => {
  dispatch(setSignerChainId(chainId));
};
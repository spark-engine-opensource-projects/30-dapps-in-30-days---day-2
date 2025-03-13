export const getWalletState = state => state.wallet;
          export const getSignerState = state => state.signer;

          // Individual wallet selectors
          export const getIsWalletConnected = state => state.wallet.isConnected;
          export const getWalletAddress = state => state.wallet.address;
          export const getWalletChainId = state => state.wallet.chainId;

          // Individual signer selectors
          export const getIsSignerConnected = state => state.signer.isConnected;
          export const getSignerInstance = state => state.signer.signer;
          export const getSignerChainId = state => state.signer.chainId;

          // Combined selectors
          export const getFullState = state => ({
            wallet: getWalletState(state),
            signer: getSignerState(state)
          });
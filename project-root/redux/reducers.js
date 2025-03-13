
          import { combineReducers } from 'redux';

          // Wallet Reducer
          const walletInitialState = {
            isConnected: false,
            address: '',
            chainId: null
          };

          const walletReducer = (state = walletInitialState, action) => {
            switch (action.type) {
              case 'SET_WALLET_CONNECTION':
                return {
                  ...state,
                  isConnected: action.payload
                };
              case 'SET_WALLET_ADDRESS':
                return {
                  ...state,
                  address: action.payload
                };
              case 'SET_CHAIN_ID':
                return {
                  ...state,
                  chainId: action.payload
                };
              default:
                return state;
            }
          };

          // Signer Reducer
          const signerInitialState = {
            isConnected: false,
            signer: null,
            chainId: null
          };

          const signerReducer = (state = signerInitialState, action) => {
            switch (action.type) {
              case 'SET_SIGNER_CONNECTION':
                return {
                  ...state,
                  isConnected: action.payload
                };
              case 'SET_SIGNER_INSTANCE':
                return {
                  ...state,
                  signer: action.payload
                };
              case 'SET_SIGNER_CHAIN_ID':
                return {
                  ...state,
                  chainId: action.payload
                };
              default:
                return state;
            }
          };

          // Combine reducers
          const rootReducer = combineReducers({
            wallet: walletReducer,
            signer: signerReducer
          });

          export default rootReducer;
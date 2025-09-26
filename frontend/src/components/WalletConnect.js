import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WalletConnect = ({ onWalletChange }) => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.aptos) {
      try {
        const account = await window.aptos.account();
        setWallet(account);
        onWalletChange(account);
      } catch (error) {
        console.log('No wallet connected');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.aptos) {
      alert('Please install Petra Wallet');
      return;
    }

    setIsConnecting(true);
    try {
      const account = await window.aptos.connect();
      setWallet(account);
      onWalletChange(account);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.aptos.disconnect();
      setWallet(null);
      onWalletChange(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {wallet ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {t('common.disconnect')}
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isConnecting ? t('common.loading') : t('common.connect')}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
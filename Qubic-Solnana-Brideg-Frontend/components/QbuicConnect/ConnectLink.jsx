import React from 'react';
import ConnectModal from './ConnectModal';
import { useQubicConnect } from '@/contexts/QubicContext/QubicConnectContext';
import { useHM25 } from '@/contexts/QubicContext/HM25Context';
import { truncateMiddle } from '@/utils/index';
import { Button } from '@heroui/button';
import { formatQubicAmount } from '@/utils/index';

const ConnectLink = () => {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { balance, fetchBalance, walletPublicIdentity } = useHM25();

  const handleBalanceClick = async (e) => {
    e.stopPropagation();
    if (walletPublicIdentity) {
      await fetchBalance(walletPublicIdentity);
    }
  };

  return (
    <>
      <Button
        className='flex gap-2 items-center wallet-adapter-button-trigger rounded-[4px] h-[48px]'
        onClick={() => toggleConnectModal()}
      >
        {connected ? (
          <>
            {/* Desktop View */}
            <div className='hidden md:block'>
              <div className='flex items-center gap-2 text-white'>
                <img src='/QubicAssets/metamask.svg' alt='Lock icon' className='w-5 h-5' />
                <span className='font-space text-[16px]'>
                  {truncateMiddle(walletPublicIdentity, 50)}
                </span>
              </div>
              {/* {balance != null && (
                <div
                  className='text-white mt-1 text-sm cursor-pointer'
                  onClick={handleBalanceClick}
                  title='Click to refresh balance'
                >
                  Balance: {formatQubicAmount(balance)} QUBIC
                </div>
              )} */}
            </div>

            {/* Mobile View */}
            <div className='md:hidden'>
              <img src='/QubicAssets/lock.svg' alt='locked' />
            </div>
          </>
        ) : (
          <>
            {/* Desktop View */}
            <span className='hidden md:block font-space text-[16px] text-white'>
              Select Qubic Wallet
            </span>

            {/* Mobile View
            <img src='/QubicAssets/unlocked.svg' alt='unlocked' /> */}
          </>
        )}
      </Button>

      <ConnectModal open={showConnectModal} onClose={() => toggleConnectModal()} />
    </>
  );
};

export default ConnectLink;

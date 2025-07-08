import React, { FC } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { FaArrowDown } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';

import { useHM25 } from '@/contexts/QubicContext/HM25Context';
import { Token } from '@/types';

const backendUrl = process.env.backend || 'https://aa2e6d270cec.ngrok-free.app'

interface ConfirmSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: Token;
  toToken: Token;
  fromTokenAmount?: number;
  toTokenAmount?: number;
}

interface LockPayload {
  tick: number;
  qubicTxHash: string;
  amount: number;
  solanaAddress: string;
}

export const ConfirmSwapModal: FC<ConfirmSwapModalProps> = ({
  isOpen,
  onClose,
  fromToken,
  toToken,
  fromTokenAmount = 0,
  toTokenAmount = 0,
}) => {
  const { echo } = useHM25();
  const { publicKey } = useWallet();

  const notifyLock = async ({ tick, qubicTxHash, amount, solanaAddress }: LockPayload) => {
    try {
      const res = await fetch(`${backendUrl}/api/lock-and-mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tick,
          qubicTxHash,
          amount,
          solanaAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Server error');

      toast.custom((t) => (
        <div className="bg-slate-800 text-white px-4 py-3 rounded shadow-lg flex justify-between items-center gap-3">
          <div>
            ✅ Minted!{' '}
            <a
              href={`https://explorer.solana.com/tx/${data.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              View Transaction
            </a>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-white bg-red-600 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      ));

      console.log('Notify success:', data);

      return data;
    } catch (err) {
      toast.error("Sever Error")
      console.error('Notify failed:', err);
    }
  };

  const handleClick = async () => {
    try {
      const response = await echo(fromTokenAmount);

      await notifyLock({
        tick: response.tick,
        qubicTxHash: response.txResult.transactionId,
        amount: fromTokenAmount,
        solanaAddress: publicKey?.toBase58() ?? '',
      });
      console.log('Lock response:', response);
    } catch (error) {
      console.error('Error during lock operation:', error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Confirm Swap</ModalHeader>
            <ModalBody>
              <div className="flex w-full items-center justify-between my-2 bg-[#212429] p-4 rounded-lg">
                <p>{fromToken.symbol}</p>
                <p>{fromTokenAmount.toString()}</p>
              </div>
              <div className="flex items-center justify-center my-2">
                <FaArrowDown />
              </div>
              <div className="flex w-full items-center justify-between my-2 bg-[#212429] p-4 rounded-lg">
                <p>{toToken.symbol}</p>
                <p>{toTokenAmount.toString()}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex w-full gap-2">
                <button className="w-full bg-emerald-400 rounded-md h-[40px]" onClick={handleClick}>
                  Confirm
                </button>
                <button className="w-full bg-gray-600 rounded-md h-[40px]" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

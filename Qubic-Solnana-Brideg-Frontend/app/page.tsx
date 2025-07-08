'use client';

import React, { useEffect } from 'react';
import { Card, CardBody, CardFooter, Button, Divider } from '@heroui/react';

import { InputCard } from '@/components/InputCard';
import { ConfirmSwapModal } from '@/components/Dialog/SwapDialog';
import { Token } from '@/types';

export default function Home() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fromTokenAmount, setFromTokenAmount] = React.useState('');
  const [toTokenAmount, setToTokenAmount] = React.useState('');

  useEffect(() => {
    setToTokenAmount(fromTokenAmount);
  }, [fromTokenAmount]);

  useEffect(() => {
    setFromTokenAmount(toTokenAmount);
  }, [toTokenAmount]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="w-[400px]">
        <CardBody>
          <InputCard
            chain="Qubic"
            fromTo={true}
            value={fromTokenAmount}
            onChange={(e) => setFromTokenAmount(e.target.value)}
          />
          <Divider className="my-4" />
          <InputCard
            chain="Solana"
            fromTo={false}
            value={toTokenAmount}
            onChange={(e) => setToTokenAmount(e.target.value)}
          />
        </CardBody>
        <CardFooter className="flex px-5">
          <Button
            className="h-[40px] w-full rounded-md bg-emerald-400 text-[20px] text-white"
            onClick={() => setIsOpen(true)}
          >
            Swap
          </Button>
        </CardFooter>
        <ConfirmSwapModal
          fromToken={{ symbol: 'Qubic', address: '' } as Token}
          fromTokenAmount={fromTokenAmount ? parseFloat(fromTokenAmount) : 0}
          isOpen={isOpen}
          toToken={{ symbol: 'wQubic', address: '' } as Token}
          toTokenAmount={toTokenAmount ? parseFloat(toTokenAmount) : 0}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </Card>
    </section>
  );
}

'use client';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Input } from '@heroui/react';

interface InputCardProps {
  fromTo: boolean;
  chain: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputCard = (props: InputCardProps) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex flex-row gap-3 items-center">
        <div className="flex gap-2">
          <p className="text-md">{props.fromTo ? 'From' : 'To'}</p>
          <p className="text-md">{props.chain}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Input
          className="w-full"
          label={props.fromTo ? 'Qubic ' : 'wQubic'}
          labelPlacement="outside-left"
          placeholder="0.00"
          size="lg"
          type="number"
          value={props.value}
          onChange={props.onChange}
        />
      </CardBody>
    </Card>
  );
};

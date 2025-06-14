import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type SummaryCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
};

const SummaryCard = (props: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className='flex items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{props.title}</CardTitle>
        {props.icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{props.value}</div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

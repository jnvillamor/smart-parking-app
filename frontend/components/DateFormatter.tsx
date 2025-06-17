'use client';

import { useEffect, useState } from 'react';

interface FormattedDateProps {
  isoDate: string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

const FormattedDate = ({
  isoDate,
  locale = navigator.language,
  options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
}: FormattedDateProps) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const localDate = new Date(isoDate);
    if (!isNaN(localDate.getTime())) {
      setFormattedDate(localDate.toLocaleString(locale, options));
    } else {
      setFormattedDate('Invalid date');
    }
  }, [isoDate, locale, options]);

  return <>{formattedDate}</>;
};

export default FormattedDate;

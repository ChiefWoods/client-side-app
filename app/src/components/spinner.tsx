import { LoaderCircle } from 'lucide-react';

export default function Spinner() {
  return (
    <LoaderCircle className="aspect-square h-[25%] w-[25%] animate-spin text-primary opacity-25" />
  );
}

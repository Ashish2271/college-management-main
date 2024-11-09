import { TriangleAlert } from 'lucide-react';

interface Props {
  errorMessage?: string;
}

export default function FormErrorComponent({ errorMessage }: Props) {

  if(!errorMessage){
    return;
  }

  return <div className="bg-destructive/15 text-destructive w-full py-3 px-6 rounded-xl flex gap-2 items-center font-medium "> <TriangleAlert /> <p>{errorMessage}</p></div>;
}

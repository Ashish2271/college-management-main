import { CheckCheck } from 'lucide-react';


interface Props {
  successMessage?: string;
}
export default function FormSuccessComponent({successMessage}:Props){

  if(!successMessage){
    return;
  }

  return <div className="bg-emerald-500/15 text-emerald-500 w-full py-3 px-6 rounded-xl flex gap-2 items-center font-medium "> <CheckCheck /> <p>{successMessage}</p></div>;
}
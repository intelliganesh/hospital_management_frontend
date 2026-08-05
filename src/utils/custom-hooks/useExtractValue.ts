import { useSelector } from 'react-redux';
import { RootState } from '@/actions/store'; // adjust path as needed

const useExtractValue = (slice: any, dataFrom: any) => {
  return useSelector((state: RootState | any) => state[slice][dataFrom]);
};

export default useExtractValue;

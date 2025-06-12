import AddDeviceModal from '../popUps/AddDevicePopUp';

export default function AddDeviceModalWrapper({ brand }: { brand: string }) {
  return <AddDeviceModal brand={brand} />;
}

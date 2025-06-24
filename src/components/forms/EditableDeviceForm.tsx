'use client';

import {
  updateDevice,
  updatePart,
  updateVariant,
  addPart,
} from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/actions';


export default function EditableDeviceForm({ device }: { device: any }) {
  return (
    <>
      <form action={updateDevice} className="content-box flex flex-col gap-2 p-4">
        <input type="hidden" name="id" value={device.id} />

        <label>
          Brand:
          <input name="brand" defaultValue={device.brand} />
        </label>

        <label>
          Model:
          <input name="model" defaultValue={device.model} />
        </label>

        <label>
          Version:
          <input name="version" defaultValue={device.version} />
        </label>

        <label>
          Type:
          <input name="type" defaultValue={device.type} />
        </label>

        <label>
          Release Date:
          <input
            type="date"
            name="releaseDate"
            defaultValue={device.releaseDate.split('T')[0]}
          />
        </label>

        <button type="submit" className="btn">💾 Save Device</button>
      </form>

      {/* ✅ Separate image upload form (not nested) */}
      <form
        action="/api/device/uploadImage"
        method="POST"
        encType="multipart/form-data"
        className="content-box flex items-center gap-2 p-4 mt-2"
      >
        <input type="hidden" name="deviceId" value={device.id} />
        <input type="file" name="image" accept="image/*" />
        <button type="submit">Upload Image</button>
      </form>
    </>
  );
}

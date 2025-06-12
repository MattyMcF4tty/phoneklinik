'use server';

type BrandFormState =
  | {
      success: true;
      brand: {
        name: string;
        imageUrl: string;
      };
      error?: undefined;
    }
  | {
      success: false;
      error: string;
      brand?: undefined;
    };

export async function createBrandAction(
  prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const brandName = formData.get('brandName') as string;
  const brandImage = formData.get('brandImage') as File;

  if (!brandName || !brandImage) {
    return { success: false, error: 'Missing brandName or brandImage' };
  }

  const buffer = Buffer.from(await brandImage.arrayBuffer());

  try {
    const res = await fetch('/api/brand', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Brand creation failed:', result);
      return { success: false, error: result.message || 'Ukendt fejl.' };
    }

    return { success: true, brand: result.brand };
  } catch (error: any) {
    console.error('Fetch failed:', error);
    return { success: false, error: error.message || 'Uventet fejl.' };
  }
}

import RepairBooking from '@/schemas/new/repairBooking';
import { createClient } from '../supabase/serverClient';
import { deserializeFromDbFormat, serializeToDbFormat } from '@/utils/dbFormat';
import { ErrorSupabase } from '@/schemas/errors/appErrorTypes';

// Config
const repairBookingTable = 'repair_bookings';

export default class RepairBookingClient {
  static async getAvailableSlots(date: Date): Promise<string[]> {
    const supabase = await createClient();

    const { data: slotData, error } = await supabase.rpc(
      'get_available_repair_slots',
      {
        p_date: date.toISOString(),
      }
    );

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af ledige tider.',
        `Supabase error when trying to get available repair booking time slots: ${error.message}`
      );
    }

    if (!slotData) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af ledige tider.',
        `Supabase returned with null when trying to get available repair booking time slots.`
      );
    }

    return slotData;
  }

  static async bookRepair(
    newBooking: Pick<
      RepairBooking,
      'name' | 'email' | 'customerNotes' | 'reportedBrokenParts' | 'bookingDate'
    >
  ) {
    const supabase = await createClient();

    const serializedBooking = serializeToDbFormat(newBooking);

    const { data: bookingData, error } = await supabase
      .from(repairBookingTable)
      .insert(serializedBooking)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under bookning af reparation.',
        `Supabase error when trying to book repair: ${error.message}`
      );
    }

    if (!bookingData) {
      throw new ErrorSupabase(
        'Noget gik galt under bookning af reparation.',
        `Supabase returned with null when trying to book repair`
      );
    }

    const deserializedBooking =
      deserializeFromDbFormat<RepairBooking>(bookingData);

    return deserializedBooking;
  }
}

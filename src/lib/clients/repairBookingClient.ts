import { createClient } from '../supabase/serverClient';
import {
  deserializeFromDbFormat,
  Serialize,
  serializeToDbFormat,
} from '@/utils/dbFormat';
import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import RepairBooking from '@schemas/repairBooking';

// Config
const repairBookingsTable = process.env.REPAIR_BOOKINGS_TABLE as string;

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
      | 'name'
      | 'email'
      | 'customerNotes'
      | 'selectedPartVariants'
      | 'bookingDate'
      | 'phone'
      | 'deviceId'
    >
  ) {
    const supabase = await createClient();

    const serializedBooking = serializeToDbFormat(newBooking);

    const { data: bookingData, error } = await supabase
      .from(repairBookingsTable)
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

  static async getBookings(range: {
    start: Date;
    end: Date;
  }): Promise<RepairBooking[]> {
    const supabase = await createClient();

    const { data: bookingData, error } = await supabase
      .from(repairBookingsTable)
      .select('*')
      .gte('booking_date', range.start.toISOString())
      .lte('booking_date', range.end.toISOString());

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af bookinger.',
        `Supabase error when trying to get booked repair booking time slots: ${error.message}`
      );
    }

    if (!bookingData) {
      console.warn(
        'Supbase returned with no data when trying to get booked repair time.'
      );
      return [];
    }

    const deserializedBookings = bookingData.map(
      (serializedBooking: Serialize<RepairBooking>) => {
        return deserializeFromDbFormat<RepairBooking>(serializedBooking);
      }
    );

    return deserializedBookings;
  }

  static id(id: RepairBooking['id']) {
    return new RepairBookingHandler(id);
  }
}

class RepairBookingHandler {
  private _id: RepairBooking['id'];

  constructor(id: RepairBooking['id']) {
    this._id = id;
  }

  public async updateBooking(
    updatedBooking: Partial<Omit<RepairBooking, 'id'>>
  ): Promise<RepairBooking> {
    const supabase = await createClient();

    const serializedUpdatedBooking = serializeToDbFormat(updatedBooking);

    const { data: bookingData, error } = await supabase
      .from(repairBookingsTable)
      .update(serializedUpdatedBooking)
      .eq('id', this._id)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af booking.',
        `Supabase error when trying to update booked repair timeslot [${this._id}]: ${error.message}`
      );
    }

    if (!bookingData) {
      console.warn(
        `Supabase returned no data when updating repair booking [${this._id}].`
      );
      const Booking = await RepairBookingClient.id(this._id).getBooking();

      if (!Booking) {
        throw new ErrorNotFound(
          `Booking [${this._id}] kunne ikke findes`,
          `Repair booking [${this._id}] could not be found.`
        );
      }

      return Booking;
    }

    const deserializedBooking =
      deserializeFromDbFormat<RepairBooking>(bookingData);
    return deserializedBooking;
  }

  public async getBooking(): Promise<RepairBooking | null> {
    const supabase = await createClient();

    const { data: bookingData, error } = await supabase
      .from(repairBookingsTable)
      .select('*')
      .eq('id', this._id)
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af booking.',
        `Supabase error when trying to get booked repair timeslot [${this._id}]: ${error.message}`
      );
    }

    if (!bookingData) {
      console.warn(`Repair booking [${this._id}] could not be found.`);
      return null;
    }

    const deserializedBooking =
      deserializeFromDbFormat<RepairBooking>(bookingData);

    return deserializedBooking;
  }
}

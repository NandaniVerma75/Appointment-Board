import { NextResponse } from 'next/server';
import { getAppointments, saveAppointments } from '@/lib/db';
import { Appointment } from '@/types/appointment';

function checkTimeConflict(newAppt: Appointment, existingAppts: Appointment[]): boolean {
  for (const appt of existingAppts) {
    if (appt.status === 'cancelled') continue;
    if (appt.date !== newAppt.date) continue;
    if (appt.id === newAppt.id) continue;

    if (newAppt.startTime < appt.endTime && appt.startTime < newAppt.endTime) {
      return true;
    }
  }
  return false;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const appointments = await getAppointments();
    
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const currentAppointment = appointments[index];
    const updatedAppointment = { ...currentAppointment, ...body };

    // Validate if dates/times were changed and status is not cancelled
    if (
      updatedAppointment.status !== 'cancelled' &&
      (updatedAppointment.date !== currentAppointment.date ||
        updatedAppointment.startTime !== currentAppointment.startTime ||
        updatedAppointment.endTime !== currentAppointment.endTime)
    ) {
      if (updatedAppointment.endTime <= updatedAppointment.startTime) {
        return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
      }

      if (checkTimeConflict(updatedAppointment, appointments)) {
        return NextResponse.json({ error: 'Time slot is already booked' }, { status: 409 });
      }
    }

    appointments[index] = updatedAppointment;
    await saveAppointments(appointments);

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAppointments, saveAppointments } from '@/lib/db';
import { Appointment } from '@/types/appointment';

// helper function to check if time overlaps
function checkTimeConflict(newAppt: Appointment, existingAppts: Appointment[]): boolean {
  for (const appt of existingAppts) {
    if (appt.status === 'cancelled') continue;
    if (appt.date !== newAppt.date) continue;
    if (appt.id === newAppt.id) continue; // For editing

    // Start1 < End2 && Start2 < End1 means they overlap
    if (newAppt.startTime < appt.endTime && appt.startTime < newAppt.endTime) {
      return true;
    }
  }
  return false;
}

export async function GET() {
  console.log("fetching appointments...") // debug log
  const appointments = await getAppointments();
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("incoming data:", body);
    
    const { title, description, date, startTime, endTime } = body;

    // Basic validation
    if (!title || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 });
    }

    if (endTime <= startTime) {
      return NextResponse.json({ error: 'End time is invalid' }, { status: 400 });
    }

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      date,
      startTime,
      endTime,
      status: 'scheduled',
    };

    const appointments = await getAppointments();

    // prevent double booking
    if (checkTimeConflict(newAppointment, appointments)) {
      return NextResponse.json({ error: 'Slot already booked!' }, { status: 409 });
    }

    appointments.push(newAppointment);
    await saveAppointments(appointments);

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("error in post:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

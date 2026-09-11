import fs from 'fs/promises';
import path from 'path';
import { Appointment } from '../types/appointment';

const dataFile = path.join(process.cwd(), 'data', 'appointments.json');

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data) as Appointment[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFile, '[]', 'utf8');
      return [];
    }
    throw error;
  }
}

export async function saveAppointments(appointments: Appointment[]): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(appointments, null, 2), 'utf8');
}

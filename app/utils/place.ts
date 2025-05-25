import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export async function createPlace(place: {
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  tags?: string[];
  images?: string[];
}) {
  try {
    const result = await client.models.Place.create({
      ...place,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return result;
  } catch (error) {
    console.error('Error creating place:', error);
    throw error;
  }
}

export async function getPlaces() {
  try {
    const result = await client.models.Place.list();
    return result;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}

export async function getPlaceById(id: string) {
  try {
    const result = await client.models.Place.get({ id });
    return result;
  } catch (error) {
    console.error('Error fetching place:', error);
    throw error;
  }
}

export async function updatePlace(id: string, place: {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  tags?: string[];
  images?: string[];
}) {
  try {
    const result = await client.models.Place.update({
      id,
      ...place,
      updatedAt: new Date().toISOString(),
    });
    return result;
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
}

export async function deletePlace(id: string) {
  try {
    const result = await client.models.Place.delete({ id });
    return result;
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
} 
import { getParkingLocations } from '@/lib/parking'
import React from 'react'
import LocationTableComponent from './LocationTableComponent';

const LocationTable = async () => {
  const locationsData = await getParkingLocations();

  if (!locationsData.success || !locationsData.data) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {locationsData.message}</p>
      </div>
    )
  }

  return (
    <LocationTableComponent locationsData={locationsData?.data} />
  )
}

export default LocationTable
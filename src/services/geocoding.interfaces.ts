export interface CoordinatesPayload {
  result: [
    {
      geometry: {
        location: {
          lat: number,
          lng: number,
        }
      }
    }
  ];
}
